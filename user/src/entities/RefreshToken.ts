import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'; 
import { User } from './User';

@Entity({ name: 'refresh-tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  token: string;

  @Column({ default: "Unknown Device" })
  device: string;

  @Column({ type: "timestamp" })
  expiresAt: Date; 

  @Column({ type: "int" })
  userId: number; 

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;
}