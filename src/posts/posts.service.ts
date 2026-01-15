import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async create(createPostData: createPostDto): Promise<Post> {
    const newPost = {
      title: createPostData.title,
      content: createPostData.content,
      authorName: createPostData.authorName,
    };
    return await this.postsRepository.save(newPost);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Post with this id ${id} not found`);
    }
    return post;
  }

  async delete(id:number):Promise<string>{
    await this.postsRepository.delete(id)
    return 'Post deleted'
  }

  async update(id:number, updatePostData:updatePostDto):Promise<Post>{
    const findPostToUpdate = await this.findOne(id);

    if(findPostToUpdate.title && updatePostData.title){
      findPostToUpdate.title = updatePostData.title
    }

    if(findPostToUpdate.content && updatePostData.content){
      findPostToUpdate.content = updatePostData.content
    }

    if(findPostToUpdate.authorName && updatePostData.authorName){
      findPostToUpdate.authorName = updatePostData.authorName
    }

    return this.postsRepository.save(findPostToUpdate)

  }
}
