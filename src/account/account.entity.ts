import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from "src/user/user.entity";
import { AccountType } from './account-type.enum';
import { Transaction } from 'src/transactions/transactions.entity';


@Entity()
@Unique(['numberCard'])
export class Account extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    numberCard:string;
    @Column()
    expDate:Number;
    @Column()
    ccv:string;
    @Column()
    nip:string;
    @Column({nullable:true, type:"float"})
    limit:number;
    @Column({type:"float"})
    balance:number;
    @Column()
    createdAt:Date;
    @Column()
    typeAccount:AccountType;
    @Column()
    status:boolean;
    @ManyToOne(type => User, user => user.account, {eager: false, onDelete: "CASCADE"})
    user: User;
    @Column()
    userId:string;
    @OneToMany(type => Transaction, transaction => transaction.account, {eager: false, onDelete: "CASCADE"})
    transaction: Transaction[];
}
