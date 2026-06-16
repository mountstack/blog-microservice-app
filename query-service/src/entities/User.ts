import { 
  Entity, Column, PrimaryColumn, OneToMany, 
  CreateDateColumn, UpdateDateColumn
} from "typeorm"; 
import { Post } from "./Post";
import { Comment } from "./Comment";

@Entity({name: 'users'})
export class User { 
  @PrimaryColumn({ type: "int" })
  id: number;

  @Column({ type: 'varchar', default: "", length: 100 })
  name: string; 

  @Column({ type: 'varchar', unique: true, length: 100 }) 
  email: string;

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean; 

  @CreateDateColumn({ type: "timestamptz" }) 
  createdAt: Date; 

  @UpdateDateColumn({ type: "timestamptz" }) 
  updatedAt: Date; 

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
} 