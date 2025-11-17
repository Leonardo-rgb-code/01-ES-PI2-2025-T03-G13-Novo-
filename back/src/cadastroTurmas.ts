// Autor: Gabrielle Mota, Bruno Terra

import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /turmas
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const disciplinaId = req.query.disciplinaId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM turmas";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    if (disciplinaId) {
      sql += " AND id_disciplina = ?";
      params.push(disciplinaId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar turmas", error });
  } finally {
    db.release();
  }
});

/**
 * GET /turma/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM turmas WHERE id_turma = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar turma", error });
  } finally {
    db.release();
  }
});

/**
 * POST /turma
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, usuarioId, disciplinaId } = req.body;

  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO turmas (nome, id_usuario, id_disciplina) VALUES (?, ?, ?)",
      [nome, usuarioId, disciplinaId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      usuarioId,
      disciplinaId
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar turma", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /turma/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM turmas WHERE id_turma = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    return res.json({ message: "Turma excluída com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir turma", error });
  } finally {
    db.release();
  }
});

export default router;
