import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

@Injectable()
export class LoginRateLimitGuard implements CanActivate {
  private limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    keyGenerator: (req) => ipKeyGenerator(req.ip ?? 'unknown'),

    handler: () => {
      throw new HttpException(
        {
          statusCode: 429,
          message: 'Too many login attempts. Try again later.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    },
  });

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return new Promise((resolve, reject) => {
      this.limiter(req, res, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}
