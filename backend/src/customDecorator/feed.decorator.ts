import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Feed = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const body = { ...ctx.switchToHttp().getRequest().body };
    delete body.userId;
    delete body.memberIdList;
    return body;
  },
);
