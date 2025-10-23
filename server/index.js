const express = require('express');
const cors = require('cors');
const axios = require('axios'); // to call model service if needed

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// simple /predict that proxies to model microservice if available
app.get('/predict', async (req, res) => {
  try {
    // try calling model service local (port 8000)
    const r = await axios.get('http://localhost:8000/predict');
    return res.json({ source: 'model', result: r.data });
  } catch (e) {
    // fallback: return fixed demo prediction
    return res.json({ source: 'stub', result: { disease: 'demo-disease', confidence: 0.72 }});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
