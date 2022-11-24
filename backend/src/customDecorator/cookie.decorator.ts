import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// req와 controller 분리
const Cookie = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { cookies } = ctx.switchToHttp().getRequest();
  return cookies;
});

export default Cookie;
