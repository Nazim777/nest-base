import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-query.dto";

export class FindPostQueryDto extends PaginationDto{
    @IsOptional()
    @IsString({message:'Title must be string'})
    @MaxLength(100,{message:'Title search query can not exceeds 100 character'})
    title?:string
}