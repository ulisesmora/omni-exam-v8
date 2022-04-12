import {IsNotEmpty, IsIn, isNotEmpty, IsString, IsBoolean, IsNumber, IsOptional} from "class-validator";
import { AccountType } from "../account-type.enum";


export class CreateAccountDto {
   
    @IsNotEmpty()
    @IsNumber()
    limit:number;
    @IsNotEmpty()
    @IsBoolean()
    creditcard:boolean;
   
}