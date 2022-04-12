import { IsString, MinLength, MaxLength, Matches, IsDate, IsEmail, IsDateString, IsOptional, IsNotEmpty,  } from "class-validator";

export class RessetCredentials {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(60)
    @IsEmail()
    email: string;
}