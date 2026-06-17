import { 
  Entity, Column, PrimaryColumn, OneToMany, 
  CreateDateColumn, UpdateDateColumn
} from "typeorm"; 
import { PostProjection } from "./PostProjection";
import { Comment } from "./Comment";

@Entity({name: 'user-projection'})
export class UserProjection { 
  @PrimaryColumn({ type: "int" })
  id: number;

  @Column({ length: 100, nullable: true })
  name: string; 

  @Column({ type: 'varchar', unique: true, length: 100 }) 
  email: string;

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean; 

  @Column({length: 10, nullable: true}) 
  gender: string; 

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 20, nullable: true }) 
  phoneNumber: string; 

  @Column({ type: 'int', default: 0 }) 
  totalPosts: number; 

  @CreateDateColumn({ type: "timestamptz" }) 
  createdAt: Date; 

  @UpdateDateColumn({ type: "timestamptz" }) 
  updatedAt: Date; 

  @OneToMany(() => PostProjection, (post) => post.user)
  posts: PostProjection[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
} 