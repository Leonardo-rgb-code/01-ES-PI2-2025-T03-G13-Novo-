// cadastroDisciplina.js

// Array para armazenar as disciplinas cadastradas
let disciplinas = [];

// Contador para IDs únicos de disciplinas
let disciplinaIdCounter = 1;

// Elementos do DOM
const form = document.querySelector('form');
const nomeCursoTitulo = document.getElementById('nomeCursoTitulo');
const disciplinaInput = document.getElementById('disciplina1');
const siglaDisciInput = document.getElementById('siglaDisci');
const codigoDisciInput = document.getElementById('codigoDisci1');
const periodo1Radio = document.getElementById('periodo1');
const periodo2Radio = document.getElementById('periodo2');
const botaoAdicionarDisciplina = document.querySelector('button[name="botaoDisciplina"]');
const tabelaBody = document.querySelector('tbody');

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  carregarNomeCurso();
  carregarDisciplinas();
  configurarEventListeners();
});

// Carregar nome do curso (pode vir de localStorage ou URL params)
function carregarNomeCurso() {
  const nomeCurso = localStorage.getItem('nomeCurso') || 'Não especificado';
  nomeCursoTitulo.textContent = nomeCurso;
}

// Configurar todos os event listeners
function configurarEventListeners() {
  // Botão adicionar disciplina
  botaoAdicionarDisciplina.addEventListener('click', adicionarDisciplina);
  
  // Prevenir submit padrão do formulário
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    voltarPaginaInicial();
  });
}

// Adicionar nova disciplina
function adicionarDisciplina() {
  // Validar campos
  if (!validarCampos()) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return;
  }
  
  // Obter período selecionado
  const periodoSelecionado = periodo1Radio.checked ? '1º Semestre' : 
                             periodo2Radio.checked ? '2º Semestre' : null;
  
  if (!periodoSelecionado) {
    alert('Por favor, selecione um período!');
    return;
  }
  
  // Criar objeto disciplina
  const disciplina = {
    id: disciplinaIdCounter++,
    nome: disciplinaInput.value.trim(),
    sigla: siglaDisciInput.value.trim(),
    codigo: codigoDisciInput.value.trim(),
    periodo: periodoSelecionado,
    componentesNotas: [],
    turmas: []
  };
  
  // Adicionar ao array
  disciplinas.push(disciplina);
  
  // Salvar no localStorage
  salvarDisciplinas();
  
  // Atualizar tabela
  atualizarTabela();
  
  // Limpar campos
  limparCampos();
  
  // Feedback visual
  mostrarMensagemSucesso('Disciplina adicionada com sucesso!');
}

// Validar campos obrigatórios
function validarCampos() {
  return disciplinaInput.value.trim() !== '' &&
         siglaDisciInput.value.trim() !== '' &&
         codigoDisciInput.value.trim() !== '';
}

// Limpar campos do formulário
function limparCampos() {
  disciplinaInput.value = '';
  siglaDisciInput.value = '';
  codigoDisciInput.value = '';
  periodo1Radio.checked = false;
  periodo2Radio.checked = false;
}

// Atualizar tabela de disciplinas
function atualizarTabela() {
  // Limpar tbody
  tabelaBody.innerHTML = '';
  
  // Se não houver disciplinas, mostrar mensagem
  if (disciplinas.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="2" class="text-muted">Nenhuma disciplina cadastrada</td>
    `;
    tabelaBody.appendChild(tr);
    return;
  }
  
  // Adicionar cada disciplina na tabela
  disciplinas.forEach(disciplina => {
    const tr = document.createElement('tr');
    
    // Verificar se há componentes de notas cadastrados
    const temComponentesNotas = disciplina.componentesNotas && disciplina.componentesNotas.length > 0;
    
    tr.innerHTML = `
      <td>${disciplina.nome}</td>
      <td>
        <button type="button" class="btn btn-sm btn-primary me-2" onclick="cadastrarTurmas(${disciplina.id})">
          Cadastrar Turmas
        </button>
        <button type="button" class="btn btn-sm btn-primary me-2" onclick="cadastrarComponentesNotas(${disciplina.id})">
          Componentes de Notas
        </button>
        <button type="button" class="btn btn-sm btn-success me-2" 
                onclick="cadastrarNotaFinal(${disciplina.id})"
                ${!temComponentesNotas ? 'disabled' : ''}>
          Nota Final
        </button>
        <button type="button" class="btn btn-sm btn-danger" onclick="excluirDisciplina(${disciplina.id})">
          Excluir
        </button>
      </td>
    `;
    
    tabelaBody.appendChild(tr);
  });
}

// Excluir disciplina
function excluirDisciplina(id) {
  if (!confirm('Tem certeza que deseja excluir esta disciplina?')) {
    return;
  }
  
  // Remover do array
  disciplinas = disciplinas.filter(d => d.id !== id);
  
  // Salvar no localStorage
  salvarDisciplinas();
  
  // Atualizar tabela
  atualizarTabela();
  
  // Feedback visual
  mostrarMensagemSucesso('Disciplina excluída com sucesso!');
}

// Cadastrar turmas (redirecionar para página de turmas)
function cadastrarTurmas(id) {
  const disciplina = disciplinas.find(d => d.id === id);
  if (disciplina) {
    // Salvar disciplina selecionada no localStorage
    localStorage.setItem('disciplinaSelecionada', JSON.stringify(disciplina));
    // Redirecionar para página de cadastro de turmas
    window.location.href = 'cadastroTurmas.html';
  }
}

// Cadastrar componentes de notas (redirecionar para página de componentes)
function cadastrarComponentesNotas(id) {
  const disciplina = disciplinas.find(d => d.id === id);
  if (disciplina) {
    // Salvar disciplina selecionada no localStorage
    localStorage.setItem('disciplinaSelecionada', JSON.stringify(disciplina));
    // Redirecionar para página de cadastro de componentes de notas
    window.location.href = 'cadastroCompNotas.html';
  }
}

// Cadastrar nota final (redirecionar para página de notas)
function cadastrarNotaFinal(id) {
  const disciplina = disciplinas.find(d => d.id === id);
  if (disciplina) {
    // Verificar se há componentes de notas
    if (!disciplina.componentesNotas || disciplina.componentesNotas.length === 0) {
      alert('É necessário cadastrar componentes de notas antes de cadastrar a nota final!');
      return;
    }
    // Salvar disciplina selecionada no localStorage
    localStorage.setItem('disciplinaSelecionada', JSON.stringify(disciplina));
    // Redirecionar para página de cadastro de notas finais
    window.location.href = 'cadastroNotaFinal.html';
  }
}

// Salvar disciplinas no localStorage
function salvarDisciplinas() {
  localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
}

// Carregar disciplinas do localStorage
function carregarDisciplinas() {
  const disciplinasStorage = localStorage.getItem('disciplinas');
  if (disciplinasStorage) {
    disciplinas = JSON.parse(disciplinasStorage);
    // Atualizar contador de IDs
    if (disciplinas.length > 0) {
      disciplinaIdCounter = Math.max(...disciplinas.map(d => d.id)) + 1;
    }
  }
  atualizarTabela();
}

// Voltar para página inicial
function voltarPaginaInicial() {
  window.location.href = 'index.html';
}

// Mostrar mensagem de sucesso
function mostrarMensagemSucesso(mensagem) {
  // Criar elemento de alerta
  const alerta = document.createElement('div');
  alerta.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  alerta.style.zIndex = '9999';
  alerta.innerHTML = `
    ${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alerta);
  
  // Remover após 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

// Funções auxiliares para edição (opcional)
function editarDisciplina(id) {
  const disciplina = disciplinas.find(d => d.id === id);
  if (disciplina) {
    // Preencher campos com dados da disciplina
    disciplinaInput.value = disciplina.nome;
    siglaDisciInput.value = disciplina.sigla;
    codigoDisciInput.value = disciplina.codigo;
    
    if (disciplina.periodo === '1º Semestre') {
      periodo1Radio.checked = true;
    } else if (disciplina.periodo === '2º Semestre') {
      periodo2Radio.checked = true;
    }
    
    // Remover disciplina temporariamente (será re-adicionada ao clicar em adicionar)
    disciplinas = disciplinas.filter(d => d.id !== id);
    atualizarTabela();
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Exportar funções para uso global
window.excluirDisciplina = excluirDisciplina;
window.cadastrarTurmas = cadastrarTurmas;
window.cadastrarComponentesNotas = cadastrarComponentesNotas;
window.cadastrarNotaFinal = cadastrarNotaFinal;
window.editarDisciplina = editarDisciplina;
