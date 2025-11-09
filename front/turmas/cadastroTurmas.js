// cadastroTurmas.js

// Array para armazenar as turmas
let turmas = [];
let inputTurma, btnAdicionar, tabelaBody, form;

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ JavaScript carregado!');
  
  // Seleciona elementos do DOM DEPOIS que carregou
  inputTurma = document.getElementById('turma');
  btnAdicionar = document.getElementById('btnAdicionar');
  tabelaBody = document.getElementById('tabelaTurmas');
  form = document.querySelector('form');
  
  // Verifica se os elementos foram encontrados
  if (!inputTurma || !btnAdicionar || !tabelaBody || !form) {
    console.error('❌ Erro: Elementos não encontrados!');
    return;
  }
  
  console.log('✅ Todos os elementos encontrados!');
  
  // Exibe o nome da disciplina
  const nomeDisciplina = localStorage.getItem('disciplinaSelecionada') || 'Não definida';
  document.getElementById('nomeDisciplinaTitulo').textContent = nomeDisciplina;
  
  // Adiciona evento ao botão "Adicionar Turma"
  btnAdicionar.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('🖱️ Botão clicado!');
    adicionarTurma();
  });
  
  // Adiciona evento ao formulário para prevenir submit padrão
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });
  
  // Permite adicionar turma pressionando Enter
  inputTurma.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarTurma();
    }
  });
  
  // Carrega as turmas salvas
  carregarTurmas();
});

// Função para adicionar turma
function adicionarTurma() {
  const nomeTurma = inputTurma.value.trim();
  
  console.log('➕ Tentando adicionar:', nomeTurma);
  
  // Validação
  if (nomeTurma === '') {
    alert('Por favor, informe o nome da turma!');
    return;
  }
  
  // Verifica se a turma já existe
  if (turmas.some(turma => turma.nome.toLowerCase() === nomeTurma.toLowerCase())) {
    alert('Esta turma já foi cadastrada!');
    return;
  }
  
  // Adiciona a turma ao array
  const novaTurma = {
    id: Date.now(),
    nome: nomeTurma
  };
  
  turmas.push(novaTurma);
  console.log('✅ Turma adicionada!', novaTurma);
  
  // Salva no localStorage
  salvarTurmas();
  
  // Atualiza a tabela
  renderizarTabela();
  
  // Limpa o campo de input
  inputTurma.value = '';
  inputTurma.focus();
}

// Função para renderizar a tabela
function renderizarTabela() {
  console.log('🔄 Renderizando', turmas.length, 'turmas');
  
  // Limpa o corpo da tabela
  tabelaBody.innerHTML = '';
  
  // Se não houver turmas, exibe mensagem
  if (turmas.length === 0) {
    tabelaBody.innerHTML = `
      <tr>
        <td colspan="2" class="text-muted">Nenhuma turma cadastrada ainda</td>
      </tr>
    `;
    return;
  }
  
  // Renderiza cada turma
  turmas.forEach(turma => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${turma.nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2" onclick="cadastrarAlunos(${turma.id})">
          Cadastrar Alunos
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTurma(${turma.id})">
          Excluir
        </button>
      </td>
    `;
    tabelaBody.appendChild(linha);
  });
}

// Função para excluir turma
function excluirTurma(id) {
  console.log('🗑️ Excluindo turma:', id);
  if (confirm('Tem certeza que deseja excluir esta turma?')) {
    turmas = turmas.filter(turma => turma.id !== id);
    salvarTurmas();
    renderizarTabela();
    console.log('✅ Turma excluída!');
  }
}

// Função para redirecionar para cadastro de alunos
function cadastrarAlunos(id) {
  const turma = turmas.find(t => t.id === id);
  if (turma) {
    localStorage.setItem('turmaSelecionada', turma.nome);
    localStorage.setItem('turmaId', turma.id);
    window.location.href = 'alunos.html';
  }
}

// Função para salvar turmas no localStorage
function salvarTurmas() {
  localStorage.setItem('turmas', JSON.stringify(turmas));
  console.log('💾 Turmas salvas no localStorage');
}

// Função para carregar turmas do localStorage
function carregarTurmas() {
  const turmasSalvas = localStorage.getItem('turmas');
  if (turmasSalvas) {
    turmas = JSON.parse(turmasSalvas);
    console.log('📂 Turmas carregadas:', turmas);
    renderizarTabela();
  }
}
