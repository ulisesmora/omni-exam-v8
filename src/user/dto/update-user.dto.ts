import { IsString, MinLength, MaxLength, Matches, IsDate, IsEmail, IsDateString, IsOptional, IsArray,  } from "class-validator";

export class UpdateUserPasswordDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    username:string;
    @IsOptional()
    @MinLength(8)
    @MaxLength(60)
    password:string;
    @IsOptional()
    @MinLength(2)
    @IsString()
    names:string;
    @IsOptional()
    @MinLength(2)
    @IsString()
    lastnames:string;
  
}