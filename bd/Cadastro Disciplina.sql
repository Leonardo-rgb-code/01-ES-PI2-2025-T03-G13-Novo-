-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_disciplinas;
USE sistema_disciplinas;

-- Criação da tabela de disciplinas
CREATE TABLE disciplinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    sigla VARCHAR(20) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    periodo ENUM('1º Semestre', '2º Semestre') NOT NULL
);

-- Inserir nova disciplina
DELIMITER //
CREATE PROCEDURE inserir_disciplina(
    IN nome_disciplina VARCHAR(150),
    IN sigla_disciplina VARCHAR(20),
    IN codigo_disciplina VARCHAR(50),
    IN periodo_disciplina VARCHAR(20)
)
BEGIN
    INSERT INTO disciplinas (nome, sigla, codigo, periodo)
    VALUES (nome_disciplina, sigla_disciplina, codigo_disciplina, periodo_disciplina);
END //
DELIMITER ;

-- Listar todas as disciplinas
DELIMITER //
CREATE PROCEDURE listar_disciplinas()
BEGIN
    SELECT id AS codigo,
           nome AS nome_disciplina,
           sigla AS sigla,
           codigo AS codigo_disciplina,
           periodo AS periodo
    FROM disciplinas
    ORDER BY id ASC;
END //
DELIMITER ;

-- Atualizar disciplina
DELIMITER //
CREATE PROCEDURE atualizar_disciplina(
    IN id_disciplina INT,
    IN novo_nome VARCHAR(150),
    IN nova_sigla VARCHAR(20),
    IN novo_codigo VARCHAR(50),
    IN novo_periodo VARCHAR(20)
)
BEGIN
    UPDATE disciplinas
    SET nome = novo_nome,
        sigla = nova_sigla,
        codigo = novo_codigo,
        periodo = novo_periodo
    WHERE id = id_disciplina;
END //
DELIMITER ;

-- Excluir disciplina
DELIMITER //
CREATE PROCEDURE excluir_disciplina(IN id_disciplina INT)
BEGIN
    DELETE FROM disciplinas WHERE id = id_disciplina;
END //
DELIMITER ;
