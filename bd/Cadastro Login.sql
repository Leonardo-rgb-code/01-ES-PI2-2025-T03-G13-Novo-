-- BANCO DE DADOS: SISTEMA NOTA DEZ

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- TABELA: USUÁRIOS

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERÇÃO DE USUÁRIO PADRÃO (TESTE)

INSERT INTO usuarios (nome, email, senha, telefone, sobrenome);
VALUES ('Administrador', 'admin@notadez.com', 'admin123', '19999999999', 'Fulano');
ALTER TABLE usuarios ADD COLUMN tokensenha VARCHAR(10) NULL;