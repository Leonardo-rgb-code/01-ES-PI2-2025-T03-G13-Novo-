import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /Alunos
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const turmaId = req.query.trumaId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM alunos";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    if (turmaId) {
      sql += " AND id_truma = ?";
      params.push(turmaId);
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
 * GET /aluno/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM alunos WHERE matricula = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar aluno", error });
  } finally {
    db.release();
  }
});

/**
 * POST /Aluno
 */
router.post("/", async (req: Request, res: Response) => {
  const { matricula, nome, usuarioId, turmaId } = req.body;

  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO alunos (matricula, nome, id_usuario, id_turma) VALUES (?, ?, ?, ?)",
      [matricula, nome, usuarioId, turmaId]
    );

    return res.status(201).json({ //to mandando pro frontend a resposta
      id: result.insertId, //o id foi preenchido
      nome,
      usuarioId,
      turmaId
    });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar aluno", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /aluno/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM alunos WHERE matricula = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    return res.json({ message: "Aluno excluído com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir aluno", error });
  } finally {
    db.release();
  }
});

export default router;
