// Autor: Gabrielle Mota

import { getConn } from "./db";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { turmaId, matricula } = req.body;
  const db = await getConn();

  try {
    let sql = "SELECT count(*) total_notas FROM notas where id_turma = ? and matricula = ?";
    let params: any[] = [];
    params.push(turmaId, matricula)

    const [notas] : any = await db.execute(sql, params);
    const totalNotas = notas[0].total_notas;

    sql = `
    SELECT COUNT(*) AS total_componentes
    FROM turmas
    INNER JOIN disciplinas ON disciplinas.id = turmas.id_disciplina
    INNER JOIN componentes_notas ON disciplinas.id = componentes_notas.id_disciplina
    WHERE turmas.id_turma = ?`;

  const [rows] : any = await db.execute(sql, [turmaId]);

  const totalComponentes = rows[0].total_componentes;

  if (totalNotas == totalComponentes) {
    sql = `
    SELECT componentes_notas.peso, notas.nota FROM turmas
		 inner join disciplinas on disciplinas.id = turmas.id_disciplina
		 inner join componentes_notas on disciplinas.id = componentes_notas.id_disciplina
		 inner join alunos on alunos.id_turma = turmas.id_turma
         inner join notas on notas.matricula = alunos.matricula AND notas.id_turma = turmas.id_turma
         and notas.id_componente = componentes_notas.id_componente
		 where turmas.id_turma = ? AND alunos.matricula = ?`;
     
     const [notas] : any = await db.execute(sql, params);
      let media = 0;

      if (notas[0].peso != null) {
          let somaPesos = 0;
          notas.forEach((n: any) => {
              const notaNum = Number(n.nota);
              const pesoNum = Number(n.peso) / 100;
              media += notaNum * pesoNum;
              somaPesos += pesoNum;
          });
          media = media / somaPesos;
      } else {
          notas.forEach((n: any) => {
              media += Number(n.nota);
          });
          media = media / notas.length;
      }
      media = parseFloat(media.toFixed(2));

    await db.execute(
      `INSERT INTO medias (matricula, id_turma, media)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE media = VALUES(media)`,
      [matricula, turmaId, media]
    );
    return res.status(201).json({media, turmaId, matricula});
}
    return res.status(400).json({ message: "As notas não foram todas lançadas" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao calcular media", error });
  } finally {
    db.release();
  }
});

router.get("/", async (req: Request, res: Response) => {
  const turmaId = req.query.turmaId;
  const matricula = req.query.matricula;
  const db = await getConn();
  try {
    let sql = "SELECT * FROM medias";
    let params: any[] = [];

    if (turmaId) {
      sql += " WHERE id_turma = ?";
      params.push(turmaId);
    }

    if (matricula) {
      sql += " and matricula = ?";
      params.push(matricula);
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
