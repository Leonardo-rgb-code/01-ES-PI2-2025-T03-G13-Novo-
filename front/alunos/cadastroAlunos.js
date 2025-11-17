// <!-- Autor: Gabrielle Mota-->

document.addEventListener("DOMContentLoaded", () => {
  // verifica se o usuário esta logado com os dados salvos no localStorage
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
  const usuarioId = localStorage.getItem("id"); // pega o id do usuário no localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const turmaId = urlParams.get("turmaId"); //pega o id da turma na url

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
      const response = await fetch(`http://localhost:3000/alunos?turmaId=${turmaId}&usuarioId=${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao carregar alunos");
      //manda requisição pro back consultar os alunos salvos naquela turma e naquele usuário pelos id
      const lista = await response.json();
      tabelaAlunos.innerHTML = "";
      lista.forEach(adicionarAlunoNaTabela);
     //adiciona na tabela os alunos que retornarem
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  }

    async function buscarTurmasPeloId() {
    try { //burca a turma pelo id que pegou na url pra ver se existe
      const response = await fetch(`http://localhost:3000/turmas/${turmaId}`);
      if (!response.ok) throw new Error("Erro ao buscar turma");
      let turma = await response.json();
      return turma;
    } catch (error) {
      console.error("Erro ao carregar turma:", error);
      return null;
    }
  }
  carregarAlunos();
    //preenche com o nome da turma no título da página
    async function preencheTituloTurma() {
    let turma = await buscarTurmasPeloId();
    if (turma && nomeTurmaTitulo) nomeTurmaTitulo.innerText = turma.nome ?? "";
  }

  // Salvar aluno
  async function salvarAlunos() {
    const body = { //monta o body pra mandar pro back a requisição com os dados
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
        }  //manda uma requisição pro back verificar se ja existe uma matrícula igual a que esta sendo cadastrada
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
        <button type="button" class="btn btn-danger btn-sm btnExcluirAluno" data-id="${aluno.matricula}">
          Excluir
        </button>
      </td>
    `;
    // adiciona aluno na tabela, cria a linha e coloca o id no botão de excluir
    tabelaAlunos.appendChild(tr);
  }

  // Excluir aluno
  tabelaAlunos.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btnExcluirAluno");
    if (!btn) return;

    const id = btn.dataset.id;

    if (!confirm("Deseja realmente excluir este aluno?")) return;
    // confirmação para excluir o aluno
    try {
      const response = await fetch(`http://localhost:3000/alunos/${id}?turmaId=${turmaId}`, {
        method: "DELETE"
      });
      if (response.status === 409) { //se o backend retornar o erro 409, indica que a FK esta sendo usada em outro lugar
        alert("Não é possível excluir. Existem notas lançadas.");
        return;
      }
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

  // Verificar extensão correta se é um .csv
  const nomeArquivo = arquivo.name.toLowerCase();
  if (!nomeArquivo.endsWith(".csv")) {
    alert("Formato inválido! O arquivo deve ser .csv");
    inputCSV.value = ""; // limpa o campo
    return;
  }

  const leitor = new FileReader(); //função do js que lê arquivos

  leitor.onload = function (evento) { //depois que terminar de ler o arquivo vem a função
    const conteudo = evento.target.result; //salva o resultado aqui, que é o conteúdo lido do arquivo

    // valida se realmente parece CSV, com informações dividas por vírgula
    if (!conteudo.includes(",") && !conteudo.includes(";")) {
      alert("Arquivo inválido! O CSV deve conter separação por vírgulas.");
      inputCSV.value = "";
      return;
    }

    processarCSV(conteudo);  
  };

  leitor.readAsText(arquivo, "UTF-8"); // vai ler o arquivo como um texto, função do js
});

  // Processamento CSV
  function processarCSV(texto) { //aqui é uma string 'texto' tem linha por linha do conteúdo lido do arquivo csv
    const linhas = texto.split("\n").map(l => l.trim()).filter(l => l !== ""); //cada quebra de linha vira uma array...
    //... remove espaços no começo e final, remove linhas vazias
    // Remove cabeçalho se existir
    if (linhas[0].toLowerCase().includes("matricula")) {
      linhas.shift(); //remove o primeiro elemento do array / a primeira linha do csv, o cabeçalho
    }

    let totalNovos = 0;
    let duplicados = 0;

    linhas.forEach(async linha => {
      const [matricula, nome] = linha.split(",").map(x => x.trim());

      if (!matricula || !nome) return;
      //monta o body pra requisição do back
      const body = {
        matricula,
        nome,
        usuarioId,
        turmaId
      };

      try {
        const response = await fetch("http://localhost:3000/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },// fala que a requisição sera emm formato json
          body: JSON.stringify(body)
        });

        if (response.status === 409) { //se encontrar matrícula igual, da erro e não salva/substitui
          duplicados++;
          return;
        }

        if (!response.ok) throw new Error("Erro ao importar aluno");

        const alunoCriado = await response.json();
        adicionarAlunoNaTabela(alunoCriado); //adiciona na tabela
        totalNovos++;

      } catch (e) {
        console.error("Erro ao importar linha:", e);
      }
    });

    setTimeout(() => {
      alert(//mostra quantos alunos foram adicionados e quantos tinham duplicados no back
        `Importação concluída!\n\n` +
        `✔ Novos alunos adicionados: ${totalNovos}\n` +
        `⚠ Duplicados ignorados: ${duplicados}`
      );
    }, 500); //set timeout 500, fala para ele executar essa função depois de 500ms (0.5 segundos)
    inputCSV.value = "";
  }
  preencheTituloTurma();

});
