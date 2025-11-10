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
  const instId = urlParams.get("instId");

  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  const curso = document.getElementById("curso1");
  const btnCurso = document.getElementById("btnCurso");
  const btnInicial = document.getElementById("btnInicial");
  const tbodyCurso = document.getElementById("tbodyCurso");
  const nomeInstituicaoTitulo = document.getElementById("nomeInstituicaoTitulo");

async function buscarCursos(usuarioId, instId) {
  try {
    const response = await fetch(`http://localhost:3000/cursos?usuarioId=${usuarioId}&instId=${instId}`);

    if (!response.ok) throw new Error("Erro ao buscar cursos");

    const lista = await response.json();
    return lista;

  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return [];
  }
}

async function buscarInstituicaoPeloId(instId) {
  try {
    const response = await fetch(`http://localhost:3000/instituicoes/${instId}`);

    if (!response.ok) throw new Error("Erro ao buscar instituições");

    let lista = await response.json();
    return lista;

  } catch (error) {
    console.error("Erro ao carregar instituições:", error);
    return []; // retorna lista vazia em caso de erro
  }
}


async function carregarCursos() {
  const lista = await buscarCursos(usuarioId, instId);

  tbodyCurso.innerHTML = "";

  lista.forEach(inst => adicionarCursoNaTabela(inst));
}

async function preencheTituloInstituicao() {
  let instituicao = await buscarInstituicaoPeloId(instId);
  nomeInstituicaoTitulo.innerText = instituicao.nome;
}

  async function salvarCurso() {
    const body = {
      nome: curso.value.trim(),
      usuarioId: usuarioId,
      instId: instId
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

  function adicionarCursoNaTabela(curso) {

    // Usa o ID correto conforme retorno do backend
    const id = curso.id_curso ?? curso.id ?? inst.cursoId;
    const nome = curso.nome_curso ?? curso.nome;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${id}</td>
      <td>${nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarDisciplina" data-id="${id}">
          Cadastrar Disciplinas
        </button>
        <button type="button" class="btn btn-sm btn-danger btnExcluiCurso" data-id="${id}">
          Excluir
        </button>
      </td>
    `;

    tbodyCurso.appendChild(tr);
  }

  // 🔥 Agora capta corretamente o botão clicado
  tbodyCurso.addEventListener("click", async (e) => {
    const btn = e.target.closest("button"); // <- Pega o botão mesmo clicando no ícone/texto

    if (!btn) return;

    const cursoId = btn.dataset.id;   // <- Agora pega corretamente o ID da instituição

    if (!cursoId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }

    if (btn.classList.contains("btnCadastrarDisciplina")) {
      window.location.href = `../disciplina/cadastroDisciplina.html?cursoId=${cursoId}`;
      return;
    }

    if (btn.classList.contains("btnExcluiCurso")) {
      if (!confirm("Deseja realmente excluir esta curso?")) return;

      try {
        const response = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
          method: "DELETE",
        });

        if (response.status === 409) {
          alert("Não é possível excluir. Existem cursos vinculados.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir instituição");

        btn.closest("tr").remove();

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnCurso.addEventListener("click", (event) => {
    event.preventDefault();

    if (validarCampos()) salvarCurso();

  });

  btnInicial.addEventListener("click", async  () => {
    const totalCurso = await buscarCursos(usuarioId, instId);
    if (totalCurso.length == 0) {
      alert("Voce precisa cadastrar pelo menos uma instituição e um curso");
    } else {
      window.location.href = "../paginainicial/paginaInicial.html";
    }
  });

  carregarCursos();
  preencheTituloInstituicao();
});
