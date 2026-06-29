import { 
  Entity, Column, PrimaryColumn, 
  ManyToOne, JoinColumn, 
  CreateDateColumn, UpdateDateColumn 
} from 'typeorm';
import { UserProjection } from './UserProjection'; 
import { PostProjection } from './PostProjection'; 

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' }) 
  content: string; 

  @ManyToOne(() => PostProjection, (post) => post.comments, { onDelete: 'CASCADE' }) 
  post: PostProjection; 

  @ManyToOne(() => UserProjection, (user) => user.comments, { onDelete: 'CASCADE' }) 
  user: UserProjection; 

  @CreateDateColumn({ type: 'timestamptz' }) 
  createdAt: Date; 

  @UpdateDateColumn({ type: 'timestamptz' }) 
  updatedAt: Date; 
} 