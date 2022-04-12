import { Controller, Logger, Get, UseGuards, Param, ParseUUIDPipe, Post, ValidationPipe, Body, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { AccountService } from './account.service';
import { GetUser } from 'src/user/get-user-decorator';
import { User } from 'src/user/user.entity';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('account')
export class AccountController {


    private logger = new Logger('AccountsController');
    constructor(
        private accountService: AccountService
    ){
    }

    @Get('/:id')
    @UseGuards(AuthGuard('userToken'))
    getAccountById(@GetUser() user: User, @Param('id', ParseUUIDPipe) id:string): Promise<Account>{
        return  this.accountService.getAccountById(id,user);
    }

    @Get('')
    @UseGuards(AuthGuard('userToken'))
    getAccountsByUser(@GetUser() user: User ): Promise<Account[]>{
        return  this.accountService.getAccountsByUser(user);
    }

    @Post('')
    @UseGuards(AuthGuard('userToken'))
    createAccounts(@GetUser() user:User,@Body(ValidationPipe)  createAccountdto:CreateAccountDto):Promise<Account[]>{
        this.logger.verbose(`Creating Account ${createAccountdto}`)
        return this.accountService.createAccount(user,createAccountdto);

    }

    @Post('/credit')
    @UseGuards(AuthGuard('userToken'))
    createCreditAccount(@GetUser() user:User):Promise<Account>{
        this.logger.verbose(`Creating Credit Account`)
        return this.accountService.createCreditCard(user);
    }

    
    @Post('/whitdraw')
    @UseGuards(AuthGuard('userToken'))
    withdrawAccount(@GetUser() user:User,@Body(ValidationPipe) withdrawAccountDto:WithdrawAccountDto):Promise<Account>{
        this.logger.verbose(`Withdraw Account ${JSON.stringify(withdrawAccountDto)}`)
        return this.accountService.withdraw(user,withdrawAccountDto);
    }



    
}
