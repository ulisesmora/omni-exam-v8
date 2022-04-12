import { Repository, Entity, EntityRepository } from "typeorm";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { Transaction } from './transactions.entity';


@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction>{

    private logger = new Logger('Transaction');
   

    async getAccounts():Promise<Transaction[]>{
        const query = this.createQueryBuilder('Transaction');

        try {
        const transactions = await query.getMany();
        return transactions; 
            
        } catch (error) {
            this.logger.error(`Failed to get transactions. Filters:`, error.stack);
            throw new InternalServerErrorException();
            
        }


    }






}