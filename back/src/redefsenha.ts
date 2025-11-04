// import  {Router, Request, Response } from "express";

// const router = Router();

// // Interface para o corpo da requisição
// interface RedefinirSenhaBody {
//     userId?: string;
//     senha: string;
//     confSenha: string;
// }

// // Simulação de banco de dados 
// let usuarios = [
//     {
//         id: "1",
//         nome: "Gabrielle",
//         sobrenome: "Mota",
//         telefone: "19 99999-9999",
//         email: "gabi@hotmail.com",
//         senha: "123Senha@",
//     }
// ];

// // Função para validar a senha
// function validarSenha(senha: string): boolean {
//     // Verifica se tem de 8 a 20 caracteres
//     if (senha.length < 8 || senha.length > 20) {
//         return false;
//     }
    
//     // Verifica se tem pelo menos 1 letra maiúscula, 1 minúscula e 1 número
//     const temMaiuscula = /[A-Z]/.test(senha);
//     const temMinuscula = /[a-z]/.test(senha);
//     const temNumero = /[0-9]/.test(senha);
    
//     return temMaiuscula && temMinuscula && temNumero;
// }

// // POST - Redefinir senha
// router.post("/redefinir-senha", (req: Request, res: Response) => {
//     const dados: RedefinirSenhaBody = req.body;
    
//     // Validação 1: Verificar se os campos foram preenchidos
//     if (!dados.senha || !dados.confSenha) {
//         return res.status(400).json({ 
//             message: "Todos os campos são obrigatórios.",
//             campo: !dados.senha ? "senha" : "confSenha"
//         });
//     }
    
//     // Validação 2: Verificar se a senha atende aos requisitos
//     if (!validarSenha(dados.senha)) {
//         return res.status(400).json({ 
//             message: "A senha deve ter 8 a 20 caracteres, com pelo menos 1 letra maiúscula, 1 minúscula e 1 número.",
//             campo: "senha"
//         });
//     }
    
//     // Validação 3: Verificar se as senhas coincidem
//     if (dados.senha !== dados.confSenha) {
//         return res.status(400).json({ 
//             message: "As senhas não coincidem.",
//             campo: "confSenha"
//         });
//     }
    
//     // Validação 4: Verificar se o usuário existe (substitua pela lógica real)

//     const userId = dados.userId || "1"; 
//     const usuario = usuarios.find(u => u.id === userId);
    
//     if (!usuario) {
//         return res.status(404).json({ 
//             message: "Usuário não encontrado."
//         });
//     }
    
//     // Atualizar a senha do usuário
//     usuario.senha = dados.senha;
    
//     // Resposta de sucesso
//     return res.status(200).json({ 
//         message: "Senha redefinida com sucesso!",
//         success: true
//     });
// });


// router.get("/verificar-token/:token", (req: Request, res: Response) => {
//     const { token } = req.params;
    
//     // serve pra verificar se o otken é valido

    
//     if (!token) {
//         return res.status(400).json({ 
//             message: "Token não fornecido."
//         });
//     }
    
//     // Simulação de verificação de token
//     const tokenValido = true; // Substitua pela lógica real
    
//     if (tokenValido) {
//         return res.status(200).json({ 
//             message: "Token válido.",
//             valid: true
//         });
//     } else {
//         return res.status(401).json({ 
//             message: "Token inválido ou expirado.",
//             valid: false
//         });
//     }
// });

// export default router;
