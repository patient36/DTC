import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  getAdminToken(@CurrentUser() user: AuthedUser) {
    return this.adminService.getAdminToken(user)
  }

  // Register admin
  @Post('/create')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // Get all users
  @Get('/all-users')
  findAllUser() {
    return this.adminService.findAllUser();
  }

  // Get all payments
  @Get('/all-payments')
  findAllPayments() {
    return this.adminService.findAllPayments;
  }

  // Activate payment
  @Patch(':id')
  activatePayment(@Param('id') id: string) {
    return this.adminService.activatePayment(id)
  }
}
