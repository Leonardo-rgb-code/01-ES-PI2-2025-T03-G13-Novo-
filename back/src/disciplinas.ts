// // back/src/disciplinas.ts
// import { Router, Request, Response } from 'express';

// const router = Router();

// router.post('/', (req: Request, res: Response) => {
//     const nomeDisciplina = req.body['disciplina[]']?.[0];
//     const codigoDisciplina = req.body['codigoDisci[]']?.[0];
    
//     if (!nomeDisciplina || !codigoDisciplina) {
//         // Adicionado 'return' aqui
//         return res.status(400).json({ mensagem: "O nome e o código da disciplina são obrigatórios." });
//     }

//     const nomesComp = Array.isArray(req.body['nomeCompNota[]']) ? req.body['nomeCompNota[]'] : [];
//     const componentesDeNota = nomesComp.map((nome: string, index: number) => ({
//         nome: nome,
//         sigla: req.body['siglaCompNota[]']?.[index] || '',
//         descricao: req.body['descCompNota[]']?.[index] || ''
//     }));

//     const disciplinaData = {
//         nome: nomeDisciplina,
//         sigla: req.body['siglaDisci[]']?.[0] || '',
//         codigo: codigoDisciplina,
//         periodo: req.body.periodo,
//         componentesDeNota: componentesDeNota,
//     };

//     console.log("Recebido para cadastro de disciplina:", disciplinaData);
    
//     // Adicionado 'return' aqui
//     return res.status(201).json({ 
//         mensagem: "Disciplina recebida com sucesso!", 
//         dados: disciplinaData 
//     });
// });

// export default router;
