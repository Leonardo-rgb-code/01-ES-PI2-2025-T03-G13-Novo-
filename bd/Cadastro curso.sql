-- BANCO DE DADOS COMPLETO: SISTEMA NOTA DEZ
-- MÓDULO: INSTITUIÇÕES, CURSOS, DISCIPLINAS, TURMAS E ALUNOS

-- 1️⃣ Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- 2️⃣ TABELA: INSTITUIÇÕES

CREATE TABLE IF NOT EXISTS instituicoes (
    id_instituicao INT AUTO_INCREMENT PRIMARY KEY,
    nome_instituicao VARCHAR(150) NOT NULL UNIQUE,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ TABELA: CURSOS
-- Cada curso pertence a uma instituição

CREATE TABLE IF NOT EXISTS cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nome_curso VARCHAR(150) NOT NULL,
    area VARCHAR(100),
    id_instituicao INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_instituicao) REFERENCES instituicoes(id_instituicao) ON DELETE CASCADE
);

-- 4️⃣ TABELA: DISCIPLINAS
-- Cada disciplina pertence a um curso

CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nome_disciplina VARCHAR(150) NOT NULL,
    carga_horaria INT,
    id_curso INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- 5️⃣ TABELA: TURMAS
-- Cada turma pertence a uma disciplina

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    ano_letivo YEAR NOT NULL,
    periodo ENUM('Matutino', 'Vespertino', 'Noturno') DEFAULT 'Matutino',
    id_disciplina INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE
);

-- 6️⃣ TABELA: ALUNOS
-- Cada aluno pertence a uma turma

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome_aluno VARCHAR(150) NOT NULL,
    id_turma INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma) ON DELETE CASCADE
);

-- 7️⃣ INSERÇÃO DE DADOS EXEMPLO

INSERT INTO instituicoes (nome_instituicao, cidade, estado)
VALUES 
('Universidade Federal do ABC', 'Santo André', 'SP'),
('Instituto Federal de São Paulo', 'São Paulo', 'SP');

INSERT INTO cursos (nome_curso, area, id_instituicao)
VALUES 
('Engenharia de Computação', 'Tecnologia', 1),
('Administração', 'Gestão', 2);

INSERT INTO disciplinas (nome_disciplina, carga_horaria, id_curso)
VALUES
('Algoritmos e Programação', 80, 1),
('Banco de Dados', 60, 1),
('Gestão Empresarial', 60, 2);

INSERT INTO turmas (nome_turma, ano_letivo, periodo, id_disciplina)
VALUES
('Turma 1', 2025, 'Matutino', 1),
('Turma 2', 2025, 'Noturno', 2),
('Turma 3', 2025, 'Vespertino', 3);

INSERT INTO alunos (matricula, nome_aluno, id_turma)
VALUES
('2500000', 'João da Silva Gomes', 1),
('2500001', 'Larissa Penteado de Souza', 1),
('2500002', 'Carlos Eduardo Santos', 2),
('2500003', 'Mariana Oliveira Costa', 3);

-- 8️⃣ CONSULTAS DE EXEMPLO

-- 🔹 Listar todas as instituições com seus cursos
SELECT 
    i.nome_instituicao,
    c.nome_curso,
    c.area
FROM instituicoes i
LEFT JOIN cursos c ON i.id_instituicao = c.id_instituicao;

-- 🔹 Listar cursos com suas disciplinas
SELECT 
    c.nome_curso,
    d.nome_disciplina,
    d.carga_horaria
FROM cursos c
LEFT JOIN disciplinas d ON c.id_curso = d.id_curso;

-- 🔹 Listar turmas com curso e instituição
SELECT 
    t.nome_turma,
    d.nome_disciplina,
    c.nome_curso,
    i.nome_instituicao,
    t.ano_letivo,
    t.periodo
FROM turmas t
JOIN disciplinas d ON t.id_disciplina = d.id_disciplina
JOIN cursos c ON d.id_curso = c.id_curso
JOIN instituicoes i ON c.id_instituicao = i.id_instituicao;

-- 🔹 Listar alunos com todas as informações hierárquicas
SELECT 
    a.matricula,
    a.nome_aluno,
    t.nome_turma,
    d.nome_disciplina,
    c.nome_curso,
    i.nome_instituicao
FROM alunos a
JOIN turmas t ON a.id_turma = t.id_turma
JOIN disciplinas d ON t.id_disciplina = d.id_disciplina
JOIN cursos c ON d.id_curso = c.id_curso
JOIN instituicoes i ON c.id_instituicao = i.id_instituicao;

-- FIM DO SCRIPT COMPLETO
