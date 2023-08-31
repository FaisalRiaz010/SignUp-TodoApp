/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'typeorm/entities/User';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';



@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
  ],
     
    controllers: [UsersController],
    providers: [UserService,EmailService,AuthService,JwtService],
    exports:[UsersModule,TypeOrmModule,UserService]
  })
  export class UsersModule {
    
  }
  