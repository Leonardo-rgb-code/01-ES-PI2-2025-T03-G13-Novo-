import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

/**
 * GET /instituicoes
 */
router.get("/", async (req: Request, res: Response) => {
  const usuarioId = req.query.userId;
  const db = await getConn();

  try {
    let sql = "SELECT * FROM instituicoes";
    let params: any[] = [];

    if (usuarioId) {
      sql += " WHERE usuario_id = ?";
      params.push(usuarioId);
    }

    const [rows] = await db.execute(sql, params);
    return res.json(rows);  
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar instituições", error });
  }
});

/**
 * GET /instituicoes/:id
 */
router.get("/instituicoes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const db = await getConn();
    const [rows]: any = await db.execute(
      "SELECT * FROM instituicoes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar instituição", error });
  }
});

/**
 * POST /instituicoes
 */
router.post("/instituicoes", async (req: Request, res: Response) => {
  const { nome, usuarioId } = req.body;

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }

  if (!usuarioId || isNaN(Number(usuarioId))) {
    return res.status(400).json({ message: "Usuário inválido" });
  }

  try {
    const db = await getConn();
    const [result]: any = await db.execute(
      "INSERT INTO instituicoes (nome, usuarioId) VALUES (?, ?)",
      [nome, usuarioId]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      usuarioId,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar instituição", error });
  }
});

/**
 * PUT /instituicoes/:id
 */
router.put("/instituicoes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { nome } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  if (!nome || nome.trim() === "") {
    return res.status(400).json({ message: "Nome obrigatório" });
  }

  try {
    const db = await getConn();
    const [result]: any = await db.execute(
      "UPDATE instituicoes SET nome = ? WHERE id = ?",
      [nome, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }

    return res.json({ id, nome });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar instituição", error });
  }
});

/**
 * DELETE /instituicoes/:id
 */
router.delete("/instituicoes/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const db = await getConn();
    const [result]: any = await db.execute(
      "DELETE FROM instituicoes WHERE id = ?",
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
  }
});

export default router;
