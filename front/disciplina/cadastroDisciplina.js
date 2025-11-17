// <!-- Autor: Gabrielle Mota, Matheus Ferreira -->

document.addEventListener("DOMContentLoaded", () => {
//Verifica se o usuário esta logado pelas informações salvas no localStorage
  verificarLogin();

  function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado !== "true") {
      alert("Usuário não identificado. Faça login novamente.");
      window.location.href = "../login/login.html";
      throw new Error("Execução interrompida — usuário não logado.");
    }
  }
 
  const usuarioId = localStorage.getItem("id"); //pega o id do usuário no localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const cursoId = urlParams.get("cursoId"); //pega o id do curso na url

  if (!usuarioId) { //redireciona se não encontrar dados salvos do usuário no localStorage
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  // elementos
  const disciplinaInput = document.getElementById("disciplina1");
  const btnDisci = document.getElementById("btnDisci");
  const siglaDisci = document.getElementById("siglaDisci");
  const codigoDisci = document.getElementById("codigoDisci1");
  const btnInicial = document.getElementById("btnInicial");
  const tbodyDisci = document.getElementById("tbodyDisci");
  const nomeCursoTitulo = document.getElementById("nomeCursoTitulo"); 

  // Esconde erros ao interagir
  disciplinaInput.addEventListener("input", () => {
    disciplinaInput.classList.remove("is-invalid");
    document.getElementById("erroDisciplinaVazio")?.classList.add("d-none");
  });
  siglaDisci.addEventListener("input", () => {
    siglaDisci.classList.remove("is-invalid");
    document.getElementById("errosiglaDisciVazio")?.classList.add("d-none");
  });
  codigoDisci.addEventListener("input", () => {
    codigoDisci.classList.remove("is-invalid");
    document.getElementById("erroCodigoDisciVazio")?.classList.add("d-none");
  });
  document.querySelectorAll('input[name="periodo"]').forEach(radio => {
    radio.addEventListener("change", () => {
      document.getElementById("erroPeriodoVazio")?.classList.add("d-none");
    });
  });

  async function buscarDisciplinas(usuarioId, cursoId) {
    try { //busca as disciplinas cadastradas ligadas ao id do usuário e id do curso indicados
      const response = await fetch(`http://localhost:3000/disciplinas?usuarioId=${usuarioId}&cursoId=${cursoId}`);
      if (!response.ok) throw new Error("Erro ao buscar disciplinas");
      const lista = await response.json();
      return lista;
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      return [];
    }
  }

  async function buscarCursoPeloId(cursoId) {
    try { //busca o curso relacionado aquele id que estava na url
      const response = await fetch(`http://localhost:3000/cursos/${cursoId}`);
      if (!response.ok) throw new Error("Erro ao buscar cursos");
      let curso = await response.json();
      return curso;
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      return null;
    }
  }

  async function carregarDisciplinas() {
    const lista = await buscarDisciplinas(usuarioId, cursoId);
    tbodyDisci.innerHTML = "";
    lista.forEach(inst => adicionarDisciplinaNaTabela(inst));
  } //carrega as disciplinas encontradas pelo back na tabela

  async function preencheTituloCurso() {
    let curso = await buscarCursoPeloId(cursoId);
    if (curso && nomeCursoTitulo) nomeCursoTitulo.innerText = curso.nome ?? "";
  } //preenche o título pelo nome do curso do id indicado

  async function salvarDisciplina() {
    // pega o radio selecionado no momento do envio
    const periodoSelecionado = document.querySelector('input[name="periodo"]:checked');
    const periodo = periodoSelecionado ? periodoSelecionado.value : null;

    //monta o body que vai enviar pro back com os valores
    const body = {
      nome: disciplinaInput.value.trim(),
      sigla: siglaDisci.value.trim(),
      codigo: codigoDisci.value.trim(),
      periodo: periodo,
      usuarioId: usuarioId,
      cursoId: cursoId
    };

    try {
      // ajustar endpoint conforme sua API (usando /disciplinas como exemplo)
      const response = await fetch("http://localhost:3000/disciplinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }); //manda a requisição pro back adicioanr as informações do body

      if (!response.ok) throw new Error("Erro ao cadastrar disciplina");

      const data = await response.json();
      adicionarDisciplinaNaTabela(data);
      //se tudo certo, adiciona os input na tabela

      // limpa campos
      disciplinaInput.value = "";
      siglaDisci.value = "";
      codigoDisci.value = "";
      document.querySelectorAll('input[name="periodo"]').forEach(r => r.checked = false);
      document.getElementById("erroPeriodoVazio")?.classList.add("d-none");

    } catch (error) {
      console.error(error);
    }
  }

  // Valida os campos
  function validarCampos() {
    let valido = true;

    if (disciplinaInput.value.trim() === "") {
      disciplinaInput.classList.add("is-invalid");
      document.getElementById("erroDisciplinaVazio")?.classList.remove("d-none");
      valido = false;
    } else {
      disciplinaInput.classList.remove("is-invalid");
      document.getElementById("erroDisciplinaVazio")?.classList.add("d-none");
    }

    if (siglaDisci.value.trim() === "") {
      siglaDisci.classList.add("is-invalid");
      document.getElementById("errosiglaDisciVazio")?.classList.remove("d-none");
      valido = false;
    } else {
      siglaDisci.classList.remove("is-invalid");
      document.getElementById("errosiglaDisciVazio")?.classList.add("d-none");
    }

    if (codigoDisci.value.trim() === "") {
      codigoDisci.classList.add("is-invalid");
      document.getElementById("erroCodigoDisciVazio")?.classList.remove("d-none");
      valido = false;
    } else {
      codigoDisci.classList.remove("is-invalid");
      document.getElementById("erroCodigoDisciVazio")?.classList.add("d-none");
    }

    const periodoSelecionado = document.querySelector('input[name="periodo"]:checked');
    if (!periodoSelecionado) {
      document.getElementById("erroPeriodoVazio")?.classList.remove("d-none");
      valido = false;
    } else {
      document.getElementById("erroPeriodoVazio")?.classList.add("d-none");
    }

    return valido;
  }

  function adicionarDisciplinaNaTabela(disciplina) {
    const id = disciplina.id;
    const nome = disciplina.nome;

    const tr = document.createElement("tr");
    
    //cria as linhas na tabela
    tr.innerHTML = `
      <td>${nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2 btnComponenteNotas" data-id="${id}">
          Componentes de Notas
        </button>
        <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarTurmas" data-id="${id}">
          Cadastrar Turmas
        </button>
        <button type="button" class="btn btn-sm btn-danger btnExcluirDisciplina" data-id="${id}">
          Excluir
        </button>
      </td>
    `;
    //adiciona as linahs e o id da disciplina nos botões
    tbodyDisci.appendChild(tr);
  }

  // Botões
  tbodyDisci.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const disciplinaId = btn.dataset.id;
    if (!disciplinaId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }
    //puxa o id da disciplina no url quando aperta os botões 
    if (btn.classList.contains("btnComponenteNotas")) {
      window.location.href = `../componentesNotas/cadastroCompNotas.html?disciplinaId=${disciplinaId}`;
      return;
    }

    if (btn.classList.contains("btnCadastrarTurmas")) {
      window.location.href = `../turmas/cadastroTurmas.html?disciplinaId=${disciplinaId}`;
      return;
    }

    if (btn.classList.contains("btnExcluirDisciplina")) {
      if (!confirm("Deseja realmente excluir esta Disciplina?")) return;
      try {
        const response = await fetch(`http://localhost:3000/disciplinas/${disciplinaId}`, {
          method: "DELETE",
        });
        //verifica se tem alguma tabela vinculada com o back
        if (response.status === 409) {
          alert("Não é possível excluir. Existem componente de notas ou turmas vinculadas.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir disciplina");

        btn.closest("tr").remove();

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnDisci.addEventListener("click", (event) => {
    event.preventDefault();
    //se tudo ok, sala as informações na tabela
    if (validarCampos()) salvarDisciplina();
  });

  btnInicial.addEventListener("click", () => {
    window.location.href = "../paginainicial/paginaInicial.html";
  });

  // inicialização
  carregarDisciplinas();
  preencheTituloCurso();
});
