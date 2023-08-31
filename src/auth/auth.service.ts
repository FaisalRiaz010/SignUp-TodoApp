/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { User } from "typeorm/entities/User";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/email/email.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private tokenCache: Map<string, { token: string; expiration: Date }> = new Map()
  ) {}

  // Login function
  async loginuser(email: string, password: string): Promise<User | null> {
    console.log('Attempting login for email:', email);
    const user = await this.usersService.getUserByEmailAndPassword(email, password);
    console.log('User found:', user); // Check the user object
    return user || null;
  }

  // Login and token
  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Reset Password
  async resetPassword(email: string, password: string): Promise<void> {
    try {
      console.log("working");

      // Check if the user exists in the database
      const user = await this.userRepository.findOne({ where: { email, password,isVerified:true } });
      console.log(user);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate a unique reset token
      const resetToken = speakeasy.generateSecret().base32;

      // Store the token and its expiration date in memory (tokenCache)
      this.usersService.storeResetPasswordToken(email, resetToken);
      this.userRepository.save(user);

      // Send the verification email
      const emailTemplate = `
        <p>Thank you for registering with our SignUp service. Please click the link below to verify your email address:</p>
        <a href="http://localhost:5000/api#/default/AuthController_verifyaccount/${resetToken}" Put this token in Feild>Verify Email</a>
      ` + `OR ${resetToken} copy token from here And put in your swagger field `;
      
      // Use EmailService to send the password reset email
      await this.emailService.sendPasswordResetEmail(email, emailTemplate);

      // Return the reset token to be used for verification
      console.log("reset", resetToken);

    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Verify token reset
  async verifyToken(emailToken: string, username: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (emailToken) {
      console.log(emailToken);
      user.password = newPassword;
      this.userRepository.save(user);
    }
  }

  // Forget Password
  async forgetPassword(email: string): Promise<void> {
    try {
      console.log("working");

      // Check if the user exists in the database
      const user = await this.userRepository.findOne({ where: { email } });
      console.log(user);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate a unique reset token
      const resetToken = speakeasy.generateSecret().base32;

      // Store the token and its expiration date in memory (tokenCache)
      this.usersService.storeResetPasswordToken(email, resetToken);
      this.userRepository.save(user);

      // Send the verification email
      const emailTemplate = `
        <p>. Please click the link below to Reset Your Forgotten:</p>
        <a href="http://localhost:5000/api#/default/AuthController_verifyForgetToken/${resetToken}" Put this token in Feild>Verify Email</a>
      ` + `OR "${resetToken}" copy token from here And put in your swagger field `;

      // Use EmailService to send the password reset email
      await this.emailService.sendPasswordResetEmail(email, emailTemplate);

      // Return the reset token to be used for verification
      console.log("reset", resetToken);

    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Verify forget password token
  async verifyForgetPasswordToken(emailToken: string, username: string, newPassword: string, confirmPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { username,isVerified:true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (emailToken) {
      console.log(emailToken);
      user.password = newPassword;
      if (newPassword === confirmPassword) {
        this.userRepository.save(user);
      } else {
        throw new NotFoundException('Password doesn\'t match');
      }
    }
  }
}
