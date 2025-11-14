document.addEventListener("DOMContentLoaded", () => {
  // ----- LOGIN (descomente se usar) -----
  // function verificarLogin() {
  //   const usuarioLogado = localStorage.getItem("usuarioLogado");
  //   if (usuarioLogado !== "true") {
  //     alert("Usuário não identificado. Faça login novamente.");
  //     window.location.href = "../login/login.html";
  //     throw new Error("Execução interrompida — usuário não logado.");
  //   }
  // }
  // const usuarioId = localStorage.getItem("id");
  // if (!usuarioId) { ... }
  // verificarLogin();

  // variáveis
  let componentes = [];
  let componentesSalvos = false;

  // elementos
  const componenteNomeNota = document.getElementById("componenteNota");
  const siglaCompoNota = document.getElementById("siglaCompNota");
  const descricaodaNota = document.getElementById("descricaoNota");
  const tipoMediaRadios = document.getElementsByName("tipoMedia");
  const campoPeso = document.getElementById("campoPeso");
  const tabela = document.getElementById("tabelaComponentes");
  const colunaPeso = document.querySelector(".colPeso");

  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnSalvar = document.getElementById("btnSalvarComponentes");
  const btnPaginaInicial = document.getElementById("btnPaginaInicial");

  function getTipoMediaSelecionada() {
    return [...tipoMediaRadios].find(r => r.checked)?.value ?? null;
  }

  // Remove erros quando usuário digita
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
  document.getElementById("pesoNota").addEventListener("input", () => {
    const pesoInput = document.getElementById("pesoNota");
    pesoInput.classList.remove("is-invalid");
    document.getElementById("erroPesoVazio").classList.add("d-none");
    document.getElementById("erroPesoTotal").classList.add("d-none");
  });

  // Bloqueia a troca de tipos de médias se ja tiver componente cadastrado
  [...tipoMediaRadios].forEach(radio => {
    radio.addEventListener("change", () => {
      // se já existem componentes, não permite trocar o tipo
      if (componentes.length > 0) {
        const tipoExistente = componentes[0].peso === null ? "ARITMETICA" : "PONDERADA";
        if (radio.value !== tipoExistente) {
          document.getElementById("erroTrocaMedia").classList.remove("d-none");
          // desmarcar o radio que foi marcado agora (mantém o anterior)
          // procura o radio correspondente ao tipo existente e marca-o de volta
          const radioAntigo = [...tipoMediaRadios].find(r => r.value === tipoExistente);
          if (radioAntigo) radioAntigo.checked = true;
          return;
        }
      }
      // sem componentes, esconde erro e mostra/oculta campo peso conforme seleção
      document.getElementById("erroTrocaMedia").classList.add("d-none");
      if (radio.value === "PONDERADA") {
        campoPeso.classList.remove("d-none");
        colunaPeso.classList.remove("d-none");
      } else {
        campoPeso.classList.add("d-none");
        colunaPeso.classList.add("d-none");
      }
    });
  });

  // Validação
  function validarCampos() {
    let valido = true;

    if (componenteNomeNota.value.trim() === "") {
      componenteNomeNota.classList.add("is-invalid");
      document.getElementById("erroComponenteVazio").classList.remove("d-none");
      valido = false;
    } else {
      componenteNomeNota.classList.remove("is-invalid");
      document.getElementById("erroComponenteVazio").classList.add("d-none");
    }

    if (siglaCompoNota.value.trim() === "") {
      siglaCompoNota.classList.add("is-invalid");
      document.getElementById("erroSiglaVazio").classList.remove("d-none");
      valido = false;
    } else {
      siglaCompoNota.classList.remove("is-invalid");
      document.getElementById("erroSiglaVazio").classList.add("d-none");
    }

    if (descricaodaNota.value.trim() === "") {
      descricaodaNota.classList.add("is-invalid");
      document.getElementById("erroDescVazio").classList.remove("d-none");
      valido = false;
    } else {
      descricaodaNota.classList.remove("is-invalid");
      document.getElementById("erroDescVazio").classList.add("d-none");
    }

    const tipoMedia = getTipoMediaSelecionada();
    const pesoInput = document.getElementById("pesoNota");

    // se campo de peso está visível (modo ponderada) valida o input
    if (!campoPeso.classList.contains("d-none")) {
      if (!pesoInput.value.trim()) {
        pesoInput.classList.add("is-invalid");
        document.getElementById("erroPesoVazio").classList.remove("d-none");
        valido = false;
      } else {
        // valor numérico entre 1 e 100
        const v = Number(pesoInput.value);
        if (Number.isNaN(v) || v <= 0 || v > 100) {
          pesoInput.classList.add("is-invalid");
          document.getElementById("erroPesoVazio").classList.remove("d-none");
          valido = false;
        } else {
          pesoInput.classList.remove("is-invalid");
          document.getElementById("erroPesoVazio").classList.add("d-none");
        }
      }
    } else {
      // se campo de peso não visível, limpa possíveis mensagens
      pesoInput.classList.remove("is-invalid");
      document.getElementById("erroPesoVazio").classList.add("d-none");
    }

    // tipo de média precisa estar selecionado
    if (!tipoMedia) {
      document.getElementById("erroTipoMedia").classList.remove("d-none");
      valido = false;
    } else {
      document.getElementById("erroTipoMedia").classList.add("d-none");
    }

    return valido;
  }

  // Adiciona o componente
  btnAdicionar.addEventListener("click", () => {
    // chama validarCampos para exibir mensagens
    if (!validarCampos()) return;

    const tipoMedia = getTipoMediaSelecionada();
    const nome = componenteNomeNota.value.trim();
    const sigla = siglaCompoNota.value.trim();
    const desc = descricaodaNota.value.trim();
    const pesoInput = document.getElementById("pesoNota");
    let peso = null;

    if (!campoPeso.classList.contains("d-none")) {
      const valor = pesoInput.value.trim();
      peso = valor === "" ? null : Number(valor);
    }

    componentes.push({ nome, sigla, desc, peso: peso === null ? null : peso });
    componentesSalvos = false;
    atualizarTabela();

    // limpa inputs
    componenteNomeNota.value = "";
    siglaCompoNota.value = "";
    descricaodaNota.value = "";
    if (pesoInput) pesoInput.value = "";

    // após adicionar, se houver componentes, fixa o tipo (impede troca)
    // marca o radio correspondente ao tipo atual para manter coerência
    if (tipoMedia) {
      const radioAtual = [...tipoMediaRadios].find(r => r.value === tipoMedia);
      if (radioAtual) radioAtual.checked = true;
    }
  });

  // Atualiza Tabela
  function atualizarTabela() {
    tabela.innerHTML = "";

    componentes.forEach((c, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(String(c.nome))}</td>
        <td>${escapeHtml(String(c.sigla))}</td>
        <td>${escapeHtml(String(c.desc))}</td>
        <td class="${c.peso !== null ? "" : "d-none"}">${c.peso !== null ? escapeHtml(String(c.peso)) : ""}</td>
        <td>
          <button class="btn btn-danger btn-sm btn-remover" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tabela.appendChild(tr);
    });

    tabela.querySelectorAll(".btn-remover").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(btn.dataset.index);
        remover(idx);
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  // Remove componente
  function remover(i) {
    componentes.splice(i, 1);
    componentesSalvos = false;
    atualizarTabela();
  }

  window.remover = remover;

  // Botão para salvar no banco de dados
  btnSalvar.addEventListener("click", async () => {
    if (componentes.length === 0) {
      alert("Adicione ao menos um componente antes de salvar.");
      return;
    }

    // antes de salvar, valida novamente
    if (!validarCampos()) return;

    const tipoMedia = getTipoMediaSelecionada();

    if (tipoMedia === "PONDERADA") {
      const soma = componentes.reduce((acc, c) => acc + (c.peso ?? 0), 0);
      if (soma !== 100) {
        document.getElementById("erroPesoTotal").classList.remove("d-none");
        return;
      } else {
        document.getElementById("erroPesoTotal").classList.add("d-none");
      }
    } else {
      document.getElementById("erroPesoTotal").classList.add("d-none");
    }

    // ----- AQUI VAI A REQUISIÇÃO PARA O BACKEND -----
    // Substitua a URL e payload conforme sua API.
    // Exemplo (descomente e ajuste conforme necessário):
    btnSalvar.addEventListener("click", async () => {
    if (componentes.length === 0) {
      alert("Adicione ao menos um componente antes de salvar.");
      return;
    }
    const usuarioId = localStorage.getItem("id");
    const disciplinaId = localStorage.getItem("disciplinaId");

    try {
      for (const c of componentes) {
        await fetch("http://localhost:3000/componentesNotas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: c.nome,
            sigla: c.sigla,
            peso: c.peso,    // aceita null ou número
            usuarioId,
            disciplinaId
          })
        });
      }

      alert("Componentes salvos com sucesso!");
      componentesSalvos = true;

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar no servidor.");
    }
  });

    componentesSalvos = true;
    alert("Componentes salvos com sucesso!");
  });

  // Págins inicial (confirmação se não salvo) -----
  btnPaginaInicial.addEventListener("click", (e) => {
    if (!componentesSalvos && componentes.length > 0) {
      const sair = confirm("Você ainda não salvou os componentes. Deseja sair e perder os dados?");
      if (!sair) return;
    }
    window.location.href = "../paginainicial/paginaInicial.html";
  });

  // inicializa: (esconde campo peso por padrão)
  campoPeso.classList.add("d-none");
  colunaPeso.classList.add("d-none");
});
