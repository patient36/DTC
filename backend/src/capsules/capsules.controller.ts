import { Controller, Get, Post, Body, Query, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, SetMetadata } from '@nestjs/common';
import { CapsulesService } from './capsules.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isMediaFile } from 'src/common/utils/mime-check';
import { CurrentUser } from 'src/common/decorators/currentUser';
import { AuthGuard } from '@nestjs/passport';
import { AuthedUser } from 'src/common/types/currentUser';
import { PaymentGuard } from 'src/auth/guards/storage.guard';

@UseGuards(AuthGuard('jwt'))
@UseGuards(PaymentGuard)
@SetMetadata('paymentProtected', true)
@Controller('capsules')
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) { }

  @Post('/create')
  @UseInterceptors(
    FilesInterceptor('attachments', 50, {
      fileFilter: (req, file, cb) => {
        if (isMediaFile(file.mimetype)) cb(null, true);
        else cb(null, false);
      },
    }),
  )
  create(@Body() dto: CreateCapsuleDto, @UploadedFiles() files: Express.Multer.File[], @CurrentUser() user: AuthedUser) {
    return this.capsulesService.create(dto, files, user);
  }

  @Get()
  findAll(@CurrentUser() user: AuthedUser, @Query('page') page: number, @Query('limit') limit: number) {
    return this.capsulesService.findAll(user, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthedUser) {
    return this.capsulesService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthedUser) {
    return this.capsulesService.remove(id, user);
  }
}
