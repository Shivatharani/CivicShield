const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = { generateToken, verifyToken, requireRole };