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
    const nomeUsuario =  localStorage.getItem("nome");
    const nomeUsuarioTitulo = document.getElementById("nomeUsuarioTitulo");
    nomeUsuarioTitulo.innerText = nomeUsuario;
    const btnLogout = document.getElementById("btnLogout");

    btnLogout.addEventListener("click", async  () => {
    localStorage.clear();
    window.location.href = "/front/login/login.html";
  });
})