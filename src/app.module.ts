import { Module, CacheModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { SavingsModule } from './savings/savings.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    SavingsModule,
    TransactionsModule,
    AccountModule],
})
export class AppModule {

}
