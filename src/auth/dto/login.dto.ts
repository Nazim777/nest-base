import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide valid email address!' })
  email: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 character' })
  @MaxLength(40, { message: 'Password can not be more than 40 character' })
  password: string;
}
