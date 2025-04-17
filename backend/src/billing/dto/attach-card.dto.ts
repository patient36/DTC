import { IsNotEmpty, IsString } from "class-validator";

export class AttachCardDto {
    @IsNotEmpty()
    @IsString()
    paymentMethodId: string
}
