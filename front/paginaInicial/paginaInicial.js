// <!-- Autor: Gabrielle Mota -->

document.addEventListener("DOMContentLoaded", async() => {
// Verifica o login pelo id do usuário e nome salvos no localstorage
verificarLogin();

function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const usuarioId = localStorage.getItem("id");
  const nomeUsuario = localStorage.getItem("nome");

  if (usuarioLogado !== "true" || !usuarioId) { //se usuário logado for diferente de True, direciona para a tela de login
    window.location.href = "/front/login/login.html";
  }

  // mostra o nome do usuário no cabeçalho pelo id criado na navbar
  document.getElementById("nomeUsuarioTitulo").textContent = nomeUsuario || "Professor";
}

// Botões e links
const usuarioId = localStorage.getItem("id");

// botão de instituições
const linkInstituicoes = document.querySelector('a[href="../instituicao/cadastroInst.html"]');
linkInstituicoes.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = `/front/instituicao/cadastroInst.html?usuarioId=${usuarioId}`;
});

// botão de lançar notas
const btnLancarNotas = document.querySelector(".bi-pencil-square").closest(".card").querySelector("button");
btnLancarNotas.addEventListener("click", () => {
  window.location.href = `/front/notaFinal/NotaFinal.html?usuarioId=${usuarioId}`;
});

// LOGOUT / sair, remove as informações do usuário do localStorage
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("id");
  localStorage.removeItem("nome");

  window.location.href = "/front/login/login.html";
});

//Verifica se o usuário tem algum curso cadastrado, se não tiver direciona para a tela de cadastro instituição
async function carregarCursos() {
  const res = await fetch(`http://localhost:3000/cursos?usuarioId=${usuarioId}`);
  const lista = await res.json();
  return lista
}

const lista = await carregarCursos();
if (lista.length <= 0) {
  window.location.href = `/front/instituicao/cadastroInst.html?usuarioId=${usuarioId}`;
}
});
