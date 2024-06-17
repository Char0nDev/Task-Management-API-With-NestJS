import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { registerDto } from './dtos/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { RefreshToken } from './schema/refresh-token.schema';
import { ResetToken } from './schema/reset-password.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}

  async register(registerData: registerDto) {
    const { email, password, username } = registerData;
    const emailInUser = await this.userModel.findOne({ email });

    if (emailInUser)
      throw new BadRequestException('This email already in use.');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully.',
      statusCode: HttpStatus.CREATED,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('Wrong credentials.');

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) throw new UnauthorizedException('Wrong credentials.');

    return {
      accessToken: await this.generateAccessToken(user._id as Types.ObjectId),
    };
  }

  async generateAccessToken(userId: Types.ObjectId) {
    const token = await this.jwtService.sign(
      { id: userId },
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = uuid();
    await this.storeRefreshToken(refreshToken, userId);

    return token;
  }

  async storeRefreshToken(token: string, userId: Types.ObjectId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 5);

    const refreshToken = await this.refreshTokenModel.findOneAndUpdate(
      { userId },
      {
        expiryDate,
        token,
      },
    );

    if (!refreshToken) {
      await this.refreshTokenModel.create({
        token,
        userId,
        expiryDate,
      });

      return;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('Wrong credentials.');

    const resetToken = uuid();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 5 );

    try {
      const resetTokenFind = await this.resetTokenModel.findOneAndUpdate(
        { userId: user._id },
        {
          resetToken,
          expiryDate,
        },
      );

      if (!resetTokenFind) {
        await this.resetTokenModel.create({
          userId: user._id,
          resetToken,
          expiryDate,
        });
      }

      await this.mailService.sendMail({
        from: this.configService.get('GMAIL_AUTH_USER') as string,
        to: email,
        subject: 'Reset Your Password',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                body {
                    font-family: "Inter", sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 5px;
                }
                .header {
                    text-align: center;
                    padding: 10px;
                    background-color: #007bff;
                    color: #ffffff;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                }
                .content {
                    padding: 20px;
                }
                .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px;
                    background-color: #28a745;
                    color: #ffffff;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #888888;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Password Reset Request</h2>
                </div>
                <div class="content">
                    <p>Hi there,</p>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <a class="button" href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have questions.</p>
                    <p>Thanks,<br>Task Management API</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Task Management API. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
            `,
      });

      return {
        message: 'Mail has send successfully, check you email.',
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async resetPassword(newPassword : string , resetToken : string){
    const token = await this.resetTokenModel.findOne({resetToken , expiryDate : {$gte : new Date()}});
    if(!token) throw new UnauthorizedException('Invalid token.');

    const user = await this.userModel.findById(token.userId);
    if(!user) throw new NotFoundException('User not found.');

    const hashedNewPassword = await bcrypt.hash(newPassword , 10);
    user.password = hashedNewPassword;
    await user.save()
    await token.deleteOne()

    return {
      message : 'Password has changed successfully.',
      statusCode : HttpStatus.OK
    }
  }
}
