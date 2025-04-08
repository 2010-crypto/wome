const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const MODEL_ID = process.env.MODEL_ID;

app.post('/generate', async (req, res) => {
  const { image, style } = req.body;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: MODEL_ID,
        input: {
          image: `data:image/jpeg;base64,${image}`,
          prompt: `Transformar a decoração da sala para o estilo ${style}`
        }
      })
    });

    const data = await response.json();
    const predictionId = data.id;

    // Espera o resultado final
    let outputUrl = null;
    while (!outputUrl) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`
        }
      });

      const pollData = await pollResponse.json();
      if (pollData.output) {
        outputUrl = pollData.output[0];
      }
    }

    res.json({ output: outputUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao chamar a API da IA' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
