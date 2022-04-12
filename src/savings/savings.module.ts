import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingRepository } from './savings.repository';
import { UserModule } from '../user/user.module';

@Module({
   imports: [
    TypeOrmModule.forFeature([SavingRepository]),
    UserModule,

  ],
  providers: [SavingsService],
  controllers: [SavingsController],
  exports: []
})
export class SavingsModule {}
