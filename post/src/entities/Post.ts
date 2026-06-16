import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'posts'})
export class Post { 
  @PrimaryGeneratedColumn() 
  id: number; 

  @Column({ type: 'varchar' })
  title: string; 

  @Column({ type: 'int' })
  userId: number; 

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date; 

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date; 
} 
