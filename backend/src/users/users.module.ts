import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Users from 'src/entities/Users';
import UsersService from './users.service';
import UsersController from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
})
export default class UsersModule {}
