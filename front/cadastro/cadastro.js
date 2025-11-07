
const nome         = document.getElementById("nome");
const sobrenome    = document.getElementById("sobrenome");
const email        = document.getElementById("email");
const tel          = document.getElementById("telefone");
const senha        = document.getElementById("senha");
const confSenha    = document.getElementById("confirmSenha");
const btnCadastro  = document.getElementById("botaoCadastro");

const senhaRegex   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;

async function salvarUsuario(){
    
    const body = {
       nome : nome.value,
       sobrenome : sobrenome.value,
       telefone : tel.value,
       email : email.value,
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
  console.log("Usuário cadastrado:", data);
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

function validarCamposBasicos() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // simples e eficaz
  const telRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // (XX) XXXXX-XXXX ou similar

  // ===== Nome =====
  if (nome.value.trim() === "") {
    nome.classList.add('is-invalid');
    document.getElementById('erroNomeVazio').classList.remove('d-none');
  } else {
    nome.classList.remove('is-invalid');
    document.getElementById('erroNomeVazio').classList.add('d-none');
  }

  // ===== Sobrenome =====
if (sobrenome.value.trim() === "") {
  sobrenome.classList.add('is-invalid');
  document.getElementById('erroSobrenomeVazio').classList.remove('d-none');
  valido = false;
} else {
  sobrenome.classList.remove('is-invalid');
  document.getElementById('erroSobrenomeVazio').classList.add('d-none');
}

  // ===== Email =====
  if (email.value.trim() === "") {
    email.classList.add('is-invalid');
    document.getElementById('erroEmailVazio').classList.remove('d-none');
    document.getElementById('erroEmailInvalido').classList.add('d-none');
  } else if (!emailRegex.test(email.value)) {
    email.classList.add('is-invalid');
    document.getElementById('erroEmailVazio').classList.add('d-none');
    document.getElementById('erroEmailInvalido').classList.remove('d-none');
  } else {
    email.classList.remove('is-invalid');
    document.getElementById('erroEmailVazio').classList.add('d-none');
    document.getElementById('erroEmailInvalido').classList.add('d-none');
  }

  // ===== Telefone =====
  if (tel.value.trim() === "") {
    tel.classList.add('is-invalid');
    document.getElementById('erroTelefoneVazio').classList.remove('d-none');
    document.getElementById('erroTelefoneInvalido').classList.add('d-none');
  } else if (!telRegex.test(tel.value)) {
    tel.classList.add('is-invalid');
    document.getElementById('erroTelefoneVazio').classList.add('d-none');
    document.getElementById('erroTelefoneInvalido').classList.remove('d-none');
  } else {
    tel.classList.remove('is-invalid');
    document.getElementById('erroTelefoneVazio').classList.add('d-none');
    document.getElementById('erroTelefoneInvalido').classList.add('d-none');
  }
}

btnCadastro.addEventListener("click", (event) => {
  event.preventDefault(); // impede envio automático

  // valida todos os campos básicos (nome, sobrenome, email, telefone)
  validarCamposBasicos();

  // valida senhas e recebe se passou ou não
  const senhasValidas = validarSenhas();

  // Se tudo válido, salva o usuário
  if (
    nome.value.trim() !== "" &&
    sobrenome.value.trim() !== "" &&
    emailRegex.test(email.value) &&
    telRegex.test(tel.value) &&
    senhasValidas
  ) {
    salvarUsuario();
  }
});
