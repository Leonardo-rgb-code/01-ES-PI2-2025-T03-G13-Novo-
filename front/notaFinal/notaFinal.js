
  // Aguarda o carregamento completo do DOM
  document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o formulário
    const form = document.querySelector('form');
    
    // Adiciona evento de submit ao formulário
    form.addEventListener('submit', function(event) {
      // Previne o envio padrão do formulário
      event.preventDefault();
      
      // Obtém todos os radio buttons com name="media"
      const radioButtons = document.getElementsByName('media');
      let mediaSelecionada = null;
      
      // Verifica qual radio button está selecionado
      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          mediaSelecionada = radioButtons[i].value;
          break;
        }
      }
      
      // Validação: verifica se alguma opção foi selecionada
      if (!mediaSelecionada) {
        alert('Por favor, selecione o tipo de média desejada.');
        return;
      }
      
      // Aqui você pode processar os dados
      console.log('Tipo de média selecionada:', mediaSelecionada);
      
      // Exemplo: exibir mensagem de sucesso
      alert('Fórmula cadastrada com sucesso! Tipo: ' + 
            (mediaSelecionada === 'media7' ? 'Média Ponderada' : 'Média Aritmética'));
      
      // Redirecionar para página inicial (opcional)
      // window.location.href = 'index.html';
    });
    
    // Opcional: Preencher o nome do curso dinamicamente
    const nomeCursoTitulo = document.getElementById('nomeCursoTitulo');
    if (nomeCursoTitulo) {
      // Você pode buscar o nome do curso de localStorage, URL params, etc.
      nomeCursoTitulo.textContent = 'Matemática Aplicada';
    }
  });

