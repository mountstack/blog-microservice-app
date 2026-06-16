import { 
  Entity, Column, PrimaryColumn, 
  ManyToOne, JoinColumn, 
  CreateDateColumn, UpdateDateColumn 
} from 'typeorm';
import { User } from './User'; 
import { Post } from './Post'; 

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' }) 
  content: string; 

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' }) 
  post: Post; 

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' }) 
  user: User; 

  @CreateDateColumn({ type: 'timestamptz' }) 
  createdAt: Date; 

  @UpdateDateColumn({ type: 'timestamptz' }) 
  updatedAt: Date; 
} 