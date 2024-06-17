import { IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
    @IsStrongPassword({
        minLength : 8,
        minLowercase : 1,
        minNumbers : 1,
        minSymbols : 1,
        minUppercase : 1
    })
    newPassword : string
}