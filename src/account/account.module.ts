import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRepository } from './account.repository';
import { UserModule } from '../user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionsModule } from '../transactions/transactions.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountRepository]),
    UserModule, 
    TransactionsModule,
   /* CacheModule.register({
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
      store:redisStore,
      host:'localhost',
      port:6379,
      ttl: 3600,
    }), */

  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService]
})
export class AccountModule {}
