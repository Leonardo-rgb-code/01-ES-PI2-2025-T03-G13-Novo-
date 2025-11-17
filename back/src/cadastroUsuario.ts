// Autor: Gabrielle Mota

import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

interface CadastroUsuario {
    email: string;
    senha: string;
    nome: string;
    sobrenome: string;
    telefone: string;
}

// Rota para adicionar um componente
router.post("/", async (req: Request, res: Response) => {
    let dados: CadastroUsuario = req.body;

    const db = await getConn();
    try {
        // Busca usuário pelo email
        const [result]: any = await db.execute(
            'INSERT INTO usuarios (nome, sobrenome, telefone, email, senha) values (?,?,?,?,?)',
            [dados.nome, dados.sobrenome, dados.telefone, dados.email, dados.senha]
        );

        return res.status(201).json({
            id: result.insertId
        });

    } catch (err) {
        console.error('Erro no login:', err);
        throw err;
    } finally {
        db.release();
    }
})

export default router;