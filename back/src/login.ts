import { getConn } from "./db";
import  { Router, Request, Response } from "express";

const router = Router();

interface Usuario {
    id: number;
    email: string;
    senha: string;
}

// Rota para adicionar um componente
router.post("/", async (req: Request, res: Response) => {
    let dados = req.body;
    const db = await getConn();
    try { 
        // Busca usuário pelo email
        const [rows] = await db.execute(
            'SELECT id, email, senha FROM usuarios WHERE email = ? AND senha = ?',
            [dados['email'], dados['senha']]
        ); 

        const usuarios = rows as Usuario[];

        if (usuarios.length === 0) {
            // usuário não encontrado
            return res.status(404).send({message:"Usuário não encontrado."})
        }

        const usuario = usuarios[0];
       return  res.send(usuario)

    } catch (err) {
        console.error('Erro no login:', err);
        throw err;
    } finally {
        db.release();
  }
})

export default router;