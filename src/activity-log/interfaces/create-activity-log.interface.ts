import { ActivityAction, Prisma } from '@prisma/client';

export interface CreateActivityLogInput {
  action: ActivityAction;
  entityType: string;
  entityId: string;
  message: string;
  projectId: string;
  userId: string;
  metadata?: Prisma.InputJsonValue;
}
