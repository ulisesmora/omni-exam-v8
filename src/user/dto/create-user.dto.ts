import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsArray, IsIn, ArrayMinSize } from "class-validator";


export class CreateUserCredentialsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @IsEmail()
    username:string;
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(60)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: "password is weak"})
    password:string;
    @IsNotEmpty()
    @MinLength(2)
    @IsString()
    names:string;
    @IsNotEmpty()
    @MinLength(2)
    @IsString()
    lastnames:string;

}