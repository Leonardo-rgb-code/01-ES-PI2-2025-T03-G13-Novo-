// // back/src/cursos.ts
// import { Router, Request, Response } from 'express';

// const router = Router();

// // Rota para CADASTRAR um novo curso (POST /cursos)
// router.post('/', (req: Request, res: Response) => {
//     const { descricao, dataInicio, dataFim, categoria } = req.body;

//     // Validação dos dados
//     if (!descricao || !dataInicio || !dataFim || !categoria) {
//         // Adicionado 'return' aqui
//         return res.status(400).json({ mensagem: "Campos obrigatórios faltando." });
//     }

//     // TODO: Lógica para salvar o curso no banco de dados.
//     console.log("Recebido para cadastro de curso:", req.body);
    
//     // Adicionado 'return' aqui
//     return res.status(201).json({ 
//         mensagem: "Curso recebido com sucesso!", 
//         dados: req.body 
//     });
// });

// export default router;
