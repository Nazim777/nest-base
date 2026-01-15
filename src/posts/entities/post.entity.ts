import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({length:20})
    title:string;

    @Column({type:'text'})
    content:string;

    @Column({length:20})
    authorName:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt:Date;

}