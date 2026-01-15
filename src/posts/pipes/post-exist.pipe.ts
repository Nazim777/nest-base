import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistPipe implements PipeTransform {
  constructor(private readonly postsService: PostsService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.postsService.getPostById(value);
    } catch (error) {
      throw new NotFoundException(`post with id ${value} not found!`);
    }
    return value;
  }
}
