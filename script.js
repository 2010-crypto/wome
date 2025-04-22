document.getElementById('upload-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('image');
  const style = document.getElementById('style').value;

  if (!fileInput.files[0]) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    fetch('https://api.deepai.org/api/fast-style-transfer', {
      method: 'POST',
      headers: {
        'api-key': 'ae5b44b4-5046-42ec-801e-dad13915fd65',  // sua API key aqui
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const output = document.getElementById('output');
      if (data.output_url) {
        output.innerHTML = `<h3>Resultado:</h3><img src="${data.output_url}" alt="Imagem gerada" style="max-width: 100%; border-radius: 10px;" />`;
      } else {
        output.innerHTML = `<p>Não foi possível gerar a imagem. Tente novamente.</p>`;
      }
    })
    .catch(error => {
      console.error('Erro ao integrar com a API:', error);
      alert("Erro ao processar imagem. Verifique sua conexão ou tente novamente.");
    });
  };

  reader.readAsDataURL(fileInput.files[0]);
});
