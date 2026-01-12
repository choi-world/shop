import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;

    console.log('[REQUEST]', {
      method,
      url: originalUrl,
      query,
      body,
    });

    next();
  }
}
