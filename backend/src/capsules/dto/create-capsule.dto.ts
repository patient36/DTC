import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCapsuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsNotEmpty()
  deliveryDate:string
}
