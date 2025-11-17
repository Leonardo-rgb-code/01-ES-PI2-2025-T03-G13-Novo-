-- Autor: Gabrielle Motas

-- BANCO DE DADOS COMPLETO: SISTEMA NOTA DEZ
CREATE TABLE turmas (
	id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
	id_usuario INT,
    id_disciplina INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id)
    );