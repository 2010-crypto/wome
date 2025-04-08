document.getElementById('photoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById('photoInput');
  const style = document.getElementById('styleSelect').value;

  if (!fileInput.files[0]) {
    alert("Por favor, selecione uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    fetch('https://wome-1.onrender.com/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: reader.result,
        style: style
      })
    })
      .then(response => response.json())
      .then(data => {
        const output = document.getElementById('result');
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
