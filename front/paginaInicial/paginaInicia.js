// =========================
// VERIFICA LOGIN
// =========================
verificarLogin();

function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  const usuarioId = localStorage.getItem("id");
  const nomeUsuario = localStorage.getItem("nome");

  if (usuarioLogado !== "true" || !usuarioId) {
    window.location.href = "../login/login.html";
  }

  // mostra o nome do usuário no topo
  document.getElementById("nomeUsuarioTitulo").textContent = nomeUsuario || "Professor";
}

// =========================
// BOTÕES E LINKS
// =========================
const usuarioId = localStorage.getItem("id");

// botão de instituições
const linkInstituicoes = document.querySelector('a[href="../instituicao/cadastroInst.html"]');
linkInstituicoes.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = `../instituicao/cadastroInst.html?usuarioId=${usuarioId}`;
});

// botão de lançar notas
const btnLancarNotas = document.querySelector(".bi-pencil-square").closest(".card").querySelector("button");
btnLancarNotas.addEventListener("click", () => {
  window.location.href = `../notaFinal/NotaFinal.html?usuarioId=${usuarioId}`;
});

// botão de média final
const btnMediaFinal = document.querySelector(".bi-calculator").closest(".card").querySelector("button");
btnMediaFinal.addEventListener("click", () => {
  window.location.href = `../mediaFinal/mediaFinal.html?usuarioId=${usuarioId}`;
});

// =========================
// LOGOUT
// =========================
document.getElementById("btnLogout").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("id");
  localStorage.removeItem("nome");

  window.location.href = "../login/login.html";
});
