import { IsString, MinLength, MaxLength, Matches, IsDate, IsEmail, IsDateString, IsOptional, IsNotEmpty,  } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(60)
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    token:string;
    @IsNotEmpty()
    @IsString()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: "password muy debil"})
    password:string;
}