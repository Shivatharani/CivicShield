let status = "ACTIVE";
let budget = 1000000;

let freezeReason = null;

// ==========================
// STATUS
// ==========================
function getStatus() {
  return status;
}

function setStatus(newStatus, reason = null) {
  status = newStatus;
  freezeReason = reason;

  if (newStatus === "FROZEN") {
    logFreeze(reason); // ✅ ADD THIS
  }

  console.log(
    `SYSTEM STATUS → ${newStatus} | Reason: ${reason}`
  );
}


function getFreezeReason() {
  return freezeReason;
}

// ==========================
// BUDGET
// ==========================
function getBudget() {
  return budget;
}

function deductBudget(amount) {
  budget -= amount;

  // 💰 AUTO FREEZE ON ZERO
  if (budget === 0) {
    setStatus("FROZEN", "BUDGET_EXHAUSTED");
  }
}

function resetSystem() {
  status = "ACTIVE";
  freezeReason = null;
  budget = 1000000;
}


const fs = require("fs");

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

module.exports = {
  getStatus,
  setStatus,
  getFreezeReason,
  getBudget,
  deductBudget,
  resetSystem
};