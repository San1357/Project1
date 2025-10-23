// server/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// enable CORS for all origins (dev only)
app.use(cors());
app.use(express.json());

// simple request logger so we see incoming calls in terminal
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.get('/predict', async (req, res) => {
  try {
    // try model on localhost:8000
    const r = await axios.get('http://localhost:8000/predict', { timeout: 2000 });
    return res.json({ source: 'model', result: r.data });
  } catch (err) {
    return res.json({ source: 'stub', result: { disease: 'demo-disease', confidence: 0.72 }});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));

