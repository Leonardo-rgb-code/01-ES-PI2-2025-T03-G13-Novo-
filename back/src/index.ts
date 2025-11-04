import express, {Request, Response} from "express";
import cors from "cors"
import loginRoutes from './login';
// import cursoRoutes from './cursos'; 
// import disciplinaRoutes from './disciplinas';
// import redefSenhaRoutes from './redefsenha';
// import componentesNotasRoutes from './componenteNotas';
import { initPool } from "./db";
const app = express();
//express é a biblioteca que facilita a criação do servidor web
app.use(express.json());

app.use(cors());

let usuarios = [
    {
       nome : "Gabrielle",
       sobrenome : "Mota",
       telefone : "19 99999-9999",
       email : "gabi@hotmail.com",
       senha : "123Senha@", 
    }
];
async function bootstrap() {
  await initPool();
  app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000");
});
// app.use('/cursos', cursoRoutes);
// app.use('/disciplinas', disciplinaRoutes);
// app.use('/senha', redefSenhaRoutes);
// app.use('/notas', componentesNotasRoutes);
app.use('/login', loginRoutes);
app.post("/usuarios", (req:Request, res:Response) => {
    let usuario = req.body;
    console.log(usuario)
    if (usuario["nome"] == "" || usuario["sobrenome"] == "" || usuario["telefone"] == "" || usuario["email"] == "" || usuario["senha"] == ""){
        res.status(400).send({message:"Campos não preenchidos"})
    }
    else {
        usuarios.push(usuario);  //inserir no banco de dados
        res.send({message:"Usuário cadastrado com sucesso!"});
    }
})
    

app.get("/usuarios", (req:Request, res:Response) => {
    res.send(usuarios);   //retorna todos os alunos
});
}

bootstrap();