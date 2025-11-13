document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();

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
  const tbodyMedias = document.getElementById("tbodyMedias");
  const btnInicial = document.getElementById("btnInicial");
  const btnExportar = document.getElementById("btnExportar");

  // BUSCAR INSTITUIÇÕES
  async function carregarInstituicoes() {
    const res = await fetch(`http://localhost:3000/instituicoes?usuarioId=${usuarioId}`);
    const lista = await res.json();

    selectInstituicao.innerHTML = `<option value="">Selecione...</option>`;

    lista.forEach(inst => {
      const op = document.createElement("option");
      op.value = inst.id_instituicao;
      op.textContent = inst.nome;
      selectInstituicao.appendChild(op);
    });
  }

  // BUSCAR CURSOS
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

  // BUSCAR DISCIPLINAS
  async function carregarDisciplinas(cursoId) {
    const res = await fetch(`http://localhost:3000/disciplinas?cursoId=${cursoId}`);
    const lista = await res.json();

    selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    lista.forEach(d => {
      const op = document.createElement("option");
      op.value = disciplina.id ?? disciplina.id;
      op.textContent = disciplina.nome_disciplina ?? disciplina.nome;
      selectDisciplina.appendChild(op);
    });

    selectDisciplina.disabled = false;
  }

  // BUSCAR TURMAS
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

  // BUSCAR MÉDIAS DA TURMA
  async function carregarMedias(turmaId) {
    const res = await fetch(`http://localhost:3000/medias?turmaId=${turmaId}`);
    const lista = await res.json();

    tbodyMedias.innerHTML = "";

    lista.forEach(aluno => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${aluno.matricula}</td>
        <td>${aluno.nome}</td>
        <td>${aluno.media_final}</td>
      `;
      tbodyMedias.appendChild(tr);
    });
  }

  // FILTROS

  selectInstituicao.addEventListener("change", () => {
    const instId = selectInstituicao.value;

    // reset
    selectCurso.innerHTML = `<option value="">Selecione...</option>`;
    selectCurso.disabled = true;

    selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    selectDisciplina.disabled = true;

    selectTurma.innerHTML = `<option value="">Selecione...</option>`;
    selectTurma.disabled = true;

    tbodyMedias.innerHTML = "";

    if (instId) carregarCursos(instId);
  });

  selectCurso.addEventListener("change", () => {
    const cursoId = selectCurso.value;

    selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;
    selectDisciplina.disabled = true;

    selectTurma.innerHTML = `<option value="">Selecione...</option>`;
    selectTurma.disabled = true;

    tbodyMedias.innerHTML = "";

    if (cursoId) carregarDisciplinas(cursoId);
  });

  selectDisciplina.addEventListener("change", () => {
    const disciplinaId = selectDisciplina.value;

    selectTurma.innerHTML = `<option value="">Selecione...</option>`;
    selectTurma.disabled = true;

    tbodyMedias.innerHTML = "";

    if (disciplinaId) carregarTurmas(disciplinaId);
  });

  selectTurma.addEventListener("change", () => {
    const turmaId = selectTurma.value;

    tbodyMedias.innerHTML = "";

    if (turmaId) carregarMedias(turmaId);
  });

  // Botão página inicial

  btnInicial.addEventListener("click", () => {
    window.location.href = "/front/paginaInicial/paginaInicial.html";
  });

  // Botão exportar
  btnExportar.addEventListener("click", () => {
    alert("Aqui você pode gerar um Excel/PDF com as médias!");
  });

  // Inicializa
  carregarInstituicoes();
});
