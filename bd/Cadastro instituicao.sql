-- BANCO DE DADOS COMPLETO: SISTEMA NOTA DEZ
-- MÓDULO: INSTITUIÇÕES, CURSOS, TURMAS E ALUNOS

-- 1️⃣ CRIAÇÃO DO BANCO DE DADOS
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- 2️⃣ TABELA: INSTITUIÇÕES
-- Contém as instituições de ensino cadastradas

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

-- 4️⃣ TABELA: TURMAS
-- Cada turma pertence a um curso

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    ano_letivo YEAR NOT NULL,
    id_curso INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- 5️⃣ TABELA: ALUNOS
-- Cada aluno pertence a uma turma

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome_aluno VARCHAR(150) NOT NULL,
    id_turma INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma) ON DELETE CASCADE
);

-- 6️⃣ INSERÇÃO DE DADOS EXEMPLO

INSERT INTO instituicoes (nome_instituicao, cidade, estado)
VALUES 
('Universidade Federal do ABC', 'Santo André', 'SP'),
('Instituto Federal de São Paulo', 'São Paulo', 'SP');

INSERT INTO cursos (nome_curso, area, id_instituicao)
VALUES 
('Ciência da Computação', 'Tecnologia', 1),
('Engenharia de Software', 'Tecnologia', 2);

INSERT INTO turmas (nome_turma, ano_letivo, id_curso)
VALUES
('Turma A', 2025, 1),
('Turma B', 2025, 2);

INSERT INTO alunos (matricula, nome_aluno, id_turma)
VALUES
('2500000', 'João da Silva Gomes', 1),
('2500001', 'Larissa Penteado de Souza', 1),
('2500002', 'Carlos Eduardo Santos', 2),
('2500003', 'Mariana Oliveira Costa', 2);

-- 7️⃣ CONSULTAS DE EXEMPLO

-- 🔹 Listar todas as instituições com seus cursos
SELECT 
    i.nome_instituicao,
    c.nome_curso,
    c.area
FROM instituicoes i
LEFT JOIN cursos c ON i.id_instituicao = c.id_instituicao;

-- 🔹 Listar turmas de cada curso
SELECT 
    c.nome_curso,
    t.nome_turma,
    t.ano_letivo
FROM cursos c
LEFT JOIN turmas t ON c.id_curso = t.id_curso;

-- 🔹 Listar alunos com instituição, curso e turma
SELECT 
    a.matricula,
    a.nome_aluno,
    t.nome_turma,
    c.nome_curso,
    i.nome_instituicao
FROM alunos a
JOIN turmas t ON a.id_turma = t.id_turma
JOIN cursos c ON t.id_curso = c.id_curso
JOIN instituicoes i ON c.id_instituicao = i.id_instituicao;

-- 🔹 Contar número de alunos por instituição
SELECT 
    i.nome_instituicao,
    COUNT(a.id_aluno) AS total_alunos
FROM instituicoes i
JOIN cursos c ON i.id_instituicao = c.id_instituicao
JOIN turmas t ON c.id_curso = t.id_curso
JOIN alunos a ON t.id_turma = a.id_turma
GROUP BY i.nome_instituicao;

-- FIM DO SCRIPT COMPLETO
