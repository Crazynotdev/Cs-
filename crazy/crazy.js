const { default: makeWASocket } = require('@whiskeysockets/baileys');
const { saveSession } = require('./sessionStore');
const { wireEvents } = require('./events');
const { logEvent } = require('./log');

// Générer pairing code et init session
async function requestPairingCode(number) {
  // Crée le JID WhatsApp, ex: 241XXXXXX@s.whatsapp.net
  const jid = number.replace('+', '') + '@s.whatsapp.net';
  const sock = makeWASocket();
  // Nouvelle API Baileys: pairing code (méthode fictive si besoin)
  const code = await sock.requestPairingCode(jid);
  logEvent({ jid, action: 'pairing-code-generated', code });
  // Events (connexion/messages)
  wireEvents(sock, jid);
  return { code, jid };
}

// Ex pour "connexion": stockage session JSON (trigger automatique)
function startSession(jid, sessionObj) {
  saveSession(jid, sessionObj);
  logEvent({ jid, action: 'session-saved' });
}

module.exports = { requestPairingCode, startSession };
