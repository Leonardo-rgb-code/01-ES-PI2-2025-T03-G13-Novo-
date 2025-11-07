-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_instituicoes;
USE sistema_instituicoes;

-- Criação da tabela principal
CREATE TABLE instituicoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL
);

-- Inserir nova instituição
DELIMITER //
CREATE PROCEDURE inserir_instituicao(IN nome_inst VARCHAR(150))
BEGIN
    INSERT INTO instituicoes (nome) VALUES (nome_inst);
END //
DELIMITER ;

-- Listar todas as instituições
DELIMITER //
CREATE PROCEDURE listar_instituicoes()
BEGIN
    SELECT id AS codigo, nome AS nome_instituicao
    FROM instituicoes
    ORDER BY id ASC;
END //
DELIMITER ;

-- Atualizar o nome de uma instituição
DELIMITER //
CREATE PROCEDURE atualizar_instituicao(IN id_inst INT, IN novo_nome VARCHAR(150))
BEGIN
    UPDATE instituicoes
    SET nome = novo_nome
    WHERE id = id_inst;
END //
DELIMITER ;

-- Excluir uma instituição
DELIMITER //
CREATE PROCEDURE excluir_instituicao(IN id_inst INT)
BEGIN
    DELETE FROM instituicoes WHERE id = id_inst;
END //
DELIMITER ;
