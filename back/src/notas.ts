// Autor: Gabrielle Mota

import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /Notas
 */
router.get("/", async (req: Request, res: Response) => {
  const matricula = req.query.matricula;
  const turmaId = req.query.turmaId;
  const componenteId = req.query.componenteId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM notas";
    let params: any[] = [];

    if (matricula) {
      sql += " WHERE matricula = ?";
      params.push(matricula);
    }

    if (turmaId) {
      sql += " AND id_turma = ?";
      params.push(turmaId);
    }

    if (componenteId) {
      sql += " AND id_componente = ?";
      params.push(componenteId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar Alunos", error });
  } finally {
    db.release();
  }
});

/**
 * PUT /notas
 */
router.put("/", async (req: Request, res: Response) => {
  const { nota, usuarioId, turmaId, matricula, componenteId } = req.body;

  const db = await getConn();
  try {
    //Verifica se já existe essa nota para essa combinação
    const [rows]: any = await db.execute(
      `SELECT * FROM notas
       WHERE matricula = ?
         AND id_turma = ?
         AND id_componente = ?`,
      [matricula, turmaId, componenteId]
    );

    if (rows.length > 0) {
      await db.execute(
        `UPDATE notas 
         SET nota = ?, id_usuario = ?, id_turma = ?
         WHERE matricula = ?
           AND id_turma = ?
           AND id_componente = ?
           AND nota <> ?`,
        [nota, usuarioId, turmaId, matricula, turmaId, componenteId, nota]
      );

      return res.status(200).json({
        message: "Nota atualizada com sucesso",
        matricula,
        componenteId,
        nota,
        usuarioId,
        turmaId
      });
    }

    await db.execute(
      `INSERT INTO notas (matricula, id_componente, nota, id_usuario, id_turma)
       VALUES (?, ?, ?, ?, ?)`,
      [matricula, componenteId, nota, usuarioId, turmaId]
    );

    return res.status(201).json({
      message: "Nota cadastrada com sucesso",
      matricula,
      componenteId,
      nota,
      usuarioId,
      turmaId
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao cadastrar/atualizar nota",
      error
    });
  } finally {
    db.release();
  }
});

router.post("/medias", async (req: Request, res: Response) => {
  const matricula = req.query.matricula;
  const turmaId = req.query.turmaId;
  const componenteId = req.query.componenteId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM notas";
    let params: any[] = [];

    if (matricula) {
      sql += " WHERE matricula = ?";
      params.push(matricula);
    }

    if (turmaId) {
      sql += " AND id_turma = ?";
      params.push(turmaId);
    }

    if (componenteId) {
      sql += " AND id_componente = ?";
      params.push(componenteId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar Alunos", error });
  } finally {
    db.release();
  }
});

export default router;
