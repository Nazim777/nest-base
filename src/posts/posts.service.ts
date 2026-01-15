import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({relations:['author']});
  }

  

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({where:{id},relations:['author']});
    if (!post) {
      throw new NotFoundException(`Post with this id ${id} not found`);
    }
    return post;
  }

  
async create(createPostData: createPostDto,user:User): Promise<Post> {
    const newPost = {
      title: createPostData.title,
      content: createPostData.content,
      author:user
    };
    return await this.postsRepository.save(newPost);
  }

  async update(id:number, updatePostData:updatePostDto,user:User):Promise<Post>{
    const findPostToUpdate = await this.findOne(id);
    if(findPostToUpdate.author.id !==user.id && user.role !=='Admin'){  // post onwer and admin can update post
      throw new ForbiddenException('You can only update your own post')
    }

    if(findPostToUpdate.title && updatePostData.title){
      findPostToUpdate.title = updatePostData.title
    }

    if(findPostToUpdate.content && updatePostData.content){
      findPostToUpdate.content = updatePostData.content
    }


    return this.postsRepository.save(findPostToUpdate)

  }

  async delete(id:number):Promise<string>{
    await this.postsRepository.delete(id)
    return 'Post deleted'
  }
}
