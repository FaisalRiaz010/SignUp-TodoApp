/* eslint-disable prettier/prettier */
// comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'typeorm/entities/Todo';
import { User } from 'typeorm/entities/User';
import { Comment } from 'typeorm/entities/comments';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User) // Inject the User repository
        private readonly userRepository: Repository<User>,
        @InjectRepository(Todo) // Inject the Todo repository
        private readonly todoRepository: Repository<Todo>,
      ) {}
    //post comment for either user or TOdo
      async createComment(userId: number, text: string, type: string): Promise<Comment> {
        // Check if the type is 'User' or 'Todo'
        if (type !== 'User' && type !== 'Todo') {
          throw new NotFoundException('Invalid commentable type');
        }
    
        // Find the commentable entity (either User or Todo) by ID
        const commentable = type === 'User'
          ? await this.userRepository.findOne({ where: { id: userId } })
          : await this.todoRepository.findOne({ where: { id: userId } });
    
        if (!commentable) {
          throw new NotFoundException(`${type} not found`);
        }
    
        // Create a new comment associated with the commentable entity
        const comment = this.commentRepository.create({
          text,
          commentableUser: type === 'User' ? commentable : null,
          commentableTodo: type === 'Todo' ? commentable : null,
          commentableId: commentable.id,
          commentableType: type,
        });
    
        // Save the comment to the database
        return await this.commentRepository.save(comment);
      }
    
     

  async findAll(): Promise<Comment[]> {
   
 return await this.commentRepository.find();
  }

  async findByUser(userId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: {
        commentableId: userId,
        commentableType: 'User',
      },
    });
  }

  async findByTodo(TodoId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: {
        commentableId: TodoId,
        commentableType: 'Todo',
      },
    });
  }
}
