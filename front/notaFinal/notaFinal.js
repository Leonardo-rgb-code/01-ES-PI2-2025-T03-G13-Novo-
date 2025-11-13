document.addEventListener("DOMContentLoaded", () => {
    function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado !== "true") {
      alert("Usuário não identificado. Faça login novamente.");
      window.location.href = "../login/login.html";
      throw new Error("Execução interrompida — usuário não logado.");
    }
  }

  const usuarioId = localStorage.getItem("id");

  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  const selectInstituicao = document.getElementById("selectInstituicao");
  const selectCurso = document.getElementById("selectCurso");
  const selectDisciplina = document.getElementById("selectDisciplina");
  const selectTurma = document.getElementById("selectTurma");
  const tabelaHead = document.getElementById("tabelaHead");
  const tabelaBody = document.getElementById("tabelaBody");
  const btnSalvarNotas = document.getElementById("btnSalvarNotas");
  const btnInicial = document.getElementById("btnInicial");

  let componentes = []; // ← componentes de nota (P1, P2, etc)

  // BUSCA INSTITUIÇÕES
  async function carregarInstituicoes() {
    const res = await fetch(`http://localhost:3000/instituicoes?usuarioId=${usuarioId}`);
    const lista = await res.json();

    selectInstituicao.innerHTML = `<option value="">Selecione...</option>`;
    lista.forEach(inst => {
      const op = document.createElement("option");
      op.value = inst.id;
      op.textContent = inst.nome;
      selectInstituicao.appendChild(op);
    });
  }

  // BUSCA CURSOS
  async function carregarCursos(instId) {
    const res = await fetch(`http://localhost:3000/cursos?usuarioId=${usuarioId}&instId=${instId}`);
    const lista = await res.json();

    selectCurso.innerHTML = `<option value="">Selecione...</option>`;
    lista.forEach(curso => {
      const op = document.createElement("option");
      op.value = curso.id_curso ?? curso.id;
      op.textContent = curso.nome_curso ?? curso.nome;
      selectCurso.appendChild(op);
    });

    selectCurso.disabled = false;
  }

  // BUSCA DISCIPLINAS
  async function carregarDisciplinas(cursoId) {
    const res = await fetch(`http://localhost:3000/disciplinas?cursoId=${cursoId}`);
    const lista = await res.json();

    selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    lista.forEach(d => {
      const op = document.createElement("option");
      op.value = d.id_disciplina ?? d.id;
      op.textContent = d.nome_disciplina ?? d.nome;
      selectDisciplina.appendChild(op);
    });

    selectDisciplina.disabled = false;
  }

  // BUSCA TURMAS
  async function carregarTurmas(disciplinaId) {
    const res = await fetch(`http://localhost:3000/turmas?disciplinaId=${disciplinaId}`);
    const lista = await res.json();

    selectTurma.innerHTML = `<option value="">Selecione...</option>`;
    lista.forEach(t => {
      const op = document.createElement("option");
      op.value = t.id_turma ?? t.id;
      op.textContent = t.nome_turma ?? t.nome;
      selectTurma.appendChild(op);
    });

    selectTurma.disabled = false;
  }

  // BUSCA COMPONENTES DE NOTA
  async function carregarComponentes(disciplinaId) {
    const res = await fetch(`http://localhost:3000/componentes?disciplinaId=${disciplinaId}`);
    componentes = await res.json();
  }

  // BUSCA ALUNOS DA TURMA
  async function carregarAlunos(turmaId) {
    const res = await fetch(`http://localhost:3000/alunos?turmaId=${turmaId}`);
    return await res.json();
  }

  // MONTA CABEÇALHO DA TABELA
  function montarCabecalho() {
    tabelaHead.innerHTML = "";

    let th = `
      <tr>
        <th>Matrícula</th>
        <th>Nome</th>
    `;

    componentes.forEach(c => {
      th += `<th>${c.nome_componente}</th>`;
    });

    th += `</tr>`;

    tabelaHead.innerHTML = th;
  }

  // MONTA LINHAS COM INPUTS
  async function montarTabela(turmaId) {
    const alunos = await carregarAlunos(turmaId);
    tabelaBody.innerHTML = "";

    alunos.forEach(aluno => {
      let tr = `
        <tr>
          <td>${aluno.matricula}</td>
          <td>${aluno.nome}</td>
      `;

      componentes.forEach(comp => {
        tr += `
          <td>
            <input 
              class="form-control form-control-sm nota-input"
              data-aluno="${aluno.id}"
              data-componente="${comp.id_componente}"
              type="number" step="0.1" min="0" max="10">
          </td>
        `;
      });

      tr += `</tr>`;
      tabelaBody.innerHTML += tr;
    });
  }

  // EVENTOS DOS FILTROS

  selectInstituicao.addEventListener("change", () => {
    const id = selectInstituicao.value;
    selectCurso.disabled = true;
    selectDisciplina.disabled = true;
    selectTurma.disabled = true;
    tabelaHead.innerHTML = "";
    tabelaBody.innerHTML = "";
    if (id) carregarCursos(id);
  });

  selectCurso.addEventListener("change", () => {
    const id = selectCurso.value;
    selectDisciplina.disabled = true;
    selectTurma.disabled = true;
    tabelaHead.innerHTML = "";
    tabelaBody.innerHTML = "";
    if (id) carregarDisciplinas(id);
  });

  selectDisciplina.addEventListener("change", () => {
    const id = selectDisciplina.value;
    selectTurma.disabled = true;
    tabelaHead.innerHTML = "";
    tabelaBody.innerHTML = "";
    if (id) carregarTurmas(id);
  });

  selectTurma.addEventListener("change", async () => {
    const turmaId = selectTurma.value;
    const disciplinaId = selectDisciplina.value;

    if (!turmaId) return;

    await carregarComponentes(disciplinaId); // ← pega P1, P2, etc
    montarCabecalho();
    montarTabela(turmaId);
  });

  // SALVAR NOTAS
  btnSalvarNotas.addEventListener("click", async () => {
    const inputs = document.querySelectorAll(".nota-input");

    const payload = [];
    inputs.forEach(inp => {
      payload.push({
        alunoId: inp.dataset.aluno,
        componenteId: inp.dataset.componente,
        nota: inp.value
      });
    });

    const res = await fetch(`http://localhost:3000/notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Notas salvas com sucesso!");
    } else {
      alert("Erro ao salvar notas.");
    }
  });

  // BOTÃO PÁGINA INICIAL
  btnInicial.addEventListener("click", () => {
    window.location.href = "/front/paginaInicial/paginaInicial.html";
  });

  carregarInstituicoes();
});
