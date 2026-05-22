import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
