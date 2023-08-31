/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodosService } from 'src/todos/services/todos/todos.service';
import { Todo } from 'typeorm/entities/Todo';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { CreateTodos } from 'src/todos/dtos/createtodo.dto';
import { TodoQueueService } from 'src/todos/todo-queue.service';
import { TodoCronService } from 'src/todos/todos-cron.service';

// FOr swagger setup follow the link
//https://github.com/nestjs/nest/blob/master/sample/11-swagger/src/cats/cats.controller.ts

@ApiTags('todos') // Adds a tag to the Swagger  for this controller
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly todoQueueService: TodoQueueService,
    private readonly todoCronService: TodoCronService,
  ) {} //create constructor

  //Post todo by using user id for login
  @Post('addtodo') //post addtodo like /todos/addtodo
  @ApiOperation({ summary: 'Create a new todo item' }) //in swagger show the Operation what to do
  @ApiBody({ type: Todo, description: 'Todo object with title and userId' }) //give the body to type
  @ApiResponse({
    status: 201,
    description: 'The todo item has been successfully created.',
    type: Todo,
  }) //give response back
  async createTodo(
    @Body('userId') UserId: number,
    @Body() createTodos: CreateTodos,
  ): Promise<Todo> {
    return this.todosService.createTodo(UserId, createTodos);
  }

  //login user and create todo

  @Post(':userId/login')
  @ApiOperation({ summary: 'Login Todo' })
  @ApiResponse({ status: 200, description: 'ceck items.', type: Todo })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async loginTodo(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('userId') userId: number,
    @Body() createTodos: CreateTodos,
  ): Promise<Todo> {
    return await this.todosService.loginTodo(
     email,
      password,
      userId,
      createTodos,
    );
  }
  //check by using redis queue
  @Post('addtodoqueue') //post addtodo like /todos/addtodo
  @ApiOperation({ summary: 'Create a new todo item' }) //in swagger show the Operation what to do
  @ApiBody({ type: Todo, description: 'Todo object with title and userId' }) //give the body to type
  @ApiResponse({
    status: 201,
    description: 'The todo item has been successfully created.',
    type: Todo,
  }) //give response back
  async insertTodo(
    @Body('userId') userId: number,
    @Body() createTodos: CreateTodos,
  ) {
    // Add todo data to the Redis queue
    await this.todoQueueService.addToQueue(userId, createTodos);

    console.log('datainserted into queue');
    console.log('Data goes to db');
    return this.todosService.insertTodo(userId, createTodos);
  }

  //for check completed todos
  //use patch beacuse we just partially update the todo not fully if want fully than we use put
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a todo item as completed' })
  @ApiBody({ type: Todo, description: 'userId' }) //give the body to type
  @ApiParam({ name: 'id', description: 'Todo item ID', type: 'number' }) //give id of the added todo as a parameter
  @ApiResponse({
    status: 200,
    description: 'The todo item has been marked as completed.',
    type: Todo,
  })
  async markTodoAsCompleted(
    @Param('id') id: number,
    @Body('userId') userIdd: number,
  ): Promise<Todo> {
    console.log('username', userIdd);
    return this.todosService.markTodoAsCompleted(id, userIdd);
  }

  //get all the todos add by specific user
  @Get(':id/todos')
  @ApiOperation({ summary: 'Put Id to get all todos' })
  @ApiResponse({ status: 200, description: 'Return todo items.', type: [Todo] })
  async getallTodosByUser(@Param('id') userId: number): Promise<Todo[]> {
    return this.todosService.getallTodosByUser(userId);
  }
  //delete the todo getting by id
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete Todo' })
  @ApiParam({ name: 'id', description: 'Todo item ID', type: 'number' }) //give id of the added todo as a parameter
  @ApiResponse({
    status: 200,
    description: 'The todo item has been Deleted Successfully.',
    type: Todo,
  })
  async RemoveTodo(@Param('id') id: number,
  @Param('UserId') userId: number): Promise<Todo> {
    return this.todosService.RemoveTodo(userId,id);
  }

  //update
  @Put(':id/updateTodo')
  @ApiOperation({ summary: 'Update todo Title' }) //in swagger show the Operation what to do
  @ApiBody({ type: Todo, description: 'Todo object with title and userId' }) //give the body to type
  @ApiResponse({
    status: 201,
    description: 'The todo item has been successfully updated.',
    type: Todo,
  }) //give response back
  async updateTodo(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Body() UpdateTodos,
  ): Promise<Todo> {
    return this.todosService.updateTodo(id,userId, UpdateTodos.title);
  }

  //get the  pendings todos by a specific users
  @Get(':userId/pending')
  @ApiOperation({ summary: 'Pending tasks' })
  @ApiResponse({
    status: 200,
    description: 'Returns pending todo items.',
    type: [Todo],
  })
  async getallPendTodosByUser(
    @Param('userId') userId: number,
  ): Promise<Todo[]> {
    return this.todosService.getallPendTodosByUser(userId);
  }

  //get the completed todos by a user
  @Get(':userId/completed')
  @ApiOperation({ summary: 'Completed tasks' })
  @ApiResponse({
    status: 200,
    description: 'Returns pending todo items.',
    type: [Todo],
  })
  async completedTodosByUser(@Param('userId') userId: number): Promise<Todo[]> {
    return this.todosService.completedTodosByUser(userId);
  }

  //Get the all users sending email alerts for pending task after eavey 5 hours
  @Get('send-emails')
  async sendScheduledEmailsManually() {
    try {
      await this.todoCronService.sendScheduledEmails();
      return { message: 'Emails sent successfully' };
    } catch (error) {
      return { error: 'An error occurred while sending emails' };
    }
  }
  //check usng pagination keyset and offset
  @Get('keyset')
  async findTodosWithOffset(
    @Query('lastId') lastId: number, //apllying query to check on limits and id check
    @Query('limit') limit: number,
  ): Promise<Todo[]> {
    return this.todosService.findTodosWithOffset(lastId, limit);
  }
}
