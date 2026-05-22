import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tasks/:id/comments')
  create(
    @Param('id') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.commentsService.create(
      taskId,
      createCommentDto,
      request.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:id/comments')
  findAll(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.commentsService.findAll(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id') commentId: string, @Req() request: AuthenticatedRequest) {
    return this.commentsService.remove(commentId, request.user.sub);
  }
}
