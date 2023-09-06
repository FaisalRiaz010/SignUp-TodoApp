/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Todo } from './Todo';
import { Comment } from './comments';

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
  @Column({ default: '' })
  twoFactorSecret: string;
  
  @Column({ type: 'varchar', length: 4096, default:'' }) // Increased length
qrcodeUrl: string;
  //one to many relation that one user can create multiple todos
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
  //relation with comment
  @OneToMany(() => Comment, (comment) => comment.commentableUser)
  comments: Comment[];
}
