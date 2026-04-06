const fs = require("fs");

function generateFraudReport(logs, users, ledger) {
  const reasons = {};
  logs.forEach(l => {
    reasons[l.reason] = (reasons[l.reason] || 0) + 1;
  });

  const topReason = Object.keys(reasons).reduce((a, b) =>
    reasons[a] > reasons[b] ? a : b, "NONE"
  );

  const topUsers = [...users]
    .sort((a, b) => b.Claim_Count - a.Claim_Count)
    .slice(0, 3);

  const regionSpend = {};
  ledger.forEach(tx => {
    regionSpend[tx.Region_Code] =
      (regionSpend[tx.Region_Code] || 0) + parseInt(tx.Amount);
  });

  const report = {
    timestamp: new Date().toISOString(),
    mostCommonRejection: topReason,
    topCitizens: topUsers,
    budgetByRegion: regionSpend
  };

  fs.writeFileSync("fraudReport.json", JSON.stringify(report, null, 2));

  return report;
}

module.exports = { generateFraudReport };