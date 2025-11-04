
const email       = document.getElementById("emailInput");
const senha       = document.getElementById("senhaInput");
const btnLogin    = document.getElementById("btnLogin");
const alertLogin  = document.getElementById("alertLogin"); // alerta acima do título

async function login(){                                                       
    const body = {
       email : email.value,
       senha : senha.value
    }
        // limpar alertas anteriores
    alertLogin.innerHTML = "";
    document.getElementById('erroEmailInvalido').classList.add('d-none');
    document.getElementById('erroSenhaInvalido').classList.add('d-none')

    fetch("http://localhost:3000/login", {
  method: "POST", // tipo da requisição
  headers: {
    "Content-Type": "application/json", // informa que o corpo é JSON
  },
  body: JSON.stringify(body),
})
.then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                // alerta de login inválido acima do título
                alertLogin.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Usuário ou senha inválidos!
                    </div>
                `;
                // marca inputs como inválidos
                email.classList.add('is-invalid');
                senha.classList.add('is-invalid');
                document.getElementById('erroEmailInvalido').classList.remove('d-none');
                document.getElementById('erroSenhaInvalido').classList.remove('d-none');
            } else {
                throw new Error("Erro na requisição: " + response.status);
            }
            return;
        }
})
.then(data => {
  console.log("Login feito com sucesso", data);
  localStorage.setItem("usuarioLogado", "true");
  window.location.href = "../paginaInicial/paginaInicial.html";
}) 

}
function validarCamposBasicos() {
  // ===== email =====
  if (email.value.trim() === "") {
    email.classList.add('is-invalid');
    document.getElementById('erroEmailVazio').classList.remove('d-none');
  } else {
    email.classList.remove('is-invalid');
    document.getElementById('erroEmailVazio').classList.add('d-none');
  }

    // ===== Ssenha =====
  if (senha.value.trim() === "") {
    senha.classList.add('is-invalid');
    document.getElementById('erroSenhaVazia').classList.remove('d-none');
    valido = false;
  } else {
    senha.classList.remove('is-invalid');
    document.getElementById('erroSenhaVazia').classList.add('d-none');
  }
}


btnLogin.addEventListener("click", (event) => {
  event.preventDefault(); // impede envio automático

  // valida todos os campos básicos (email, senha)
  validarCamposBasicos();
  // Se tudo válido, salva o usuário
  if (
    email.value.trim() !== "" &&
    senha.value.trim() !== ""
  ) {
    login();
  }
});


