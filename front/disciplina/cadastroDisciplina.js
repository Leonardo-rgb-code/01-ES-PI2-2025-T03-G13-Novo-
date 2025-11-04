// Lista de disciplinas
let disciplinas = [
    {
        nome: "Projeto Integrador II",
        sigla: "PI2",
        codigo: "ENG001",
        periodo: "1º Semestre"
    },
    {
        nome: "Engenharia e Elicitação de Requisitos",
        sigla: "EER",
        codigo: "ENG002",
        periodo: "2º Semestre"
    }
];

// Botão de adicionar disciplina
let botaoAdicionar = document.querySelector('.btn-outline-secondary.btn-sm');
botaoAdicionar.onclick = function() {
    // Pegar os valores dos campos
    let nome = document.getElementById('disciplina1').value;
    let sigla = document.getElementById('siglaDisci').value;
    let codigo = document.getElementById('codigoDisci1').value;
    
    // Pegar qual período foi selecionado
    let periodo = "";
    if (document.getElementById('periodo1').checked) {
        periodo = "1º Semestre";
    } else if (document.getElementById('periodo2').checked) {
        periodo = "2º Semestre";
    }
    
    // Verificar se preencheu tudo
    if (nome == "" || sigla == "" || codigo == "" || periodo == "") {
        alert("Preencha todos os campos!");
        return;
    }
    
    // Criar nova disciplina
    let novaDisciplina = {
        nome: nome,
        sigla: sigla,
        codigo: codigo,
        periodo: periodo
    };
    
    // Adicionar na lista
    disciplinas.push(novaDisciplina);
    
    // Mostrar na tabela
    mostrarDisciplinas();
    
    // Limpar os campos
    document.getElementById('disciplina1').value = "";
    document.getElementById('siglaDisci').value = "";
    document.getElementById('codigoDisci1').value = "";
    document.getElementById('periodo1').checked = false;
    document.getElementById('periodo2').checked = false;
    
    alert("Disciplina adicionada!");
};

// Função para mostrar as disciplinas na tabela
function mostrarDisciplinas() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = "";
    
    for (let i = 0; i < disciplinas.length; i++) {
        tbody.innerHTML += `
            <tr>
                <td>${disciplinas[i].nome}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="alert('Cadastrar turmas...')">
                        Cadastrar Turmas
                    </button>
                    <button class="btn btn-sm btn-primary me-2" onclick="alert('Componentes de notas...')">
                        Componentes de Notas
                    </button>
                    <button class="btn btn-sm btn-success me-2" onclick="alert('Nota final...')">
                        Nota Final
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirDisciplina(${i})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }
}

// Função para excluir disciplina
function excluirDisciplina(posicao) {
    if (confirm("Quer mesmo excluir esta disciplina?")) {
        disciplinas.splice(posicao, 1);
        mostrarDisciplinas();
        alert("Disciplina excluída!");
    }
}

// Botão de voltar para página inicial
document.querySelector('button[type="submit"]').onclick = function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
};

// Mostrar as disciplinas quando carregar a página
mostrarDisciplinas();

// Colocar o nome do curso no título (se vier da página anterior)
let cursoSelecionado = localStorage.getItem('cursoSelecionado');
if (cursoSelecionado) {
    document.getElementById('nomeCursoTitulo').textContent = cursoSelecionado;
} else {
    document.getElementById('nomeCursoTitulo').textContent = "Engenharia de Computação";
}

const usuario = localStorage.getItem("usuarioLogado");
console.log(usuario)

if (!usuario) {
  // usuário não está logado → redireciona para login
  window.location.href = "../login/login.html";
}