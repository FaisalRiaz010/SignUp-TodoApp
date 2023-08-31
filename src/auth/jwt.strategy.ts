/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Repository } from "typeorm";
import { User } from "typeorm/entities/User";
import { AuthService } from "./auth.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,) {
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExipration: false,
            secretOrKey: 'test' ,
            expiresIn: '15s',
        })
    }

    async validate(payload: any): Promise<User> {
        const user = await this.userRepository.findOne(payload.sub);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      }
}