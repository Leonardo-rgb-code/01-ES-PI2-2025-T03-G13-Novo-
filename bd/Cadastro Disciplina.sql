-- Autor: Gabrielle Mota, Leonardo Fonseca

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- Criação da tabela de disciplinas
CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    periodo INT NOT NULL,
    id_usuario INT,
    id_curso INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_curso) REFERENCES cursos(id)
);
