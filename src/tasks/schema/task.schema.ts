import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsIn, IsNotEmpty, Length } from 'class-validator';
import { Document, Types, isObjectIdOrHexString } from 'mongoose';

@Schema({
  versionKey: false,
  validateBeforeSave: true,
  timestamps: true,
})
export class Task extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  owner: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @Prop()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @Prop()
  @Length(1, 100)
  category: string;

  @Prop()
  @Length(1, 50)
  priorityLevel: string;

  @Prop({ required: true })
  @IsIn(['pending', 'in-progress', 'completed'])
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
