-- TABELA DE ALUNOS
CREATE TABLE alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    id_turma INT,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma)
);

-- TABELA DE NOTAS
CREATE TABLE notas (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    media_final DECIMAL(5,2),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno)
);