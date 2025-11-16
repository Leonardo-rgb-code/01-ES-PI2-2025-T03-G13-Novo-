// <!-- Autor: Gabrielle Mota -->

document.addEventListener("DOMContentLoaded", () => {
//verifica se o usuário esta logado pelos dados no localStorage
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

  //manda requisição pro back para carregar as instituições salvas no bd vinculados aquele id de usuário
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

  tbodyInst.innerHTML = ""; // limpa a tabela para receber as informações

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
      adicionarInstituicaoNaTabela(data); // se der tudo certo na requisição do back e as informações estiverem corretas no bd
      // salva a instituição no banco de dados e na tabela

      instituicao.value = "";

    } catch (error) {
      console.error(error);
    }
  }
 
// Valida os campos de input, nome 
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

  // Função corrigida
  function adicionarInstituicaoNaTabela(inst) {

    // Usa o ID correto conforme retorno do backend
    const id = inst.id_instituicao;
    const nome = inst.nome;

    const tr = document.createElement("tr");
    
    // salva as informações na tabela e adiciona o id da insitituição em casa botão para funcionalidades
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

  // Botões
  tbodyInst.addEventListener("click", async (e) => {
    const btn = e.target.closest("button"); // botão para cadastrar curso

    if (!btn) return;

    const instId = btn.dataset.id;   // pega o ID da instituição no botão

    if (!instId) {
      console.warn("Nenhum data-id encontrado no botão:", btn);
      return;
    }

    if (btn.classList.contains("btnCadastrarCurso")) {
      window.location.href = `../curso/cadastroCurso.html?instId=${instId}&usuarioId=${usuarioId}`;
      return;  //direciona para página de cadastrar curso com o id da instituição e do usuário vinculados
    }

    if (btn.classList.contains("btnExcluirInst")) {
      if (!confirm("Deseja realmente excluir esta instituição?")) return;
    //alerta de confirmação para excluir 

      try {
        const response = await fetch(`http://localhost:3000/instituicoes/${instId}`, {
          method: "DELETE",
        });

        //usa a resposta da requisição do back para verificar se existe tabelas vinculadas a insittuição alvo
        if (response.status === 409) {
          alert("Não é possível excluir. Existem cursos vinculados.");
          return;
        }

        if (!response.ok) throw new Error("Erro ao excluir instituição");
        
        //se todas as validações estiverem ok, remove da tabela a linha e do bd no back
        btn.closest("tr").remove();
        totalInstituicao = 0;

      } catch (error) {
        console.error(error);
      }
    }
  });

  btnInst.addEventListener("click", (event) => {
    event.preventDefault();
    //salva a insituição se tudo ok e libera os campos para cadastrar nova instituição

    if (validarCampos()) salvarInst();

  });

  btnInicial.addEventListener("click", async  () => {
    const totalInstituicao = await buscarInstituicoes(usuarioId);
    console.log(totalInstituicao)
    if (totalInstituicao.length == 0) { //confirma se ja existe uma instituição cadastrada para permitir que vá para tela inicial
      alert("Voce precisa cadastrar pelo menos uma instituição e um curso");
    } else {
      window.location.href = "../paginainicial/paginaInicial.html";
    }
  });

  carregarInstituicoes();
});
