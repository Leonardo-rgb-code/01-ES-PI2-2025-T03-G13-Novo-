import { getConn } from "./db";
import  { Router, Request, Response } from "express";

const router = Router();
import sgMail from "@sendgrid/mail";

sgMail.setApiKey("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");

async function sendRecoveryEmail(to: string, token: string) {
  const url = `http://127.0.0.1:5501/front/senha/redefSenha.html?token=${token}`;

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
}

console.log(gerarStringAleatoria());


router.post("/", async (req: Request, res: Response) => {
    let dados = req.body;
    const db = await getConn();
        try { 
            // Busca o email
            let token = gerarStringAleatoria(10)
            const [rows]: any = await db.execute(
                'UPDATE usuarios SET tokensenha = ? WHERE email = ?',
                [token, dados['email']]
            ); 
            if (rows.affectedRows == 1) {
                sendRecoveryEmail(dados['email'], token)
                return res.status(200).send({message:"email enviado."})
            }
            return res.status(404).send({message:"Usuário não encontrado."})
    
        } finally {
        db.release();
  }
})

export default router;
