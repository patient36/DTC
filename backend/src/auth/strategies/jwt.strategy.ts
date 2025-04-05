import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';


interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET is not defined');

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.auth_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });

    }

    async validate(payload: JwtPayload) {
        return { userId: payload.userId, email: payload.email, role: payload.role };
    }
}
