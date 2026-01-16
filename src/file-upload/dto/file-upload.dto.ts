import { IsOptional, IsString, MaxLength } from "class-validator";

export class UploadFileDto{
    @IsOptional()
    @MaxLength(500,{message:'description can not be greater then 500 character'})
    @IsString()
    description?:string
}