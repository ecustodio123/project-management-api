import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Create login page',
    description: 'Task title',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: 'Build responsive login UI and connect it to the auth endpoint',
    description: 'Task description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '7d2dbd8f-0f7f-4f7e-9d67-8d0a8f2d3a25',
    description: 'User ID assigned to the task',
  })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: 'Task priority',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-06-15T00:00:00.000Z',
    description: 'Task due date in ISO 8601 format',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
