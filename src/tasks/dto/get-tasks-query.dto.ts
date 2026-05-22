import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class GetTasksQueryDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Filter tasks by status',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Filter tasks by priority',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '7d2dbd8f-0f7f-4f7e-9d67-8d0a8f2d3a25',
    description: 'Filter tasks by assigned user ID',
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of tasks per page',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
