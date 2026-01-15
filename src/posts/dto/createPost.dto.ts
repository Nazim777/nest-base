import { IsNotEmpty, IsString, MaxLength, MinLength,  } from "class-validator";


export class createPostDto{
   @IsNotEmpty({message:'Title can not be empty'})
   @IsString({message:'Title must be string'})
   @MinLength(2,{message:'Title must be at least 2 character'})
   @MaxLength(40,{message:'Title can not be more than 40 character'})
   title:string

   @IsNotEmpty({message:'Content can not be empty'})
   @IsString({message:'Content must be string'})
   @MinLength(4,{message:'Content must be at least 4 character'})
   content:string

   @IsNotEmpty({message:'AuthorName can not be empty'})
   @IsString({message:'AuthorName must be string'})
   @MinLength(2,{message:'AuthorName must be at least 2 character'})
   @MaxLength(20,{message:'AuthorName can not be more than 20 character'})
   authorName:string
}