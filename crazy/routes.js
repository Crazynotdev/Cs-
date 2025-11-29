const express = require('express');
const { requestPairingCode, startSession } = require('./crazy');
const { saveSession, getSessions } = require('./sessionStore');
const { logEvent, getLogs } = require('./log');
const router = express.Router();

// [POST] Générer pairing code
router.post('/pairing', async (req, res) => {
  const { number } = req.body;
  if (!number || !/^\+\d{8,16}$/.test(number)) {
    return res.status(400).json({ error: 'Numéro WhatsApp non valide.' });
  }
  try {
    const { code, jid } = await requestPairingCode(number);
    logEvent({ jid, action: 'pairing-requested', number });
    res.json({ code, jid });
  } catch (err) {
    logEvent({ action: 'pairing-error', error: err.message });
    res.status(500).json({ error: "Erreur de génération du code." });
  }
});

// [POST] Enregistrer session (auto lors pairing)
router.post('/session', (req, res) => {
  const { jid, session } = req.body;
  if (!jid || !session) {
    return res.status(400).json({ error: 'Session/JID manquants.' });
  }
  saveSession(jid, session);
  logEvent({ jid, action: 'session-saved' });
  res.json({ success: true });
});

// [GET] Liste sessions
router.get('/admin/sessions', (req, res) => {
  const sessions = getSessions();
  res.json(sessions);
});

// [GET] Logs plateforme
router.get('/admin/logs', (req, res) => {
  const logs = getLogs();
  res.json(logs);
});

module.exports = router;
