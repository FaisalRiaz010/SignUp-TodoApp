/* eslint-disable prettier/prettier */
// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'typeorm/entities/comments';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { UsersModule } from 'src/user/user.module';
import { TodosModule } from 'src/todos/todos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),UsersModule,TodosModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService], // Export CommentService for use in other modules
})
export class CommentsModule {}
