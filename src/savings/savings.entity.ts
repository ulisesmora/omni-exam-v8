import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "src/user/user.entity";


@Entity()
export class Saving extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    name:string;
    @Column({type:"float"})
    balance:number;
    @Column()
    createdAt:Date;
    @ManyToOne(type => User, user => user.saving, {eager: false, onDelete: "CASCADE"} )
    user: User;
    @Column()
    userId:string;

}
