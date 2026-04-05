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
app.post("/apply", (req, res) => {
  if (system.getStatus() !== "ACTIVE") {
    return res.json({ status: "SYSTEM_FROZEN" });
  }

  const { id, scheme, amount } = req.body;

  const hash = hashCitizen(id);

  // Duplicate check
  if (requestLog.some(r => r.hash === hash)) {
    return res.json({ status: "DUPLICATE_REJECTED" });
  }

  // Replay
  const replay = checkReplay(hash, scheme, amount);
  if (replay !== "PASS") return res.json({ status: replay });

  const user = users.find(u => u.Citizen_ID === id);

  // Gate1
  const g1 = gate1(user, req.body);
  if (g1 !== "PASS") return res.json({ status: g1 });

  // Gate2
  const g2 = system.checkBudget(parseInt(amount));
  if (g2 !== "PASS") return res.json({ status: g2 });

  // Gate3
  const g3 = gate3(user);
  if (g3 !== "PASS") return res.json({ status: g3 });

  // Update runtime registry
  user.Last_Claim_Date = new Date().toISOString();
  user.Claim_Count = parseInt(user.Claim_Count) + 1;

  // Deduct budget
  system.deductBudget(parseInt(amount));

  // Ledger
  const tx = addTransaction({
    CitizenHash: hash,
    Scheme: scheme,
    Amount: amount,
    Region_Code: user.Region_Code,
    Income_Tier: user.Income_Tier
  });

  // Integrity check
  const check = verifyLedger();
  if (check.status === "TAMPERED") {
    system.setStatus("FROZEN");
  }

  res.json({ status: "SUCCESS", tx });
});

// Admin APIs
app.get("/dashboard", (req, res) => {
  res.json({
    status: system.getStatus(),
    budget: system.getBudget(),
    transactions: readLedger().slice(-10)
  });
});

app.post("/pause", (req, res) => {
  system.setStatus("PAUSED");
  res.json({ status: "PAUSED" });
});

app.post("/resume", (req, res) => {
  if (system.getStatus() === "PAUSED") {
    system.setStatus("ACTIVE");
  }
  res.json({ status: system.getStatus() });
});

app.listen(5000, () => console.log("Server running"));