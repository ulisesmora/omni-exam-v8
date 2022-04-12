import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from './transactions.repository';
import { UserModule } from 'src/user/user.module';
import { TransactionsResolver } from './transactions.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRepository]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/transactions/schema.gql'),
    }),
    UserModule,

  ],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController],
  exports: [TransactionsService,TransactionsResolver]
})
export class TransactionsModule {}
