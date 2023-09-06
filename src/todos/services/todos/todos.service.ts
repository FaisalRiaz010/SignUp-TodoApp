/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { CreateTodos } from 'src/todos/dtos/createtodo.dto';
import { Todo } from 'typeorm/entities/Todo';
import { MoreThan, Not, Repository } from 'typeorm';
//TypeORM Repository design pattern, each entity has its own Repository.
//These repositories can be obtained from the database connection

@Injectable() //for injections
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    @InjectQueue('todo') private readonly todoQueue: Queue,
  ) {}

  //create todo funciton for cretiing the todo by using user id after authentication user can create it
  async createTodo(userId: number, createtodo: CreateTodos): Promise<Todo> {
    const todo = this.todoRepository.create({
      user: { id: userId, isVerified:true },
      ...createtodo,
    });
    console.log(todo);

    return this.todoRepository.save(todo);
  }
  //check for using queue to insert todo using queue and than to db
  async insertTodo(userId: number, createtodo: CreateTodos): Promise<Todo> {
    const todocheck = await this.todoRepository.find({
      where: { user: { id: userId,isVerified:true } },
    });
    if (!todocheck) {
      throw new NotFoundException('User not found');
    }
    const todo = this.todoRepository.create({
      user: { id: userId },
      ...createtodo,
    });
    return this.todoRepository.save(todo);
  }
  //login
  async loginTodo(
    email: string,
    password: string,
    userId: number,
    createTodos: CreateTodos,
  ): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      relations: ['user'],
      where: {
        user: {
          id: userId,
          email: email,
          password: password,
          isVerified:true,
        },
      },
    });

    if (!todo) {
      throw new NotFoundException('User not found');
    }

    console.log(email);
    if (
      email !== todo.user.username &&
      userId !== todo.user.id &&
      password !== todo.user.password
    ) {
      console.log('username wrong');
    }
    const todoCreate = this.todoRepository.create({
      user: { id: userId },
      ...createTodos,
    });
    console.log(todoCreate);

    return this.todoRepository.save(todoCreate);
  }

  //check by todo id that this todo is completed
  async markTodoAsCompleted(idd: number, userIdd: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: {
        id: idd,
        user: {
          id: userIdd,
          isVerified:true
        },
      },
    });
    console.log(userIdd);
    console.log(idd);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.completed = true;
    if (!userIdd) {
      throw new NotFoundException('wrong  Id username');
    }
    return this.todoRepository.save(todo);
  }
  //find all the todos created by specific user
  async getallTodosByUser(userId: number): Promise<Todo[]> {
    const todo = await this.todoRepository.find({
      where: { user: { id: userId,isVerified:true } },
    });
    return todo;
  }
  //delete todo by id
  async RemoveTodo(id: number,userId:number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id ,completed:false,
    user:{
      id:userId,isVerified:true
    } 
  }});
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return this.todoRepository.remove(todo);
  }

  //update totdo title and date
  async updateTodo(id: number,userId:number, updatetitle: string): Promise<Todo> {
    const existtodo = await this.todoRepository.findOne({ where: { id,completed:false, user:{
      id:userId,isVerified:true
    }  } });
    console.log(existtodo);
    if (!existtodo) {
      throw new NotFoundException('todo not FOund');
    }
    existtodo.title = updatetitle;
    console.log(updatetitle);
    const updatetodo = await this.todoRepository.save(existtodo);
    return updatetodo;
  }

  //get the completed Todos by specific User
  async completedTodosByUser(userId: number): Promise<Todo[]> {
    {
      const todos = await this.todoRepository.find({
        where: {
          user: { id: userId,isVerified:true },
          completed: true,
        },
      });
      return todos;
    }
  }

  //findthe pending tasks by users
  async getallPendTodosByUser(userId: number): Promise<Todo[]> {
    {
      const todos = await this.todoRepository.find({
        where: {
          user: { id: userId,isVerified:true },
          completed: false,
        },
      });
      return todos;
    }
  }


  //email todos finding
  async findTodosWithUserEmails(): Promise<Todo[]> {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      where: {
        user: {
          email: Not(''),
          isVerified:true
        },
      },
    });

    return todos;
  }

  //OFSET PAGINATION
  async findTodosWithOffset(offset: number, limit: number): Promise<Todo[]> {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      skip: offset,
      take: limit,
      order: {
        id: 'ASC',
      },
    });
    console.log(todos);
    return todos;
  }
  //keySet
  async findTodosWithKeyset(lastId: number, limit: number): Promise<Todo[]> {
    const todos = await this.todoRepository.find({
      relations: ['user'],
      where: {
        id: MoreThan(lastId),
      },
      take: limit,
      order: {
        id: 'ASC',
      },
    });
    console.log(todos);
    return todos;
  }
  
}
