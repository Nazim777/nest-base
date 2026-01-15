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
import type { Post as PostInterface } from './interfaces/post.interface';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';
import { PostExistPipe } from './pipes/post-exist.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(@Query('search') search?: string): PostInterface[] {
    const allPosts = this.postsService.getAllPosts();
    if (search) {
      return allPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return allPosts;
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe,PostExistPipe) id: number): PostInterface {
    return this.postsService.getPostById(id);
  }

  @Delete(':id')
  deletePostById(@Param('id', ParseIntPipe,PostExistPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  //   @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // single controller validation
  createPost(@Body() createPostData: createPostDto): PostInterface {
    return this.postsService.createPost(createPostData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  updatePost(
    @Param('id', ParseIntPipe,PostExistPipe) id: number,
    @Body() updatePostData: updatePostDto,
  ): PostInterface {
    return this.postsService.updatePost(id, updatePostData);
  }
}
