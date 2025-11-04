import  { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';

const router = Router();

// Interface para tipar a Instituição
interface Instituicao {
  id: number;
  nome: string;
}

// Array para simular banco de dados (substitua por banco real depois)
let instituicoes: Instituicao[] = [
  { id: 1, nome: 'Universidade Federal do ABC' },
  { id: 2, nome: 'Instituto Federal de São Paulo' }
];

let proximoId = 3;

// GET - Listar todas as instituições
router.get('/instituicoes', (req: Request, res: Response) => {
  res.json(instituicoes);
});

// GET - Buscar instituição por ID
router.get('/instituicoes/:id', 
  param('id').isInt().withMessage('ID deve ser um número'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const instituicao = instituicoes.find(inst => inst.id === id);
    
    if (!instituicao) {
      return res.status(404).json({ message: 'Instituição não encontrada' });
    }
    
    res.json(instituicao);
  }
);

// POST - Criar nova instituição
router.post('/instituicoes',
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome da instituição é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const novaInstituicao: Instituicao = {
      id: proximoId++,
      nome: req.body.nome
    };
    
    instituicoes.push(novaInstituicao);
    res.status(201).json(novaInstituicao);
  }
);

// PUT - Atualizar instituição
router.put('/instituicoes/:id',
  param('id').isInt().withMessage('ID deve ser um número'),
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome da instituição é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const index = instituicoes.findIndex(inst => inst.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Instituição não encontrada' });
    }
    
    instituicoes[index].nome = req.body.nome;
    res.json(instituicoes[index]);
  }
);

// DELETE - Excluir instituição
router.delete('/instituicoes/:id',
  param('id').isInt().withMessage('ID deve ser um número'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const index = instituicoes.findIndex(inst => inst.id === id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Instituição não encontrada' });
    }
    
    const instituicaoRemovida = instituicoes.splice(index, 1)[0];
    res.json({ 
      message: 'Instituição excluída com sucesso', 
      instituicao: instituicaoRemovida 
    });
  }
);

export default router;
