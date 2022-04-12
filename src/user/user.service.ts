import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateUserCredentialsDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtPayload } from './jwt.payload.interface';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { RessetCredentials } from './dto/get-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){

    }

    async signUp(authCrentialsDto: CreateUserCredentialsDto):Promise<void>{
        return await this.userRepository.signUp(authCrentialsDto);
    }

    async signIn(authCrentialsDto: UserCredentialsDto):Promise<{accesToken: string}>{
        const username = await this.userRepository.validateUserPassword(authCrentialsDto);
        if(!username){
            throw new UnauthorizedException("Invalid credentials");
        }
        const payload : JwtPayload = { username};
        const accesToken = await this.jwtService.sign(payload);
        return { accesToken};
    }



    
    async getAllUsers( user: User): Promise<User[]>{
        return this.userRepository.getAllUsers();
    }

    async deleteUser(id:string):Promise<void>{

        try {
           await this.userRepository.delete(id);
        } catch (error) {
            return error;
            
        }

    }


    


    async updateUser(id:string,updatePassword:UpdateUserPasswordDto):Promise<void>{
        const {username, password, names, lastnames} = updatePassword;
        const User = await this.userRepository.findOne({where:{id:id}});
        if(username!= null){
            User.username = username;
        }if(password != null){
            const salt = await bcrypt.genSalt();
            User.password =  await this.hashPassword(password,salt);
            User.salt = salt;
        }
        if(names!=null){
            User.names = names;
        }
        if(lastnames != null){
            User.lastnames = lastnames;
        }
      

        try {
            await User.save();
            
        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException('username alredy exist');
            } else {
                throw new InternalServerErrorException;
            }   
        }
    }

 
     async getMyUser( user: User): Promise<User>{
        return this.userRepository.findOne({where:{id:user.id}});
    }



    async getById( id: string): Promise<User>{
        return this.userRepository.findOne({where:{id:id}});
    }

    async generateResetPassword(authCrentialsDto: RessetCredentials):Promise<void>{
        return await this.userRepository.generateTokenResetPassword(authCrentialsDto);
    }

    async updatePassword(updateDto: UpdatePasswordDto):Promise<void>{
        return await this.userRepository.updatePassword(updateDto);
    }

    async getUserMeInfo(user:string):Promise<User>{

        return this.userRepository.getUserForValidation(user);
    }



    public async hashPassword(password:string, salt:string): Promise<string>{
        return bcrypt.hash(password,salt);
    }  
}
