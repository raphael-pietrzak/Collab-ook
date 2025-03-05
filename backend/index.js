import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
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


io.on('connection', (socket) => {
  // set user to socket

  handleSocket(io, socket);
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

