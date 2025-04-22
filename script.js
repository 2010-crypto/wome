document.getElementById("submitButton").addEventListener("click", async function() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  
  if (!file) {
    alert("Por favor, escolha uma imagem para enviar.");
    return;
  }

  // Exibe um carregamento enquanto a imagem é processada
  document.getElementById("submitButton").disabled = true;
  document.getElementById("submitButton").textContent = "Processando...";

  const formData = new FormData();
  formData.append("image", file);

  try {
    // Envia a requisição para a API do DeepAI
    const response = await fetch('https://api.deepai.org/api/fast-style-transfer', {
      method: 'POST',
      headers: {
        'Api-Key': '4e94e435-1fd9-4352-adb2-b8ebde0ebd47',  // Substitua pela sua chave API
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao processar a imagem. Verifique sua conexão ou tente novamente.');
    }

    const result = await response.json();

    // Verifica se a resposta da API contém o link da imagem
    if (result.output_url) {
      document.getElementById("outputImage").src = result.output_url;
      document.getElementById("result").style.display = "block";  // Exibe a seção de resultados
    } else {
      throw new Error('Erro: A API não retornou a imagem processada.');
    }
  } catch (error) {
    // Exibe mensagem de erro caso a requisição falhe
    alert(error.message);
    console.error(error);
  } finally {
    // Restaura o botão de envio
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").textContent = "Enviar Imagem";
  }
});
