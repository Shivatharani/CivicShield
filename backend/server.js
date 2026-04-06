const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const { hashCitizen } = require("./utils/hash");
const { gate1, gate3 } = require("./utils/gates");
const { addTransaction, verifyLedger } = require("./utils/ledger");
const system = require("./utils/system");
const { logRejection, getLogs } = require("./utils/logger");
const { readLedger } = require("./utils/ledger");

const {
  checkDuplicate,
  checkReplay,
  removeFromQueue
} = require("./utils/identityTracker");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];

// ==========================
// 📂 LOAD DATASET
// ==========================
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", row => users.push(row))
  .on("end", () => console.log("Dataset Loaded"));

// ==========================
// 🚀 APPLY API
// ==========================
app.post("/apply", (req, res) => {

  setTimeout(() => { // 🔥 delay for duplicate demo

    if (system.getStatus() !== "ACTIVE") {
      return res.json({
        status: "SYSTEM_FROZEN",
        reason: system.getFreezeReason()
      });
    }

    const { id, scheme, amount } = req.body;

    // 🔐 COMPONENT 1: HASH
    const citizenHash = hashCitizen(id);

    // 🚫 DUPLICATE CHECK
    const dup = checkDuplicate(citizenHash);
    if (dup !== "PASS") {
      logRejection({ citizenHash, gate: "PRE", reason: "DUPLICATE_REJECTED" });

      return res.json({
        status: "DUPLICATE_REJECTED",
        message: "Duplicate request detected"
      });
    }

    // 🔁 REPLAY CHECK
    const replay = checkReplay(citizenHash, scheme, amount);
    if (replay !== "PASS") {
      removeFromQueue(citizenHash);

      logRejection({ citizenHash, gate: "PRE", reason: "REPLAY_DETECTED" });

      return res.json({
        status: "REPLAY_DETECTED",
        message: "Replay attack detected"
      });
    }

    // 🔍 FIND USER
    const user = users.find(
      u => hashCitizen(u.Citizen_ID) === citizenHash
    );

    // ======================
    // 🟢 GATE 1
    // ======================
    const g1 = gate1(user, req.body);

    if (g1.status !== "PASS") {
      logRejection({ citizenHash, gate: 1, reason: g1.reason });

      removeFromQueue(citizenHash);
      return res.json({ status: g1.status });
    }

    // ======================
    // 💰 GATE 2
    // ======================
    const amountInt = parseInt(amount);

    if (system.getBudget() - amountInt < 0) {
      logRejection({
        citizenHash,
        gate: 2,
        reason: "BUDGET_INSUFFICIENT"
      });

      removeFromQueue(citizenHash);
      return res.json({ status: "BUDGET_INSUFFICIENT" });
    }

    // ======================
    // ⏱️ GATE 3
    // ======================
    const g3 = gate3(user);

    if (g3.status !== "PASS") {
      logRejection({
        citizenHash,
        gate: 3,
        reason: "FREQUENCY_VIOLATION"
      });

      removeFromQueue(citizenHash);
      return res.json({ status: g3.status });
    }

    // ======================
    // 🔗 COMPONENT 3: LEDGER
    // ======================
    system.deductBudget(amountInt);

    if (system.getBudget() === 0) {
      system.setStatus("BUDGET_EXHAUSTED");
    }

    user.Last_Claim_Date = new Date().toISOString();
    user.Claim_Count = parseInt(user.Claim_Count) + 1;

    const txResult = addTransaction({
      CitizenHash: citizenHash,
      Scheme: scheme,
      Amount: amount,
      Region_Code: user.Region_Code,
      Income_Tier: user.Income_Tier
    });

    // 🚨 TAMPER DETECT
    if (txResult.status === "LEDGER_TAMPERED") {
      system.setStatus("FROZEN", "LEDGER_TAMPERED");

      removeFromQueue(citizenHash);

      return res.json({
        status: "SYSTEM_FROZEN",
        reason: "LEDGER_TAMPERED",
        error: txResult.error
      });
    }

    removeFromQueue(citizenHash);

    res.json({
      status: "SUCCESS",
      tx: txResult
    });

  }, 2000); // delay
});

// 🛑 ADMIN PAUSE
app.post("/admin/pause", (req, res) => {
  system.setStatus("FROZEN", "ADMIN_PAUSED");

  res.json({
    status: "SYSTEM_FROZEN",
    reason: "ADMIN_PAUSED"
  });
});

// ▶️ ADMIN UNPAUSE
app.post("/admin/unpause", (req, res) => {
  if (system.getFreezeReason() !== "ADMIN_PAUSED") {
    return res.json({
      status: "FAILED",
      message: "Only ADMIN_PAUSED can be resumed"
    });
  }

  system.setStatus("ACTIVE", null);

  res.json({
    status: "SYSTEM_RESUMED"
  });
});

app.get("/dashboard", (req, res) => {
  const logs = getLogs();         // rejected
  const ledger = readLedger();    // approved

  const approved = ledger.length;
  const rejected = logs.length;

  const totalTransactions = approved + rejected;

  const approvalRate =
    totalTransactions === 0
      ? 0
      : ((approved / totalTransactions) * 100).toFixed(2);

  // ✅ APPROVED TRANSACTIONS
  const approvedTx = ledger.slice(-10).map(tx => ({
    CitizenHash: tx.CitizenHash.slice(0, 8),
    Scheme: tx.Scheme,
    Amount: tx.Amount,
    Region_Code: tx.Region_Code,
    status: "APPROVED",
    gate: "Gate3"
  }));

  // ✅ REJECTED TRANSACTIONS
  const rejectedTx = logs.slice(-10).map(log => ({
    CitizenHash: log.citizenHash.slice(0, 8),
    Scheme: "-",
    Amount: "-",
    Region_Code: "-",
    status: "REJECTED",
    gate: log.gate
  }));

  // ✅ COMBINE LAST 10
  const last10 = [...approvedTx, ...rejectedTx]
    .slice(-10)
    .reverse();

  res.json({
    systemStatus: system.getStatus(),
    freezeReason: system.getFreezeReason(),
    budget: system.getBudget(),
    totalTransactions,
    approvalRate,
    last10,
    registry: users
  });
});

// ==========================
// 📊 ANALYTICS
// ==========================
app.get("/analytics", (req, res) => {
  const logs = getLogs();

  const fraudStats = {
    total: logs.length,
    gate1: logs.filter(l => l.gate === 1).length,
    gate2: logs.filter(l => l.gate === 2).length,
    gate3: logs.filter(l => l.gate === 3).length
  };

  res.json({
    logs,
    fraudStats,
    systemStatus: system.getStatus(),        // ✅ ADD THIS
    freezeReason: system.getFreezeReason()   // ✅ ADD THIS
  });
});

// ==========================
// 🔐 TAMPER CHECK
// ==========================
app.get("/tamper", (req, res) => {
  const result = verifyLedger();

  if (result.status === "TAMPERED") {
    system.setStatus("FROZEN", "LEDGER_TAMPERED");
  }

  res.json(result);
});

app.get("/tamper-report", (req, res) => {
  const result = verifyLedger();

  if (result.status !== "TAMPERED") {
    return res.json({ message: "No tampering detected" });
  }

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tamper_report.json"
  );

  res.json(result);
});

// ==========================
// 🚀 START SERVER
// ==========================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});