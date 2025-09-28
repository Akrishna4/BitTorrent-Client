// add-udp-tracker.js
const fs = require('fs');
const bencode = require('bencode');
const path = require('path');

// Paths
const inputTorrent = process.argv[2];  // original torrent
const outputTorrent = process.argv[3]; // output torrent with UDP tracker

if (!inputTorrent || !outputTorrent) {
  console.error("Usage: node add-udp-tracker.js <input.torrent> <output.torrent>");
  process.exit(1);
}

// Load and decode the torrent
const torrentData = fs.readFileSync(inputTorrent);
const torrent = bencode.decode(torrentData);

// Add UDP tracker
const udpTracker = 'udp://tracker.opentrackr.org:1337/announce';

if (!torrent['announce-list']) {
  torrent['announce-list'] = [];
}

// Ensure the tracker is added as a list of lists
torrent['announce-list'].push([Buffer.from(udpTracker)]);
torrent['announce'] = Buffer.from(udpTracker); // set default announce

// Save the modified torrent
fs.writeFileSync(outputTorrent, bencode.encode(torrent));

console.log(`UDP tracker added! Saved as: ${outputTorrent}`);
