import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { FilesModule } from './files/files.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    FilesModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
