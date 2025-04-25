import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { deleteUserDto } from './dto/delete-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthedUser } from 'src/common/types/currentUser';
import { CurrentUser } from 'src/common/decorators/currentUser';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() dto: deleteUserDto, @CurrentUser() AuthedUser: AuthedUser) {
    return this.usersService.deleteUser(id, dto, AuthedUser);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() AuthedUser: AuthedUser) {
    return this.usersService.updateUser(id, dto, AuthedUser);
  }

  @Get('/payments')
  getPayments(@CurrentUser() AuthedUser: AuthedUser, @Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.getPayments(page, limit, AuthedUser);
  }
}
