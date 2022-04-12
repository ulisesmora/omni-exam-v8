import {IsNotEmpty, IsIn, isNotEmpty, IsString, IsBoolean, IsNumber, IsOptional, IsNotIn} from "class-validator";
import { AccountType } from "../account-type.enum";



export class WithdrawAccountDto {
    @IsNotEmpty()
    @IsIn([AccountType.DEBIT,AccountType.CREDIT])
    typeAccount:AccountType
    @IsNotEmpty()
    @IsNumber()
    @IsNotIn([0])
    amount:number;
   
}