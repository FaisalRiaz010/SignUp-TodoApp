/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}
//   public jwtToken = {access_token: ''}; 

//   @Post('auth/login')
//   async login (@Req() req) {
//       return this.authService.login(req.user);
//   }

//   @Get('google')
//   @UseGuards(AuthGuard('google'))
//   async googlelogin(){}

//   @Get('auth/google/callback')
//   @UseGuards(AuthGuard('google'))
//   async callback(@Req() req,@Res() res) {
//       const jwt=await this.authService.login(req.user);
//       res.set('autherization',jwt.access_token);
//       res.json(req.user);
//       console.log(req.user);
//        console.log("token",jwt.access_token);
//   }

//   @Get('test123')
// @UseGuards(AuthGuard('jwt'))
// async test123(@Req() req,@Res() res) {
//   const token = req.headers.authorization.split(' ')[1]; // Extract token from header
//   const decodedToken = jwt.decode(token, { complete: true }); // Decode token
//   console.log('JWT Token:', token);
//   console.log('Decoded Token:', decodedToken);
//   // Your existing logic
//   res.json('success');
// }

}
