import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, Matches } from "class-validator";


export class registerDto {
    @IsString()
    @Length(4,20)
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_]*$/, { message: 'Username can only contain letters, numbers, and underscores.' })
    username : string

    @IsEmail()
    @IsNotEmpty()
    email : string

    @IsStrongPassword({
        minNumbers : 1 ,
        minLength : 8 ,
        minSymbols : 1 ,
        minUppercase : 1 ,
        minLowercase : 1
    })
    @IsNotEmpty()
    password : string
}