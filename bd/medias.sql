-- Autor: Gabrielle Mota


CREATE TABLE medias(
  matricula varchar(100) NOT NULL,
  id_turma int NOT NULL,
  media decimal(5,2) NOT NULL,
  PRIMARY KEY (matricula, id_turma)
) 
     