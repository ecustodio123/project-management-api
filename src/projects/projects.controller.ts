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

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    schema: {
      example: {
        id: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
        name: 'Website Redesign',
        description: 'Client portal and marketing website redesign',
        ownerId: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
        createdAt: '2026-05-22T13:00:00.000Z',
        updatedAt: '2026-05-22T13:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.create(createProjectDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List projects for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Project list returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  findAll(@Req() request: AuthenticatedRequest) {
    return this.projectsService.findAll(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiResponse({ status: 200, description: 'Project returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.projectsService.findOne(id, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.update(id, updateProjectDto, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Project deleted successfully',
    schema: { example: { message: 'Project deleted successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.projectsService.remove(id, request.user.sub);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a member to a project' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiBody({ type: AddProjectMemberDto })
  @ApiResponse({ status: 201, description: 'Project member added' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Insufficient project permissions' })
  @ApiResponse({ status: 404, description: 'Project or user not found' })
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
  @ApiOperation({ summary: 'List project members' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiResponse({ status: 200, description: 'Project members returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  getMembers(
    @Param('id') projectId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.getMembers(projectId, request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId')
  @ApiOperation({ summary: 'Update a project member role' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiParam({
    name: 'userId',
    example: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
    description: 'User ID',
  })
  @ApiBody({ type: UpdateProjectMemberRoleDto })
  @ApiResponse({ status: 200, description: 'Project member role updated' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Insufficient project permissions' })
  @ApiResponse({ status: 404, description: 'Project member not found' })
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
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiParam({
    name: 'userId',
    example: '2b9e4e3c-7a43-4b71-a545-92ad3c42df31',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Project member removed',
    schema: { example: { message: 'Member removed successfully' } },
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Insufficient project permissions' })
  @ApiResponse({ status: 404, description: 'Project member not found' })
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
  @ApiOperation({ summary: 'List project activity log entries' })
  @ApiParam({
    name: 'id',
    example: '8d81cf0f-9f3f-4cf9-a2e3-7e75ed5c0f4f',
    description: 'Project ID',
  })
  @ApiResponse({ status: 200, description: 'Project activity returned' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'User is not a project member' })
  getActivity(
    @Param('id') projectId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.getActivity(projectId, request.user.sub);
  }
}
