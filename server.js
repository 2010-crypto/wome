const express = require('express');
const cors = require('cors'); // Importa o CORS
const fetch = require('node-fetch'); // Caso precise usar fetch no servidor
const app = express();

// Habilita CORS para todas as origens
app.use(cors());

// Ou, se você quiser permitir apenas o domínio do seu GitHub Pages:
// app.use(cors({ origin: 'https://2010-crypto.github.io' }));

app.use(express.json());  // Para permitir o corpo da requisição como JSON

// Definindo a chave da API e o Model ID
const apiKey = process.env.REPLICATE_API_KEY;
const modelId = process.env.REPLICATE_MODEL_ID;

// Rota para gerar a imagem com o estilo
app.post('/predictions', async (req, res) => {
  const { image, style } = req.body;
  
  // Verificar se os dados necessários foram enviados
  if (!image || !style) {
    return res.status(400).json({ error: 'Imagem ou estilo não fornecido' });
  }

  try {
    // Aqui você iria integrar com a API da Replicate
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: modelId,
        input: {
          image: image,
          style: style
        }
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ output_url: data.output_url });  // Retorna a URL da imagem gerada
    } else {
      return res.status(500).json({ error: data.error || 'Erro ao gerar imagem' });
    }
  } catch (error) {
    console.error('Erro ao integrar com a API:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
  }
});

// Porta onde o servidor irá rodar
app.listen(10000, () => {
  console.log('Servidor rodando na porta 10000');
});
