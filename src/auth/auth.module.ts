import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schema/refresh-token.schema';
import {
  ResetToken,
  ResetTokenSchema
} from './schema/reset-password.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ])
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
