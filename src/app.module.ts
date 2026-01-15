import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogger } from './database/db-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ 
    isGlobal: true, // this makes the env variable available globally
    envFilePath: ['.env.local'] }),
    TypeOrmModule.forRoot({
    type:'postgres',
    url:process.env.DATABASE_URL,
    ssl:{
      rejectUnauthorized:false //
    },
    autoLoadEntities:true,
    synchronize:true //  turn OFF in production

    }),
    PostsModule
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService, DbLogger],
})
export class AppModule {}
