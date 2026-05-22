import { Prisma } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityAction } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(
    projectId: string,
    createTaskDto: CreateTaskDto,
    currentUserId: string,
  ) {
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

    if (createTaskDto.assigneeId) {
      const assigneeMember = await this.prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: createTaskDto.assigneeId,
            projectId,
          },
        },
      });

      if (!assigneeMember) {
        throw new NotFoundException(
          'Assigned user is not a member of this project',
        );
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate
          ? new Date(createTaskDto.dueDate)
          : undefined,
        assigneeId: createTaskDto.assigneeId,
        projectId,
        createdById: currentUserId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.activityLogService.log({
      action: ActivityAction.TASK_CREATED,
      entityType: 'TASK',
      entityId: task.id,
      message: `Task "${task.title}" was created`,
      projectId,
      userId: currentUserId,
    });

    return task;
  }

  async findAll(
    projectId: string,
    currentUserId: string,
    query: GetTasksQueryDto,
  ) {
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

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      projectId,
      status: query.status,
      priority: query.priority,
      assigneeId: query.assigneeId,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
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
      }),
      this.prisma.task.count({
        where,
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
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

    if (updateTaskDto.assigneeId) {
      const assigneeMember = await this.prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: updateTaskDto.assigneeId,
            projectId: task.projectId,
          },
        },
      });

      if (!assigneeMember) {
        throw new NotFoundException(
          'Assigned user is not a member of this project',
        );
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.activityLogService.log({
      action: ActivityAction.TASK_UPDATED,
      entityType: 'TASK',
      entityId: updatedTask.id,
      message: `Task "${updatedTask.title}" was updated`,
      projectId: task.projectId,
      userId: currentUserId,
    });

    return updatedTask;
  }

  async remove(taskId: string, currentUserId: string) {
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

    await this.activityLogService.log({
      action: ActivityAction.TASK_DELETED,
      entityType: 'TASK',
      entityId: task.id,
      message: `Task "${task.title}" was deleted`,
      projectId: task.projectId,
      userId: currentUserId,
    });

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return {
      message: 'Task deleted successfully',
    };
  }

  async findOne(taskId: string, currentUserId: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
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

    return task;
  }
}
