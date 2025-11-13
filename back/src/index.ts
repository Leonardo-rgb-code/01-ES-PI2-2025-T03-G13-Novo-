import express from "express";
import cors from "cors"
import loginRoutes from './login';
import recupSeanhaRoutes from './recupSenha'
import instituicaoRoutes from './cadastroInstituicoes'
import redefSenhaRoutes from './redefsenha';
import cadastroUsuarioRoutes from './cadastroUsuario';
import cadastroCursosoRoutes from './cadastroCursos';
import disciplinaRoutes from './cadastroDisciplinas';
// import componentesNotasRoutes from './componenteNotas';
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
// app.use('/notas', componentesNotasRoutes);
app.use('/cursos', cadastroCursosoRoutes);
app.use('/usuarios', cadastroUsuarioRoutes);
app.use('/redefSenha', redefSenhaRoutes);
app.use('/instituicoes', instituicaoRoutes);
app.use('/recupSenha', recupSeanhaRoutes);
app.use('/login', loginRoutes);
app.use('/disciplinas', disciplinaRoutes)
}

bootstrap();