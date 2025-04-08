// Carregando as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importando as dependências
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

// Criando a aplicação Express
const app = express();
const port = process.env.PORT || 3000;

// Servindo arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para a integração com a API da Replicate
app.post('/api/prediction', async (req, res) => {
    const imageData = req.body.image; // imagem enviada pelo usuário

    // Chave de API da Replicate, obtida do arquivo .env
    const apiKey = process.env.REPLICATE_API_KEY;

    try {
        // Fazendo a requisição para a API da Replicate
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,  // Usando a chave da variável de ambiente
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: 'r8_MF4Pae99TS7zxlhgkXFU5fwrRMC0qb20UXzOq', // Substitua pelo seu model_id da Replicate
                input: {
                    image: imageData,
                }
            })
        });

        const data = await response.json();

        // Enviar a resposta da API para o frontend
        res.json(data);
    } catch (error) {
        console.error('Erro ao integrar com a API:', error);
        res.status(500).json({ error: 'Erro ao processar a imagem' });
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
