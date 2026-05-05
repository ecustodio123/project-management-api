import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
  };
};

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.create(createProjectDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.projectsService.findAll(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.projectsService.findOne(id, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.update(id, updateProjectDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.projectsService.remove(id, request.user.sub);
  }
}
