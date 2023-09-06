/* eslint-disable prettier/prettier */
// comment.controller.ts
import { Controller, Post, Get, Param, Body, NotFoundException } from '@nestjs/common';
import { CommentService } from './comments.service';
import { Comment } from 'typeorm/entities/comments';
import { CommentDto } from 'src/todos/dtos/comment.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';


@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  
  
  @Post('create/:type/:id')
  @ApiOperation({ summary: 'Create a comment for a user or todo' })
  @ApiParam({ name: 'type', description: 'Type of commentable entity (User or Todo)' })
  @ApiParam({ name: 'id', description: 'ID of the commentable entity' })
  @ApiBody({ type: CommentDto }) // Use CommentDto to define the request body
  async createComment(
    @Param('id') id: number,
    @Param('type') type: string,
    @Body() commentDto: CommentDto, // Use CommentDto here
  ) {
    const comment = await this.commentService.createComment(id, commentDto.text, type);
    return comment;
    }

  @Get('check/:check')
  @ApiParam({ name: 'check', description: 'Type Password' })
  async findAll(
    @Param('check') check:string,
  ): Promise<Comment[]> {
    if (check !== "abc123") {
        throw new NotFoundException('Invalid commentable type');
      }
    return await this.commentService.findAll();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number): Promise<Comment[]> {
    return await this.commentService.findByUser(userId);
  }

  @Get('Todo/:TodoId')
  async findByPost(@Param('TodoId') TodoId: number): Promise<Comment[]> {
    return await this.commentService.findByTodo(TodoId);
  }
}
