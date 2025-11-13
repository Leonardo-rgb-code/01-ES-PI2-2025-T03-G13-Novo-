import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /disciplinas
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const cursoId = req.query.cursoId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM disciplinas";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    if (cursoId) {
      sql += " AND id_curso = ?";
      params.push(cursoId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar disciplinas", error });
  } finally {
    db.release();
  }
});

/**
 * GET /disciplina/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM disciplinas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar disciplina", error });
  } finally {
    db.release();
  }
});

/**
 * POST /disciplina
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, sigla, codigo, periodo, usuarioId, cursoId } = req.body;

  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO disciplinas (nome, sigla, codigo, periodo, id_usuario, id_curso) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, sigla, codigo, periodo, usuarioId, cursoId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      sigla,
      codigo,
      periodo,
      usuarioId,
      cursoId
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar dicisplina", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /disciplina/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM disciplinas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Disciplina não encontrada" });
    }

    return res.json({ message: "Disciplina excluída com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir disciplina", error });
  } finally {
    db.release();
  }
});

export default router;
