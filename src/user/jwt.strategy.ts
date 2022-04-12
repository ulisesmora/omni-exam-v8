
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "./jwt.payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'userToken'){

    constructor(@InjectRepository(UserRepository)
                private adminRepository: UserRepository){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'area51',
        });
    }

    async validate(payload: JwtPayload){
        const {username} = payload;
        const user = await this.adminRepository.getUserForValidation(username);

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }



}