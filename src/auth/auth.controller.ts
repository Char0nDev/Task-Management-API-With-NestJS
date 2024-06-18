import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerData: registerDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const { email, password } = loginData;
    return this.authService.login(email, password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordData: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordData.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
    @Query('token') resetToken: string,
  ) {
    return this.authService.resetPassword(
      resetPassword.newPassword,
      resetToken,
    );
  }
}
