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

// Middleware socket pour authentifier l'utilisateur
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const user = jwt.verify(token, 'your-secret-key');
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on('connection', (socket) => {
  handleSocket(io, socket);
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

