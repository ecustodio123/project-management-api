import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityLogInput } from './interfaces/create-activity-log.interface';

@Injectable()
export class ActivityLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: CreateActivityLogInput) {
    return this.prisma.activityLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        message: input.message,
        metadata: input.metadata,
        projectId: input.projectId,
        userId: input.userId,
      },
    });
  }
}
