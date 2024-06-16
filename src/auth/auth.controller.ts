import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}
    @Post('register')
    async register(@Body() registerData  : registerDto) {
        return this.authService.register(registerData)
    };

    @Post('login')
    async login(@Body() loginData : LoginDto) {
       const {email , password} = loginData;
       return this.authService.login(email , password)
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordData : ForgotPasswordDto){
        return this.authService.forgotPassword(forgotPasswordData.email)
    }
}
