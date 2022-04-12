import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from './transactions.entity';
import { TransactionRepository } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from 'src/account/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(TransactionRepository)
        private transactionRepository: TransactionRepository,

    ) { }

    async getAllTransactions(): Promise<Transaction[]> {
        try {
            const found = await this.transactionRepository.find();
            if (!found) {
                throw new NotFoundException("No transactions found")
            }
            return found;

        } catch (error) {

        }

    }


    async getTransactionById(id: string): Promise<Transaction> {
        try {

            const found = await this.transactionRepository.findOne({ where: { id: id } });
            if (!found) {
                throw new NotFoundException("No transactions found")
            }
            return found;

        } catch (error) {

        }
    }


    async getTransactionByAccount(accountId: string): Promise<Transaction[]> {
        try {
            const found:Transaction[] = await this.transactionRepository.find({ where: { accountId: accountId } })
            return found
        } catch (error) {
            throw new Error(error)
        }
    }



    async createTransaction(createTransactionDto: CreateTransactionDto, account: Account): Promise<Transaction> {
        const { typeTransaction, amount } = createTransactionDto;
        const transaction = new Transaction();
        transaction.amount = amount;
        transaction.createdAt = new Date();
        transaction.typeTransaction = typeTransaction;
        transaction.status = "Creada";
        transaction.account = account;
        transaction.accountId = account.id;
        const thetransaction =  await transaction.save();
        return thetransaction;

    }
}
