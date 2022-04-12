import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { Account } from './account.entity';
import { User } from '../user/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import * as moment from 'moment';
import * as cardGen from 'card-number-generator';
import * as generateUniqueId from 'generate-unique-id';
import { AccountType } from './account-type.enum';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';
import { Transaction } from 'src/transactions/transactions.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';

@Injectable()
export class AccountService {

    constructor(
        @InjectRepository(AccountRepository)
        private accountRepository: AccountRepository,
        private transactionService: TransactionsService
    ) { }

    async getAccounts(): Promise<Account[]> {
        return this.accountRepository.getAccounts();
    }

    async getAccountById(id: string, user:User): Promise<Account> {
        try {
            const found = await this.accountRepository.findOne({where: {userId:user.id, id:id}});
            
            if (!found) {
                throw new NotFoundException(`Account with Id ${id} not found`);
            }
            
            delete found.nip;
            delete found.ccv;
            return found;

        } catch (error) {

            throw new ConflictException(error.response)

        }

    }


    async getAccountsByUser(user: User): Promise<Account[]> {
        try {
            const found:Account[] = await this.accountRepository.find({ where: { userId: user.id } })

            return found
        } catch (error) {
            throw new Error(error)
        }
    }





    async createAccount(user: User, createAccountDto: CreateAccountDto): Promise<Account[]> {
        try {
            const {  limit, creditcard } = createAccountDto;
           
            const accounts: Account[] = [];
            const found: Account[] = await this.getAccountsByUser(user);
            if (found.length > 0) {
                throw new ConflictException("you only can have one debit and credit account ")
            }

            if (limit <= 1000) {
                throw new ConflictException("you need a begin balance greater than $1000 ")
            }
            const debbitAccount: Account = new Account();
            debbitAccount.limit = 0;
            debbitAccount.status = true;
            debbitAccount.typeAccount = AccountType.DEBIT;
            debbitAccount.user = user;
            debbitAccount.userId = user.id;
            debbitAccount.balance = limit;
            debbitAccount.createdAt = new Date();
            debbitAccount.expDate = Number.parseInt(moment().add(4, 'years').format('YYYY'));
            debbitAccount.numberCard = cardGen({ issuer: 'MasterCard' });
            debbitAccount.ccv = generateUniqueId({
                length: 3,
                useLetters: false,
                useNumbers: true
            });
            debbitAccount.nip = generateUniqueId({
                length: 4,
                useLetters: false,
                useNumbers: true
            });
            const debit = await debbitAccount.save()
            accounts.push(debit);

            if (creditcard == true) {
                const credit = await this.createCreditCard(user);
                accounts.push(credit);


            }
            return accounts;


        } catch (error) {
            throw new ConflictException(error);
        }
    }




    async createCreditCard(user: User):Promise<Account> {

        const found = await this.getAccountsByUser(user);
        if (found.length == 0) {
            throw new ConflictException("you need have first a debit account with us");
        }

        let debitAccount: Account;

        for (let account of found) {
            if (account.typeAccount == AccountType.CREDIT) {
                throw new ConflictException("you have a credit account with us you can't have one more credit card");
            } else {
                debitAccount = account;
            }
        }

        const credditAccount: Account = new Account();
        credditAccount.limit = debitAccount.balance;
        credditAccount.status = true;
        credditAccount.typeAccount = AccountType.CREDIT;
        credditAccount.user = user;
        credditAccount.userId = user.id;
        credditAccount.balance = 0;
        credditAccount.createdAt = new Date();
        credditAccount.expDate = Number.parseInt(moment().add(4, 'years').format('YYYY'));
        credditAccount.numberCard = cardGen({ issuer: 'MasterCard' });
        credditAccount.ccv = generateUniqueId({
            length: 3,
            useLetters: false,
            useNumbers: true
        });
        credditAccount.nip = generateUniqueId({
            length: 4,
            useLetters: false,
            useNumbers: true
        });

        const credit = await credditAccount.save()
        return credit;
    }



    async withdraw(user:User,withdrawAccount:WithdrawAccountDto):Promise<Account>{
        const {amount,typeAccount} = withdrawAccount;
        const found: Account[] = await this.getAccountsByUser(user);
        if (!found) {
            throw new ConflictException("you need have first a debit account with us");
        }


        let actualAccount:Account;

        for (let account of found) {
            if (typeAccount == account.typeAccount) {
                actualAccount = account;
            } 
        }


        const createTransactionDto:CreateTransactionDto = new CreateTransactionDto();
        let operation:Account;

        if(actualAccount.typeAccount == AccountType.DEBIT){
            if( (amount + actualAccount.balance) < 0 ){
                throw new ConflictException("Your amount is more than your balance, please select another amount");
            }
            
            actualAccount.balance += amount;
            createTransactionDto.typeTransaction = "debit card";
            createTransactionDto.amount = amount;
            operation = await actualAccount.save(); 

        }else{
            let fee:number = 0;
            if(amount < 0){
                createTransactionDto.typeTransaction = "withdraw credit card";
                fee = amount * 0.05;
            }
            const total = amount+fee;
            createTransactionDto.amount = total;
            if( amount > 0 ) {
                createTransactionDto.typeTransaction = "pay credit card";
                if( (total+actualAccount.balance > 0) )
                throw new ConflictException("You try to pay more than your limit, please select another amount");
            }else if(amount < 0){
                if( ( (total+actualAccount.balance) < (actualAccount.limit * -1)) )
                throw new ConflictException("Your amount is more than your limit, please select another amount");
            }
            actualAccount.balance += total;
        
            operation =  await actualAccount.save();
           
        }


        const transaction = await this.transactionService.createTransaction(createTransactionDto,actualAccount);
        return operation;



    }










}
