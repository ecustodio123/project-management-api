import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: 'Website Redesign Phase 2',
    description: 'Updated project name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated project scope for phase 2',
    description: 'Updated project description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
