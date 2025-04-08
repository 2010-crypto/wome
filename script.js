document.getElementById('photoForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const file = document.getElementById('photoInput').files[0];
  const style = document.getElementById('styleSelect').value;

  if (!file || !style) return;

  const reader = new FileReader();
  reader.onloadend = async () => {
    const imageBase64 = reader.result.split(',')[1];

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, style })
      });

      const data = await response.json();
      if (data.output) {
        document.getElementById('result').innerHTML = `<img src="${data.output}" alt="Imagem transformada" />`;
      } else {
        document.getElementById('result').innerText = 'Erro ao gerar imagem';
      }
    } catch (error) {
      console.error('Erro ao integrar com a API:', error);
    }
  };

  reader.readAsDataURL(file);
});
