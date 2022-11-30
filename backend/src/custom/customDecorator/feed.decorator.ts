import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom param decorator
const Feed = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const body = { ...ctx.switchToHttp().getRequest().body };
  delete body.memberIdList;
  return body;
});

export default Feed;
