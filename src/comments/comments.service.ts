import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ActivityAction } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  canManageProject,
  canWriteProjectContent,
} from '../projects/utils/project-permissions';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    currentUserId: string,
  ) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId: task.projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (!canWriteProjectContent(member.role)) {
      throw new ForbiddenException('You do not have permission to comment');
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        content: createCommentDto.content || '',
        taskId,
        userId: currentUserId,
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

    await this.activityLogService.log({
      action: ActivityAction.COMMENT_CREATED,
      entityType: 'COMMENT',
      entityId: comment.id,
      message: 'Comment added to task',
      projectId: task.projectId,
      userId: currentUserId,
    });

    return comment;
  }

  async findAll(taskId: string, currentUserId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId: task.projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return this.prisma.taskComment.findMany({
      where: {
        taskId,
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

  async remove(commentId: string, currentUserId: string) {
    const comment = await this.prisma.taskComment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        task: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId: comment.task.projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const canDelete =
      comment.userId === currentUserId || member.role === 'OWNER';

    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    const isCommentOwner = comment.userId === currentUserId;
    const canDeleteOthers = canManageProject(member.role);

    if (!isCommentOwner && !canDeleteOthers) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    await this.prisma.taskComment.delete({
      where: {
        id: commentId,
      },
    });

    return {
      message: 'Comment deleted successfully',
    };
  }

  private async getProjectMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    return member;
  }
}
