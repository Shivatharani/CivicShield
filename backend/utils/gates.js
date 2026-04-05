function gate1(user, req) {
  if (!user) {
    return {
      status: "USER_NOT_FOUND",
      reason: "Citizen_ID = NOT_FOUND"
    };
  }

  if (user.Account_Status !== "Active") {
    return {
      status: "ACCOUNT_INVALID",
      reason: `Account_Status = ${user.Account_Status}`
    };
  }

  if (user.Aadhaar_Linked !== "TRUE") {
    return {
      status: "AADHAAR_NOT_LINKED",
      reason: `Aadhaar_Linked = ${user.Aadhaar_Linked}`
    };
  }

  if (user.Scheme_Eligibility !== req.scheme) {
    return {
      status: "SCHEME_MISMATCH",
      reason: `Scheme_Eligibility = ${user.Scheme_Eligibility}`
    };
  }

  if (parseInt(user.Scheme_Amount) !== parseInt(req.amount)) {
    return {
      status: "AMOUNT_MISMATCH",
      reason: `Scheme_Amount = ${user.Scheme_Amount}`
    };
  }

  if (parseInt(user.Claim_Count) > 3) {
    return {
      status: "CLAIM_LIMIT_EXCEEDED",
      reason: `Claim_Count = ${user.Claim_Count}`
    };
  }

  return { status: "PASS" };
}

// Gate 3
function gate3(user) {
  const last = new Date(user.Last_Claim_Date);
  const now = new Date();

  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return {
      status: "FREQUENCY_VIOLATION",
      lastDate: user.Last_Claim_Date,
      gap: diffDays
    };
  }

  return { status: "PASS" };
}

module.exports = { gate1, gate3 };