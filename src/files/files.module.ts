import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
@Module({
  imports: [PrismaModule, AuthModule, S3Module, ActivityLogModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
