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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('Comments')
@ApiBearerAuth()
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tasks/:id/comments')
  @ApiOperation({ summary: 'Create a comment on a task' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
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
  @ApiOperation({ summary: 'List comments for a task' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiResponse({ status: 200, description: 'Task comments returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findAll(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.commentsService.findAll(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'id',
    example: 'f16f40d7-44e1-44cc-8963-72d735bb88a9',
    description: 'Comment ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
    schema: { example: { message: 'Comment deleted successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User cannot delete this comment' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') commentId: string, @Req() request: AuthenticatedRequest) {
    return this.commentsService.remove(commentId, request.user.sub);
  }
}
