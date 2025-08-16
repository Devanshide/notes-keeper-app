const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Get token after "Bearer"

  // Ensure JWT secret exists
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing" });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach user ID to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = authMiddleware;
