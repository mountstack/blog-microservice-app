import {
  Entity, Column, PrimaryColumn, 
  OneToMany, ManyToOne, JoinColumn, 
  CreateDateColumn, UpdateDateColumn
} from 'typeorm'; 
import { User } from './User'; 
import { Comment } from './Comment'; 

@Entity({ name: 'posts' }) 
export class Post { 
  @PrimaryColumn({ type: 'int' }) 
  id: number; 

  @Column({ type: 'varchar', length: 255 }) 
  title: string; 

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User; 

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date; 

  @Column({ type: "int", default: 0 })
  commentCount: number;
} 