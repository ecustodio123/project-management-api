import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'I pushed the first version for review.',
    description: 'Comment content',
  })
  @IsString()
  @IsNotEmpty()
  content?: string;
}
