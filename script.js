document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('image');
  const style = document.getElementById('style').value;
  const output = document.getElementById('output');

  if (!fileInput.files[0]) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  // Simula processamento e mostra imagem de exemplo
  output.innerHTML = `<h3>Processando imagem com estilo: ${style}</h3>`;
  
  setTimeout(() => {
    output.innerHTML = `
      <h3>Resultado:</h3>
      <img src="https://via.placeholder.com/500x300.png?text=Imagem+Transformada+(${style})" alt="Imagem gerada"/>
    `;
  }, 2000);
});
