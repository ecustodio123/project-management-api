import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class AddProjectMemberDto {
  @ApiProperty({
    example: 'member@test.com',
    description: 'Email address of the user to add to the project',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    enum: ProjectRole,
    example: ProjectRole.MEMBER,
    description: 'Role assigned to the new project member',
  })
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}
