document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();

  function verificarLogin() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado !== "true") {
      alert("Usuário não identificado. Faça login novamente.");
      window.location.href = "/front/login/login.html";
      throw new Error("Execução interrompida — usuário não logado.");
    }
  }

  // IDs via URL/localStorage
  const usuarioId = localStorage.getItem("id");
  const urlParams = new URLSearchParams(window.location.search);
  const turmaId = urlParams.get("turmaId");

  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "/front/login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  // Elementos do DOM
  const matriculaAluno = document.getElementById("matriculaAluno");
  const nomeAluno = document.getElementById("nomeAluno");
  const btnAluno = document.getElementById("btnAluno");
  const btnInicial = document.getElementById("btnInicial");
  const tabelaAlunos = document.getElementById("tabelaAlunos");
  const nomeTurmaTitulo = document.getElementById("nomeTurmaTitulo");

  // Importação CSV
  const btnImportarCSV = document.getElementById("btnImportarCSV");
  const inputCSV = document.getElementById("inputCSV");

  // Remove erro enquanto digita
  matriculaAluno.addEventListener("input", () => {
    matriculaAluno.classList.remove("is-invalid");
    document.getElementById("erroMatriVazio").classList.add("d-none");
  });

  nomeAluno.addEventListener("input", () => {
    nomeAluno.classList.remove("is-invalid");
    document.getElementById("erroNomeVazio").classList.add("d-none");
  });

  // Validação simples
  function validarCampos() {
    let valido = true;

    if (matriculaAluno.value.trim() === "") {
      matriculaAluno.classList.add("is-invalid");
      document.getElementById("erroMatriVazio").classList.remove("d-none");
      valido = false;
    }

    if (nomeAluno.value.trim() === "") {
      nomeAluno.classList.add("is-invalid");
      document.getElementById("erroNomeVazio").classList.remove("d-none");
      valido = false;
    }

    return valido;
  }
 
// Carregar Alunos

  async function carregarAlunos() {
    try {
      const response = await fetch(`http://localhost:3000/alunos/turma/${turmaId}`);
      if (!response.ok) throw new Error("Erro ao carregar alunos");

      const lista = await response.json();
      tabelaAlunos.innerHTML = "";
      lista.forEach(adicionarAlunoNaTabela);

    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  }
  carregarAlunos();

    async function preencheTituloTurma() {
    let turma = await buscarTurmaPeloId(TurmaId);
    if (turma && nomeTurmaTitulo) nomeTurmaTitulo.innerText = turma.nome ?? "";
  }

  // Salvar aluno
  async function salvarAlunos() {
    const body = {
      matricula: matriculaAluno.value.trim(),
      nome: nomeAluno.value.trim(),
      usuarioId: usuarioId,
      turmaId: turmaId
    };

    try {
      const response = await fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        if (response.status === 409) {
          alert("Já existe um aluno com essa matrícula.");
        }
        throw new Error("Erro ao cadastrar aluno");
      }

      const alunoCriado = await response.json();
      adicionarAlunoNaTabela(alunoCriado);

      matriculaAluno.value = "";
      nomeAluno.value = "";

    } catch (error) {
      console.error(error);
    }
  }

  // Adicionar linha na tabela
  function adicionarAlunoNaTabela(aluno) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${aluno.matricula}</td>
      <td>${aluno.nome}</td>
      <td>
        <button type="button" class="btn btn-danger btn-sm btnExcluirAluno" data-id="${aluno.id}">
          Excluir
        </button>
      </td>
    `;

    tabelaAlunos.appendChild(tr);
  }

  // Excluir aluno
  tabelaAlunos.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btnExcluirAluno");
    if (!btn) return;

    const id = btn.dataset.id;

    if (!confirm("Deseja realmente excluir este aluno?")) return;

    try {
      const response = await fetch(`http://localhost:3000/alunos/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Erro ao excluir aluno");

      btn.closest("tr").remove();

    } catch (err) {
      console.error(err);
    }
  });

  // Botão adicionar aluno
  btnAluno.addEventListener("click", () => {
    if (validarCampos()) salvarAlunos();
  });

  // Botão página inicial
  btnInicial.addEventListener("click", () => {
    window.location.href = "/front/paginaInicial/paginaInicial.html";
  });

  // Importar alunos via CSV
  // Abre input de arquivo
  btnImportarCSV.addEventListener("click", () => {
    inputCSV.click();
  });

  // Ao selecionar arquivo
  inputCSV.addEventListener("change", function () {
    const arquivo = this.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function (evento) {
      const conteudo = evento.target.result;
      processarCSV(conteudo);
    };

    leitor.readAsText(arquivo, "UTF-8");
  });

  // Processamento CSV
  function processarCSV(texto) {
    const linhas = texto.split("\n").map(l => l.trim()).filter(l => l !== "");

    // Remove cabeçalho se existir
    if (linhas[0].toLowerCase().includes("matricula")) {
      linhas.shift();
    }

    let totalNovos = 0;
    let duplicados = 0;

    linhas.forEach(async linha => {
      const [matricula, nome] = linha.split(",").map(x => x.trim());

      if (!matricula || !nome) return;

      const body = {
        matricula,
        nome,
        usuarioId,
        turmaId
      };

      try {
        const response = await fetch("http://localhost:3000/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (response.status === 409) {
          duplicados++;
          return;
        }

        if (!response.ok) throw new Error("Erro ao importar aluno");

        const alunoCriado = await response.json();
        adicionarAlunoNaTabela(alunoCriado);
        totalNovos++;

      } catch (e) {
        console.error("Erro ao importar linha:", e);
      }
    });

    setTimeout(() => {
      alert(
        `Importação concluída!\n\n` +
        `✔ Novos alunos adicionados: ${totalNovos}\n` +
        `⚠ Duplicados ignorados: ${duplicados}`
      );
    }, 500);
  }
  preencheTituloTurma();

});
