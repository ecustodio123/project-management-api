import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from '@prisma/client';

export class AddProjectMemberDto {
  @IsEmail()
  email!: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}
