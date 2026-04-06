require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");

// ==========================
// IMPORTS
// ==========================
const User = require("./models/User");

const { generateToken, verifyToken, requireRole } = require("./utils/jwt");
const { verifyGoogleToken } = require("./utils/googleAuth");

const { hashCitizen } = require("./utils/hash");
const { gate1, gate3 } = require("./utils/gates");
const { addTransaction, verifyLedger, readLedger } = require("./utils/ledger");
const { logRejection, getLogs } = require("./utils/logger");

const { sendWebhook } = require("./utils/webhook");
const { generateFraudReport } = require("./utils/fraudReport");

const system = require("./utils/system");

// ==========================
// INIT
// ==========================
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let requestLog = [];

// ==========================
// DB CONNECT
// ==========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));
// ==========================
// LOAD DATASET
// ==========================
fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", row => users.push(row))
  .on("end", () => console.log("Dataset Loaded"));

// ==========================
// AUTH APIs
// ==========================

// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ username, password: hashed, role });

  res.json({ status: "USER_CREATED" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ error: "Invalid" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).json({ error: "Invalid" });

  const token = generateToken(user);
  res.json({ token, role: user.role });
});

// GOOGLE LOGIN
app.post("/google-login", async (req, res) => {
  const { credential, role } = req.body;

  try {
    const userData = await verifyGoogleToken(credential);

    const token = generateToken({
      username: userData.email,
      role: role || "VIEWER"
    });

    res.json({ token, role: role || "VIEWER" });

  } catch {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// ==========================
// REPLAY CHECK
// ==========================
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

// ==========================
// FREEZE SYSTEM + WEBHOOK
// ==========================
function freezeSystem(reason) {
  system.setStatus("FROZEN", reason);

  const ledger = readLedger();
  const lastHash = ledger.length
    ? ledger[ledger.length - 1].CurrentHash
    : "GENESIS";

  sendWebhook({
    reason,
    timestamp: new Date().toISOString(),
    lastValidHash: lastHash,
    budgetRemaining: system.getBudget()
  });
}

// ==========================
// APPLY API
// ==========================
app.post("/apply", verifyToken, requireRole("OPERATOR"), (req, res) => {

  if (system.getStatus() !== "ACTIVE") {
    return res.json({
      status: "SYSTEM_FROZEN",
      reason: system.getFreezeReason()
    });
  }

  const { id, scheme, amount } = req.body;
  const citizenHash = hashCitizen(id);

  const user = users.find(
    u => hashCitizen(u.Citizen_ID) === citizenHash
  );

  const replay = checkReplay(citizenHash, scheme, amount);
  if (replay !== "PASS") {
    logRejection({ citizenHash, gate: "PRE", reason: replay });
    return res.json({ status: replay });
  }

  const g1 = gate1(user, req.body);
  if (g1.status !== "PASS") {
    logRejection({ citizenHash, gate: 1, reason: g1.reason });
    return res.json({ status: g1.status });
  }

  const amountInt = parseInt(amount);

  if (system.getBudget() - amountInt < 0) {
    freezeSystem("BUDGET_EXHAUSTED");
    return res.json({
      status: "SYSTEM_FROZEN",
      reason: "BUDGET_EXHAUSTED"
    });
  }

  const g3 = gate3(user);
  if (g3.status !== "PASS") {
    logRejection({ citizenHash, gate: 3, reason: "FREQUENCY_VIOLATION" });
    return res.json({ status: g3.status });
  }

  // APPROVED
  system.deductBudget(amountInt);

  user.Last_Claim_Date = new Date().toISOString();
  user.Claim_Count = parseInt(user.Claim_Count) + 1;

  const tx = addTransaction({
    CitizenHash: citizenHash,
    Scheme: scheme,
    Amount: amount,
    Region_Code: user.Region_Code,
    Income_Tier: user.Income_Tier
  });

  // LEDGER CHECK
  const verify = verifyLedger();

  if (verify.status === "TAMPERED") {
    freezeSystem("LEDGER_TAMPERED");

    return res.json({
      status: "SYSTEM_FROZEN",
      reason: "LEDGER_TAMPERED"
    });
  }

  // FRAUD REPORT (every 10 tx)
  const logs = getLogs();
  const ledger = readLedger();

  if ((logs.length + ledger.length) % 10 === 0) {
    generateFraudReport(logs, users, ledger);
  }

  res.json({ status: "SUCCESS", tx });
});

// ==========================
// DASHBOARD
// ==========================
app.get("/dashboard", verifyToken, (req, res) => {

  const logs = getLogs();
  const ledger = readLedger();

  const approved = ledger.length;
  const rejected = logs.length;
  const total = approved + rejected;

  const approvalRate =
    total === 0 ? 0 : ((approved / total) * 100).toFixed(2);

  const last10 = [...ledger.slice(-10)].reverse();

  res.json({
    systemStatus: system.getStatus(),
    freezeReason: system.getFreezeReason(),
    budget: system.getBudget(),
    totalTransactions: total,
    approvalRate,
    last10,
    registry: users
  });
});

// ==========================
// ADMIN CONTROL
// ==========================
app.post("/admin/pause", verifyToken, requireRole("OPERATOR"), (req, res) => {
  system.setStatus("PAUSED", "ADMIN_PAUSED");
  res.json({ status: "PAUSED" });
});

app.post("/admin/unpause", verifyToken, requireRole("OPERATOR"), (req, res) => {
  system.setStatus("ACTIVE", null);
  res.json({ status: "RESUMED" });
});

// ==========================
// TAMPER CHECK
// ==========================
app.get("/tamper", verifyToken, (req, res) => {
  const result = verifyLedger();

  if (result.status === "TAMPERED") {
    freezeSystem("LEDGER_TAMPERED");
  }

  res.json(result);
});

// ==========================
// TAMPER REPORT DOWNLOAD
// ==========================
app.get("/tamper-report", verifyToken, requireRole("OPERATOR"), (req, res) => {
  const result = verifyLedger();

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tamper_report.json"
  );

  res.json(result);
});

// ==========================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});