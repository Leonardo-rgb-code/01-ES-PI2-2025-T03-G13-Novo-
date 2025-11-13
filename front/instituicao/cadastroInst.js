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

  if (!usuarioId) {
    alert("Erro: usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
    throw new Error("Execução interrompida — sem ID de usuário.");
  }

  const instituicao = document.getElementById("instituicao1");
  const btnInst = document.getElementById("btnInst");
  const btnInicial = document.getElementById("btnInicial");
  const tbodyInst = document.getElementById("tbodyInst");

async function buscarInstituicoes(usuarioId) {
  try {
    const response = await fetch(`http://localhost:3000/instituicoes?usuarioId=${usuarioId}`);

    if (!response.ok) throw new Error("Erro ao buscar instituições");

    const lista = await response.json(); // retorna array do backend
    return lista;

  } catch (error) {
    console.error("Erro ao carregar instituições:", error);
    return []; // retorna lista vazia em caso de erro
  }
}


// Função que usa o retorno para montar a tabela
async function carregarInstituicoes() {
  const lista = await buscarInstituicoes(usuarioId); // chama a função de GET
  totalInstituicao = lista.length;

  tbodyInst.innerHTML = ""; // limpa tabela

  lista.forEach(inst => adicionarInstituicaoNaTabela(inst));
}

  async function salvarInst() {
    const body = {
      nome: instituicao.value.trim(),
      usuarioId: usuarioId
    };

    try {
      const response = await fetch("http://localhost:3000/instituicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Erro ao cadastrar instituição");

      const data = await response.json();
      adicionarInstituicaoNaTabela(data);

      instituicao.value = "";

    } catch (error) {
      console.error(error);
    }
  }

  function validarCampos() {
    if (instituicao.value.trim() === "") {
      instituicao.classList.add("is-invalid");
      document.getElementById("erroInstVazio").classList.remove("d-none");
      return false;
    }

    instituicao.classList.remove("is-invalid");
    document.getElementById("erroInstVazio").classList.add("d-none");
    return true;
  }

  // 🔥 Função corrigida
  function adicionarInstituicaoNaTabela(inst) {

    // Usa o ID correto conforme retorno do backend
    const id = inst.id_instituicao ?? inst.id ?? inst.instituicaoId;
    const nome = inst.nome_instituicao ?? inst.nome;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarCurso" data-id="${id}">
          Cadastrar Cursos
        </button>
        <button type="button" class="btn btn-sm btn-danger btnExcluirInst" data-id="${id}">
          Excluir
        </button>
      </td>
    `;

    tbodyInst.appendChild(tr);
  }

  // 🔥 Agora capta corretamente o botão clicado
  tbodyInst.addEventListener("click", async (e) => {
    const btn = e.target.closest("button"); // <- Pega o botão mesmo clicando no ícone/texto

    if (!btn) return;

    const instId = btn.dataset.id;   // <- Agora pega corretamente o ID da instituição

    if (!instId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }

    if (btn.classList.contains("btnCadastrarCurso")) {
      window.location.href = `../curso/cadastroCurso.html?instId=${instId}&usuarioId=${usuarioId}`;
      return;
    }

    if (btn.classList.contains("btnExcluirInst")) {
      if (!confirm("Deseja realmente excluir esta instituição?")) return;

      try {
        const response = await fetch(`http://localhost:3000/instituicoes/${instId}`, {
          method: "DELETE",
        });

        if (response.status === 409) {
          alert("Não é possível excluir. Existem cursos vinculados.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir instituição");

        btn.closest("tr").remove();
        totalInstituicao = 0;

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnInst.addEventListener("click", (event) => {
    event.preventDefault();

    if (validarCampos()) salvarInst();

  });

  btnInicial.addEventListener("click", async  () => {
    const totalInstituicao = await buscarInstituicoes(usuarioId);
    console.log(totalInstituicao)
    if (totalInstituicao.length == 0) {
      alert("Voce precisa cadastrar pelo menos uma instituição e um curso");
    } else {
      window.location.href = "../paginainicial/paginaInicial.html";
    }
  });

  carregarInstituicoes();
});
