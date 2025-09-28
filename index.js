'use strict';

const download = require('./src/download');
const torrentParser = require('./src/torrent-parser');

const torrent = torrentParser.open(process.argv[2]);

console.log('Fetching peers from trackers...');  // <-- added log

download(torrent, torrent.info.name);
