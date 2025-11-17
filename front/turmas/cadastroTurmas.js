// <!-- Autor: Gabrielle Mota, Bruno Terra -->


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
  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaId = urlParams.get("disciplinaId");

  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "/front/login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  // elementos
  const turmaInput = document.getElementById("turma");
  const btnTurma = document.getElementById("btnTurma");
  const tabelaTurmas = document.getElementById("tabelaTurmas");
  const btnInicial = document.getElementById("btnInicial");
  const nomeDisciplinaTitulo = document.getElementById("nomeDisciplinaTitulo"); 

  // Esconde erros ao interagir
  turmaInput.addEventListener("input", () => {
    turmaInput.classList.remove("is-invalid");
    document.getElementById("erroTurmaVazio")?.classList.add("d-none");
  });

  async function buscarTurmas(usuarioId, disciplinaId) {
    try {
      const response = await fetch(`http://localhost:3000/turmas?usuarioId=${usuarioId}&disciplinaId=${disciplinaId}`);
      if (!response.ok) throw new Error("Erro ao buscar turmas");
      const lista = await response.json();
      return lista;
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      return [];
    }
  }

  async function buscarDisciplinaPeloId(disciplinaId) {
    try {
      const response = await fetch(`http://localhost:3000/disciplinas/${disciplinaId}`);
      if (!response.ok) throw new Error("Erro ao buscar disciplina");
      let disciplina = await response.json();
      return disciplina;
    } catch (error) {
      console.error("Erro ao carregar disciplina:", error);
      return null;
    }
  }

  async function carregarTurmas() {
    const lista = await buscarTurmas(usuarioId, disciplinaId);
    tabelaTurmas.innerHTML = "";
    lista.forEach(turma => adicionarTurmaNaTabela(turma));
  }

  async function preencheTituloDisciplina() {
    let disciplina = await buscarDisciplinaPeloId(disciplinaId);
    if (disciplina && nomeDisciplinaTitulo) nomeDisciplinaTitulo.innerText = disciplina.nome ?? "";
  }

  async function salvarTurma() {

    const body = {
      nome: turmaInput.value.trim(),
      usuarioId: usuarioId,
      disciplinaId: disciplinaId
    };

    try {
      const response = await fetch("http://localhost:3000/turmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Erro ao cadastrar turma");

      const data = await response.json();
      adicionarTurmaNaTabela(data);

      // limpa campos
      turmaInput.value = "";

    } catch (error) {
      console.error(error);
    }
  }

  // Validação
  function validarCampos() {
    let valido = true;

    if (turmaInput.value.trim() === "") {
      turmaInput.classList.add("is-invalid");
      document.getElementById("erroTurmaVazio")?.classList.remove("d-none");
      valido = false;
    } else {
      turmaInput.classList.remove("is-invalid");
      document.getElementById("erroTurmaVazio")?.classList.add("d-none");
    }

    return valido;
  }

  function adicionarTurmaNaTabela(turma) {
    // adapte os nomes dos campos conforme seu backend:
    const id = turma.id_turma ?? turma.id ?? turma.turmaId ?? turma.id_interno ?? null;
    const nome = turma.nome_turma ?? turma.nome;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarAlunos" data-id="${id}">
          Cadastrar Alunos
        </button>
        <button type="button" class="btn btn-sm btn-danger btnExcluirTurma" data-id="${id}">
          Excluir
        </button>
      </td>
    `;

    tabelaTurmas.appendChild(tr);
  }

  // Delegation para botões na tabela
  tabelaTurmas.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const turmaId = btn.dataset.id;
    if (!turmaId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }

    if (btn.classList.contains("btnCadastrarAlunos")) {
      window.location.href = `/front/alunos/cadastroAlunos.html?turmaId=${turmaId}`;
      return;
    }

    if (btn.classList.contains("btnExcluirTurma")) {
      if (!confirm("Deseja realmente excluir esta Turma?")) return;
      try {
        const response = await fetch(`http://localhost:3000/turmas/${turmaId}`, {
          method: "DELETE",
        });

        if (response.status === 409) {
          alert("Não é possível excluir. Existem alunos vinculados.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir turma");

        btn.closest("tr").remove();

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnTurma.addEventListener("click", (event) => {
    event.preventDefault();
    if (validarCampos()) salvarTurma();
  });

  btnInicial.addEventListener("click", () => {
    window.location.href = "/front/paginainicial/paginaInicial.html";
  });

  // inicialização
  carregarTurmas();
  preencheTituloDisciplina();
});

