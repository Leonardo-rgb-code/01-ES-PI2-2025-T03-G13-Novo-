// Autor: Gabrielle Mota

import { getConn } from "./db";
import  {Router, Request, Response } from "express";

const router = Router();

// Interface para o corpo da requisição
interface RedefinirSenhaBody {
    token: string;
    senha: string;
}

// Função para validar a senha
function validarSenha(senha: string): boolean {
    // Verifica se tem de 8 a 20 caracteres
    if (senha.length < 8 || senha.length > 20) {
        return false;
    }   
    // Verifica se tem pelo menos 1 letra maiúscula, 1 minúscula e 1 número
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);  
    return temMaiuscula && temMinuscula && temNumero;
}
// POST - Redefinir senha
router.post("/", async (req: Request, res: Response) => {
    const dados: RedefinirSenhaBody = req.body;

    // Validação: Verificar se a senha atende aos requisitos
    if (!validarSenha(dados.senha)) {
        return res.status(400).json({ 
            message: "A senha deve ter 8 a 20 caracteres, com pelo menos 1 letra maiúscula, 1 minúscula e 1 número.",
            campo: "senha"
        });
    }
    //Verificar se o usuário existe
    const db = await getConn();
        try { 
            // Busca o email
            const [rows]: any = await db.execute(
                'UPDATE usuarios SET senha = ? WHERE tokensenha = ?',
                [dados.senha, dados.token] //substitui a senha antiga pela nova e valida se o token da url é o mesmo que esta no bd
            ); 
            if (rows.affectedRows == 1) {
                return res.status(200).send({message:"senha alterada."})
            }
            return res.status(404).send({message:"Usuário não encontrado."})
    
        } finally {
        db.release();
  }
});

export default router;
