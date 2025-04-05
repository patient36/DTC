import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Admin } from 'src/common/decorators/admin.decorator';

@Controller('users')
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @Get()
  @Admin()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }
}
