import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { unlink } from 'fs/promises';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(
    taskId: string,
    file: Express.Multer.File,
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

    return this.prisma.file.create({
      data: {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimeType: file.mimetype,
        size: file.size,
        taskId,
        uploadedById: currentUserId,
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

    return this.prisma.file.findMany({
      where: {
        taskId,
      },
      include: {
        uploadedBy: {
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

  async remove(fileId: string, currentUserId: string) {
    const file = await this.prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        task: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: currentUserId,
          projectId: file.task.projectId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project');
    }

    const canDelete =
      file.uploadedById === currentUserId || member.role === 'OWNER';

    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this file',
      );
    }

    await this.prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    try {
      await unlink(file.path);
    } catch {
      // El archivo físico puede no existir, pero la metadata ya fue eliminada.
    }

    return {
      message: 'File deleted successfully',
    };
  }
}
