import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CapsulesService } from './capsules.service';
import { CreateCapsuleDto } from './dto/create-capsule.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isMediaFile } from 'src/common/utils/mime-check';

@Controller('capsules')
@Public()
export class CapsulesController {
  constructor(private readonly capsulesService: CapsulesService) { }

  @Post('/create')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (isMediaFile(file.mimetype)) cb(null, true);
        else cb(null, false);
      },
    }),
  )
  create(@Body() dto: CreateCapsuleDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.capsulesService.create(dto, files);
  }

  @Get()
  findAll() {
    return this.capsulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.capsulesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.capsulesService.remove(+id);
  }
}
