// <!-- Autor: Gabrielle Mota -->

document.addEventListener("DOMContentLoaded", () => {
//verifica se o usuário esta logado pelo localStorage
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
  const instId = urlParams.get("instId"); //pega o id da instituição que esta na url

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
   //manda requisição para buscar os cursos cadastrados no id da instituição e do usuário indicados
    if (!response.ok) throw new Error("Erro ao buscar cursos");

    const lista = await response.json();
    return lista;

  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return []; //retorna lista vazia do back
  }
}

async function buscarInstituicaoPeloId(instId) {
  try {
    const response = await fetch(`http://localhost:3000/instituicoes/${instId}`);
    //manda requisição para buscar a instituição pelo id indicado
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
  //carrega is cursos encontrados
  tbodyCurso.innerHTML = "";
  //adiciona os cursos encontrados na tabela
  lista.forEach(inst => adicionarCursoNaTabela(inst));
}

async function preencheTituloInstituicao() {
  let instituicao = await buscarInstituicaoPeloId(instId);
  nomeInstituicaoTitulo.innerText = instituicao.nome;
}

//cria o body para mandar na requisição pro back
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
      
      //se tudo ok, o back adiciona no bd e aqui adiciona na tabela
      const data = await response.json();
      adicionarCursoNaTabela(data);

      curso.value = "";

    } catch (error) {
      console.error(error);
    }
  }
  
  //Validar os campos, nome
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
    const id = curso.id;
    const nome = curso.nome;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarDisciplina" data-id="${id}">
          Cadastrar Disciplinas
        </button>
        <button type="button" class="btn btn-sm btn-danger btnExcluirCurso" data-id="${id}">
          Excluir
        </button>
      </td>
    `;
  //adiciona na tabela e coloca o id do curso nos botões
    tbodyCurso.appendChild(tr);
  }

  // Botões
  tbodyCurso.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");

    if (!btn) return;

    const cursoId = btn.dataset.id;   // <- pega o ID da instituição

    if (!cursoId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }

    if (btn.classList.contains("btnCadastrarDisciplina")) {
      window.location.href = `../disciplina/cadastroDisciplina.html?cursoId=${cursoId}`;
      return;
    }

    if (btn.classList.contains("btnExcluirCurso")) {
      if (!confirm("Deseja realmente excluir este Curso?")) return;

      try {
        const response = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
          method: "DELETE",
        });

        //manda requisição para verificar se existe alguma disciplina vinculada a esse curso
        if (response.status === 409) {
          alert("Não é possível excluir. Existem disciplinas vinculados.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir instituição");

        //remove da tabela a linha
        btn.closest("tr").remove();

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnCurso.addEventListener("click", (event) => {
    event.preventDefault();
   
    //se tudo ok adiciona na tabela 
    if (validarCampos()) salvarCurso();

  });

  btnInicial.addEventListener("click", async  () => {
    const totalCurso = await buscarCursos(usuarioId, instId);
    if (totalCurso.length == 0) { //se ja existir um curso e uma instituição cadastrada, deixa ir para página inical
      alert("Voce precisa cadastrar pelo menos uma instituição e um curso");
    } else {
      window.location.href = "../paginainicial/paginaInicial.html";
    }
  });

  carregarCursos();
  preencheTituloInstituicao();
});
