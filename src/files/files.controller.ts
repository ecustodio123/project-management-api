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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
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
      storage: diskStorage({
        destination: './uploads/tasks',
        filename: (_, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),
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
}
