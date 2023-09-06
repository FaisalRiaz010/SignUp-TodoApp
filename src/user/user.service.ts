/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'typeorm/entities/User';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as speakeasy from 'speakeasy'; // Import the speakeasy library
import * as qrcode from 'qrcode';


@Injectable()
export class UserService {
  public getTokenData(email: string): { token: string; expiration: Date } | undefined {
    return this.tokenCache.get(email);
  }//make public to get TOken data from cache using email as a key
  private tokenCache: Map<string, { token: string; expiration: Date }> = new Map();//in-memory cache to store token in cache 

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
       
        
      ) {}
    //register user
      async createUserWith2FA(createUserDto: CreateUserDto): Promise<{ user: User; qrcodeDataUrl: string }> {
        const { username, password, email } = createUserDto;
    
        // Check if the user exists in the database
        const userInDb = await this.userRepository.findOne({
          where: { username },
        });
    
        if (userInDb) {
          throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
    
        // Generate a unique verification token
        const verificationToken = speakeasy.generateSecret().base32;
    
        // Generate a unique 2FA secret key which use for google authenticator
        const twoFactorSecret = speakeasy.generateSecret().base32;
    
        // Generate the full QR code URL for display
        const otpauthUrl = `otpauth://totp/${username}?secret=${twoFactorSecret}&issuer=signupApp`;
        // Generate the QR code image using the full URL with image 
        const qrcodeDataUrl = await qrcode.toDataURL(otpauthUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
        });
    
        // Create the user entity
        const user = this.userRepository.create({
          username,
          password,
          email,
          verificationToken,
          twoFactorSecret,
          
        });
    
        // Save the user entity
        await this.userRepository.save(user);
    
        return { user, qrcodeDataUrl };
      }
//function to verify user by token vs 2FA token
async verifyUserByTokens(verificationToken: string, codeFromGoogleAuthenticator: string): Promise<User> {
  // Find the user by the verification token
  const user = await this.userRepository.findOne({
    where: { verificationToken },
  });

  if (!user) {
    throw new NotFoundException('User not found or token expired.');
  }

  // Verify the code received from Google Authenticator
  const isCodeValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: codeFromGoogleAuthenticator,
  });

  if (!isCodeValid) {
    throw new UnauthorizedException('Invalid code from Google Authenticator.');
  }

  // Mark the user as verified (if needed)
  user.isVerified = true;
  await this.userRepository.save(user);

  return user;
}

     
   //login User
   async getUserByEmailAndPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email, password,isVerified:true } });
    
    console.log(user);
    return user || null;
  }
    
   //set token cache usng in auth service where reset password logic is presnt
    async storeResetPasswordToken(email: string, token: string,expiration: Date): Promise<void> {
      // Store the token and its expiration date in memory (tokenCache)
  console.log("cached token",token,expiration);
      this.tokenCache.set(email, { token, expiration });
    }
    
  
}
