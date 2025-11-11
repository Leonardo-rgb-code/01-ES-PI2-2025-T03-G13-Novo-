// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // Seleciona o formulário e a tabela
  const form = document.querySelector('form');
  const tableBody = document.querySelector('tbody');
  
  
  // Event Delegation para botões "Acessar" 
  tableBody.addEventListener('click', function(event) {
    // Verifica se o clique foi em um botão
    if (event.target.classList.contains('btn-warning')) {
      
      // Pega a linha (tr) pai do botão clicado
      const row = event.target.closest('tr');
      
      // Extrai os dados da linha
      const disciplina = row.cells[0].textContent;
      const turma = row.cells[1].textContent;
      
      // Log dos dados (para teste)
      console.log(`Acessando: ${disciplina} - ${turma}`);
      
      // Aqui você pode redirecionar para outra página ou abrir modal
      // Exemplo de redirecionamento:
      // window.location.href = `media-final.html?disciplina=${encodeURIComponent(disciplina)}&turma=${encodeURIComponent(turma)}`;
      
      // Exemplo de alerta (remova em produção):
      alert(`Acessando média final de:\nDisciplina: ${disciplina}\nTurma: ${turma}`);
    }
  });
  
  
  // ===== Previne submissão do formulário e redireciona para página inicial =====
  form.addEventListener('submit', function(event) {
    // Previne o comportamento padrão do formulário
    event.preventDefault();
    
    console.log('Redirecionando para página inicial...');
    
    // Redireciona para a página inicial
    // window.location.href = 'index.html';
    
    // Exemplo de alerta (remova em produção):
    alert('Redirecionando para a Página Inicial');
  });
  
});
