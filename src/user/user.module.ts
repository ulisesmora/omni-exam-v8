import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: "area51",
      signOptions: {
        expiresIn: 3600*8,
      },

    }),
    PassportModule.register({defaultStrategy: 'userToken'})
  ],

  providers: [UserService,JwtStrategy],
  controllers: [UserController],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
