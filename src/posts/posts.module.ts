import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports:[TypeOrmModule.forFeature([Post]),AuthModule], // to use authService we need to import authModule
    controllers:[PostsController],
    providers:[PostsService]
})
export class PostsModule {}
