import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from '@root/authentication/authentication.service';
import TypeOrmCustomModule from '@root/common/typeorm/typeorm.module';
import { InvalidNickname } from '@root/custom/customValidators/nicknameValidate';
import { OauthModule } from '@root/oauth/oauth.module';
import UsersController from '@users/users.controller';
import UserFacade from '@users/users.facade';
import UsersService from '@users/users.service';
import { UserRepository } from '@users/users.repository';

@Module({
  imports: [
    OauthModule,
    TypeOrmCustomModule.forCustomRepository([UserRepository]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserFacade,
    AuthenticationService,
    JwtService,
    InvalidNickname,
  ],
  exports: [UsersService],
})
export default class UsersModule {}
