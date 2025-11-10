<<<<<<< Updated upstream
// verificarLogin();

// // verifica se está logado
// function verificarLogin() {
//   const usuarioLogado = localStorage.getItem("usuarioLogado");
//     if (usuarioLogado != "true") {
//     alert("Usuário não identificado. Faça login novamente.");
//     window.location.href = "../login/login.html";
//   }
// }

// // pega instituiçãoId da URL
// const urlParams = new URLSearchParams(window.location.search);
// const usuarioId = localStorage.getItem("id");

// if (!usuarioId) {
//   alert("Erro: usuário não identificado. Faça login novamente.");
//   window.location.href = "../login/login.html";
// }

// const disciplina       = document.getElementById("disciplina1");
// const btnDisci           = document.getElementById("btnDisci");
// const btnInicial        = document.getElementById("btnInicial");
// const tbodyDisci         = document.getElementById("tbodyDisci");

// // carrega instituições filtradas pelo usuário logado
// async function carregarDisciplinas() {
//   try {
//     const response = await fetch(`http://localhost:3000/instituicoes?usuarioId=${usuarioId}`);

//     if (!response.ok) {
//       throw new Error("Erro ao buscar disciplinas");
//     }

//     const lista = await response.json();

//     tbodyDisci.innerHTML = "";

//     lista.forEach(inst => adicionarDisciplinaNaTabela(disci));

//   } catch (error) {
//     console.error("Erro ao carregar disciplinas:", error);
//   }
// }

// // cria instituição vinculada ao usuarioId
// async function salvarInst() {
//   const body = {
//     nome: instituicao.value.trim(),
//     usuarioId: usuarioId    // <-- obrigatório para FK
//   };

//   try {
//     const response = await fetch("http://localhost:3000/instituicoes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body)
//     });

//     if (!response.ok) {
//       throw new Error("Erro ao cadastrar");
//     }

//     const data = await response.json();
//     adicionarInstituicaoNaTabela(data);

//     instituicao.value = "";

//   } catch (error) {
//     console.error(error);
//   }
// }

// // valida input
// function validarCampos() {
//   if (instituicao.value.trim() === "") {
//     instituicao.classList.add("is-invalid");
//     document.getElementById("erroInstVazio").classList.remove("d-none");
//     return false;
//   }

//   instituicao.classList.remove("is-invalid");
//   document.getElementById("erroInstVazio").classList.add("d-none");
//   return true;
// }

// // adiciona linha na tabela
// function adicionarInstituicaoNaTabela(inst) {
//   const tr = document.createElement("tr");

//   tr.innerHTML = `
//     <td>${inst.id}</td>
//     <td>${inst.nome}</td>
//     <td>
//       <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarCurso" data-id="${inst.id}">
//         Cadastrar Cursos
//       </button>
//       <button type="button" class="btn btn-sm btn-danger btnExcluirInst" data-id="${inst.id}">
//         Excluir
//       </button>
//     </td>
//   `;

//   tbodyInst.appendChild(tr);
// }

// // ações da tabela
// tbodyInst.addEventListener("click", async (e) => {
//   const btn = e.target;

//   if (btn.classList.contains("btnCadastrarCurso")) {
//     const instId = btn.dataset.id;
//     window.location.href = `../curso/cadastroCurso.html?instId=${instId}&usuarioId=${usuarioId}`;
//   }

//   if (btn.classList.contains("btnExcluirInst")) {
//     const instId = btn.dataset.id;

//     if (!confirm("Deseja realmente excluir esta instituição?")) return;

//     try {
//       const response = await fetch(`http://localhost:3000/instituicoes/${instId}`, {
//         method: "DELETE",
//       });

//       if (response.status === 409) {
//         alert("Não é possível excluir. Existem cursos vinculados.");
//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Erro ao excluir");
//       }

//       btn.closest("tr").remove();

//     } catch (error) {
//       console.error(error);
//     }
//   }
// });

// // eventos dos botões
// btnInst.addEventListener("click", (event) => {
//   event.preventDefault();

//   if (validarCampos()) {
//     salvarInst();
//   }
// });

// btnInicial.addEventListener("click", () => {
//   window.location.href = `../paginainicial/paginaInicial.html?usuarioId=${usuarioId}`;
// });

// // carrega ao abrir
// carregarInstituicoes();
=======
verificarLogin();

// verifica se está logado
function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado != "true") {
    alert("Usuário não identificado. Faça login novamente.");
    window.location.href = "../login/login.html";
  }
}

// pega instituiçãoId da URL
const urlParams = new URLSearchParams(window.location.search);
const usuarioId = localStorage.getItem("id");

if (!usuarioId) {
  alert("Erro: usuário não identificado. Faça login novamente.");
  window.location.href = "../login/login.html";
}

const disciplina = document.getElementById("disciplina1");
const btnDisci = document.getElementById("btnDisci");
const btnInicial = document.getElementById("btnInicial");
const tbodyDisci = document.getElementById("tbodyDisci");

// carrega instituições filtradas pelo usuário logado
async function carregarDisciplinas() {
  try {
    const response = await fetch(`http://localhost:3000/instituicoes?usuarioId=${usuarioId}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar disciplinas");
    }

    const lista = await response.json();

    tbodyDisci.innerHTML = "";

    lista.forEach(inst => adicionarDisciplinaNaTabela(disci));

  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
  }
}

// cria instituição vinculada ao usuarioId
async function salvarInst() {
  const body = {
    nome: instituicao.value.trim(),
    usuarioId: usuarioId // <-- obrigatório para FK
  };

  try {
    const response = await fetch("http://localhost:3000/instituicoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar");
    }

    const data = await response.json();
    adicionarInstituicaoNaTabela(data);

    instituicao.value = "";

  } catch (error) {
    console.error(error);
  }
}

// valida input
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

// adiciona linha na tabela
function adicionarInstituicaoNaTabela(inst) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${inst.id}</td>
    <td>${inst.nome}</td>
    <td>
      <button type="button" class="btn btn-sm btn-primary me-2 btnCadastrarCurso" data-id="${inst.id}">
        Cadastrar Cursos
      </button>
      <button type="button" class="btn btn-sm btn-danger btnExcluirInst" data-id="${inst.id}">
        Excluir
      </button>
    </td>
  `;

  tbodyInst.appendChild(tr);
}

// ações da tabela
tbodyInst.addEventListener("click", async (e) => {
  const btn = e.target;

  if (btn.classList.contains("btnCadastrarCurso")) {
    const instId = btn.dataset.id;
    window.location.href = `../curso/cadastroCurso.html?instId=${instId}&usuarioId=${usuarioId}`;
  }

  if (btn.classList.contains("btnExcluirInst")) {
    const instId = btn.dataset.id;

    if (!confirm("Deseja realmente excluir esta instituição?")) return;

    try {
      const response = await fetch(`http://localhost:3000/instituicoes/${instId}`, {
        method: "DELETE",
      });

      if (response.status === 409) {
        alert("Não é possível excluir. Existem cursos vinculados.");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao excluir");
      }

      btn.closest("tr").remove();

    } catch (error) {
      console.error(error);
    }
  }
});

// eventos dos botões
btnInst.addEventListener("click", (event) => {
  event.preventDefault();

  if (validarCampos()) {
    salvarInst();
  }
});

btnInicial.addEventListener("click", () => {
  window.location.href = `../paginainicial/paginaInicial.html?usuarioId=${usuarioId}`;
});

// carrega ao abrir
carregarInstituicoes();
>>>>>>> Stashed changes
