-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- Criação da tabela principal
CREATE TABLE notas (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    nota DECIMAL(5,2) NOT NULL,
    id_usuario INT, 
    id_turma INT, 
    matricula VARCHAR(100), 
    id_componente INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (matricula) REFERENCES alunos(matricula),
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma),
    FOREIGN KEY (id_componente) REFERENCES componentes_notas(id_componente)
);

CREATE TABLE notas_audit (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    nota_antiga DECIMAL(5,2) NOT NULL,
    nota_nova DECIMAL(5,2) NOT NULL,
    id_usuario INT NOT NULL, 
    matricula VARCHAR(100) NOT NULL,
    nome_aluno VARCHAR(100) NOT NULL,
    mensagem VARCHAR(500) NOT NULL,
    data_hora DATETIME NOT NULL
);

CREATE TRIGGER trg_notas_audit
AFTER UPDATE ON notas
FOR EACH ROW
BEGIN
    DECLARE v_nome_aluno VARCHAR(100);
    DECLARE v_data_hora DATETIME;
    DECLARE v_mensagem VARCHAR(500);

    -- Buscar o nome do aluno
    SELECT nome INTO v_nome_aluno
    FROM alunos
    WHERE matricula = NEW.matricula
    LIMIT 1;

    -- Data e hora no fuso do Brasil (UTC-3)
    SET v_data_hora = CONVERT_TZ(NOW(), '+00:00', '-03:00');

    -- Montar mensagem
    SET v_mensagem = CONCAT(
        DATE_FORMAT(v_data_hora, '%d/%m/%Y %H:%i:%s'),
        ' - (Aluno ', v_nome_aluno, ') - Nota de ',
        OLD.nota, ' para ', NEW.nota
    );

    -- Inserir na tabela de auditoria
    INSERT INTO notas_audit (
        nota_antiga,
        nota_nova,
        id_usuario,
        matricula,
        nome_aluno,
        mensagem,
        data_hora
    ) VALUES (
        OLD.nota,
        NEW.nota,
        NEW.id_usuario,
        NEW.matricula,
        v_nome_aluno,
        v_mensagem,
        v_data_hora
    );

END $$

DELIMITER $$
CREATE TRIGGER trg_notas_audit_insert
AFTER INSERT ON notas
FOR EACH ROW
BEGIN
    DECLARE v_nome_aluno VARCHAR(100);
    DECLARE v_data_hora DATETIME;
    DECLARE v_mensagem VARCHAR(500);

    -- Buscar o nome do aluno
    SELECT nome INTO v_nome_aluno
    FROM alunos
    WHERE matricula = NEW.matricula
    LIMIT 1;

    -- Data e hora no fuso do Brasil (UTC-3)
    SET v_data_hora = CONVERT_TZ(NOW(), '+00:00', '-03:00');

    -- Montar mensagem
    SET v_mensagem = CONCAT(
        DATE_FORMAT(v_data_hora, '%d/%m/%Y %H:%i:%s'),
        ' - (Aluno ', v_nome_aluno, ') - Nota de nao tem',
        ' para ', NEW.nota
    );

    -- Inserir na tabela de auditoria
    INSERT INTO notas_audit (
        nota_antiga,
        nota_nova,
        id_usuario,
        matricula,
        nome_aluno,
        mensagem,
        data_hora
    ) VALUES (
        '0',
        NEW.nota,
        NEW.id_usuario,
        NEW.matricula,
        v_nome_aluno,
        v_mensagem,
        v_data_hora
    );

END $$