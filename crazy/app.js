const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');

const app = express();

// Sécurité + logging
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// Routes API
app.use('/api', routes);

// Sessions statiques
app.use('/sessions', express.static(path.join(__dirname, 'data/sessions')));

// Pages statiques (ne sert pas sur /)
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Sécurité : rate limit API pairing
const pairingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1mn
  max: 5,
  message: 'Trop de requêtes, réessayez plus tard.',
});
app.use('/api/pairing', pairingLimiter);

// Route racine simple (ne renvoie pas la page HTML)
//****app.get('/', (req, res) => res.send('crazy-mini backend API 🟢'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`crazy-mini backend running on port ${PORT}`);
});
