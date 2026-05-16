# stellar-dex-backend

NestJS backend + Soroban event indexer for the Stellar DEX.

## Stack

- NestJS + TypeScript
- PostgreSQL (TypeORM)
- Redis
- Socket.io WebSockets
- Stellar SDK (Soroban RPC)
- Swagger docs at `/api/docs`

## Quick Start

```bash
cp .env.example .env
# Fill in your values
npm install
npm run start:dev
```

## Docker

```bash
docker-compose up -d
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/pairs | List pools |
| GET | /api/v1/pairs/:id | Pool detail |
| GET | /api/v1/swaps | Swap history |
| GET | /api/v1/swaps/address/:addr | User swaps |
| GET | /api/v1/tokens | Token list |
| GET | /api/v1/tokens/:address | Token detail |
| GET | /api/v1/farms | Farm list |
| GET | /api/v1/analytics/stats | Protocol stats |
| GET | /api/v1/analytics/candles/:poolId | OHLCV data |
| POST | /api/v1/admin/login | Admin JWT |

## WebSocket Events

Connect to `/ws`, then:

```js
socket.emit('subscribe:pool', 'CONTRACT_ID')  // pool updates
socket.emit('subscribe:swaps')                 // live swaps
socket.on('swap', handler)
socket.on('pool:update', handler)
socket.on('price', handler)
```

## Architecture

```
IndexerService (polls Soroban RPC every 10s)
  └── EventProcessorService (decodes + stores events)
        ├── PairsService
        ├── SwapsService
        └── AnalyticsService
DexGateway (WebSocket — broadcasts to subscribers)
```
