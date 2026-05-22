import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class UpdateProjectMemberRoleDto {
  @ApiProperty({
    enum: ProjectRole,
    example: ProjectRole.ADMIN,
    description: 'New role for the project member',
  })
  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
