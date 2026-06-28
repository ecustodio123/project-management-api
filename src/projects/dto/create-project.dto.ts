import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Website Redesign',
    description: 'Project name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Client portal and marketing website redesign',
    description: 'Project description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  role?: ProjectRole;
}
