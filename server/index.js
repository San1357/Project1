const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// simple logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// In-memory stores (MVP)
const users = []; // { id, email, passwordHash }
const records = []; // { id, userId, input, result, createdAt }

// secret for JWT (in prod store in env)
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret123';

// helpers
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// signup
app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 8);
  const user = { id: String(Date.now()), email, passwordHash: hash };
  users.push(user);
  const token = generateToken(user);
  return res.json({ token, user: { id: user.id, email: user.email } });
});

// login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid creds' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid creds' });
  const token = generateToken(user);
  return res.json({ token, user: { id: user.id, email: user.email } });
});

// predict (uses model if up, else stub)
app.post('/predict', authMiddleware, async (req, res) => {
  try {
    // Example: accept input in body (e.g., { features: {...} } or file url)
    const input = req.body.input || {};
    // try model
    const r = await axios.post((process.env.MODEL_URL || 'http://127.0.0.1:8000') + '/predict', { input }, { timeout: 3000 })
      .then(resp => ({ source: 'model', result: resp.data }))
      .catch(() => ({ source: 'stub', result: { disease: 'demo-disease', confidence: 0.72 }}));

    // save into records
    const rec = { id: String(Date.now()), userId: req.user.id, input, result: r.result, source: r.source, createdAt: new Date().toISOString() };
    records.push(rec);
    return res.json({ record: rec });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'predict error' });
  }
});

// get user's records
app.get('/records', authMiddleware, (req, res) => {
  const userRecords = records.filter(r => r.userId === req.user.id);
  res.json({ records: userRecords });
});

// simple admin (not protected) to view all users/records (for demo only)
app.get('/admin/data', (req, res) => {
  res.json({ users: users.map(u => ({ id: u.id, email: u.email })), records });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
