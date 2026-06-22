import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name: 'posts'}) 
export class Post { 
  @PrimaryGeneratedColumn() 
  id: number; 

  @Column({ type: 'varchar', length: 400 }) 
  title: string; 

  @Column({ type: 'varchar', length: 100, default: 'bg-gradient-to-r from-gray-600 to-black' }) 
  bgColor: string; 

  @Column({ type: 'int' }) 
  userId: number; 

  @CreateDateColumn({ type: "timestamptz" }) 
  createdAt: Date; 

  @UpdateDateColumn({ type: "timestamptz" }) 
  updatedAt: Date; 
} 
