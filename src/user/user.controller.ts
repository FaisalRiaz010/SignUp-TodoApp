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
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';

@ApiTags('users') // Adds a tag to the Swagger documentation for this controller
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // Function to register a new user with 2FA
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User object with username and password',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: CreateUserDto,
  })
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: CreateUserDto; verificationToken: string }> {
    const user = await this.usersService.createUserWith2FA(createUserDto);

    try {
      // Send the verification email
      const emailTemplate =
        `
        <p>Thank you for registering with our SignUp service. Please click the link below to verify your email address:</p>
        <a href="http://localhost:5000/api#/users/UsersController_verifyUser/${user.verificationToken}" Put this token in Feild>Verify Email</a>
      ` +
        `OR ${user.verificationToken} copy token from here And put in your swagger field `;

      await this.emailService.sendTestEmail(user.email, emailTemplate);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new HttpException(
        'Failed to send verification email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Return a success response to the client
    return {
      user,
      verificationToken: user.verificationToken,
    };
  }

  // Account verification
  @Get('verify/:token')
  async verifyUser(
    @Param('token') token: string,
    @Param('token2FA') token2FA: string,
  ) {
    // Find the user by the verification token
    const user = await this.usersService.getVerifiedUser(token, token2FA);

    if (!user) {
      // Handle case where user is not found
      return 'Verification failed: User not found or token expired.';
    }
    // Redirect or respond to the client indicating successful verification
    return `Verification successful: Your account with username "${user.username}" is now verified.`;
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
  async getUserByCriteria(
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
