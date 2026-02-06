import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class UserRateLimitGuard implements CanActivate {
  private limiter = rateLimit({
    windowMs: 60_000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: any) => {
      return `user:${req.user.userId}`;
    },
    handler: (_req, res) => {
      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
      });
    },
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return new Promise((resolve, reject) => {
      this.limiter(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
