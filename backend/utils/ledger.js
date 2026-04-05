const fs = require("fs");
const crypto = require("crypto");

const FILE = "ledger.json";

// ==========================
// 🔐 HASH FUNCTION
// ==========================
function createHash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// ==========================
// 📖 READ LEDGER
// ==========================
function readLedger() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// ==========================
// 💾 WRITE LEDGER
// ==========================
function writeLedger(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ==========================
// ➕ ADD TRANSACTION
// ==========================
function addTransaction(txData) {
  const ledger = readLedger();

  const TransactionID = ledger.length + 1;
  const Timestamp = new Date().toISOString();

  const PreviousHash =
    ledger.length === 0
      ? "0000000000000000"
      : ledger[ledger.length - 1].CurrentHash;

  const baseString =
    Timestamp +
    txData.CitizenHash +
    txData.Scheme +
    txData.Amount +
    PreviousHash;

  const CurrentHash = createHash(baseString);

  const record = {
    TransactionID,
    Timestamp,
    CitizenHash: txData.CitizenHash,
    Scheme: txData.Scheme,
    Amount: txData.Amount,
    Region_Code: txData.Region_Code,
    Income_Tier: txData.Income_Tier,
    GatesPassed: ["Gate1", "Gate2", "Gate3"],
    PreviousHash,
    CurrentHash
  };

  ledger.push(record);
  writeLedger(ledger);

  // 🔍 Run integrity check after every insert
  const check = verifyLedger();

  if (check.status === "TAMPERED") {
    return {
      status: "LEDGER_TAMPERED",
      error: check
    };
  }

  return record;
}

// ==========================
// 🔍 VERIFY LEDGER
// ==========================
function verifyLedger() {
  const ledger = readLedger();

  for (let i = 0; i < ledger.length; i++) {
    const current = ledger[i];

    const expectedPrev =
      i === 0 ? "0000000000000000" : ledger[i - 1].CurrentHash;

    if (current.PreviousHash !== expectedPrev) {
      return {
        status: "TAMPERED",
        index: i,
        storedPrev: current.PreviousHash,
        expectedPrev
      };
    }

    const recomputedHash = createHash(
      current.Timestamp +
      current.CitizenHash +
      current.Scheme +
      current.Amount +
      current.PreviousHash
    );

    if (current.CurrentHash !== recomputedHash) {
      return {
        status: "TAMPERED",
        index: i,
        storedHash: current.CurrentHash,
        expectedHash: recomputedHash
      };
    }
  }

  return { status: "OK" };
}

module.exports = {
  addTransaction,
  verifyLedger,
  readLedger
};