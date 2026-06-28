import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'; 
import { User } from './User'; 

@Entity({ name: 'profiles' }) 
export class Profile { 
  @PrimaryGeneratedColumn() 
  id: number; 

  @Column({ type: 'int' }) 
  userId: number; 
  
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' }) 
  user: User; 

  @Column({ default: "", length: 100 }) 
  name: string; 

  @Column({length: 10, nullable: true}) 
  gender: string; 

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 20, nullable: true }) 
  phoneNumber: string; 
} 