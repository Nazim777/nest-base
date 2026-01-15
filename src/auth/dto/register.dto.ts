import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto{
    @IsEmail({},{message:'Please provide valid email address!'})
    email:string;

    @IsNotEmpty({message:'Name can not be empty'})
    @IsString({message:'Name must be string'})
    @MinLength(2,{message:'name must be at least 2 character'})
    @MaxLength(40,{message:'name can not be more than 40 character'})
    name:string   

   @IsNotEmpty({message:'Password can not be empty'})
   @MinLength(6,{message:'Password must be at least 6 character'})
   @MaxLength(40,{message:'Password can not be more than 40 character'})
   password:string
}