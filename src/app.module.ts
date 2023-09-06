/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { User } from 'typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { Todo } from 'typeorm/entities/Todo';
import { Comment } from 'typeorm/entities/comments';
import { CommentController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'signup',
      entities: [User,Todo,Comment], // Add entity
       synchronize: true,
    }), UsersModule, AuthModule,TodosModule, CommentsModule],
  controllers: [AppController, CommentController],
  providers: [AppService],
})
export class AppModule {}
