import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import documentRoutes from './routes/documents.js';
import authRoutes from './routes/auth.js';
import handleSocket from './socket/documentHandler.js';
import bookRoutes from './routes/books.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(bookRoutes);
app.use(documentRoutes);
app.use(authRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

console.log('Socket.IO server configured and initialized');

// Middleware socket pour authentifier l'utilisateur
io.use((socket, next) => {
  console.log('Authentication attempt with token:', socket.handshake.auth.token ? 'Token provided' : 'No token');
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('Authentication failed: No token provided');
    return next(new Error("Authentication error"));
  }

  try {
    const user = jwt.verify(token, 'your-secret-key');
    
    // Vérifier que les informations utilisateur sont complètes
    if (!user.userId || !user.username) {
      console.log('Authentication failed: Incomplete user information in token', user);
      return next(new Error("Invalid user information in token"));
    }
    
    socket.user = user;
    console.log(`Authentication successful for user: ${user.username} (ID: ${user.userId})`);
    next();
  } catch (err) {
    console.log('Authentication failed:', err.message);
    next(new Error("Authentication error"));
  }
});

io.on('connection', (socket) => {
  console.log(`New socket connection: ${socket.id}`);
  handleSocket(io, socket);
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready for connections`);
  console.log(`CORS configured for origin: http://localhost:5173`);
});

