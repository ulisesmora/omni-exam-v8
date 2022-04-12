import { Controller, Post, ValidationPipe, Body, UseGuards, Get, Param, ParseUUIDPipe, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserCredentialsDto } from './dto/create-user.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { RessetCredentials } from './dto/get-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from './get-user-decorator';
import { UpdateUserPasswordDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

    constructor(
        private authService: UserService
    ){
    }


    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: CreateUserCredentialsDto ){
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/sigin')
    sigIn(@Body(ValidationPipe) authCredentialsDto: UserCredentialsDto ):  Promise<{accesToken: string}>{
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard('userToken'))
    test(@GetUser() user: User){
        return user;
    }


    @Get('')
    @UseGuards(AuthGuard('userToken'))
    allUsers(@GetUser() user: User):Promise<User[]>{
        return this.authService.getAllUsers(user);
    }


    @Get('/me')
    @UseGuards(AuthGuard('userToken'))
    myUser(@GetUser() user: User):Promise<User>{
        return this.authService.getUserMeInfo(user.username);
    }




    @Get('user/:id')
    @UseGuards(AuthGuard('userToken'))
    getUserById(@Param('id', ParseUUIDPipe) id:string):Promise<User>{
        return this.authService.getById(id);
    }

    

    @Post('resetPassword')
    ressetPassword(@Body(ValidationPipe) authCredentialsDto: RessetCredentials ):Promise<void>{
        return this.authService.generateResetPassword(authCredentialsDto);
    }

    @Patch('updatePassword')
    updatePassword(@Body(ValidationPipe) authCredentialsDto: UpdatePasswordDto ):Promise<void>{
        return this.authService.updatePassword(authCredentialsDto);
    }



    @Delete('/:id')
    @UseGuards(AuthGuard('userToken'))
    deleteUser(@Param('id', ParseUUIDPipe) id:string){
        return this.authService.deleteUser(id);
     }


    @Patch('updateUser/:id')
    @UseGuards(AuthGuard('userToken'))
    updatePasswordUser(@Param('id', ParseUUIDPipe) id:string,@Body(ValidationPipe) updatePassword:UpdateUserPasswordDto){
       return this.authService.updateUser(id,updatePassword);
    }
}
