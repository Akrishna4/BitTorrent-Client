const fs = require('fs');
const bencode = require('bencode');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node print-trackers.js <torrent-file>');
  process.exit(1);
}

const torrent = bencode.decode(fs.readFileSync(filePath));

const trackers = new Set();

// Add main announce tracker
if (torrent.announce) {
  trackers.add(torrent.announce.toString());
}

// Add all trackers from announce-list
if (torrent['announce-list']) {
  torrent['announce-list'].forEach(tier => {
    tier.forEach(tracker => {
      trackers.add(tracker.toString());
    });
  });
}

console.log('Trackers:');
console.log(Array.from(trackers));
