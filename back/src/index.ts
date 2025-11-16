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

app.use(cors());

async function bootstrap() {
  await initPool();
  app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000");
});

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