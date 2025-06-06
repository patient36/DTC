import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from 'src/common/decorators/admin.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CurrentUser } from 'src/common/decorators/currentUser';
import { AuthedUser } from 'src/common/types/currentUser';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Admin()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // Get an admin registration token
  @Post('/get-token')
  getAdminToken(@CurrentUser() user: AuthedUser, @Body('password') password: string) {
    return this.adminService.getAdminToken(user, password)
  }

  // Register admin
  @Post('/create')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // Get all users
  @Get('/users')
  findAllUser(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adminService.findAllUser(page, limit);
  }

  // Get all payments
  @Get('/payments')
  findAllPayments(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adminService.findAllPayments(page, limit);
  }

  // Get a user
  @Get('/users/:id')
  findOneUser(@Param('id') id: string) {
    return this.adminService.findOneUser(id);
  }

  // Delete user
  @Delete('/users/:id')
  deleteUser(@Param('id') id: string, @Body('password') password: string, @CurrentUser() user: AuthedUser) {
    return this.adminService.deleteUser(id, password, user);
  }
}
