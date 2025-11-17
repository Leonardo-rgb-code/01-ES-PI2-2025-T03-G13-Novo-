// Autor: Gabrielle Mota, Bruno Terra

import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /instituicoes
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const db = await getConn();
  console.log(usuarioId)
  try {
    let sql = "SELECT * FROM instituicoes";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar instituições", error });
  } finally {
    db.release();
  }
});

/**
 * GET /instituicoes/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (id == undefined || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM instituicoes WHERE id_instituicao = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar instituição", error });
  } finally {
    db.release();
  }
});

/**
 * POST /instituicoes
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, usuarioId } = req.body;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }

  if (!usuarioId || isNaN(Number(usuarioId))) {
    return res.status(400).json({ message: "Usuário inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO instituicoes (nome, id_usuario) VALUES (?, ?)",
      [nome, usuarioId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      usuarioId,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar instituição", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /instituicoes/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM instituicoes WHERE id_instituicao = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.json({ message: "Instituição excluída com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir instituição", error });
  } finally {
    db.release();
  }
});

export default router;
