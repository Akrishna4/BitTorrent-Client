'use strict';

const dgram = require('dgram');
const { parse: urlParse } = require('url');
const crypto = require('crypto');
const torrentParser = require('./torrent-parser');
const util = require('./util');

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4');

  const trackers = Array.isArray(torrent.announceList)
    ? torrent.announceList.flat()
    : [torrent.announce.toString('utf8')];

  trackers.forEach(url => {
    console.log('Querying tracker:', url);
    udpSend(socket, buildConnReq(), url);
  });

  socket.on('message', response => {
    const type = respType(response);

    if (type === 'connect') {
      const connResp = parseConnResp(response);
      console.log('Got connection ID from tracker');

      // Save the tracker URL to use in announce
      const trackerUrl = trackers[0]; 
      const announceReq = buildAnnounceReq(connResp.connectionId, torrent);
      udpSend(socket, announceReq, trackerUrl);

    } else if (type === 'announce') {
      const announceResp = parseAnnounceResp(response);
      console.log('Peers received:', announceResp.peers.length);
      callback(announceResp.peers);
    }
  });

  socket.on('error', err => console.error('UDP socket error:', err));
};

// Helpers
function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.hostname, callback);
}

function respType(resp) {
  const action = resp.readUInt32BE(0);
  if (action === 0) return 'connect';
  if (action === 1) return 'announce';
}

function buildConnReq() {
  const buf = Buffer.allocUnsafe(16);
  buf.writeUInt32BE(0x417, 0);           // part of connection id
  buf.writeUInt32BE(0x27101980, 4);      // rest of connection id
  buf.writeUInt32BE(0, 8);               // action: connect
  crypto.randomBytes(4).copy(buf, 12);   // transaction id
  return buf;
}

function parseConnResp(resp) {
  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    connectionId: resp.slice(8)
  };
}

function buildAnnounceReq(connId, torrent, port = 6881) {
  const buf = Buffer.allocUnsafe(98);

  connId.copy(buf, 0);
  buf.writeUInt32BE(1, 8);               // action: announce
  crypto.randomBytes(4).copy(buf, 12);   // transaction id
  torrentParser.infoHash(torrent).copy(buf, 16);
  util.genId().copy(buf, 36);

  Buffer.alloc(8).copy(buf, 56);        // downloaded

  // Fix: convert torrent size Buffer to BigInt
  const left = Buffer.alloc(8);
  const sizeBuf = torrentParser.size(torrent);
  const size = BigInt('0x' + sizeBuf.toString('hex'));
  left.writeBigUInt64BE(size, 0);
  left.copy(buf, 64);                    // left

  Buffer.alloc(8).copy(buf, 72);        // uploaded
  buf.writeUInt32BE(0, 80);              // event
  buf.writeUInt32BE(0, 84);              // IP
  crypto.randomBytes(4).copy(buf, 88);   // key
  buf.writeInt32BE(-1, 92);              // num want
  buf.writeUInt16BE(port, 96);           // port

  return buf;
}

function parseAnnounceResp(resp) {
  const peersBuf = resp.slice(20);
  const peers = [];
  for (let i = 0; i < peersBuf.length; i += 6) {
    const ip = peersBuf.slice(i, i + 4).join('.');
    const port = peersBuf.readUInt16BE(i + 4);
    peers.push({ ip, port });
  }
  return { peers };
}
