/* eslint-disable prettier/prettier */
// todo-queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTodos } from './dtos/createtodo.dto';

@Injectable()
export class TodoQueueService {
  constructor(@InjectQueue('todo') private readonly todoQueue: Queue) {}

  // Function to add the data of todo in the queue
  async addToQueue(userId: number, todoData: CreateTodos) {
    // Add the userId to the job data
    const jobData = { userId, ...todoData };

    console.log('Adding item to queue:', jobData);
    await this.todoQueue.add(jobData);
    console.log('Completed!');
  }
}
