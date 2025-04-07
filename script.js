// Sua chave da API da Clarifai
const apiKey = 'ac31b81152c548e286320e106d664ff5';
const modelID = '2pssi5q5x24t'; // ID do modelo Clarifai

// Exibir a seção de upload de foto após o envio do e-mail
document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('user-email').value;
    if (email) {
        document.getElementById('email-section').style.display = 'none';
        document.getElementById('photo-upload-section').style.display = 'block';
    }
});

// Função para visualizar a imagem carregada
function previewImage() {
    const file = document.getElementById('imageInput').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const resultImage = document.getElementById('result-image');
            resultImage.src = e.target.result; // Exibe a imagem no "result-image"
            document.getElementById('photo-upload-section').style.display = 'none';
            document.getElementById('style-selection-section').style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

// Função para aplicar o estilo selecionado (simulação)
function simulateStyle() {
    const selectedStyle = document.getElementById('style-select').value;
    let newImageUrl = '';

    if (selectedStyle === 'classic') {
        newImageUrl = 'https://via.placeholder.com/500x300/ffcc00/ffffff?text=Estilo+Cl%C3%A1ssico';
    } else if (selectedStyle === 'modern') {
        newImageUrl = 'https://via.placeholder.com/500x300/00ccff/ffffff?text=Estilo+Moderno';
    } else if (selectedStyle === 'vintage') {
        newImageUrl = 'https://via.placeholder.com/500x300/ff66cc/ffffff?text=Estilo+Vintage';
    }

    // Exemplo de chamada para API de IA (aqui, substitua com a API de sua escolha)
    applyAIStyle(newImageUrl, selectedStyle);  // Aqui, enviamos a imagem e o estilo selecionado para a API
}

// Função para enviar a imagem e estilo para a API
function applyAIStyle(imageUrl, style) {
    // Formatação da URL da imagem para enviar à API (exemplo de integração com Clarifai)
    const formData = new FormData();
    formData.append('image', imageUrl); // Aqui, você deve enviar a imagem da forma como você capturou
    formData.append('style', style);

    // Fazendo a requisição para a API (exemplo com a API da Clarifai)
    fetch('https://api.clarifai.com/v2/models/' + modelID + '/outputs', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Manipular a resposta da API aqui
        console.log(data);
        document.getElementById('final-result').src = data.outputs[0].data.image.url; // Ajuste de acordo com a resposta da API
        document.getElementById('style-selection-section').style.display = 'none';
        document.getElementById('result-section').style.display = 'block';
    })
    .catch(error => console.error('Erro ao integrar com a API:', error));
}
