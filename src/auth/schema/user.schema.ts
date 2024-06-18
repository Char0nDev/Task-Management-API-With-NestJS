import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  validateBeforeSave: true,
})
export class User extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @Prop({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({ required: true })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
