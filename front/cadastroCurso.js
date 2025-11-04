// Lista de cursos
let cursos = ["Engenharia de Computação", "Administração"];

// Botão de adicionar curso
let botaoAdicionar = document.querySelector('.btn-outline-secondary.btn-sm');
botaoAdicionar.onclick = function() {
    let nomeCurso = document.getElementById('curso1').value;
    
    // Verificar se digitou algo
    if (nomeCurso == "") {
        alert("Digite o nome do curso!");
        return;
    }
    
    // Adicionar na lista
    cursos.push(nomeCurso);
    
    // Mostrar na tabela
    mostrarCursos();
    
    // Limpar o campo
    document.getElementById('curso1').value = "";
    
    alert("Curso adicionado!");
};

// Função para mostrar os cursos na tabela
function mostrarCursos() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = "";
    
    for (let i = 0; i < cursos.length; i++) {
        tbody.innerHTML += `
            <tr>
                <td>${cursos[i]}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="alert('Indo para disciplinas...')">
                        Cadastrar Disciplinas
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirCurso(${i})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }
}

// Função para excluir curso
function excluirCurso(posicao) {
    if (confirm("Quer mesmo excluir?")) {
        cursos.splice(posicao, 1);
        mostrarCursos();
    }
}

// Mostrar os cursos quando carregar a página
mostrarCursos();
