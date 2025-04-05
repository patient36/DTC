import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  oldPassword?: string;

  @ValidateIf((o) => o.oldPassword !== undefined)
  @IsString()
  @MinLength(6)
  newPassword?: string;
}
