import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { createPostDto } from './dto/createPost.dto';
import { updatePostDto } from './dto/updatePost.dto';
import { User } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FindPostQueryDto } from './dto/find-post-query.dto';
import { PaginatedResponse } from 'src/common/interface/paginated-response.interface';

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostCacheKey(query: FindPostQueryDto): string {
    const { page, limit, title } = query;
    return `post_list_page__${page}__limit__${limit}__${title || 'all'}`;
  }

  async findAll(query: FindPostQueryDto): Promise<PaginatedResponse<Post>> {
    // generate the cachekey
    const cacheKey = this.generatePostCacheKey(query);
    // store the cachekey to set
    this.postListCacheKeys.add(cacheKey);
    const getCachedData =
      await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);
    if (getCachedData) {
      console.log(`Cache Hit------get post list from cache ${cacheKey}`);
      return getCachedData;
    }
    console.log('Cache Miss------get post list from Database');
    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;
    const queryBuilder = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page > 1,
        hasPreviosPage: totalPages > page,
      },
    };

    // store the response result to cache
    await this.cacheManager.set(cacheKey,responseResult,30000)
    return responseResult;
  }

  async findOne(id: number): Promise<Post> {

    const cacheKey = `post-${id}`;
    const cachedPost = await this.cacheManager.get<Post>(cacheKey); // get post from the cache
    if(cachedPost){
      console.log(`Cache Hit------get post from cache ${cacheKey}`);
      return cachedPost;
    }

    console.log('Cache Miss------get post from database');

    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with this id ${id} not found`);
    }
    
    await this.cacheManager.set(cacheKey,post,60000) // store the post data to cache
    return post;
  }

  async create(createPostData: createPostDto, user: User): Promise<Post> {
    const newPost = {
      title: createPostData.title,
      content: createPostData.content,
      author: user,
    };

    await this.invalidatePostListForCache()
    return await this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    updatePostData: updatePostDto,
    user: User,
  ): Promise<Post> {
    const findPostToUpdate = await this.findOne(id);
    if (findPostToUpdate.author.id !== user.id && user.role !== 'Admin') {
      // post onwer and admin can update post
      throw new ForbiddenException('You can only update your own post');
    }

    if (findPostToUpdate.title && updatePostData.title) {
      findPostToUpdate.title = updatePostData.title;
    }

    if (findPostToUpdate.content && updatePostData.content) {
      findPostToUpdate.content = updatePostData.content;
    }

    const updatedPost = await this.postsRepository.save(findPostToUpdate);
    // delete from the cache
    await this.cacheManager.del(`post-${id}`);
    // invalidate the cache
    await this.invalidatePostListForCache()
    return updatedPost;
  }

  async delete(id: number): Promise<void> {
    // delete from database
    await this.postsRepository.delete(id);
    // delete from cache
    await this.cacheManager.del(`post-${id}`);
    // invalidate the cache
    await this.invalidatePostListForCache()
  }
  private async invalidatePostListForCache ():Promise<void>{
    console.log(`Invalidating ${this.postListCacheKeys.size} list cache entries`);
    for(const key of this.postListCacheKeys){
      await this.cacheManager.del(key)
    }
    this.postListCacheKeys.clear()
  }
}
