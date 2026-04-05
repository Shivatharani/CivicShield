const crypto = require("crypto");

const SALT = "CIVICSHIELD_SECURE";

function hashCitizen(id) {
  return crypto.createHash("sha256").update(id + SALT).digest("hex");
}

module.exports = { hashCitizen };