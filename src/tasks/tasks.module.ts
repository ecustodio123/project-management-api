import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
@Module({
  imports: [PrismaModule, AuthModule, ActivityLogModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
