/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TodosController } from './controllers/todos/todos.controller';
import { TodosService } from './services/todos/todos.service';
import { Todo } from 'typeorm/entities/Todo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TodoQueueService } from './todo-queue.service';
import { TodoProcessor } from './todo.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { TodoCronService } from './todos-cron.service';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    Repository,
    TypeOrmModule.forFeature([Todo]),
    BullModule.registerQueue({
      name: 'todo',
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [TodosController],
  providers: [
    TodosService,
    TodoQueueService,
    TodoProcessor,
    TodoCronService,
    EmailService,
  ],
})
export class TodosModule {}
