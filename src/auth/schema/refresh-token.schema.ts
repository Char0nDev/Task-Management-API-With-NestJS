import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDate, IsString } from "class-validator";
import { Document, Types } from "mongoose";

@Schema({versionKey : false , timestamps : true , validateBeforeSave : true})
export class RefreshToken extends Document {
    @Prop()
    @IsString()
    token : string

    @Prop()
    userId : Types.ObjectId

    @Prop()
    @IsDate()
    expiryDate : Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)