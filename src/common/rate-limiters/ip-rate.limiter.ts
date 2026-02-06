import rateLimit from 'express-rate-limit';

export const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
});
