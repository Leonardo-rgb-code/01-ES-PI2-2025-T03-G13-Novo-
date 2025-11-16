// <!-- Autor: Gabrielle Mota -->

const email       = document.getElementById("emailInput");
const senha       = document.getElementById("senhaInput");
const btnLogin    = document.getElementById("btnLogin");
const alertLogin  = document.getElementById("alertLogin"); // alerta acima do título

//pega as informações do back para comparar e efetuar ou não o login
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
  method: "POST", // tipo da requisição no backend
  headers: {
    "Content-Type": "application/json", // informa que o corpo é JSON
  },
  body: JSON.stringify(body), //pega as informações do body que foi criada la atrás
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
        return response.json()
})
.then(async data => {
  //salva as informações do usuário no localStorage (armazenamento interno do navegador)
  console.log("Login feito com sucesso", data);
  localStorage.setItem('usuarioLogado', 'true');
  localStorage.setItem('id', data['id']);
  localStorage.setItem('nome', primeiraLetraMaiuscula(data['nome']));

  try {
    // Busca se existe instituição cadastrada para esse usuário no backend
    fetch(`http://localhost:3000/instituicoes?userId=${data['id']}`, {
      method: "GET",
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar instituições");
      }
      return response.json(); // pega o retorno do backend
    })
    .then(instituicoes => {
      console.log("Instituicoes encontradas:", data);
    // Se existir instituição -> página inicial
    if (instituicoes.length > 0) {
      window.location.href = "/front/paginainicial/paginaInicial.html";
    } else {
      // Se não existir -> irá cadastrar a primeira instituição, não vai para página inicial
      window.location.href = "/front/instituicao/cadastroInst.html";
    }
    })
    .catch(err => console.error(err));

  } catch (erro) {
    console.error("Erro ao verificar instituições:", erro);
    // alert("Erro ao verificar instituições do usuário.");
  }
})
}

function primeiraLetraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}
function validarCamposBasicos() {
  // email 
  if (email.value.trim() === "") {
    email.classList.add('is-invalid');
    document.getElementById('erroEmailVazio').classList.remove('d-none');
  } else {
    email.classList.remove('is-invalid');
    document.getElementById('erroEmailVazio').classList.add('d-none');
  }

    // Senha
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


