import express, { Request, Response } from 'express';
const router = express.Router();

// In-memory storage para exemplo
let turmas: { id: number; nome: string; disciplinaId: string }[] = [];
let nextId = 1;

// GET: Listar turmas de uma disciplina
router.get('/turmas/:disciplinaId', (req: Request, res: Response): void => {
  const { disciplinaId } = req.params;
  const result = turmas.filter(t => t.disciplinaId === disciplinaId);
  res.json(result);
});

// POST: Adicionar turma
router.post('/turmas', (req: Request, res: Response): void => {
  const { nome, disciplinaId } = req.body;
  if (!nome || !disciplinaId) {
    res.status(400).json({ error: 'Nome da turma e disciplinaId são obrigatórios.' });
    return;
  }
  const novaTurma = { id: nextId++, nome, disciplinaId };
  turmas.push(novaTurma);
  res.status(201).json(novaTurma);
});

// DELETE: Remover turma
router.delete('/turmas/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  turmas = turmas.filter(t => t.id !== id);
  res.status(204).send();
});

// PUT: Editar turma
router.put('/turmas/:id', (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;
  const turma = turmas.find(t => t.id === id);
  if (!turma) {
    res.status(404).json({ error: 'Turma não encontrada.' });
    return;
  }
  turma.nome = nome;
  res.json(turma);
});

export default router;
//.