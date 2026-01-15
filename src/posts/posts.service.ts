import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'This is post 1',
      content: 'This is the content of the post',
      authorName: 'Habib',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'This is post 2',
      content: 'This is the content of the post',
      authorName: 'Karim',
      createdAt: new Date(),
    },
  ];

  getAllPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post {
    const post = this.getAllPosts().find((post) => post.id === id);
    if (!post) throw new NotFoundException(`No post found with this id ${id}`);
    return post;
  }

  deletePost(id: number): string {
    const post = this.getPostById(id);
    if (!post) throw new NotFoundException(`No post found with this id ${id}`);
    this.posts.filter((post) => post.id !== id);
    return 'Post deleted';
  }

  updatePost(id: number, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      throw new NotFoundException(`post with id ${id} not found!`);
    }

    const updatedPost: Post = {
      ...this.posts[index],
      ...data,
      updatedAt: new Date(),
    };
    this.posts[index] = updatedPost;
    return updatedPost;
  }

  createPost(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost = {
      id: this.getNextId(),
      createdAt: new Date(),
      ...createPostData,
    };
    this.posts.push(newPost);
    return newPost;
  }

  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }
}
