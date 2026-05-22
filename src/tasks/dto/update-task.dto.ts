import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Create login page',
    description: 'Updated task title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Build responsive login UI and connect it to the auth endpoint',
    description: 'Updated task description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.REVIEW,
    description: 'Updated task status',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.URGENT,
    description: 'Updated task priority',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '7d2dbd8f-0f7f-4f7e-9d67-8d0a8f2d3a25',
    description: 'Updated assigned user ID',
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    example: '2026-06-15T00:00:00.000Z',
    description: 'Updated due date in ISO 8601 format',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
