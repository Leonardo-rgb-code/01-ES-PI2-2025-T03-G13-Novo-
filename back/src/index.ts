import express, {Request, Response} from "express";
import cors from "cors"
import cursoRoutes from './cursos'; 
import disciplinaRoutes from './disciplinas';
import redefSenhaRoutes from './redefsenha';
import componentesNotasRoutes from './componenteNotas';
import instituicoesRouter from './cadastroInstituicoes';
const app = express();
//express é a biblioteca que facilita a criação do servidor web
app.use(express.json());

app.use(cors());
//esta informando que a comunicação é por meio de json

let usuarios = [
    {
       nome : "Gabrielle",
       sobrenome : "Mota",
       telefone : "19 99999-9999",
       email : "gabi@hotmail.com",
       senha : "123Senha@", 
    }
];

// aqui identifica a porta que vamos entrar no servidor, porta 3000
app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000");
});

app.use('/cursos', cursoRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/senha', redefSenhaRoutes);
app.use('/notas', componentesNotasRoutes);
app.use('/api/instituicoes', instituicoesRouter);
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
    
app.post("/login", (req:Request, res:Response) => {
    let dados = req.body;
    let usuario = usuarios.find(_usuario => _usuario.email === dados["email"] && _usuario.senha === dados["senha"]);
    if (usuario != undefined){
        res.send(usuario)
    }
    else {
        res.status(404).send({message:"Usuário não encontrado."})
    }
})

app.get("/usuarios", (req:Request, res:Response) => {
    res.send(usuarios);   //retorna todos os alunos
});