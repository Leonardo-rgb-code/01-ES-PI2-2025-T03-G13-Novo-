-- Autor: Gabrielle Mota

CREATE TABLE componentes_notas(
	id_componente INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	sigla VARCHAR(100) NOT NULL,
    descricao VARCHAR(100),
	peso INT NULL,
	id_usuario INT,
    id_disciplina INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id)
    );