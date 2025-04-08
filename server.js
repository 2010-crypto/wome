// server.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const Replicate = require('replicate');
const fs = require('fs');

dotenv.config(); // Carrega a chave do .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public')); // pasta com index.html, style.css, script.js

// Configura multer para receber imagens
const upload = multer({ dest: 'uploads/' });

// Inicializa Replicate com sua API Key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Rota de upload e requisição para IA
app.post('/generate', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const style = req.body.style || 'modern';

    const model = 'stability-ai/sdxl';
    const version = process.env.MODEL_ID;

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    const output = await replicate.run(`${model}:${version}`, {
      input: {
        prompt: `A ${style} living room design based on this image`,
        image: imageDataUrl,
      },
    });

    // Limpa imagem após uso
    fs.unlinkSync(imagePath);

    res.json({ image: output });
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    res.status(500).json({ error: 'Erro na geração de imagem' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
