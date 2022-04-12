import { IsString, MinLength, MaxLength, Matches, IsDate, IsEmail, IsDateString, IsOptional, IsNotEmpty,  } from "class-validator";

export class UserCredentialsDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(60)
    username: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(60)
    password: string;
}