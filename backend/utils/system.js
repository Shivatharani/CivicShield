let budget = 1000000;
let status = "ACTIVE"; // ACTIVE, PAUSED, FROZEN, BUDGET_EXHAUSTED

function checkBudget(amount) {
  if (budget - amount < 0) return "BUDGET_INSUFFICIENT";
  return "PASS";
}

function deductBudget(amount) {
  budget -= amount;
  if (budget === 0) status = "BUDGET_EXHAUSTED";
}

function getStatus() {
  return status;
}

function setStatus(newStatus) {
  status = newStatus;
}

function getBudget() {
  return budget;
}

module.exports = { checkBudget, deductBudget, getStatus, setStatus, getBudget };