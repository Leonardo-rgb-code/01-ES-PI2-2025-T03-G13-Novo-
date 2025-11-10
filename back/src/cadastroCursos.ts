import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /cursos
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const instId = req.query.instId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM cursos";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    if (instId) {
      sql += " AND id_instituicao = ?";
      params.push(instId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar cursos", error });
  } finally {
    db.release();
  }
});

/**
 * GET /cursos/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM cursos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Curso não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar curso", error });
  } finally {
    db.release();
  }
});

/**
 * POST /cursos
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, usuarioId, instId } = req.body;

  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO cursos (nome, id_usuario, id_instituicao) VALUES (?, ?, ?)",
      [nome, usuarioId, instId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      usuarioId,
      instId
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar curso", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /cursos/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM cursos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Curso não encontrada" });
    }

    return res.json({ message: "Curo excluído com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir curso", error });
  } finally {
    db.release();
  }
});

export default router;
