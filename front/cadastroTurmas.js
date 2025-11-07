// Lista simples para guardar as turmas
let turmas = [];

// Pegue elementos pelo ID
const nomeTurmaInput = document.getElementById('turma');
const adicionarBtn = document.querySelector('.btn-outline-secondary.btn-sm');
const tabelaCorpo = document.querySelector('tbody');

// Função para mostrar as turmas na tabela
function atualizarTabela() {
  tabelaCorpo.innerHTML = '';
  turmas.forEach(function(t, idx) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${t.nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2">Cadastrar Alunos</button>
        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTurma(${idx})">Excluir</button>
      </td>`;
    tabelaCorpo.appendChild(linha);
  });
}

// Função para adicionar turma
adicionarBtn.addEventListener('click', function() {
  const nomeTurma = nomeTurmaInput.value.trim();
  if (nomeTurma === "") {
    alert('Preencha o nome da turma');
    return;
  }
  turmas.push({nome: nomeTurma});
  nomeTurmaInput.value = "";
  atualizarTabela();
});

// Função para excluir turma (precisa ser global para funcionar no onclick)
window.excluirTurma = function(idx) {
  turmas.splice(idx, 1);
  atualizarTabela();
};

// Inicializa a tabela vazia
document.addEventListener('DOMContentLoaded', atualizarTabela);
//.