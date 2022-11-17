import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

export default class AuthTokenMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // req.user = await this.verifyUser(req);
    return next();
  }

  private async verifyUser(req: Request) {}
}
