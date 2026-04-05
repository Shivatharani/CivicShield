const fs = require("fs");
const crypto = require("crypto");

const FILE = "ledger.json";

function readLedger() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

function writeLedger(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function hashRecord(record) {
  return crypto.createHash("sha256")
    .update(record.Timestamp + record.CitizenHash + record.Scheme + record.Amount + record.PreviousHash)
    .digest("hex");
}

function addTransaction(tx) {
  let ledger = readLedger();

  const prevHash = ledger.length ? ledger[ledger.length - 1].CurrentHash : "0000000000000000";

  const record = {
    TransactionID: ledger.length + 1,
    Timestamp: new Date().toISOString(),
    ...tx,
    GatesPassed: ["Gate1", "Gate2", "Gate3"],
    PreviousHash: prevHash
  };

  record.CurrentHash = hashRecord(record);

  ledger.push(record);
  writeLedger(ledger);

  return record;
}

function verifyLedger() {
  let ledger = readLedger();

  for (let i = 0; i < ledger.length; i++) {
    const expected = hashRecord(ledger[i]);

    if (ledger[i].CurrentHash !== expected) {
      return { status: "TAMPERED", index: i };
    }
  }

  return { status: "SAFE" };
}

module.exports = { addTransaction, verifyLedger, readLedger };