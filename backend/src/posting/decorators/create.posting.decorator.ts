import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreatePostingDto } from '../dto/create.posting.dto';

// custom param decorator
const CreatePosting = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    const encryptedFeedId = request.params.feedId;
    const createPostingReq = request.body;

    const createPostingDto = new CreatePostingDto(
      user,
      encryptedFeedId,
      createPostingReq,
    );

    return {
      createPostingDto,
      imageList: createPostingReq.images,
    };
  },
);

export default CreatePosting;
