const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const { hashCitizen } = require("./utils/hash");
const { gate1, gate3 } = require("./utils/gates");
const { addTransaction, verifyLedger, readLedger } = require("./utils/ledger");
const system = require("./utils/system");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let requestLog = [];

// Load CSV
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", row => users.push(row))
  .on("end", () => console.log("Dataset Loaded"));

// Replay detection
function checkReplay(hash, scheme, amount) {
  const now = Date.now();

  const found = requestLog.find(r =>
    r.hash === hash &&
    r.scheme === scheme &&
    r.amount === amount &&
    (now - r.time) < 600000
  );

  if (found) return "REPLAY_DETECTED";

  requestLog.push({ hash, scheme, amount, time: now });
  return "PASS";
}

// MAIN API
const { logRejection } = require("./utils/logger");

app.post("/apply", (req, res) => {
  // 🚫 SYSTEM LOCK CHECK
  if (system.getStatus() !== "ACTIVE") {
    return res.json({ status: "SYSTEM_FROZEN" });
  }

  const { id, scheme, amount } = req.body;
  const hash = hashCitizen(id);
  const user = users.find(u => u.Citizen_ID === id);

  // ======================
  // 🔐 GATE 1
  // ======================
  const g1 = gate1(user, req.body);

  if (g1.status !== "PASS") {
    logRejection({
      citizenHash: hash,
      gate: 1,
      reason: g1.reason
    });

    return res.json({ status: g1.status });
  }

  // ======================
  // 💰 GATE 2 (CHECK ONLY)
  // ======================
  const amountInt = parseInt(amount);

  if (system.getBudget() - amountInt < 0) {
    logRejection({
      citizenHash: hash,
      gate: 2,
      reason: "BUDGET_INSUFFICIENT"
    });

    return res.json({ status: "BUDGET_INSUFFICIENT" });
  }

  // ======================
  // ⏱️ GATE 3
  // ======================
  const g3 = gate3(user);

  if (g3.status !== "PASS") {
    logRejection({
      citizenHash: hash,
      gate: 3,
      reason: "FREQUENCY_VIOLATION",
      extra: ` | Last_Claim_Date: ${g3.lastDate} | Gap: ${g3.gap} days`
    });

    return res.json({ status: g3.status });
  }

  // ======================
  // ✅ FINAL APPROVAL
  // ======================

  // Deduct ONLY after all gates pass
  system.deductBudget(amountInt);

  // Auto-lock when budget = 0
  if (system.getBudget() === 0) {
    system.setStatus("BUDGET_EXHAUSTED");
  }

  // Update runtime registry
  user.Last_Claim_Date = new Date().toISOString();
  user.Claim_Count = parseInt(user.Claim_Count) + 1;

  // Ledger entry
  const tx = addTransaction({
    CitizenHash: hash,
    Scheme: scheme,
    Amount: amount,
    Region_Code: user.Region_Code,
    Income_Tier: user.Income_Tier
  });

  res.json({ status: "SUCCESS", tx });
});
const { getLogs } = require("./utils/logger");
app.get("/analytics", (req, res) => {
  const logs = getLogs();

  const fraudStats = {
    totalRejections: logs.length,
    gate1: logs.filter(l => l.gate === 1).length,
    gate2: logs.filter(l => l.gate === 2).length,
    gate3: logs.filter(l => l.gate === 3).length
  };

  res.json({
    logs,
    fraudStats
  });
});
app.get("/tamper", (req, res) => {
  const result = verifyLedger();

  if (result.status === "TAMPERED") {
    system.setStatus("FROZEN");
  }

  res.json(result);
});