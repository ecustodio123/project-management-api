import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tasks/:id/files')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_, file, callback) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }

        callback(null, true);
      },
    }),
  )
  upload(
    @Param('id') taskId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.filesService.upload(taskId, file, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:id/files')
  findAll(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.filesService.findAll(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('files/:id')
  remove(@Param('id') fileId: string, @Req() request: AuthenticatedRequest) {
    return this.filesService.remove(fileId, request.user.sub);
  }

  @Get('files/:id/download')
  @UseGuards(JwtAuthGuard)
  getDownloadUrl(
    @Param('id') fileId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.filesService.getDownloadUrl(fileId, request.user.sub);
  }
}
