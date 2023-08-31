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
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/CreateUser.dto';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}
  //login user
  @Get('/accountverification/:email/:password')
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
    const user = await this.authService.loginuser(email, password);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const username = user.username;
    console.log(`User "${username}" successfully logged in`);
    return `Hi "${username}" successfully logged in`;
  }
  //check login jwt token
  @Post('login')
  async login(@Body() createUserDro: CreateUserDto) {
    const user = await this.authService.loginuser(
      createUserDro.email,
      createUserDro.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.login(user);

    return token;
  }
  //reset password
  @Post('reset-password')
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'email', type: String, required: true })
  async resetPassword(
    @Query('email') email: string,
    @Query('password') password: string,
  ) {
    await this.authService.resetPassword(email, password);
  }
  //verify reseted password
  @Post('verify-token')
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'token', type: String, required: true })
  async verifyaccount(
    @Query('token') emailToken: string,
    @Query('email') email: string,
    @Query('NewPassword') newPassword: string,
  ) {
    await this.authService.verifyToken(emailToken, email, newPassword);
  }

  // Forget password
  @Post('forget-password')
  @ApiOperation({ summary: 'Request to reset password by providing email' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'email', type: String, required: true })
  async forgetPassword(@Query('email') email: string) {
    await this.authService.forgetPassword(email);
  }

  // Verify forget password token
  @Post('verifyForget-token')
  @ApiOperation({ summary: "Reset a user's password" })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({ name: 'token', type: String, required: true })
  async verifyForgetToken(
    @Query('token') emailToken: string,
    @Query('username') username: string,
    @Query('New Password') newPassword: string,
    @Query('confirm Password') confirmPassword: string,
  ) {
    await this.authService.verifyForgetPasswordToken(
      emailToken,
      username,
      newPassword,
      confirmPassword,
    );
  }
}
