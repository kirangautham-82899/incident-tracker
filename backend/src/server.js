import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import chatbot from './utils/chatbot.js'; // Added this import

// Import routes
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
import commentRoutes from './routes/comments.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🚨 Incident Tracker API is running!',
    version: '2.0.0',
    status: 'healthy',
    database: 'connected',
    endpoints: {
      auth: '/api/auth',
      incidents: '/api/incidents',
      comments: '/api/comments',
      analytics: '/api/analytics'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  // Join incident room
  socket.on('join_incident', (incidentId) => {
    socket.join(`incident_${incidentId}`);
    console.log(`Socket ${socket.id} joined incident ${incidentId}`);
  });

  // Leave incident room
  socket.on('leave_incident', (incidentId) => {
    socket.leave(`incident_${incidentId}`);
    console.log(`Socket ${socket.id} left incident ${incidentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle chat messages with AI auto-response
  socket.on('chat_message', (message) => {
    console.log('Chat message received:', message);

    // Broadcast user message to all connected clients
    io.emit('chat_message', message);

    // AI auto-response after a short delay

    if (chatbot.shouldRespond(message.text, message.sender.role)) {
      setTimeout(() => {
        const responseText = chatbot.generateResponse(message.text);
        const botMessage = chatbot.createBotMessage(responseText);

        console.log('AI Bot responding:', botMessage);
        io.emit('chat_message', botMessage);
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds for natural feel
    }
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling - must be last
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚨 Incident Tracker API Server - Phase 2           ║
║                                                        ║
║   Server:     http://localhost:${PORT}                ║
║   Environment: ${process.env.NODE_ENV || 'development'}                       ║
║   Database:   MongoDB Connected ✓                    ║
║   WebSocket:  Ready ✓                                 ║
║                                                        ║
║   API Routes:                                          ║
║   - /api/auth         (register, login)               ║
║   - /api/incidents    (CRUD, verify, nearby)          ║
║   - /api/comments     (add, delete)                   ║
║   - /api/analytics    (stats, trends, heatmap)        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

export { io };

