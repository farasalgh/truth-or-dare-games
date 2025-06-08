const prisma = require('../../prisma/client');

// GET /questions/random?type=truth|dare
exports.getRandom = async (req, res) => {
  const { type } = req.query;
  if (!type || !["truth", "dare"].includes(type))
    return res.status(400).json({ error: "Type must be 'truth' or 'dare'" });

  const total = await prisma.question.count({ where: { type } });
  if (total === 0) return res.status(404).json({ error: "No question found for this type" });

  const skip = Math.floor(Math.random() * total);
  const question = await prisma.question.findFirst({
    where: { type },
    skip,
    take: 1,
  });
  res.json(question);
};

// GET /questions?type=truth|dare -- List all questions (optionally by type)
exports.getAll = async (req, res) => {
  const { type } = req.query;
  const filter = type && ["truth", "dare"].includes(type) ? { type } : {};
  const questions = await prisma.question.findMany({
    where: filter,
    orderBy: { id: "asc" },
  });
  res.json(questions);
};

// POST /questions -- Add question (admin only, assumed admin check elsewhere)
exports.create = async (req, res) => {
  const { type, content } = req.body;
  if (!type || !["truth", "dare"].includes(type))
    return res.status(400).json({ error: "Type must be 'truth' or 'dare'" });
  if (!content) return res.status(400).json({ error: "Content is required" });

  const question = await prisma.question.create({
    data: { type, content }
  });
  res.status(201).json(question);
};

// PUT /questions/:id -- Update question (admin only)
exports.update = async (req, res) => {
  const { id } = req.params;
  const { type, content } = req.body;
  if (type && !["truth", "dare"].includes(type))
    return res.status(400).json({ error: "Type must be 'truth' or 'dare'" });

  const updated = await prisma.question.update({
    where: { id: parseInt(id) },
    data: { ...(type && { type }), ...(content && { content }) }
  });
  res.json(updated);
};

// DELETE /questions/:id -- Delete question (admin only)
exports.remove = async (req, res) => {
  const { id } = req.params;
  await prisma.question.delete({ where: { id: parseInt(id) } });
  res.json({ success: true });
};