import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'; 
import { RefreshToken } from './RefreshToken';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "", length: 100 })
  name: string;

  @Column({ default: false }) 
  isSuspended: boolean;

  @Column({ unique: true, length: 100 }) 
  email: string;

  @Column({ select: false, length: 100 }) 
  password: string; 

  @CreateDateColumn({ type: "timestamptz" }) 
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" }) 
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
} 