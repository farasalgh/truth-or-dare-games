const prisma = require('../../prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, email, passwordHash }
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Username/email already exists' });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  // Pastikan setidaknya username atau email ada
  if ((!username && !email) || !password) {
    return res.status(400).json({ error: 'Username/email dan password harus diisi' });
  }

  // Cari user berdasarkan username ATAU email
  let user = null;
  if (username) {
    user = await prisma.user.findUnique({ where: { username } });
  } else if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  }

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username } });
};

// Update profile/username/email/password
exports.updateProfile = async (req, res) => {
  const userId = req.user.id; // dari authMiddleware
  const { username, email, oldPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Untuk update password, cek oldPassword
    let updateData = {};
    if (username && username !== user.username) updateData.username = username;
    if (email && email !== user.email) updateData.email = email;

    if (newPassword) {
      if (!oldPassword) return res.status(400).json({ error: 'Old password required' });
      const match = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!match) return res.status(401).json({ error: 'Old password salah' });
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Tidak ada perubahan.' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Jika username/email berubah, update token baru
    const updated = await prisma.user.findUnique({ where: { id: userId } });
    const token = jwt.sign({ id: updated.id, username: updated.username }, JWT_SECRET);

    res.json({ message: 'Profile updated', user: { id: updated.id, username: updated.username, email: updated.email }, token });
  } catch (e) {
    if (e.code === 'P2002') {
      // Unique constraint failed
      return res.status(400).json({ error: 'Username/email sudah dipakai.' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};