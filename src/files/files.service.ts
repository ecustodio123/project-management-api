import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { ActivityAction } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';
import {
  canManageProject,
  canWriteProjectContent,
} from 'src/projects/utils/project-permissions';

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
    private readonly activityLogService: ActivityLogService,
  ) {}

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

    if (!member || !canWriteProjectContent(member.role)) {
      throw new ForbiddenException(
        'You do not have permission to upload files',
      );
    }
    const uploadedFile = await this.s3Service.uploadFile(
      file,
      `tasks/${taskId}`,
    );

    const createdFile = await this.prisma.file.create({
      data: {
        originalName: file.originalname,
        filename: uploadedFile.key,
        path: uploadedFile.url,
        mimeType: file.mimetype,
        size: file.size,
        taskId,
        uploadedById: currentUserId,
      },
    });

    await this.activityLogService.log({
      action: ActivityAction.FILE_UPLOADED,
      entityType: 'FILE',
      entityId: createdFile.id,
      message: `Uploaded file "${file.originalname}"`,
      projectId: task.projectId,
      userId: currentUserId,
    });

    return createdFile;
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

    const isFileOwner = file.uploadedById === currentUserId;
    const canDeleteOthers = !member || canManageProject(member?.role);

    if (!isFileOwner && !canDeleteOthers) {
      throw new ForbiddenException(
        'You do not have permission to delete this file',
      );
    }

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

    await this.s3Service.deleteFile(file.filename);

    return {
      message: 'File deleted successfully',
    };
  }

  async getDownloadUrl(fileId: string, currentUserId: string) {
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

    return this.s3Service.getSignedDownloadUrl(file.filename);
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
