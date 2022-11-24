import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const Cookie = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { cookies } = ctx.switchToHttp().getRequest();
  return cookies;
});

export default Cookie;
