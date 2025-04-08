const form = document.getElementById('form');
const imageInput = document.getElementById('image-input');
const styleSelect = document.getElementById('style-select');
const resultImage = document.getElementById('result-image');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  const style = styleSelect.value;

  if (!file || !style) {
    alert('Por favor, envie uma imagem e escolha um estilo.');
    return;
  }

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64Image = reader.result.split(',')[1];

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': 'Token r8_VwlDcXGfrbOcFDlCrFUwk2y6cqIjqHw1OVHWw',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "db21e45a3c0e7c6e807e6dffb2159b20f47230b2f6b089f31c6d24a930eeb220",
          input: {
            image: `data:image/jpeg;base64,${base64Image}`,
            prompt: `interior de sala de estar com estilo ${style}`,
            a_prompt: "design de interiores bonito e limpo",
            n_prompt: "bagunça, baixa qualidade, borrado"
          }
        })
      });

      const json = await response.json();

      if (json.urls && json.urls.get) {
        const getUrl = json.urls.get;

        // Aguardar o processamento
        let generatedImage = null;
        while (!generatedImage) {
          const result = await fetch(getUrl, {
            headers: {
              'Authorization': 'Token r8_VwlDcXGfrbOcFDlCrFUwk2y6cqIjqHw1OVHWw'
            }
          });
          const resultData = await result.json();
          if (resultData.status === 'succeeded') {
            generatedImage = resultData.output[0];
          } else if (resultData.status === 'failed') {
            throw new Error('Erro ao processar a imagem.');
          } else {
            await new Promise(res => setTimeout(res, 2000)); // espera 2 segundos
          }
        }

        resultImage.src = generatedImage;
        resultImage.style.display = 'block';
      }
    } catch (error) {
      console.error('Erro ao integrar com a API:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    }
  };

  reader.readAsDataURL(file);
});
