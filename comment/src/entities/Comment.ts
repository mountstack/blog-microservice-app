import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'comments' }) 
export class Comment { 
  @PrimaryGeneratedColumn() 
  id: number; 

  @Column({ type: 'text' }) 
  content: string; 

  @Column({ type: 'int' }) 
  postId: number; 

  @Column({ type: 'int' }) 
  userId: number; 

  @CreateDateColumn() 
  createdAt: Date; 

  @UpdateDateColumn() 
  updatedAt: Date; 
} 

