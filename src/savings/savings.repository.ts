import { Repository, Entity, EntityRepository } from "typeorm";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { Saving } from "./savings.entity";


@EntityRepository(Saving)
export class SavingRepository extends Repository<Saving>{

    private logger = new Logger('Saving');
   

    async getAccounts():Promise<Saving[]>{
        const query = this.createQueryBuilder('Saving');

        try {
        const savings = await query.getMany();
        return savings; 
            
        } catch (error) {
            this.logger.error(`Failed to get savings. Filters:`, error.stack);
            throw new InternalServerErrorException();
            
        }


    }






}