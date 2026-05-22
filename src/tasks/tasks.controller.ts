import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('projects/:id/tasks')
  @ApiOperation({ summary: 'Create a task in a project' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  create(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.create(projectId, createTaskDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects/:id/tasks')
  @ApiOperation({ summary: 'List tasks in a project' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'priority', enum: TaskPriority, required: false })
  @ApiQuery({
    name: 'assigneeId',
    example: '7d2dbd8f-0f7f-4f7e-9d67-8d0a8f2d3a25',
    required: false,
  })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @ApiResponse({ status: 200, description: 'Paginated task list returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  findAll(
    @Param('id') projectId: string,
    @Query() query: GetTasksQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.findAll(projectId, request.user.sub, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.update(taskId, updateTaskDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully',
    schema: { example: { message: 'Task deleted successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.tasksService.remove(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({
    name: 'id',
    example: '6a899b3e-b7c2-4df6-85d4-b938a4f5440f',
    description: 'Task ID',
  })
  @ApiResponse({ status: 200, description: 'Task returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.tasksService.findOne(taskId, request.user.sub);
  }
}
