import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength,  } from "class-validator";


export class updatePostDto{
   @IsOptional()
   @IsNotEmpty({message:'Title can not be empty'})
   @IsString({message:'Title must be string'})
   @MinLength(2,{message:'Title must be at least 2 character'})
   @MaxLength(20,{message:'Title can not be more than 20 character'})
   title?:string

   @IsOptional()
   @IsNotEmpty({message:'Content can not be empty'})
   @IsString({message:'Content must be string'})
   @MinLength(4,{message:'Content must be at least 4 character'})
   @MaxLength(40,{message:'Content can not be more than 40 character'})
   content?:string

   @IsOptional()
   @IsNotEmpty({message:'AuthorName can not be empty'})
   @IsString({message:'AuthorName must be string'})
   @MinLength(2,{message:'AuthorName must be at least 2 character'})
   @MaxLength(20,{message:'AuthorName can not be more than 20 character'})
   authorName?:string
}