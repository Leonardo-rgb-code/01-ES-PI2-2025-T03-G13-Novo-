document.addEventListener("DOMContentLoaded", () => {

  verificarLogin();

  // verifica se está logado
  function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (usuarioLogado !== "true") {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    throw new Error("Usuário não está logado"); // <-- garante que nada abaixo será executado
  }
  }

  const usuarioId = localStorage.getItem("id");

  // Verifica se tem ID do usuário
  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    return; // <-- PARA A EXECUÇÃO AQUI
  }


  const curso       = document.getElementById("curso1");
  const btnCurso    = document.getElementById("btnCurso");
  const btnInicial  = document.getElementById("btnInicial");
  const tbodyCurso  = document.getElementById("tbodyCurso");

  // vai pegar o id da insituição na url
  const urlParams = new URLSearchParams(window.location.search);
  const instId = urlParams.get("instId");

  // elemento onde será exibido o nome da instituição
  const nomeInstituicaoTitulo = document.getElementById("nomeInstituicaoTitulo");

  if (!instId) {
    alert("Erro: Nenhuma instituição selecionada.");
    window.location.href = "../instituicao/cadastroInst.html";
  }

  // carrega cursos dessa instituição
  async function carregarCursos() {
    try {
      const response = await fetch(`http://localhost:3000/cursos/${instId}`);

      if (!response.ok) throw new Error("Erro ao buscar cursos");

      const lista = await response.json();

      tbodyCurso.innerHTML = "";

      lista.forEach(curso => adicionarCursoNaTabela(curso));

    } catch (error) {
      console.error("Erro ao carregar Curso:", error);
      // alert("Erro ao carregar cursos do servidor.");
    }
  }

  // salvar curso vinculado à instituição
  async function salvarCurso() {
    const body = {
      nome: curso.value.trim(),
      instituicaoId: instId     // <-- ID da instituição sendo enviado
    };

    try {
      const response = await fetch("http://localhost:3000/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Erro ao cadastrar curso");

      const data = await response.json();

      adicionarCursoNaTabela(data);
      curso.value = ""; 

    } catch (error) {
      console.error(error);
      // alert("Erro ao salvar curso.");
    }
  }

  function validarCampos() {
    if (curso.value.trim() === "") {
      curso.classList.add("is-invalid");
      document.getElementById("erroCursoVazio").classList.remove("d-none");
      return false;
    }

    curso.classList.remove("is-invalid");
    document.getElementById("erroCursoVazio").classList.add("d-none");
    return true;
  }

  function adicionarCursoNaTabela(cursoObj) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cursoObj.id}</td>
      <td>${cursoObj.nome}</td>
      <td>
        <button type="button"
                class="btn btn-sm btn-primary me-2 btnCadastrarDisciplina"
                data-id="${cursoObj.id}">
          Cadastrar Disciplina
        </button>

        <button type="button"
                class="btn btn-sm btn-danger btnExcluirCurso"
                data-id="${cursoObj.id}">
          Excluir
        </button>
      </td>
    `;

    tbodyCurso.appendChild(tr);
  }

  // ação dos botões
  tbodyCurso.addEventListener("click", async (e) => {
    const btn = e.target;

    // cadastrar disciplina
    if (btn.classList.contains("btnCadastrarDisciplina")) {
      const cursoId = btn.dataset.id;
      window.location.href = `../disciplina/cadastroDisciplina.html?cursoId=${cursoId}`;
    }

    // excluir curso
    if (btn.classList.contains("btnExcluirCurso")) {
      const cursoId = btn.dataset.id;

      if (!confirm("Deseja realmente excluir este curso?")) return;

      try {
        const response = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
          method: "DELETE",
        });

        if (response.status === 409) {
          alert("Não é possível excluir. Existem disciplinas vinculadas a este curso.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir curso");

        btn.closest("tr").remove();

      } catch (error) {
      //   alert("Erro ao excluir no servidor.");
        console.error(error);
      }
    }
  });

  // botão para adicionar curso
  btnCurso.addEventListener("click", (event) => {
    event.preventDefault();
    if (validarCampos()) salvarCurso();
  });

  // botão página inicial
  btnInicial.addEventListener("click", () => {
    window.location.href = "../paginainicial/paginaInicial.html";
  });

  // carrega cursos ao abrir a página
  carregarCursos();
});