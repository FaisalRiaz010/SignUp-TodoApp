/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Todo } from './Todo';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => User, { nullable: true,  })
    @JoinColumn({ name: 'commentableUserId', referencedColumnName: 'id' }) 
    commentableUser: User;

    @ManyToOne(() => Todo, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentableTodoId', referencedColumnName: 'id' }) 
    commentableTodo: Todo;

    @Column()
    commentableId: number;

    @Column()
    commentableType: string;
}
