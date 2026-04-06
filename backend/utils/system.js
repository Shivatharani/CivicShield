const fs = require("fs");

let status = "ACTIVE";
let freezeReason = null;
let budget = 1000000;

// ==========================
// 📝 LOG FREEZE
// ==========================
function logFreeze(reason) {
  let logs = [];

  if (fs.existsSync("freezeLog.json")) {
    logs = JSON.parse(fs.readFileSync("freezeLog.json"));
  }

  logs.push({
    reason,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync("freezeLog.json", JSON.stringify(logs, null, 2));
}

// ==========================
// 🔐 STATUS
// ==========================
function getStatus() {
  return status;
}

function setStatus(newStatus, reason = null) {
  status = newStatus;
  freezeReason = reason;

  if (
    newStatus === "FROZEN" ||
    newStatus === "PAUSED" ||
    newStatus === "BUDGET_EXHAUSTED"
  ) {
    logFreeze(reason);
  }

  console.log("SYSTEM:", status, "| Reason:", reason);
}

function getFreezeReason() {
  return freezeReason;
}

// ==========================
// 💰 BUDGET
// ==========================
function getBudget() {
  return budget;
}

function deductBudget(amount) {
  budget -= amount;

  if (budget === 0) {
    setStatus("BUDGET_EXHAUSTED", "BUDGET_EXHAUSTED");
  }
}

module.exports = {
  getStatus,
  setStatus,
  getFreezeReason,
  getBudget,
  deductBudget
};