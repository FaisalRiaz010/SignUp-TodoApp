/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, Entity, OneToMany, } from 'typeorm';
import { Todo } from './Todo';

@Entity() // Add the @Entity() decorator
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'default_username' }) // Set a default value for username
  username: string;
  @Column({ default: 'default_email' }) // Set a default value for email
  email: string;
  

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;
  verification: any;
  static verificationToken: string;

  @Column({ nullable: true }) // Add this column for 2FA secret key
  twoFactorSecret: string;
  
   //one to many relation that one user can create multiple todos
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  
}
