// Autor: Gabrielle Mota

import { getConn } from "./db";
import  { Router, Request, Response } from "express";
import dotenv from "dotenv"; //salva informações que devem ser ocultadas
import sgMail from "@sendgrid/mail";
//biblioteca do sendgrid API externa para enviar o email pro usuário
const router = Router();

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_TOKEN!); //pega a api externa que esta do dotenv 

async function sendRecoveryEmail(to: string, token: string) {
  const url = `http://127.0.0.1:5501/front/senha/redefSenha.html?token=${token}`;
  //coloca o roken gerado pelo link do email na url
  const msg = {
    to,
    from: "gabispmota@hotmail.com",
    subject: "Recuperação de senha",
    text: `Clique no link para redefinir sua senha: ${url}`,
    html: `
      <h2>Recuperação de senha</h2>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="${url}" target="_blank">Redefinir senha</a>
      <br><br>
      <small>Se você não solicitou, ignore este e-mail.</small>
    `,
  };

  await sgMail.send(msg);
}

function gerarStringAleatoria(tamanho: number = 10): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resultado = "";

  for (let i = 0; i < tamanho; i++) {
    const index = Math.floor(Math.random() * caracteres.length);
    resultado += caracteres[index];
  }

  return resultado;
} //função para gerar o token para recuperar a senha

router.post("/", async (req: Request, res: Response) => {
    let dados = req.body;
    const db = await getConn();
        try { 
            // Busca o email
            let token = gerarStringAleatoria(10)
            const [rows]: any = await db.execute(
                'UPDATE usuarios SET tokensenha = ? WHERE email = ?',
                [token, dados['email']]
            ); // adiciona na coluna do bd o token que foi gerado
            if (rows.affectedRows == 1) { //se alguma linha foi adiciona sicginica que deu certo
                sendRecoveryEmail(dados['email'], token)
                return res.status(200).send({message:"email enviado."})
            }
            return res.status(404).send({message:"Usuário não encontrado."})
    
        } finally {
        db.release();
  }
})

export default router;
