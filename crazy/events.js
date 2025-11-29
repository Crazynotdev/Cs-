const { handleCommand } = require('./commands/handler');
const { logEvent } = require('./log');

// Brancher les events importants Baileys
function wireEvents(sock, jid) {
  sock.ev.on('connection.update', update => {
    if (update.connected) logEvent({ jid, action: 'bot-connected' });
    if (update.qr) logEvent({ jid, action: 'qr-generated', qr: update.qr });
    if (update.disconnectReason) logEvent({ jid, action: 'disconnect', reason: update.disconnectReason });
  });

  sock.ev.on('messages.upsert', async m => {
    for (const msg of m.messages || []) {
      if (!msg.message) continue;
      const text = msg.message.conversation || '';
      const response = handleCommand(text);
      if (response) {
        await sock.sendMessage(msg.key.remoteJid, { text: response });
        logEvent({ jid, action: 'cmd-handled', text, response });
      } else {
        logEvent({ jid, action: 'msg-received', text });
      }
    }
  });
}

module.exports = { wireEvents };
