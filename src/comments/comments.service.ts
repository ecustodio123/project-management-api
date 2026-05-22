import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.taskComment.create({
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

    await this.prisma.taskComment.delete({
      where: {
        id: commentId,
      },
    });

    return {
      message: 'Comment deleted successfully',
    };
  }
}
