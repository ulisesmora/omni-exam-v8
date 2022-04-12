import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';


@InputType()
export class CreateTransactionDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    typeTransaction:string
    @Field(type => Number)
    @IsNotEmpty()
    @IsNumber()
    amount:number;
   
}