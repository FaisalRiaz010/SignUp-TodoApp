/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
@Entity() // Add the @Entity() decorator
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'default_Title' }) // Set a default value for username
  title: string;

  @Column({
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp',
  })
  duedate: Date;

  @Column({ default: false })
  completed: boolean;

  //build many to one relation with user that specific user by using id create todo
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
