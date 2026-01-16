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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';
import { PostExistPipe } from './pipes/post-exist.pipe';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatedResponse } from 'src/common/interface/paginated-response.interface';
import { FindPostQueryDto } from './dto/find-post-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(@Query() query:FindPostQueryDto): Promise<PaginatedResponse<PostEntity>> {
    const allPosts = await this.postsService.findAll(query);
    return allPosts;
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
  ): Promise<PostEntity> {
    return await this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostData: createPostDto,
    @CurrentUser() user: User,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostData, user);
  }
 
// post onwer and admin can update post
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @Body() updatePostData: updatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, updatePostData, user);
  }

  // Admin can delete post not any other users
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard,RolesGuard) // jwtGurad will see the jwt and verification it and roleGuard will see the role of the user and permission
  @Roles(UserRole.ADMIN) // protected to admin route
  async deletePost(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
  ): Promise<void> {
    return await this.postsService.delete(id);
  }

 
}
