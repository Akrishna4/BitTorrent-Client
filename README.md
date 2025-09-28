
# BitTorrent Client

A lightweight **BitTorrent client** implemented in **JavaScript**.  
This project demonstrates the core functionalities of the BitTorrent protocol, enabling peer-to-peer file sharing in a decentralized network.

---

## 🧠 Overview

The BitTorrent protocol is a peer-to-peer (P2P) file-sharing system that allows users to download and distribute files efficiently without relying on a central server.  

This client implements the fundamental features of the protocol, including:

- **Tracker Communication**: Finding peers with the desired file.  
- **Peer-to-Peer Networking**: Exchanging pieces of the file with other peers.  
- **Piece Management**: Downloading and assembling file pieces efficiently.  
- **File Writing**: Saving the downloaded file to the local filesystem.

This project is a practical example of networking, concurrency, and protocol implementation in JavaScript.

---

## ⚙️ Features

- Connects to both HTTP and UDP trackers.  
- Maintains a queue of pieces to download from multiple peers concurrently.  
- Handles downloading, assembling, and writing file pieces.  
- Supports basic message handling between peers.  
- Modular design with separate modules for pieces, queue management, downloading, torrent parsing, tracker communication, and utility functions.

---

## 📁 Project Structure

```

BitTorrent-Client/
├── src/
│   ├── pieces.js           # Piece management and bitfield handling
│   ├── Queue.js            # Queue system for pieces to download
│   ├── download.js         # Handles piece downloading from peers
│   ├── message.js          # Peer message creation and parsing
│   ├── torrent-parser.js   # Parses .torrent files
│   ├── tracker.js          # Tracker communication (HTTP/UDP)
│   └── utils.js            # Utility functions (hashing, conversions, etc.)
├── index.js                # Main entry point for the client
├── add-udp-tracker.js      # Adds UDP tracker support
├── print-trackers.js       # Prints tracker info for a torrent
├── package.json            # Project metadata and dependencies
├── .gitignore              # Git ignore file

````

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/Akrishna4/BitTorrent-Client.git
cd BitTorrent-Client
````

2. Install dependencies:

```bash
npm install
```

3. Run the client:

```bash
node index.js <path-to-torrent-file>
```

---

## 📄 Usage

1. Obtain a `.torrent` file from a trusted source.
2. Place the `.torrent` file in the project directory.
3. Run the client using the above command.
4. The client will:

   * Parse the torrent file
   * Connect to the tracker
   * Find peers and start downloading pieces
   * Reassemble pieces into the full file

* `add-udp-tracker.js`: Adds support for discovering peers via UDP trackers.
* `print-trackers.js`: Prints all tracker URLs from a given `.torrent` file.

---

## 🛠️ How It Works

### 1. Torrent Parser (`torrent-parser.js`)

* Reads metadata from `.torrent` files
* Extracts file info, piece hashes, and tracker URLs

### 2. Tracker (`tracker.js`)

* Connects to trackers via HTTP/UDP
* Retrieves a list of peers

### 3. Piece Management (`pieces.js`)

* Keeps track of downloaded and missing pieces
* Validates piece integrity using SHA-1 hash

### 4. Queue (`Queue.js`)

* Manages download order for pieces
* Optimizes concurrent downloading

### 5. Downloader (`download.js`)

* Requests pieces from multiple peers simultaneously
* Handles reassembly into the original file

### 6. Messaging (`message.js`)

* Implements peer messaging protocol
* Handles handshakes, requests, and piece transfers

### 7. Utilities (`utils.js`)

* Common helper functions like hashing, buffer conversions, etc.

---

## 📸 Architecture Diagram (ASCII)

```
[Torrent Parser] --> [Tracker] --> [Peers]
                          |
                          v
                     [Queue System]
                          |
                          v
                   [Piece Downloader]
                          |
                          v
                    [Piece Management]
                          |
                          v
                       [File Writer]
```

---

## 📚 Resources

* [BitTorrent Protocol Specification](https://www.bittorrent.org/beps/bep_0003.html)
* [Understanding the BitTorrent Protocol](https://www.explainthatstuff.com/how-bittorrent-works.html)
* [Implementing a BitTorrent Client in JavaScript](https://www.smashingmagazine.com/2011/11/building-torrent-client-javascript/)

---



