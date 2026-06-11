import rateLimit from "express-rate-limit";

// Custom handler to return standardized JSON message
const limitHandler = (req, res, next, options) => {
  res.status(429).json({
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
};

// General rate limiter for all API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: limitHandler,
});

// Stricter rate limiter for authentication endpoints (register, login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});
