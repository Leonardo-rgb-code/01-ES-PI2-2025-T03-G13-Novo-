-- BANCO DE DADOS COMPLETO: SISTEMA NOTA DEZ
-- PAINEL DO PROFESSOR + TODAS AS TELAS RELACIONADAS

-- 1️⃣ CRIAÇÃO DO BANCO DE DADOS
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- 2️⃣ TABELA: USUÁRIOS (LOGIN)

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('professor', 'aluno', 'administrador') DEFAULT 'professor',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ TABELA: PROFESSORES
-- Cada professor é vinculado a um usuário do sistema

CREATE TABLE IF NOT EXISTS professores (
    id_professor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    titulacao VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 4️⃣ TABELA: INSTITUIÇÕES
-- Cada instituição pode ser gerenciada por vários professores

CREATE TABLE IF NOT EXISTS instituicoes (
    id_instituicao INT AUTO_INCREMENT PRIMARY KEY,
    nome_instituicao VARCHAR(150) NOT NULL UNIQUE,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5️⃣ TABELA: CURSOS
-- Cada curso pertence a uma instituição

CREATE TABLE IF NOT EXISTS cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nome_curso VARCHAR(150) NOT NULL,
    area VARCHAR(100),
    id_instituicao INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_instituicao) REFERENCES instituicoes(id_instituicao) ON DELETE CASCADE
);

-- 6️⃣ TABELA: DISCIPLINAS
-- Cada disciplina pertence a um curso

CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nome_disciplina VARCHAR(150) NOT NULL,
    sigla VARCHAR(20),
    codigo VARCHAR(50),
    periodo ENUM('1º Semestre', '2º Semestre', 'Anual') DEFAULT '1º Semestre',
    carga_horaria INT,
    id_curso INT NOT NULL,
    id_professor INT,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_professor) REFERENCES professores(id_professor) ON DELETE SET NULL
);

-- 7️⃣ TABELA: TURMAS
-- Cada turma pertence a uma disciplina

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    ano_letivo YEAR NOT NULL,
    periodo ENUM('Matutino','Vespertino','Noturno') DEFAULT 'Matutino',
    id_disciplina INT NOT NULL,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE
);

-- 8️⃣ TABELA: ALUNOS
-- Cada aluno pertence a uma turma

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome_aluno VARCHAR(150) NOT NULL,
    id_turma INT NOT NULL,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma) ON DELETE CASCADE
);

-- 9️⃣ TABELA: COMPONENTES DE NOTAS
-- Cada disciplina pode ter provas, trabalhos etc.

CREATE TABLE IF NOT EXISTS componentes_notas (
    id_componente INT AUTO_INCREMENT PRIMARY KEY,
    nome_componente VARCHAR(100) NOT NULL,
    peso DECIMAL(4,2) NOT NULL CHECK (peso > 0),
    id_disciplina INT NOT NULL,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE
);

-- 🔟 TABELA: NOTAS
-- Armazena as notas de cada aluno por componente

CREATE TABLE IF NOT EXISTS notas (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_componente INT NOT NULL,
    nota DECIMAL(5,2) CHECK (nota BETWEEN 0 AND 10),
    data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE,
    FOREIGN KEY (id_componente) REFERENCES componentes_notas(id_componente) ON DELETE CASCADE
);

-- 11️⃣ INSERÇÃO DE DADOS EXEMPLO

-- Usuário Professor
INSERT INTO usuarios (nome, email, senha, tipo) 
VALUES ('Professor Carlos', 'carlos@notadez.com', SHA2('123456', 256), 'professor');

-- Professor vinculado
INSERT INTO professores (id_usuario, cpf, titulacao) 
VALUES (1, '123.456.789-00', 'Mestre em Engenharia de Software');

-- Instituições
INSERT INTO instituicoes (nome_instituicao, cidade, estado)
VALUES 
('Universidade Federal do ABC', 'Santo André', 'SP'),
('Instituto Federal de São Paulo', 'São Paulo', 'SP');

-- Cursos
INSERT INTO cursos (nome_curso, area, id_instituicao)
VALUES 
('Engenharia de Computação', 'Tecnologia', 1),
('Administração', 'Gestão', 2);

-- Disciplinas
INSERT INTO disciplinas (nome_disciplina, sigla, codigo, periodo, carga_horaria, id_curso, id_professor)
VALUES
('Projeto Integrador II', 'PI2', 'PI2025', '1º Semestre', 80, 1, 1),
('Engenharia de Requisitos', 'ERQ', 'ERQ2025', '2º Semestre', 60, 1, 1),
('Gestão Empresarial', 'GE', 'GE2025', '1º Semestre', 60, 2, 1);

-- Turmas
INSERT INTO turmas (nome_turma, ano_letivo, periodo, id_disciplina)
VALUES
('Turma A', 2025, 'Matutino', 1),
('Turma B', 2025, 'Noturno', 2),
('Turma C', 2025, 'Vespertino', 3);

-- Alunos
INSERT INTO alunos (matricula, nome_aluno, id_turma)
VALUES
('2500000', 'João da Silva Gomes', 1),
('2500001', 'Larissa Penteado de Souza', 1),
('2500002', 'Carlos Eduardo Santos', 2),
('2500003', 'Mariana Oliveira Costa', 3);

-- Componentes de Notas
INSERT INTO componentes_notas (nome_componente, peso, id_disciplina)
VALUES
('Prova 1', 4.0, 1),
('Trabalho Final', 6.0, 1),
('Prova Única', 10.0, 2);

-- Notas
INSERT INTO notas (id_aluno, id_componente, nota)
VALUES
(1, 1, 8.0),
(1, 2, 9.0),
(2, 1, 7.5),
(2, 2, 8.5),
(3, 3, 6.0);

-- 12️⃣ CONSULTAS DE EXEMPLO (PARA O PAINEL DO PROFESSOR)

-- 🔹 Listar Disciplinas do Professor
SELECT 
    d.nome_disciplina,
    c.nome_curso,
    i.nome_instituicao
FROM disciplinas d
JOIN cursos c ON d.id_curso = c.id_curso
JOIN instituicoes i ON c.id_instituicao = i.id_instituicao
WHERE d.id_professor = 1;

-- 🔹 Exibir alunos e notas por disciplina
SELECT 
    a.nome_aluno,
    d.nome_disciplina,
    cn.nome_componente,
    n.nota
FROM notas n
JOIN alunos a ON n.id_aluno = a.id_aluno
JOIN componentes_notas cn ON n.id_componente = cn.id_componente
JOIN disciplinas d ON cn.id_disciplina = d.id_disciplina
WHERE d.id_professor = 1;

-- 🔹 Calcular média final de cada aluno em cada disciplina
SELECT 
    a.nome_aluno,
    d.nome_disciplina,
    ROUND(SUM(n.nota * cn.peso) / SUM(cn.peso), 2) AS media_final
FROM
    notas n
        JOIN
    alunos a ON n.id_aluno = a.id_aluno
        JOIN
    componentes_notas cn ON n.id_componente = cn.id_componente
        JOIN
    disciplinas d ON cn.id_disciplina = d.id_disciplina
GROUP BY a.nome_aluno , d.nome_disciplina;

-- FIM DO SCRIPT COMPLETO
