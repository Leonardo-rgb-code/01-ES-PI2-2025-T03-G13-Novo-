
const email     = document.getElementById("email");
const btnEmail  = document.getElementById("btnEmail");
const btnReenviarSenha  = document.getElementById("reenviar-senha");

async function linkRecSenha(){                                                       
    const body = {
       email : email.value,
    }

    fetch("http://localhost:3000/recupSenha", {
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
                document.getElementById('erroEmailInvalido').classList.remove('d-none');
            } else {
                throw new Error("Erro na requisição: " + response.status);
            }
            return;
        }
})
.then(data => {
  console.log("Email enviado com sucesso", data);
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
}


btnEmail.addEventListener("click", (event) => {
  event.preventDefault(); // impede envio automático
  // Se tudo válido, salva o usuário
  if (
    email.value.trim() !== "" 
  ) {
    linkRecSenha();
  }
});

btnReenviarSenha.addEventListener("click", (event) => {
  event.preventDefault(); // impede envio automático
  // Se tudo válido, salva o usuário
  if (
    email.value.trim() !== "" 
  ) {
    linkRecSenha();
  }
});

