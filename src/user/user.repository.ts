import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { Logger, InternalServerErrorException, ConflictException, NotFoundException } from "@nestjs/common";
import { CreateUserCredentialsDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import { UserCredentialsDto } from "./dto/user-credentials.dto";
import * as moment from 'moment';
import * as sgMail from '@sendgrid/mail'; 
import { RessetCredentials } from "./dto/get-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    private logger = new Logger('UserRepository');
    async signUp(authCredentialsDto: CreateUserCredentialsDto): Promise<void> {
        const { username, password, names, lastnames } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;
        user.names = names;
        user.lastnames = lastnames;
        user.createdAt = new Date();
        try {
            await user.save();

        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException('username alredy exist');
            } else {
                throw new InternalServerErrorException;
            }
        }
    }

    async generateTokenResetPassword(resetDto: RessetCredentials) {
        const { email } = resetDto;

        sgMail.setApiKey('');

        try {
            const user = await this.getUserForValidation(email);
            user.resetPasswordToken = await bcrypt.genSalt();
            user.resetExperiesIn = new Date(Date.now() + 3600000);

            let newLink = "http://localhost:4200/auth/reset?token=" + user.resetPasswordToken + "&email=" + user.username;
            const mailOptions = {
                to: user.username,
                from: 'ulisesmora3@gmail.com',
                subject: "Solicitud cambio de password",
                text: `Hola ${user.username} \n 
        Por favor da click en el siguien enlace ${newLink} para cambiar tu password. \n\n 
       Si tu no has hecho la solicitud de cambio por favor ignora este mensaje.\n`,
            };

            await user.save();

            await sgMail.send(mailOptions);
        } catch (error) {
            throw new ConflictException("error", error);

        }
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto) {
        const { email, token, password } = updatePasswordDto;
        try {
            const user = await this.getUserForValidation(email);
            const actualDate = moment();
            const expiresDate = moment(user.resetExperiesIn);
            const duration = moment.duration(actualDate.diff(expiresDate)).asMinutes();


            if (token === user.resetPasswordToken && duration < 0) {
                const salt = await bcrypt.genSalt();
                user.salt = salt;
                user.password = await this.hashPassword(password, salt);
                await user.save();
            } else {
                throw new InternalServerErrorException();

            }

        } catch (error) {

            throw new ConflictException("Usuario no encontrado o token vencido", error);

        }

    }


    async validateUserPassword(authCredentialsDto: UserCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const query = this.createQueryBuilder('User');
        query.where('User.username = :username', { username: username });
        const user: User = await query.getOne();
        user.lastLogin = new Date();
        await user.save()
        try {
            if (user && await user.validatePassword(password)) {
                return user.username;
            } else {
                return null;
            }

        } catch (error) {
            return error;

        }
    }


    public async getUserForValidation(username: string): Promise<User> {

        const query = this.createQueryBuilder('User');
        query.where('User.username = :username', { username: username });
        try {
            const user:User = await query.getOne();
            if (user != undefined) {

                delete user.password;
                delete user.salt;
                return user;
            } else {
                throw new NotFoundException(`email: ${username} not found`);

            }
        } catch (error) {
            this.logger.error(`User dont exist:`, error.stack);
            return error;
        }
    }


    async getAllUsers(): Promise<User[]> {
        const query = this.createQueryBuilder('User');
        try {

            const tasks: User[] = await query.getMany();
            return tasks;

        } catch (error) {
            this.logger.error(`Failed to get all Users. Filters:`, error.stack);
            throw new InternalServerErrorException();

        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}