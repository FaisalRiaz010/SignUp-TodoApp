/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from 'typeorm/entities/User';

@ApiTags('users') // Adds a tag to the Swagger documentation for this controller
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  //reister user
  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: CreateUserDto; verificationToken: string; qrcodeUrl: string }> {
    try {
      // Create the user with 2FA and retrieve user information and QR code URL
      const { user, qrcodeDataUrl } = await this.usersService.createUserWith2FA(createUserDto);

      // Generate the HTML email content
      const emailContent = `
        <p>Thank you for registering with our SignUp service. Please click the link below to verify your email address:</p>
        <a href="http://localhost:5000/api#/users/UsersController_verifyUser/${user.verificationToken}">Verify Email</a>
        <br/>
        <img src="${qrcodeDataUrl}" alt="QR Code" />
      `;

      // Send the verification email with qrscan image and tokoen
      await this.emailService.sendTestEmail(user.email,qrcodeDataUrl,  emailContent);

      // Return a success response to the client
      return {
        user,
        verificationToken: user.verificationToken,
        qrcodeUrl:qrcodeDataUrl
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // Account verification
  @Get('verify/:verificationToken/:codeFromGoogleAuthenticator')
  @ApiOperation({ summary: 'Verify user using verification token and Google Authenticator code' })
  @ApiResponse({ status: 200, description: 'User verified successfully' })
  @ApiResponse({ status: 400, description: 'User not found or token expired' })
  @ApiResponse({ status: 401, description: 'Invalid code from Google Authenticator' })
  @ApiParam({ name: 'verificationToken', type: 'string', description: 'User verification token' })
  @ApiParam({ name: 'codeFromGoogleAuthenticator', type: 'string', description: 'Code from Google Authenticator' })
  async verifyUser(
    @Param('verificationToken') verificationToken: string,
    @Param('codeFromGoogleAuthenticator') codeFromGoogleAuthenticator: string,
  ): Promise<User> {
    try {
      // Verify the user with the provided tokens
      const user = await this.usersService.verifyUserByTokens(verificationToken, codeFromGoogleAuthenticator);

      // If verification is successful, you can return the user or any relevant data
      return user;
    } catch (error) {
      // Handle exceptions and return appropriate responses
      if (error instanceof NotFoundException) {
        throw new HttpException('User not found or token expired.', HttpStatus.BAD_REQUEST);
      } else if (error instanceof UnauthorizedException) {
        throw new HttpException('Invalid code from Google Authenticator.', HttpStatus.UNAUTHORIZED);
      } else {
        // Handle other unexpected errors
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // For email Verification
  @Get('email/:email/password/:password')
  @ApiOperation({ summary: 'Fetch a user by email and password' })
  @ApiParam({
    name: 'email',
    example: 'faisal@gmail.com',
    description: 'Email of the user',
  })
  @ApiParam({
    name: 'password',
    example: 'password123',
    description: 'Password of the user',
  })
  @ApiOkResponse({ description: 'User found', type: String })
  @ApiNotFoundResponse({ description: 'User not found' })
  async loginUser(
    @Param('email') email: string,
    @Param('password') password: string,
  ): Promise<string | null> {
    const user = await this.usersService.getUserByEmailAndPassword(
      email,
      password,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('user', (await user).username, 'successfully Logged In');

    // If the user is found, return a string message
    return `Hi "${(await user).username}" successfully logged in`;
  }
  //login user
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ access_token: string }> {
    const user = await this.authService.loginuser(body.username, body.password);
    if (!user) {
      return { access_token: null };
    }
    return this.authService.login(user);
  }
}
