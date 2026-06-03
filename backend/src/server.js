const express = require('express');
const axios = require('axios');
const cors = require('cors');

console.log('INICIANDO SERVIDOR...');

const app = express();
app.use(cors());
app.use(express.json());

// KEYS
const SECRET_KEY_V2 = '6LcO4J4sAAAAAJe6S-QT8J6eqAEuIvL2R46608wM';
const SECRET_KEY_V3 = '6LdJZ7ksAAAAADQPscnNI11P3nXPYG0VNMVeCR_x';

app.post('/api/validate-recaptcha', async (req, res) => {

  const { token_v2, token_v3 } = req.body;

  console.log('TOKEN V2:', token_v2);
  console.log('TOKEN V3:', token_v3);

  // validação básica
  if (!token_v2 || !token_v3) {
    return res.status(400).json({
      success: false,
      message: 'Tokens ausentes'
    });
  }

  try {

    // VALIDAR V2
    const responseV2 = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: SECRET_KEY_V2,
        response: token_v2
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // VALIDAR V3
    const responseV3 = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: SECRET_KEY_V3,
        response: token_v3
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('RESPOSTA V2:', responseV2.data);
    console.log('RESPOSTA V3:', responseV3.data);

    // VALIDAÇÃO FINAL
    if (
      responseV2.data.success &&
      responseV3.data.success &&
      responseV3.data.score > 0.5
    ) {
      return res.json({
        success: true,
        message: 'Captcha validado com sucesso'
      });
    }

    // FALHA
    return res.status(400).json({
      success: false,
      message: 'Falha na validação',
      v2: responseV2.data,
      v3: responseV3.data
    });

  } catch (error) {
    console.error('ERRO:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro interno'
    });
  }
});

const server = app.listen(8000, () => {
  console.log('Servidor rodando em http://localhost:8000');
});

server.on('error', (err) => {
  console.error('ERRO SERVIDOR:', err);
});