/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./google.startegy";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { UserService } from "src/user/user.service";
import { UsersModule } from "src/user/user.module";
import { EmailService } from "src/email/email.service";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: 'test',
            signOptions: {expiresIn: '360s'}
        }),
       
    ],
    providers: [AuthService, GoogleStrategy,JwtStrategy,UserService,EmailService],
    exports: [AuthService],
    controllers:[AuthController]
})
export class AuthModule {}
