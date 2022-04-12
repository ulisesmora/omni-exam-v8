import { Repository, Entity, EntityRepository } from "typeorm";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { Account } from './account.entity';

@EntityRepository(Account)
export class AccountRepository extends Repository<Account>{

    private logger = new Logger('Account');
   

    async getAccounts():Promise<Account[]>{
        const query = this.createQueryBuilder('Account');

        try {
        const accounts = await query.getMany();
        return accounts; 
            
        } catch (error) {
            this.logger.error(`Failed to get accounts. Filters:`, error.stack);
            throw new InternalServerErrorException();
            
        }


    }






}