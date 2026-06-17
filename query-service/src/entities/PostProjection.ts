import {
  Entity, Column, PrimaryColumn, 
  OneToMany, ManyToOne, JoinColumn, 
  CreateDateColumn, UpdateDateColumn
} from 'typeorm'; 
import { UserProjection } from './UserProjection'; 
import { Comment } from './Comment'; 

@Entity({ name: 'post-projection' }) 
export class PostProjection { 
  @PrimaryColumn({ type: 'int' }) 
  id: number; 

  @Column({ type: 'varchar', length: 255 }) 
  title: string; 

  @ManyToOne(() => UserProjection, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserProjection; 

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date; 

  @Column({ type: "int", default: 0 })
  totalComments: number;
} 