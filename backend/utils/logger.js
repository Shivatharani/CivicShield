const fs = require("fs");

const LOG_FILE = "logs.json";

function logRejection({ citizenHash, gate, reason, extra = "" }) {
  const entry = {
    type: "REJECTED",
    citizenHash,
    gate,
    reason,
    extra,
    timestamp: new Date().toISOString()
  };

  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE));
  }

  logs.push(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

  console.log(entry);
}

function getLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE));
}

module.exports = { logRejection, getLogs };