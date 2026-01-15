import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {Post} from 'src/posts/entities/post.entity'

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password:string // hash the password

  @Column()
  name:string

  @Column({type:'enum',
    enum:UserRole,
    default:UserRole.USER
  })
  role:UserRole

  @OneToMany(()=>Post,(post)=>post.author)
  posts:Post[]

  @CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;
}
