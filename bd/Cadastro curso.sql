-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_cursos;
USE sistema_cursos;

-- Criação da tabela principal
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL
);

-- Inserir novo curso
DELIMITER //
CREATE PROCEDURE inserir_curso(IN nome_curso VARCHAR(150))
BEGIN
    INSERT INTO cursos (nome) VALUES (nome_curso);
END //
DELIMITER ;

-- Listar todos os cursos
DELIMITER //
CREATE PROCEDURE listar_cursos()
BEGIN
    SELECT id AS codigo, nome AS nome_curso
    FROM cursos
    ORDER BY id ASC;
END //
DELIMITER ;

-- Atualizar o nome de um curso
DELIMITER //
CREATE PROCEDURE atualizar_curso(IN id_curso INT, IN novo_nome VARCHAR(150))
BEGIN
    UPDATE cursos
    SET nome = novo_nome
    WHERE id = id_curso;
END //
DELIMITER ;

-- Excluir um curso
DELIMITER //
CREATE PROCEDURE excluir_curso(IN id_curso INT)
BEGIN
    DELETE FROM cursos WHERE id = id_curso;
END //
DELIMITER ;
