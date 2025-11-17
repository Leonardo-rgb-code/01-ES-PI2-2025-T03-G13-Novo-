// Autor: Gabrielle Mota

import mysql, { Pool, PoolConnection } from "mysql2/promise";
//importa o mysql e faz a conexão com o servidor
let pool: Pool | null = null;

export async function initPool(): Promise<void> {
  pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'sistema_notadez',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });
  
  console.log("Pool de conexões MySQL iniciado.");
}

/**
 * FUNÇÃO getConn()
 * Retorna uma conexão ativa do pool.
 */
export async function getConn(): Promise<PoolConnection> {
  if (!pool) {
    throw new Error("Pool de conexões não iniciado. Chame initPool() antes.");
  }
  return await pool.getConnection();
}

/**
 * FUNÇÃO closePool()
 * Fecha o pool quando a aplicação for encerrada.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log("Pool de conexões encerrado.");
  }
}
