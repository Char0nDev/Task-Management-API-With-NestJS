import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true, validateBeforeSave: true })
export class ResetToken extends Document {
  @Prop()
  @IsString()
  resetToken: string;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  @IsDate()
  expiryDate: Date;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
