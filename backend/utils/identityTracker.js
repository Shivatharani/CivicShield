let activeQueue = [];     // active requests
let requestHistory = [];  // past requests

// 🚫 Duplicate concurrent request
function checkDuplicate(hash) {
  if (activeQueue.includes(hash)) {
    return "DUPLICATE_REJECTED";
  }

  activeQueue.push(hash);
  return "PASS";
}

// 🔁 Replay detection (10 min)
function checkReplay(hash, scheme, amount) {
  const now = Date.now();

  const found = requestHistory.find(r =>
    r.hash === hash &&
    r.scheme === scheme &&
    r.amount === amount &&
    (now - r.time) < 10 * 60 * 1000
  );

  if (found) return "REPLAY_DETECTED";

  requestHistory.push({
    hash,
    scheme,
    amount,
    time: now
  });

  return "PASS";
}

// 🧹 Remove from queue
function removeFromQueue(hash) {
  activeQueue = activeQueue.filter(h => h !== hash);
}

module.exports = {
  checkDuplicate,
  checkReplay,
  removeFromQueue
};