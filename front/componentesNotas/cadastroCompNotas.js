// Array para armazenar os componentes cadastrados
let componentes = [];

// Todos os event listeners estão DENTRO do DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  carregarComponentes();
  carregarNomeDisciplina();
  inicializarEventos();
});

// Função para inicializar todos os eventos
function inicializarEventos() {
  // Evento do botão Adicionar
  const btnAdicionar = document.getElementById('btnAdicionar');
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', function() {
      const nomeComponente = document.getElementById('componenteNota').value.trim();
      const siglaComponente = document.getElementById('siglaCompNota').value.trim();
      const descricaoComponente = document.getElementById('descricaoNota').value.trim();

      // Validação dos campos
      if (!nomeComponente || !siglaComponente || !descricaoComponente) {
        alert('Por favor, preencha todos os campos!');
        return;
      }

      // Criar objeto do componente
      const novoComponente = {
        id: Date.now(),
        nome: nomeComponente,
        sigla: siglaComponente,
        descricao: descricaoComponente
      };

      // Adicionar ao array
      componentes.push(novoComponente);

      // Salvar no localStorage
      salvarComponentes();

      // Adicionar na tabela
      adicionarLinhaTabela(novoComponente);

      // Limpar os campos
      limparCampos();

      // Feedback visual
      mostrarMensagem('Componente adicionado com sucesso!', 'success');
    });
  }

  // Evento do botão Página Inicial
  const btnPaginaInicial = document.getElementById('btnPaginaInicial');
  if (btnPaginaInicial) {
    btnPaginaInicial.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Evento do formulário (prevenir submit)
  const form = document.getElementById('formComponentes');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
    });
  }
}

// Função para carregar nome da disciplina
function carregarNomeDisciplina() {
  const urlParams = new URLSearchParams(window.location.search);
  const disciplina = urlParams.get('disciplina') || localStorage.getItem('disciplinaAtual') || 'Não especificada';
  const elemento = document.getElementById('nomeDisciplinaTitulo');
  if (elemento) {
    elemento.textContent = disciplina;
  }
}

// Função para adicionar linha na tabela
function adicionarLinhaTabela(componente) {
  const tbody = document.getElementById('tabelaComponentes');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.id = 'linha-' + componente.id;

  tr.innerHTML = `
    <td>${componente.nome}</td>
    <td>${componente.sigla}</td>
    <td>${componente.descricao}</td>
    <td>
      <button type="button" class="btn btn-sm btn-danger" onclick="excluirComponente(${componente.id})">
        Excluir
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

// Função para excluir componente
function excluirComponente(id) {
  if (!confirm('Deseja realmente excluir este componente?')) {
    return;
  }

  // Remover do array
  componentes = componentes.filter(comp => comp.id !== id);

  // Salvar no localStorage
  salvarComponentes();

  // Remover da tabela
  const linha = document.getElementById('linha-' + id);
  if (linha) {
    linha.remove();
  }

  // Feedback visual
  mostrarMensagem('Componente excluído com sucesso!', 'danger');
}

// Função para limpar os campos do formulário
function limparCampos() {
  const campoNome = document.getElementById('componenteNota');
  const campoSigla = document.getElementById('siglaCompNota');
  const campoDescricao = document.getElementById('descricaoNota');

  if (campoNome) campoNome.value = '';
  if (campoSigla) campoSigla.value = '';
  if (campoDescricao) campoDescricao.value = '';
  if (campoNome) campoNome.focus();
}

// Função para salvar componentes no localStorage
function salvarComponentes() {
  localStorage.setItem('componentesNotas', JSON.stringify(componentes));
}

// Função para carregar componentes do localStorage
function carregarComponentes() {
  const componentesSalvos = localStorage.getItem('componentesNotas');
  
  if (componentesSalvos) {
    componentes = JSON.parse(componentesSalvos);
    
    const tbody = document.getElementById('tabelaComponentes');
    if (tbody) {
      tbody.innerHTML = '';
      
      componentes.forEach(componente => {
        adicionarLinhaTabela(componente);
      });
    }
  }
}

// Função para mostrar mensagens de feedback
function mostrarMensagem(texto, tipo) {
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alerta.style.zIndex = '9999';
  alerta.style.minWidth = '300px';
  alerta.innerHTML = `
    ${texto}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
