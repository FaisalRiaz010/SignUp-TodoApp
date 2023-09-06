/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  text: string;
}