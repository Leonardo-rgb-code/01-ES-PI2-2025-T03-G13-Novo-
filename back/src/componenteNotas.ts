import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /Componentes de Notas
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.usuarioId;
  const disciplinaId = req.query.disciplinaId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM componentes_notas";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE id_usuario = ?";
      params.push(usuarioId);
    }

    if (disciplinaId) {
      sql += " AND id_dsiciplina = ?";
      params.push(disciplinaId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar Componentes de Notas", error });
  } finally {
    db.release();
  }
});

/**
 * GET /Componentes de Notas/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [rows]: any = await db.execute(
      "SELECT * FROM componentes_notas WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Componente de notas não encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar componente", error });
  } finally {
    db.release();
  }
});

/**
 * POST /Componentes de Notas
 */
router.post("/", async (req: Request, res: Response) => {
  const { nome, sigla, peso, usuarioId, disciplinaId } = req.body;
  const pesoFinal = (peso === "" || peso === undefined) ? null : peso;

  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "INSERT INTO componentes_notas (nome, sigla, peso, id_usuario, id_disciplina) VALUES (?, ?, ?, ?, ?)",
      [nome, sigla, pesoFinal, usuarioId, disciplinaId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      sigla,
      peso: pesoFinal,
      usuarioId,
      disciplinaId
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar componente de nota", error });
  } finally {
    db.release();
  }
});

/**
 * DELETE /Componentes de Notas/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }
  const db = await getConn();
  try {
    const [result]: any = await db.execute(
      "DELETE FROM componentes_notas WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Componente de notas não encontrado" });
    }

    return res.json({ message: "Componente de notas excluído com sucesso" });
  } catch (error: any) {
    if (error.errno === 1451) {
      return res.status(409).json({
        message: "Não é possível excluir. Existe vínculo com outra tabela.",
      });
    }

    return res.status(500).json({ message: "Erro ao excluir componente", error });
  } finally {
    db.release();
  }
});

export default router;
