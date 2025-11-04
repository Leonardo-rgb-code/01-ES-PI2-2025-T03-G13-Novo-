-- BANCO DE DADOS: SISTEMA NOTA DEZ - MÓDULO ALUNOS

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- TABELA: TURMAS

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    ano_letivo YEAR NOT NULL,
    curso VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: ALUNOS

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome_aluno VARCHAR(150) NOT NULL,
    id_turma INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma) ON DELETE CASCADE
);

-- DADOS INICIAIS (EXEMPLOS)

INSERT INTO turmas (nome_turma, ano_letivo, curso)
VALUES 
('Turma A', 2025, 'Ciência da Computação'),
('Turma B', 2025, 'Engenharia de Software');

INSERT INTO alunos (matricula, nome_aluno, id_turma)
VALUES
('2500000', 'João da Silva Gomes', 1),
('2500001', 'Larissa Penteado de Souza', 1),
('2500002', 'Carlos Eduardo Santos', 2),
('2500003', 'Mariana Oliveira Costa', 2);

-- CONSULTAS DE EXEMPLO

-- 1️⃣ Listar todos os alunos com suas turmas
SELECT 
    a.matricula,
    a.nome_aluno,
    t.nome_turma,
    t.curso,
    t.ano_letivo
FROM alunos a
INNER JOIN turmas t ON a.id_turma = t.id_turma;

-- 2️⃣ Contar quantos alunos existem por turma
SELECT 
    t.nome_turma,
    COUNT(a.id_aluno) AS total_alunos
FROM turmas t
LEFT JOIN alunos a ON t.id_turma = a.id_turma
GROUP BY t.nome_turma;

-- 3️⃣ Deletar um aluno específico
-- DELETE FROM alunos WHERE matricula = '2500001';

-- 4️⃣ Atualizar nome do aluno
-- UPDATE alunos SET nome_aluno = 'Larissa Souza' WHERE matricula = '2500001';

-- FIM DO SCRIPT
