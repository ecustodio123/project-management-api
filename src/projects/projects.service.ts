import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRole } from '@prisma/client';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityAction } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(createProjectDto: CreateProjectDto, ownerId: string) {
    const { name, description } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: true,
      },
    });

    await this.activityLogService.log({
      action: ActivityAction.PROJECT_CREATED,
      entityType: 'PROJECT',
      entityId: project.id,
      message: `Project "${project.name}" was created`,
      projectId: project.id,
      userId: ownerId,
    });

    return project;
  }

  async findAll(ownerId: string) {
    return this.prisma.project.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    ownerId: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
  }

  async remove(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Project deleted successfully',
    };
  }

  async addMember(
    projectId: string,
    addProjectMemberDto: AddProjectMemberDto,
    currentUserId: string,
  ) {
    const { email, role = ProjectRole.MEMBER } = addProjectMemberDto;

    const currentMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!currentMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (
      currentMember.role !== ProjectRole.OWNER &&
      currentMember.role !== ProjectRole.ADMIN
    ) {
      throw new ForbiddenException('You do not have permission to add members');
    }

    const userToAdd = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userToAdd) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: userToAdd.id,
          projectId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    return this.prisma.projectMember.create({
      data: {
        userId: userToAdd.id,
        projectId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getMembers(projectId: string, currentUserId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return this.prisma.projectMember.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateMemberRole(
    projectId: string,
    userId: string,
    updateProjectMemberRoleDto: UpdateProjectMemberRoleDto,
    currentUserId: string,
  ) {
    const { role } = updateProjectMemberRoleDto;

    const currentMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!currentMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (currentMember.role !== ProjectRole.OWNER) {
      throw new ForbiddenException('Only the project owner can update roles');
    }

    const memberToUpdate = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!memberToUpdate) {
      throw new NotFoundException('Member not found');
    }

    if (memberToUpdate.role === ProjectRole.OWNER) {
      throw new BadRequestException('Cannot change the project owner role');
    }

    return this.prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async removeMember(projectId: string, userId: string, currentUserId: string) {
    const currentMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!currentMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (currentMember.role !== ProjectRole.OWNER) {
      throw new ForbiddenException('Only the project owner can remove members');
    }

    const memberToRemove = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Member not found');
    }

    if (memberToRemove.role === ProjectRole.OWNER) {
      throw new BadRequestException('Cannot remove the project owner');
    }

    await this.prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return {
      message: 'Member removed successfully',
    };
  }

  async getActivity(projectId: string, currentUserId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return this.prisma.activityLog.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
