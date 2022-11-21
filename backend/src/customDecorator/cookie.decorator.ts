import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const cookies = ctx.switchToHttp().getRequest().cookies;
    return cookies;
  },
);
