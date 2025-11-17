// <!-- Autor: Gabrielle Mota-->

document.addEventListener("DOMContentLoaded", async () => {
  //verifica se o usuário esta logado pelos dados salvos no localStorage
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
  const disciplinaId = urlParams.get("disciplinaId"); //pega o id da disciplina na url

  verificarLogin();
  carregarComponentesDoBanco();

  let componentes = [];
  let componentesSalvos = true;

  const componenteNomeNota = document.getElementById("componenteNota");
  const siglaCompoNota = document.getElementById("siglaCompNota");
  const descricaodaNota = document.getElementById("descricaoNota");
  const radioArit = document.getElementById("mediaArit");
  const radioPond = document.getElementById("mediaPond");
  const campoPeso = document.getElementById("campoPeso");
  const tabela = document.getElementById("tabelaComponentes");
  const colunaPeso = document.querySelector(".colPeso");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnSalvar = document.getElementById("btnSalvarComponentes");
  const btnPaginaInicial = document.getElementById("btnPaginaInicial");
  const pesoInput = document.getElementById("pesoNota");

  async function buscarDisciplina() {
    try { // manda requisição pro back buscar a disciplina pelo id e pelo usuário no banco de dados
      const response = await fetch(`http://localhost:3000/disciplinas/${disciplinaId}?usuarioId=${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar disciplina");
      const disciplina = await response.json();
      return disciplina;
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      return {}; //lista vazia
    }
  }
  let disciplina = await buscarDisciplina() //adiciona o nome da disciplina na página 
  document.getElementById("nomeDisciplinaTitulo").innerHTML = disciplina.nome;

  //Carrega os componentes ja acdastrados no banco de dados
  async function carregarComponentesDoBanco() {
    try {
      const result = await fetch(
        `http://localhost:3000/componenteNotas?usuarioId=${usuarioId}&disciplinaId=${disciplinaId}`
      );

      if (result.status !== 200) return;
      
      //cria o body que vai ser enviado na requisição pro back mandar pro banco de dados
      const dados = await result.json();
      componentes = dados.map(c => ({
        id: c.id_componente,
        nome: c.nome,
        sigla: c.sigla,
        desc: c.descricao || "",
        peso: c.peso
      }));
      
      if (componentes.length > 0) { //verifica se existe um tipo de média ja selecionada, se existir peso é podnerada, se não é aritimética
        const tipoExistente = componentes[0].peso === null ? "ARITMETICA" : "PONDERADA";
        if (tipoExistente === "ARITMETICA") radioArit.checked = true;
        else radioPond.checked = true; //ja marca automaticamente o botão do rádio de acordo com a média que foi cadastrada
       //chama o campo que se for ponderada vai deixar visivel o campo de peso
        atualizarVisibilidadePeso(tipoExistente);
      }

      atualizarTabela();

    } catch (err) {
      console.error("Erro ao carregar tabela:", err);
    }
  }

  async function remover(index) { //recebe o parametro index do componente indicado abaixo
    const componente = componentes[index];

    if (componente.id) { //verifica se esse camponente tem um id
      let response = await fetch(`http://localhost:3000/componenteNotas/${componente.id}`, { //o await faz o código esperar o retorno dessa requisição para continuar
        method: "DELETE", //Faz uma requisição do tipo DELETE ao endpoint do backend para deletar o componente com aquele id
      });
    
      if (response.status === 409) { //se o backend retornar o erro 409, indica que a FK esta sendo usada em outro lugar
        alert("Não é possível excluir. Existem notas vinculados.");
          return;
      }
    }
    componentes.splice(index, 1); //remove um componente daquele index da array da lista
    atualizarTabela(); //reconstrói a tabela com a remoção
  }

  function getTipoMediaSelecionada() {
    if (radioArit.checked) return "ARITMETICA";
    if (radioPond.checked) return "PONDERADA";
    return null; //pega os vaolres para saber qual tipo de média esta selecionado
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    ); //pega qualquer caracter especial e troca por string/ texto, deixa de ser código, substitui
  } // garante que tudo que for inserido no html seja um texto, sem outras 'sujeiras' ou um código, evitando quebra na tabela ou erro de informação
  // garante que tudo exibido dentro da tabela seja texto

  // Remover erros quando digita
  componenteNomeNota.addEventListener("input", () => {
    componenteNomeNota.classList.remove("is-invalid");
    document.getElementById("erroComponenteVazio").classList.add("d-none");
  });

  siglaCompoNota.addEventListener("input", () => {
    siglaCompoNota.classList.remove("is-invalid");
    document.getElementById("erroSiglaVazio").classList.add("d-none");
  });

  descricaodaNota.addEventListener("input", () => {
    descricaodaNota.classList.remove("is-invalid");
    document.getElementById("erroDescVazio").classList.add("d-none");
  });

  pesoInput.addEventListener("input", () => {
    pesoInput.classList.remove("is-invalid");
    document.getElementById("erroPesoVazio").classList.add("d-none");
    document.getElementById("erroPesoTotal").classList.add("d-none");
  });

  // Travar troca de tipo de média depois de adicionar componentes e o campo de peso visível ou não
  function bloquearTroca(tipoExistente) {
    if (tipoExistente === "ARITMETICA") {
      radioArit.checked = true;
      radioPond.checked = false;
    } else {
      radioArit.checked = false;
      radioPond.checked = true;
    }
  }

function atualizarVisibilidadePeso(tipo) {
  if (tipo === "PONDERADA") {
    campoPeso.classList.remove("d-none");
    colunaPeso.classList.remove("d-none");
  } else {
    campoPeso.classList.add("d-none");
    colunaPeso.classList.add("d-none");
  }
}

  radioArit.addEventListener("change", () => {
    if (componentes.length > 0 && componentes[0].peso !== null) {
      document.getElementById("erroTrocaMedia").classList.remove("d-none");
      bloquearTroca("PONDERADA");
      return;
    }
    document.getElementById("erroTrocaMedia").classList.add("d-none");
    atualizarVisibilidadePeso("ARITMETICA");
  });

  radioPond.addEventListener("change", () => {
    if (componentes.length > 0 && componentes[0].peso === null) {
      document.getElementById("erroTrocaMedia").classList.remove("d-none");
      bloquearTroca("ARITMETICA");
      return;
    }
    document.getElementById("erroTrocaMedia").classList.add("d-none");
    atualizarVisibilidadePeso("PONDERADA");
  });

  // Validação de campos

  function validarCampos() {
    let valido = true;

    if (componenteNomeNota.value.trim() === "") {
      componenteNomeNota.classList.add("is-invalid");
      document.getElementById("erroComponenteVazio").classList.remove("d-none");
      valido = false;
    }

    if (siglaCompoNota.value.trim() === "") {
      siglaCompoNota.classList.add("is-invalid");
      document.getElementById("erroSiglaVazio").classList.remove("d-none");
      valido = false;
    }

    if (descricaodaNota.value.trim() === "") {
      descricaodaNota.classList.add("is-invalid");
      document.getElementById("erroDescVazio").classList.remove("d-none");
      valido = false;
    }

    const tipo = getTipoMediaSelecionada();

    if (!tipo) {
      document.getElementById("erroTipoMedia").classList.remove("d-none");
      valido = false;
    }

    if (tipo === "PONDERADA") { //verifica se o valor colocado no imput é um número entre 0 e 100 e se existe um valor digitado
      const valor = Number(pesoInput.value);
      if (!pesoInput.value.trim() || Number.isNaN(valor) || valor <= 0 || valor > 100) {
        pesoInput.classList.add("is-invalid");
        document.getElementById("erroPesoVazio").classList.remove("d-none");
        valido = false;
      }
    }

    return valido;
  }

  // Adicionar componente

  btnAdicionar.addEventListener("click", () => {

    if (!validarCampos()) return;

    const nome = componenteNomeNota.value.trim();
    const sigla = siglaCompoNota.value.trim().toUpperCase();
    const desc = descricaodaNota.value.trim();
    const tipoMedia = getTipoMediaSelecionada();

    if (componentes.some(componente => componente.sigla.toUpperCase() === sigla)) {
      alert(`Já existe um componente com a sigla "${sigla}" nesta lista.`);
      return;
    } //não deixa criar outro componente com a mesma sigla de um ja criado
    //permite que o peso seja null se não for ponderada 
    const peso = tipoMedia === "PONDERADA" ? Number(pesoInput.value) : null;

    componentes.push({ nome, sigla, desc, peso });
    componentesSalvos = false;

    atualizarTabela();
    //cria o body pra requisição do back
    componenteNomeNota.value = "";
    siglaCompoNota.value = "";
    descricaodaNota.value = "";
    pesoInput.value = "";
  });

  // Atualizar tabela

  function atualizarTabela() {
    tabela.innerHTML = "";
    //adciona as informações na tabela evitando sujeiras ou códigos, bugs, que possam quebra-la
    componentes.forEach((componente, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(componente.nome)}</td>
        <td>${escapeHtml(componente.sigla)}</td>
        <td>${escapeHtml(componente.desc)}</td>
        <td class="${componente.peso !== null ? "" : "d-none"}">${componente.peso ?? ""}</td>
        <td>
         <button type="button" class="btn btn-danger btn-sm btn-remover" data-index="${index}">
            Excluir
          </button>
        </td>
      `;
      tabela.appendChild(tr);
    });
    //remove da tabela
    tabela.querySelectorAll(".btn-remover").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.index);
        remover(idx);
      });
    });
  }

  window.remover = remover;

  // Salvar no banco de dados
btnSalvar.addEventListener("click", async () => {

  if (componentes.length === 0) {
    alert("Adicione ao menos um componente antes de salvar.");
    return;
  }

  const tipoMedia = getTipoMediaSelecionada();
  
  //verifica se a soma dos pesos deu exatamente 100 e não permite que salve se não ser 100
  if (tipoMedia === "PONDERADA") {
    const soma = componentes.reduce((acc, componente) => acc + (componente.peso ?? 0), 0);
    if (soma !== 100) {
      document.getElementById("erroPesoTotal").classList.remove("d-none");
      return;
    }
  }

  document.getElementById("erroPesoTotal").classList.add("d-none");

  // Filtrar apenas novos componentes 
  const novosComponentes = componentes.filter(c => !c.id);

  if (novosComponentes.length === 0) {
    alert("Nenhum novo componente para salvar.");
    componentesSalvos = true;
    return;
  }

  // Antes de salvar, verificar sigla no banco
  for (const componente of novosComponentes) {
    const result = await fetch(
      `http://localhost:3000/componenteNotas?sigla=${componente.sigla}&usuarioId=${usuarioId}&disciplinaId=${disciplinaId}`
    );

    if (result.status === 200) {
      alert(`Já existe um componente com a sigla "${componente.sigla}" no banco.`);
      return;
    }
  }

  // Enviar apenas os novos componentes
  for (const componente of novosComponentes) {
    await fetch("http://localhost:3000/componenteNotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: componente.nome,
        sigla: componente.sigla,
        peso: componente.peso,
        usuarioId,
        disciplinaId,
        descricao: componente.desc
      }),
    });
  }

  componentesSalvos = true;
  alert("Novos componentes salvos com sucesso!");
});

  // Botão página inicial

  btnPaginaInicial.addEventListener("click", () => {
    if (!componentesSalvos && componentes.length > 0) {
      const sair = confirm("Você ainda não salvou os componentes. Deseja sair?");
      if (!sair) return;
    }
    window.location.href = "../paginainicial/paginaInicial.html";
  });
});
