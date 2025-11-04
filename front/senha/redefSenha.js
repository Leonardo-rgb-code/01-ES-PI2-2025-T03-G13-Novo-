const senha        = document.getElementById("senha");
const confSenha    = document.getElementById("confSenha");
const btnSenha     = document.getElementById("btnSenha");

const senhaRegex   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

async function salvarSenha(){
    
    const body = {
       senha : senha.value
    }
    fetch("http://localhost:3000/usuarios", {
  method: "POST", // tipo da requisição
  headers: {
    "Content-Type": "application/json", // informa que o corpo é JSON
  },
  body: JSON.stringify(body),
})
.then(response => {
  if (!response.ok) {
    throw new Error("Erro na requisição: " + response.status);
  }
  return response.json(); // converte resposta pra JSON
})
.then(data => {
  console.log("Senha cadastrada:", data);
  window.location.href = "login.html";
})    
}

function validarSenhas() {
  let valido = true; // assume que está tudo certo no começo
  // ======= SENHA =======
  if (senha.value.trim() === "") {
    // campo vazio
    senha.classList.add('is-invalid');
    document.getElementById('erroSenhaVazia').classList.remove('d-none');
    document.getElementById('erroSenhaInvalida').classList.add('d-none');
    valido = false;
  } else if (!senhaRegex.test(senha.value)) {
    // não atende ao regex
    senha.classList.add('is-invalid');
    document.getElementById('erroSenhaVazia').classList.add('d-none');
    document.getElementById('erroSenhaInvalida').classList.remove('d-none');
    valido = false;
  } else {
    // senha válida
    senha.classList.remove('is-invalid');
    document.getElementById('erroSenhaVazia').classList.add('d-none');
    document.getElementById('erroSenhaInvalida').classList.add('d-none');
  }

  // ======= CONFIRMAÇÃO DE SENHA =======
  if (confSenha.value.trim() === "") {
    // campo vazio
    confSenha.classList.add('is-invalid');
    document.getElementById('erroConfirmacao').classList.remove('d-none');
    document.getElementById('erroSenhasDiferentes').classList.add('d-none');
    valido = false;
  } else if (senha.value !== confSenha.value) {
    // senhas diferentes
    confSenha.classList.add('is-invalid');
    document.getElementById('erroConfirmacao').classList.add('d-none');
    document.getElementById('erroSenhasDiferentes').classList.remove('d-none');
    valido = false;
  } else {
    // confirmação correta
    confSenha.classList.remove('is-invalid');
    document.getElementById('erroConfirmacao').classList.add('d-none');
    document.getElementById('erroSenhasDiferentes').classList.add('d-none');
  }

  return valido; // retorna true se tudo estiver correto, false caso contrário
}

btnSenha.addEventListener("click", (event) => {
  event.preventDefault(); // impede envio automático

  // valida senhas e recebe se passou ou não
  const senhasValidas = validarSenhas();

  // Se tudo válido, salvaa senha
  if (
    senhasValidas
  ) {
    salvarSenha();
  }
});
