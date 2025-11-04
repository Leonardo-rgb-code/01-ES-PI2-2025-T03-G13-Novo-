-- BANCO DE DADOS COMPLETO: SISTEMA NOTA DEZ
-- MÓDULO: TURMAS E ALUNOS

-- 1️⃣ Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- 2️⃣ TABELA DE DISCIPLINAS
-- Cada turma está vinculada a uma disciplina

CREATE TABLE IF NOT EXISTS disciplinas (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nome_disciplina VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ TABELA DE TURMAS
-- Cada turma pertence a uma disciplina

CREATE TABLE IF NOT EXISTS turmas (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    nome_turma VARCHAR(100) NOT NULL,
    id_disciplina INT NOT NULL,
    ano_letivo YEAR NOT NULL,
    periodo ENUM('Matutino','Vespertino','Noturno') DEFAULT 'Matutino',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_disciplina) REFERENCES disciplinas(id_disciplina) ON DELETE CASCADE
);

-- 4️⃣ TABELA DE ALUNOS
-- Cada aluno pertence a uma turma

CREATE TABLE IF NOT EXISTS alunos (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    nome_aluno VARCHAR(150) NOT NULL,
    id_turma INT NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_turma) REFERENCES turmas(id_turma) ON DELETE CASCADE
);

-- 5️⃣ INSERÇÃO DE DADOS EXEMPLO

INSERT INTO disciplinas (nome_disciplina, descricao)
VALUES
('Algoritmos e Programação', 'Disciplina introdutória de lógica e codificação.'),
('Banco de Dados', 'Disciplina sobre modelagem e SQL.'),
('Engenharia de Software', 'Planejamento e projeto de sistemas.');

INSERT INTO turmas (nome_turma, id_disciplina, ano_letivo, periodo)
VALUES
('Turma 1', 1, 2025, 'Matutino'),
('Turma 2', 2, 2025, 'Noturno'),
('Turma 3', 3, 2025, 'Vespertino');

INSERT INTO alunos (matricula, nome_aluno, id_turma)
VALUES
('2500000', 'João da Silva Gomes', 1),
('2500001', 'Larissa Penteado de Souza', 1),
('2500002', 'Carlos Eduardo Santos', 2),
('2500003', 'Mariana Oliveira Costa', 3);

-- 6️⃣ CONSULTAS DE EXEMPLO

-- Listar todas as turmas com suas disciplinas
SELECT 
    t.id_turma,
    t.nome_turma,
    d.nome_disciplina,
    t.ano_letivo,
    t.periodo
FROM turmas t
JOIN disciplinas d ON t.id_disciplina = d.id_disciplina;

-- Listar alunos e suas turmas
SELECT 
    a.matricula,
    a.nome_aluno,
    t.nome_turma,
    d.nome_disciplina,
    t.periodo
FROM alunos a
JOIN turmas t ON a.id_turma = t.id_turma
JOIN disciplinas d ON t.id_disciplina = d.id_disciplina;

-- Contar alunos por turma
SELECT 
    t.nome_turma,
    COUNT(a.id_aluno) AS total_alunos
FROM turmas t
LEFT JOIN alunos a ON t.id_turma = a.id_turma
GROUP BY t.nome_turma;

-- FIM DO SCRIPT COMPLETO

-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  `sobrenome` text NOT NULL,
  `telefone` varchar NOT NULL,
  `email` varchar NOT NULL,
  `senha` varchar NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Nome','Sobrenome','(11)99999-9999','user@hotmail.com','Senha');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 10:18:43
