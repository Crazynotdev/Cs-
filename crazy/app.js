const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use('/sessions', express.static(path.join(__dirname, 'data/sessions')));

// Sécurité : rate limit API pairing
const pairingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1mn
  max: 5,
  message: 'Trop de requêtes, réessayez plus tard.',
});
app.use('/api/pairing', pairingLimiter);

app.get('/', (req, res) => res.send('crazy-mini backend API 🟢'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`crazy-mini backend running on port ${PORT}`);
});
