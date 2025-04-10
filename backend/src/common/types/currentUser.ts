import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthedUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
