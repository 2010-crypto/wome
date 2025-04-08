const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static('public'));

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
const MODEL_ID = "r8_MF4Pae99TS7zxlhgkXFU5fwrRMC0qb20UXzOq"; // O seu model ID da Replicate

app.post('/predictions', async (req, res) => {
  const { image, style } = req.body;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: MODEL_ID,
      input: { image, style },
    }),
  });

  const data = await response.json();
  
  if (data && data.output_url) {
    res.json({ output_url: data.output_url });
  } else {
    res.status(500).json({ error: 'Não foi possível gerar a imagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
