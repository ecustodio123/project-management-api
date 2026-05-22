import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'enrique@test.com',
    description: 'User email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'User password with at least 8 characters',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
