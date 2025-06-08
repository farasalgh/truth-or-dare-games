const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/auth');

// GET /questions/random?type=truth|dare
router.get('/random', authMiddleware, questionController.getRandom);

// GET /questions?type=truth|dare
router.get('/', authMiddleware, questionController.getAll);

// POST /questions
router.post('/', authMiddleware, questionController.create);

// PUT /questions/:id
router.put('/:id', authMiddleware, questionController.update);

// DELETE /questions/:id
router.delete('/:id', authMiddleware, questionController.remove);

module.exports = router;