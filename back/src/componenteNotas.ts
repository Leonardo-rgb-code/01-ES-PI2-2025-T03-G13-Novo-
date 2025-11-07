// import  { Router, Request, Response } from "express";

// const router = Router();

// // Lista de componentes de notas
// let componentes = [
//     {
//         nome: "Prova 1",
//         sigla: "P1",
//         descricao: "Primeira avaliação do semestre"
//     },
//     {
//         nome: "Prova 2",
//         sigla: "P2",
//         descricao: "Segunda avaliação do semestre"
//     }
// ];

// // Rota para pegar todos os componentes
// router.get("/componentes", (req: Request, res: Response) => {
//     return res.send(componentes); // ← Adicione return
// });

// // Rota para adicionar um componente
// router.post("/componentes", (req: Request, res: Response) => {
//     const nome = req.body.nome;
//     const sigla = req.body.sigla;
//     const descricao = req.body.descricao;
    
//     // Verificar se preencheu tudo
//     if (!nome || !sigla || !descricao) {
//         return res.status(400).send({ message: "Preencha todos os campos" });
//     }
    
//     // Criar novo componente
//     const novoComponente = {
//         nome: nome,
//         sigla: sigla,
//         descricao: descricao
//     };
    
//     // Adicionar na lista
//     componentes.push(novoComponente);
    
//     return res.send({ message: "Componente adicionado com sucesso!" }); // ← Adicione return
// });

// // Rota para excluir um componente
// router.delete("/componentes/:posicao", (req: Request, res: Response) => {
//     const posicao = parseInt(req.params.posicao);
    
//     // Verificar se a posição existe
//     if (posicao < 0 || posicao >= componentes.length) {
//         return res.status(404).send({ message: "Componente não encontrado" });
//     }
    
//     // Remover o componente
//     componentes.splice(posicao, 1);
    
//     return res.send({ message: "Componente excluído com sucesso!" }); // ← Adicione return
// });

// export default router;
