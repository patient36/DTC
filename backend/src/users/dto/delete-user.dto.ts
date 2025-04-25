import { IsNotEmpty, IsString } from "class-validator";

export class deleteUserDto {
    @IsString()
    @IsNotEmpty()
    password: string
}