-- Autor: Gabrielle Mota

-- BANCO DE DADOS: SISTEMA NOTA DEZ - MÓDULO ALUNOS

-- Criação do banco de dados
CREATE TABLE alunos(
    matricula VARCHAR(100),
    nome VARCHAR(100) NOT NULL,
	id_usuario INT,
    id_turma INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma),
    PRIMARY KEY (matricula, id_turma)
);