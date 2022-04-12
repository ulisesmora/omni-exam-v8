import { Entity, Unique, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import * as bctypt from "bcryptjs";
import { Account } from "src/account/account.entity";
import { Saving } from "src/savings/savings.entity";


@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    username:string;
    @Column()
    password:string;
    @Column()
    salt:string;
    @Column()
    names:string;
    @Column()
    lastnames:string;
    @Column()
    createdAt:Date;
    @Column({nullable:true})
    lastLogin:Date;
    @Column({nullable:true})
    resetPasswordToken:string;
    @Column({nullable:true})
    resetExperiesIn:Date;
    @OneToMany(type => Account, account => account.user,{eager:true})
    account: Account[];
    @OneToMany(type => Saving, saving => saving.user,{eager:true})
    saving: Saving[];
    

    async validatePassword(password: string):Promise<boolean>{
        const hash = await bctypt.hash(password, this.salt);
        return hash === this.password;
    }


}
