-- Autor: Gabrielle Mota, Leonardo Fonseca

CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;
CREATE TABLE IF NOT EXISTS instituicoes (
    id_instituicao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE,
    id_usuario INT, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);