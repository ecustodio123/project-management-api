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
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';

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

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  addMember(
    @Param('id') projectId: string,
    @Body() addProjectMemberDto: AddProjectMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.addMember(
      projectId,
      addProjectMemberDto,
      request.user.sub,
    );
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  getMembers(
    @Param('id') projectId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.getMembers(projectId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Body() updateProjectMemberRoleDto: UpdateProjectMemberRoleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.updateMemberRole(
      projectId,
      userId,
      updateProjectMemberRoleDto,
      request.user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/members/:userId')
  removeMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.removeMember(
      projectId,
      userId,
      request.user.sub,
    );
  }

  @Get(':id/activity')
  @UseGuards(JwtAuthGuard)
  getActivity(
    @Param('id') projectId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.getActivity(projectId, request.user.sub);
  }
}
