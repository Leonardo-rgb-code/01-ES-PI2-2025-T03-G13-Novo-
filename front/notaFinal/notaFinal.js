document.addEventListener("DOMContentLoaded", () => {

  function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado !== "true") {
      alert("Usuário não identificado. Faça login novamente.");
      window.location.href = "../login/login.html";
      throw new Error("Execução interrompida — usuário não logado.");
    }
  }

  verificarLogin();

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

  let componentes = [];

  let cursoIdSelecionado = null;
  let disciplinaIdSelecionada = null;
  let sigladisciplinaSelecionada = null;
  let turmaIdSelecionada = null;
  let nomeTurmaSelecionada = null;



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



  async function carregarDisciplinas(cursoId) {
    const res = await fetch(`http://localhost:3000/disciplinas?usuarioId=${usuarioId}&cursoId=${cursoId}`);
    const lista = await res.json();

    selectDisciplina.innerHTML = `<option value="">Selecione...</option>`;

    lista.forEach(disciplina => {
      const op = document.createElement("option");
      op.value = disciplina.id;
      op.textContent = disciplina.nome_disciplina ?? disciplina.nome;
      op.dataset.sigla = disciplina.sigla;
      selectDisciplina.appendChild(op);
    });

    selectDisciplina.disabled = false;
  }



  async function carregarTurmas(disciplinaId) {
    const res = await fetch(`http://localhost:3000/turmas?usuarioId=${usuarioId}&disciplinaId=${disciplinaId}`);
    const lista = await res.json();

    selectTurma.innerHTML = `<option value="">Selecione...</option>`;

    lista.forEach(t => {
      const op = document.createElement("option");
      op.value = t.id_turma ?? t.id;
      op.textContent = t.nome_turma ?? t.nome;
      op.dataset.nome = t.nome_turma ?? t.nome;
      selectTurma.appendChild(op);
    });

    selectTurma.disabled = false;
  }



  async function carregarComponentes(disciplinaId) {
    const res = await fetch(`http://localhost:3000/componenteNotas?usuarioId=${usuarioId}&disciplinaId=${disciplinaId}`);
    componentes = await res.json();
  }



  async function carregarNotas(turmaId, matricula, componenteId) {
    const res = await fetch(
      `http://localhost:3000/notas?turmaId=${turmaId}&matricula=${matricula}&componenteId=${componenteId}`
    );
    if (!res.ok) return null;
    return await res.json();
  }

  async function carregarAlunos(turmaId) {
    const res = await fetch(`http://localhost:3000/alunos?usuarioId=${usuarioId}&turmaId=${turmaId}`);
    return await res.json();
  }

  async function buscarMedia(turmaId, matricula) {
    const res = await fetch(`http://localhost:3000/medias?turmaId=${turmaId}&matricula=${matricula}`);
    return await res.json();
  }

  async function calcularMedia(turmaId, matricula) {
    const payload = { matricula, turmaId };
    const res = await fetch("http://localhost:3000/medias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }



  function montarCabecalho() {
    tabelaHead.innerHTML = "";

    let th = `
      <tr>
        <th>Matrícula</th>
        <th>Nome</th>
    `;

    componentes.forEach(c => {
      th += `
        <th style="white-space: nowrap;">
          ${c.sigla}
          <button 
            class="btn btn-sm btn-secondary toggle-col" 
            data-col="${c.id_componente}"
            style="margin-left:5px; padding:2px 6px;"
          >
            <i class="bi bi-lock-fill"></i>
          </button>
        </th>
      `;
    });

    th += `<th>Média</th>`;
    th += `</tr>`;

    tabelaHead.innerHTML = th;
  }



  async function montarTabela(turmaId) {
    const alunos = await carregarAlunos(turmaId);
    tabelaBody.innerHTML = "";

    for (const aluno of alunos) {
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
              data-aluno="${aluno.matricula}"
              data-componente="${comp.id_componente}"
              type="number" 
              step="0.1" min="0" max="10"
              disabled
            >
          </td>
        `;
      });

      const medias = await buscarMedia(turmaId, aluno.matricula);
      let valorMedia = "-";
      if (medias && medias.length > 0 && medias[0].media !== undefined) {
        valorMedia = medias[0].media;
      }

      tr += `
        <td>
          <input class="form-control form-control-sm" disabled value="${valorMedia}">
        </td>
      `;
      tr += `</tr>`;

      tabelaBody.innerHTML += tr;
    }

    const inputs = document.querySelectorAll(".nota-input");

    for (const input of inputs) {
      const dados = await carregarNotas(turmaId, input.dataset.aluno, input.dataset.componente);
      if (dados && dados.length > 0 && dados[0].nota !== undefined) {
        input.value = dados[0].nota;
      }
    }

    verificarNotasPreenchidas();
  }



  document.addEventListener("click", (e) => {
    const botao = e.target.closest(".toggle-col");
    if (!botao) return;

    const compId = botao.dataset.col;
    const inputs = document.querySelectorAll(`input[data-componente="${compId}"]`);

    const desbloquear = inputs[0].disabled;

    inputs.forEach(inp => {
      inp.disabled = !desbloquear;
    });

    botao.innerHTML = desbloquear
      ? `<i class="bi bi-unlock-fill"></i>`
      : `<i class="bi bi-lock-fill"></i>`;
  });



  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("nota-input")) {
      let raw = e.target.value;
      let value = parseFloat(raw);

      if (raw === "") return;
      if (isNaN(value)) return;

      if (value > 10) e.target.value = 10;
      if (value < 0) e.target.value = 0;
    }
    verificarNotasPreenchidas();
  });



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
    cursoIdSelecionado = selectCurso.value;

    selectDisciplina.disabled = true;
    selectTurma.disabled = true;
    tabelaHead.innerHTML = "";
    tabelaBody.innerHTML = "";

    if (cursoIdSelecionado) carregarDisciplinas(cursoIdSelecionado);
  });

  selectDisciplina.addEventListener("change", () => {
    const opt = selectDisciplina.selectedOptions[0];
    disciplinaIdSelecionada = opt.value;
    sigladisciplinaSelecionada = opt.dataset.sigla;

    selectTurma.disabled = true;
    tabelaHead.innerHTML = "";
    tabelaBody.innerHTML = "";

    if (disciplinaIdSelecionada) carregarTurmas(disciplinaIdSelecionada);
  });

  selectTurma.addEventListener("change", async () => {
    const opt = selectTurma.selectedOptions[0];
    turmaIdSelecionada = opt.value;
    nomeTurmaSelecionada = opt.dataset.nome;

    if (!turmaIdSelecionada) return;

    await carregarComponentes(disciplinaIdSelecionada);
    montarCabecalho();
    montarTabela(turmaIdSelecionada);
  });



btnSalvarNotas.addEventListener("click", async () => {
  if (!cursoIdSelecionado || !turmaIdSelecionada) {
    alert("Selecione curso e turma antes de salvar!");
    return;
  }

  const inputs = document.querySelectorAll(".nota-input");

  const colunas = {};

  inputs.forEach(inp => {
    const idComp = inp.dataset.componente;
    if (!colunas[idComp]) colunas[idComp] = [];
    colunas[idComp].push(inp);
  });

  for (const idColuna in colunas) {
    const inputsDaColuna = colunas[idColuna];

    const algumPreenchido = inputsDaColuna.some(i => i.value.trim() !== "");
    const todosPreenchidos = inputsDaColuna.every(i => i.value.trim() !== "");

    if (algumPreenchido && !todosPreenchidos) {
      const nomeColuna = componentes.find(c => c.id_componente == idColuna)?.sigla ?? "Componente";
      alert(`Erro: Preencha TODOS os valores da coluna "${nomeColuna}" antes de salvar.`);
      return;
    }
  }

  for (const inp of inputs) {
    if (inp.value.trim() === "") continue;

    const payload = {
      matricula: inp.dataset.aluno,
      componenteId: inp.dataset.componente,
      cursoId: cursoIdSelecionado,
      turmaId: turmaIdSelecionada,
      usuarioId,
      nota: inp.value
    };

    const res = await fetch("http://localhost:3000/notas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert(`Erro ao salvar a nota do aluno ${payload.matricula}`);
      return;
    }

    await calcularMedia(payload.turmaId, payload.matricula);
  }

  await montarTabela(turmaIdSelecionada);

  alert("Todas as notas foram salvas com sucesso!");
});


  btnInicial.addEventListener("click", () => {
    window.location.href = "/front/paginaInicial/paginaInicial.html";
  });



  function verificarNotasPreenchidas() {
    const inputs = document.querySelectorAll(".nota-input");
    const btnExportar = document.getElementById("btnExportar");
    if (inputs.length === 0) {
      btnExportar.disabled = true;
      return;
    }
    const todosPreenchidos = Array.from(inputs).every(inp => inp.value.trim() !== "");
    btnExportar.disabled = !todosPreenchidos;
  }



  document.getElementById("btnExportar").addEventListener("click", () => {
    exportarTabelaCSV("tabelaMedias");
  });



  function exportarTabelaCSV(idTabela) {
    const tabela = document.getElementById(idTabela);
    if (!tabela) return;

    let csv = [];
    const linhas = tabela.querySelectorAll("tr");

    linhas.forEach(tr => {
      let linha = [];
      const cols = tr.querySelectorAll("th, td");

      cols.forEach(td => {
        const input = td.querySelector("input");
        let valor;

        if (input) {
          valor = input.value.trim();
          if (valor === "") valor = "-";
        } else {
          valor = td.innerText.trim();
        }

        valor = valor.replace(/,/g, "");

        linha.push(valor);
      });

      csv.push(linha.join(";"));
    });

    const csvString = csv.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    nomeDoArquivo = `${nomeTurmaSelecionada}_${sigladisciplinaSelecionada}`
      .replace(/\s+/g, "_") + ".csv";
    a.download = nomeDoArquivo;
    a.click();

    URL.revokeObjectURL(url);
  }
  carregarInstituicoes();
  verificarNotasPreenchidas();
});
