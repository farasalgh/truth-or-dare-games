require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// API ROUTES
app.use('/auth', require('./src/routes/auth'));
app.use('/questions', require('./src/routes/questions'));
app.use('/rooms', require('./src/routes/rooms'));

// -------------------
// --- STATE ROOM ----
const roomStates = {}; // roomCode -> { players: [username], currentIdx: 0, type: "truth", currentQuestion: null }
const socketIdToUserRoom = new Map(); // socket.id -> { user, roomCode }
// -------------------

function getGameState(roomCode) {
  const state = roomStates[roomCode];
  if (!state) return null;
  return {
    currentQuestion: state.currentQuestion,
    currentPlayer: state.players.length > 0 ? state.players[state.currentIdx % state.players.length] : null,
    players: state.players,
    type: state.type || 'truth'
  };
}

// --- UTILITY: Hapus user dari roommember DB dan set room off jika kosong
async function handleLeaveRoomDB(roomCode, user) {
  if (!roomCode || !user?.id) return;

  // Hapus user dari RoomMember
  const room = await prisma.room.findUnique({ where: { code: roomCode }, include: { members: true } });
  if (!room) return;

  await prisma.roomMember.deleteMany({
    where: { roomId: room.id, userId: user.id }
  });

  // Cek apakah masih ada member
  const remaining = await prisma.roomMember.count({ where: { roomId: room.id } });
  if (remaining === 0) {
    // Set room isActive = false
    await prisma.room.update({ where: { id: room.id }, data: { isActive: false } });
    io.in(roomCode).emit('room_closed');
  }
}

io.on('connection', (socket) => {
  // JOIN ROOM
  socket.on('join_room', async ({ roomCode, user }) => {
    if (!roomCode || !user?.username) {
      socket.emit('error', { message: 'Invalid join payload.' });
      return;
    }
    socket.join(roomCode);
    socketIdToUserRoom.set(socket.id, { user, roomCode });

    // Inisialisasi state room jika belum ada
    if (!roomStates[roomCode]) {
      roomStates[roomCode] = {
        players: [],
        currentIdx: 0,
        type: 'truth',
        currentQuestion: null
      };
    }
    const state = roomStates[roomCode];
    // Tambah player jika belum ada
    if (!state.players.includes(user.username)) {
      state.players.push(user.username);
    }

    // Tambahkan user ke RoomMember (DB) jika belum ada
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    if (room && room.isActive) {
      const exist = await prisma.roomMember.findFirst({
        where: { roomId: room.id, userId: user.id }
      });
      if (!exist) {
        await prisma.roomMember.create({ data: { roomId: room.id, userId: user.id } });
      }
    } else {
      socket.emit('error', { message: 'Room sudah tidak aktif.' });
      return;
    }

    // Kirim update ke semua
    io.in(roomCode).emit('player_join', { username: user.username });
    io.in(roomCode).emit('game_state_update', getGameState(roomCode));
    socket.emit('joined_room', { roomCode });
  });

  // LEAVE ROOM
  socket.on('leave_room', async ({ roomCode, user }) => {
    if (!roomCode || !user?.username) return;
    socket.leave(roomCode);
    socketIdToUserRoom.delete(socket.id);

    const state = roomStates[roomCode];
    if (state) {
      const idx = state.players.indexOf(user.username);
      if (idx !== -1) {
        state.players.splice(idx, 1);
        // Jika pemain keluar sebelum/di giliran, atur currentIdx
        if (state.currentIdx >= state.players.length) {
          state.currentIdx = 0;
        }
      }
      // Jika tidak ada pemain, hapus state
      if (state.players.length === 0) {
        delete roomStates[roomCode];
      }
    }

    // --- DB: Hapus dari RoomMember & set room off kalau kosong
    await handleLeaveRoomDB(roomCode, user);

    io.in(roomCode).emit('player_leave', { username: user.username });
    io.in(roomCode).emit('game_state_update', getGameState(roomCode));
  });

  // GILIRAN AMBIL PERTANYAAN
  socket.on('new_question', async ({ roomCode, question, type, username }) => {
    if (!roomCode || !username || !question) return;
    const state = roomStates[roomCode];
    if (!state) return;

    // Pastikan hanya currentPlayer yang bisa ambil pertanyaan
    const currentPlayer = state.players[state.currentIdx % state.players.length];
    if (username !== currentPlayer) return;

    state.currentQuestion = question;
    state.type = type;

    // Setelah pertanyaan diambil, ganti giliran ke pemain selanjutnya
    state.currentIdx = (state.currentIdx + 1) % state.players.length;

    io.in(roomCode).emit('game_state_update', getGameState(roomCode));
  });

  // CHAT MESSAGE
  socket.on('chat_message', async ({ roomCode, user, message }) => {
    if (!roomCode || !user?.username || !message) return;
    // (opsional: simpan ke DB)
    try {
      const room = await prisma.room.findUnique({ where: { code: roomCode } });
      if (room) {
        await prisma.chatMessage.create({
          data: {
            roomId: room.id,
            userId: user.id,
            message
          }
        });
      }
    } catch (err) {
      // Opsional: log error DB
    }
    io.in(roomCode).emit('chat_message', {
      username: user.username,
      userId: user.id,
      text: message
    });
  });

  // ROOM CLOSED (manual admin)
  socket.on('close_room', async ({ roomCode }) => {
    if (!roomCode) return;
    // Set room tidak aktif di DB
    const room = await prisma.room.findUnique({ where: { code: roomCode } });
    if (room) {
      await prisma.room.update({ where: { id: room.id }, data: { isActive: false } });
    }
    io.in(roomCode).emit('room_closed');
    delete roomStates[roomCode];
  });

  // HANDLE DISCONNECT
  socket.on('disconnecting', async () => {
    const data = socketIdToUserRoom.get(socket.id);
    if (!data) return;
    const { user, roomCode } = data;
    socketIdToUserRoom.delete(socket.id);

    const state = roomStates[roomCode];
    if (state) {
      const idx = state.players.indexOf(user.username);
      if (idx !== -1) {
        state.players.splice(idx, 1);
        if (state.currentIdx >= state.players.length) {
          state.currentIdx = 0;
        }
      }
      if (state.players.length === 0) {
        delete roomStates[roomCode];
      }
    }

    // --- DB: Hapus dari RoomMember & set room off kalau kosong
    await handleLeaveRoomDB(roomCode, user);

    io.in(roomCode).emit('player_leave', { username: user.username });
    io.in(roomCode).emit('game_state_update', getGameState(roomCode));
  });
});

// ---- START SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});