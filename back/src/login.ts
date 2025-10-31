import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'projetopi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

interface Usuario {
    id: number;
    email: string;
    senha: string;
}

export async function login(email: string, senha: string): Promise<Usuario | null> {
    try {
        // Busca usuário pelo email
        const [rows] = await db.execute(
            'SELECT id, email, senha FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );

        const usuarios = rows as Usuario[];

        if (usuarios.length === 0) {
            // usuário não encontrado
            return null;
        }

        const usuario = usuarios[0];

        // login válido
        return usuario;

    } catch (err) {
        console.error('Erro no login:', err);
        throw err;
    }
}
