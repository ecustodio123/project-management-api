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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('Files')
@ApiBearerAuth()
@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tasks/:id/files')
  @ApiOperation({ summary: 'Upload a file to a task' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload. Allowed types: PNG, JPEG, PDF.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({
    status: 400,
    description: 'Missing file or invalid file type',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
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
  @ApiOperation({ summary: 'List files attached to a task' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiResponse({ status: 200, description: 'Task files returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findAll(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.filesService.findAll(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'id',
    example: 'a0b8d2ea-f98f-4a0d-a8e1-bfc41280bb10',
    description: 'File ID',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    schema: { example: { message: 'File deleted successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User cannot delete this file' })
  @ApiResponse({ status: 404, description: 'File not found' })
  remove(@Param('id') fileId: string, @Req() request: AuthenticatedRequest) {
    return this.filesService.remove(fileId, request.user.sub);
  }

  @Get('files/:id/download')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a signed download URL for a file' })
  @ApiParam({
    name: 'id',
    example: 'a0b8d2ea-f98f-4a0d-a8e1-bfc41280bb10',
    description: 'File ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Signed download URL returned',
    schema: {
      example: {
        url: 'https://enrique-project-management-dev.s3.us-east-1.amazonaws.com/tasks/task-id/file.pdf?...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'File not found' })
  getDownloadUrl(
    @Param('id') fileId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.filesService.getDownloadUrl(fileId, request.user.sub);
  }
}
