function gate1(user, req) {
  if (!user) return "USER_NOT_FOUND";
  if (user.Account_Status !== "Active") return "ACCOUNT_INVALID";
  if (user.Aadhaar_Linked !== "TRUE") return "AADHAAR_NOT_LINKED";
  if (user.Scheme_Eligibility !== req.scheme) return "SCHEME_MISMATCH";
  if (parseInt(user.Scheme_Amount) !== parseInt(req.amount)) return "AMOUNT_MISMATCH";
  if (parseInt(user.Claim_Count) > 3) return "CLAIM_LIMIT_EXCEEDED";

  return "PASS";
}

function gate3(user) {
  const last = new Date(user.Last_Claim_Date);
  const now = new Date();

  const diff = (now - last) / (1000 * 60 * 60 * 24);

  if (diff < 30) return "FREQUENCY_VIOLATION";

  return "PASS";
}

module.exports = { gate1, gate3 };