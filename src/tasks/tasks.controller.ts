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

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('projects/:id/tasks')
  create(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.create(projectId, createTaskDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects/:id/tasks')
  findAll(
    @Param('id') projectId: string,
    @Query() query: GetTasksQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.findAll(projectId, request.user.sub, query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('tasks/:id')
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.update(taskId, updateTaskDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('tasks/:id')
  remove(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.tasksService.remove(taskId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tasks/:id')
  findOne(@Param('id') taskId: string, @Req() request: AuthenticatedRequest) {
    return this.tasksService.findOne(taskId, request.user.sub);
  }
}
