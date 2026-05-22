import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Enrique Custodio',
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'enrique@test.com',
    description: 'Unique user email address',
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
