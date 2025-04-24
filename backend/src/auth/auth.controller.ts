import { Controller, Post, Body, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser';
import { AuthedUser } from 'src/common/types/currentUser';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.authUser(dto, res);
  }

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('/me')
  async getCurrentUser(@CurrentUser() AuthedUser: AuthedUser) {
    return this.authService.getCurrentUser(AuthedUser)
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @Post('get-reset-token')
  async getToken(@Body('email') email: string) {
    return this.authService.getResetPasswordToken(email)
  }
}
