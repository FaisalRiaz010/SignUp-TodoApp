/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
    constructor()
{
    super({
        clientID: '740820697567-tlt7ssvtj4b7mon815e2ii28km5hhe41.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: 'http://localhost:5000/auth/google/callback',
        scope: ['email', 'profile'],

    })


}
async validate(accessToken: string, refreshToken: string, profile: any, done:VerifyCallback) {
    // Check if the user already exists in your database by Google ID
    
    
done(null,profile)
 }

}

