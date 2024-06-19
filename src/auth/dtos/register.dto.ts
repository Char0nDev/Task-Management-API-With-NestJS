import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class registerDto {
  @ApiProperty()
  @IsString()
  @Length(4, 20)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsStrongPassword({
    minNumbers: 1,
    minLength: 8,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  @IsNotEmpty()
  password: string;
}
