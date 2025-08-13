import jwt from "jsonwebtoken";

// Make sure this secret matches the one used during login token generation
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Get the token part

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId  }; // Attach user info to request
    next(); // Pass control to the next handler
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
