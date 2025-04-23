# Express P2P Network

A lightweight TypeScript project for routing direct messages between clients via a pool of “seed” servers. Clients register with a random seed server, which tracks their IP and username. When one client wants to send a message to another, the seed servers coordinate to look up the destination and deliver the message directly.


---

## Table of Contents

- [Features](#features)
- [Architecture & Flow](#architecture--flow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running](#running)
- [API Routes](#api-routes)

---

## Features

- **Dynamic seed-server discovery**: Clients register with one of many seed servers.
- **Distributed lookup**: If a server doesn’t know where a client is, it queries its peers.
- **Peer-to-peer messaging**: Once the IP of the destination is known, messages are sent directly.
- **Extensible**: Plug in your own seed-server list or extend the routing logic.

---

## Architecture & Flow

Below is a high-level sequence diagram of how **Sally** registers, how **Bob** looks her up via two seed servers, and how messages get routed:

![Image](assets/diagram.png)

1. **Client Registration**
   - Sally asks the registry component for a random seed server.
   - Sally `POST /register` → **Seed**
   - **Seed** tracks Sally’s username & IP.

2. **Client Lookup & Routing**
   - Bob wants to message Sally.
   - Bob’s seed server (**Seed2**) checks its local cache: “Do I know Sally?”
   - If not found, **Seed2** queries **Seed**:
     - `GET /lookup?user=Sally` → returns IP & last-seen info.
   - Bob’s client receives Sally’s IP and sends the message directly.

```text
Sally   → Seed      → Seed2      → Bob
 1. register      3. lookup        5. deliver
```

---

## Project Structure

```text
assets/
└── diagram.png              # Sequence diagram for registration & lookup
src/
├── routes/
│   ├── lookup.ts            # GET  /lookup?user=<username>
│   ├── message.ts           # POST /message  (optional forwarding endpoint)
│   ├── register.ts          # POST /register
│   └── send.ts              # POST /send     (internal delivery)
├── appendEntryToJson.ts     # Utils: persist registry to JSON
├── getCurrentUri.ts         # Utils: builds current server URI
├── getRandomSeedServer.ts   # Picks a random seed for new registrations
├── lookupUser.ts            # Peer-to-peer lookup helper
├── registerWithSeedServer.ts# Forwards registration to peer seed servers
├── sendMessage.ts           # Sends raw message to a given IP
├── servers.ts               # Manages list of seed-server URIs
.gitignore
index.ts
package.json
seed.ts
trace.json
tsconfig.json
yarn.lock
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥14
- [Yarn](https://yarnpkg.com/) or npm

### Installation

```bash
git clone https://github.com/your-org/seed-proxy.git
cd seed-proxy
yarn install
# or
npm install
```

### Configuration

- **Seed server list**
  Edit `src/servers.ts` to list all seed-server URIs in your cluster.

- **Port & storage**
  By default, each seed server runs on port `3000` and writes its registry to `registry.json`. Override via environment variables:

  ```bash
  export PORT=4000
  export REGISTRY_FILE=/path/to/registry.json
  ```

### Running

```bash
# Launch a seed server (defaults to port 3000)
yarn ts-node src/seed.ts

# Or build & run
yarn build
node dist/seed.js
```

---

## API Routes

| Method | Path       | Description                                     |
| ------ | ---------- | ----------------------------------------------- |
| GET    | `/lookup`  | Look up a user. Query string: `?user=<name>`    |
| POST   | `/register`| Register this client. Body: `{ user: string }`  |
| POST   | `/send`    | Internal: send a message to an IP               |
| POST   | `/message` | (Optional) Receive incoming message payload     |

