const prisma = require('../../prisma/client');
const generateRoomCode = require('../utils/generateRoomCode');

// Create Room
exports.createRoom = async (req, res) => {
  let code;
  do {
    code = generateRoomCode();
    const existing = await prisma.room.findUnique({ where: { code } });
    if (!existing) break;
  } while (true);

  const room = await prisma.room.create({
    data: {
      code,
      hostUserId: req.user.id,
      isActive: true,
      members: {
        create: { userId: req.user.id }
      }
    },
    include: { members: { include: { user: true } } }
  });
  res.json(room);
};

// Join Room
exports.joinRoom = async (req, res) => {
  const { code } = req.body;
  const room = await prisma.room.findUnique({ where: { code }, include: { members: true } });
  if (!room || !room.isActive) return res.status(404).json({ error: 'Room not found or closed' });

  const alreadyMember = await prisma.roomMember.findFirst({
    where: { roomId: room.id, userId: req.user.id }
  });
  if (alreadyMember) return res.status(400).json({ error: 'Already joined' });

  await prisma.roomMember.create({ data: { roomId: room.id, userId: req.user.id } });
  res.json({ success: true });
};

// Get Room Details
exports.getRoom = async (req, res) => {
  const { code } = req.params;
  const room = await prisma.room.findUnique({
    where: { code },
    include: { members: { include: { user: true } } }
  });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
};