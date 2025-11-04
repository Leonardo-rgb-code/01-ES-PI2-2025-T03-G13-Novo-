-- BANCO DE DADOS: SISTEMA NOTA DEZ

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS sistema_notadez;
USE sistema_notadez;

-- TABELA: USUÁRIOS

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('aluno', 'professor', 'administrador') DEFAULT 'aluno',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA: TENTATIVAS DE LOGIN

CREATE TABLE IF NOT EXISTS tentativas_login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    data_tentativa TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sucesso BOOLEAN,
    ip_usuario VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TABELA: TOKENS DE RECUPERAÇÃO DE SENHA

CREATE TABLE IF NOT EXISTS recuperacao_senha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    data_expiracao DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- INSERÇÃO DE USUÁRIO PADRÃO (TESTE)

INSERT INTO usuarios (nome, email, senha, tipo)
VALUES ('Administrador', 'admin@notadez.com', SHA2('admin123', 256), 'administrador');

-- TESTE DE CONSULTA DE LOGIN
-- (Exemplo de como validar login via SQL)

-- SELECT * FROM usuarios
-- WHERE email = 'admin@notadez.com'
-- AND senha = SHA2('admin123', 256);

-- OBSERVAÇÕES IMPORTANTES

-- 1. A senha é armazenada com SHA2 (hash de 256 bits). 
--    Em produção, use bcrypt ou argon2 no backend.
-- 2. A tabela 'tentativas_login' registra sucessos e falhas de login.
-- 3. A tabela 'recuperacao_senha' armazena tokens de redefinição de senha
--    enviados por e-mail.
-- 4. Todos os relacionamentos possuem integridade referencial.