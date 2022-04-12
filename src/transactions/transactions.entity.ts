import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Account } from "src/account/account.entity";




@Entity()
@ObjectType()
export class Transaction extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    @Field() 
    id:string;
    @Column()
    @Field()
    typeTransaction:string;
    @Column({type:"float"})
    @Field(type => Number)
    amount:number;
    @Column()
    @Field(type => Date)
    createdAt:Date;
    @Column()
    @Field()
    status:string;
    @ManyToOne(type => Account, account => account.transaction, {eager: false, onDelete: "CASCADE"} )
    account: Account;
    @Column()
    @Field()
    accountId:string;

}
