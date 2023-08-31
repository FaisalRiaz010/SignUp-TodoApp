/* eslint-disable prettier/prettier */
// todo.processor.ts

import { Job } from 'bull';
import { TodosService } from './services/todos/todos.service';
import { CreateTodos } from './dtos/createtodo.dto';
import { Processor, Process } from '@nestjs/bull';

@Processor('todo')
export class TodoProcessor {
  constructor(private readonly todosService: TodosService) {}

  @Process('insertTodo')
  async insertTodo(job: Job<{ data: CreateTodos; userId: number }>) {
    console.log('Processing job:', job.data); //for queue checking
    const { userId, data } = job.data; //store job data into variable for stroing data in db
    await this.todosService.insertTodo(userId, data);
    console.log('added to db sucessfully');
    console.log(
      'now remove data from the queue as it sucessfully added tot db',
    );
    try {
      setTimeout(async () => {
        await job.remove(); // Remove the job after a delay
        console.log('Job removed successfully');
      }, 1000); // Delay of 1 second
    } catch (error) {
      console.error('Error while removing job:', error);
    }
  }
}
