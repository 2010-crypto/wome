require('dotenv').config();  // Carregar variáveis do .env

const axios = require('axios');

// Obter a chave da API do arquivo .env
const apiKey = process.env.REPLICATE_API_KEY;
const modelId = 'r8_MF4Pae99TS7zxlhgkXFU5fwrRMC0qb20UXzOq';  // Novo Model ID da Replicate

// Função para gerar a imagem com a API
async function gerarImagem() {
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: modelId,
        input: {
          // Parâmetros de entrada para o modelo
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Resposta da API:', response.data);
  } catch (error) {
    console.error('Erro ao chamar a API:', error);
  }
}

// Chama a função para gerar a imagem
gerarImagem();
