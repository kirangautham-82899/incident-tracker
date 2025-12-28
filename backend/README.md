# Incident Tracker Backend

Backend API server for Real-Time Incident Reporting Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file

3. Run the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /` - API health check
- `GET /api/health` - Detailed health status

## WebSocket

Socket.IO server is running and ready for real-time connections.
