import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Search,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';
import { PostExistPipe } from './pipes/post-exist.pipe';
import {  Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

@Get()
async  getAllPosts(@Query('search') search?: string): Promise< PostEntity[]> {
    const allPosts = await this.postsService.findAll();
    return allPosts;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost (@Body() createPostData:createPostDto):Promise<PostEntity>{
    return this.postsService.create(createPostData)
  }

  @Get(':id')
  async getPostById(@Param('id',ParseIntPipe,PostExistPipe) id:number):Promise<PostEntity>{
    return await this.postsService.findOne(id)
  }

  @Delete(':id')
  async deletePost(@Param('id',ParseIntPipe,PostExistPipe) id:number):Promise<string>{
    return await this.postsService.delete(id);
  }

  @Put(':id')
  async updatePost(@Param('id',ParseIntPipe,PostExistPipe) id:number, @Body() updatePostData:updatePostDto){
    return this.postsService.update(id,updatePostData)
  }

}
