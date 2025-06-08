const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, roomController.createRoom);
router.post('/join', authenticateToken, roomController.joinRoom);
router.get('/:code', authenticateToken, roomController.getRoom);

module.exports = router;