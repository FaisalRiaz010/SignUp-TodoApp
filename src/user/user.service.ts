/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'typeorm/entities/User';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as speakeasy from 'speakeasy'; // Import the speakeasy library

@Injectable()
export class UserService {
  public getTokenData(email: string): { token: string; expiration: Date } | undefined {
    return this.tokenCache.get(email);
    }
  private tokenCache: Map<string, { token: string; expiration: Date }> = new Map();
 
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        
      ) {}
    
     // Function to create a user with 2FA support
  async createUserWith2FA(createUserDto: CreateUserDto): Promise<User> {
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

    // Generate a unique 2FA secret key
    const twoFactorSecret = speakeasy.generateSecret().base32;

    const user = this.userRepository.create({
      username,
      password,
      email,
      verificationToken,
      twoFactorSecret, // Store the 2FA secret key in the database
    });

    // Save the user to the database
    await this.userRepository.save(user);

    return user;
  }
//function to verify user by token vs 2FA token
async getVerifiedUser(token:string,token2FA:string):Promise<User>{
  const user=await this.userRepository.findOne({
    where:{
      verificationToken:token,
      twoFactorSecret:token2FA
    }
  })
  user.isVerified = true;
  return this.userRepository.save(user);
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
