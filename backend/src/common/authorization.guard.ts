import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import UsersService from 'src/users/users.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    // TODO : 로그인을 하지 않았다는 error
    if (user === undefined)
      throw new HttpException('로그인을 하지 않은 유저입니다.', 401);
    const result = await this.validateUser(user);
    return result;
  }

  async validateUser(user): Promise<boolean> {
    const { id, nickname } = user;
    const findUser = await this.usersService.getUser({ nickname });

    const { id: findUserId } = findUser;
    console.log(id, findUserId);
    if (id === findUserId) return true;
    throw new HttpException('해당 피드에 대한 권한이 없습니다.', 401);
  }
}
