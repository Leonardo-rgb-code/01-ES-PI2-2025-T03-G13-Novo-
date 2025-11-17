// Autor: Gabrielle Mota, Bruno Terra

//cria as rotas para o front mandar as requisições pro back
import express from "express";
import cors from "cors"
import loginRoutes from './login';
import recupSeanhaRoutes from './recupSenha'
import instituicaoRoutes from './cadastroInstituicoes'
import redefSenhaRoutes from './redefsenha';
import cadastroUsuarioRoutes from './cadastroUsuario';
import cadastroCursosoRoutes from './cadastroCursos';
import disciplinaRoutes from './cadastroDisciplinas';
import turmasRoutes from './cadastroTurmas';
import componentesNotasRoutes from './componenteNotas';
import alunosRoutes from './cadastroAlunos';
import notasRoutes from './notas';
import mediasRoutes from './medias';
import { initPool } from "./db";
const app = express();
//express é a biblioteca que facilita a criação do servidor web
app.use(express.json());

//cors permite que o back se comunique com o front em domínios diferentes
app.use(cors());

//cria a função pra iniciar o servidor
async function bootstrap() {
  await initPool(); //cria o pool e inicia o servidor
  app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000"); //inicia o servidor na porta 3000
});

//utiliza as rotas criadas
app.use('/cursos', cadastroCursosoRoutes);
app.use('/usuarios', cadastroUsuarioRoutes);
app.use('/redefSenha', redefSenhaRoutes);
app.use('/instituicoes', instituicaoRoutes);
app.use('/recupSenha', recupSeanhaRoutes);
app.use('/login', loginRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/turmas', turmasRoutes)
app.use('/componenteNotas', componentesNotasRoutes);
app.use('/alunos', alunosRoutes);
app.use('/notas', notasRoutes);
app.use('/medias', mediasRoutes);
}

bootstrap();