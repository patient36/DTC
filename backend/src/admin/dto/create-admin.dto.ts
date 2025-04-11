import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateAdminDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string

    @IsNotEmpty()
    @IsString()
    adminToken: string
}
