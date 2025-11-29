const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'data/logs.json');

function logEvent(obj) {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  }
  logs.push({ ...obj, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function getLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
}

module.exports = { logEvent, getLogs };
