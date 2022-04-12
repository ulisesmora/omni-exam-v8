import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './transactions.entity';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from '../account/account.entity';

@Resolver(of => Transaction)
export class TransactionsResolver {
    constructor(private transactionService:TransactionsService){

    }

    @Query(returns => Transaction)
    async getTransaction(@Args("id",{type: () => String}) id:string):Promise<Transaction>{
        return await this.transactionService.getTransactionById(id)
    }

    @Query(returns => [Transaction])
    async getTransactionsByAccount(@Args("accountId",{type: () => String}) accountId:string):Promise<Transaction[]>{
        return await this.transactionService.getTransactionByAccount(accountId)
    }

    @Query(returns => [Transaction])
    async transactions():Promise<Transaction[]>{
        return this.transactionService.getAllTransactions();
    }


    @Mutation(returns => Transaction)
    async createTransaction(@Args('createTransactionDto') createTransactionDto:CreateTransactionDto, account:Account):Promise<Transaction>{
        return this.transactionService.createTransaction(createTransactionDto,account);

    }


}
