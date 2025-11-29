const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(__dirname, 'data/sessions');

function saveSession(jid, session) {
  if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  fs.writeFileSync(path.join(SESSIONS_DIR, `${jid}.json`), JSON.stringify(session, null, 2));
}

function getSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) return [];
  return fs.readdirSync(SESSIONS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({
      jid: f.replace('.json',''),
      session: JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, f), 'utf8'))
    }));
}

module.exports = { saveSession, getSessions };
