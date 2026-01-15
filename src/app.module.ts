import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogger } from './database/db-logger.service';
//import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
    isGlobal: true, // this makes the env variable available globally
    envFilePath: ['.env.local'] }),
    TypeOrmModule.forRoot({
    type:'postgres',
    url:process.env.DATABASE_URL,
    ssl:{
      rejectUnauthorized:false
    },
    autoLoadEntities:true, // it will automatically laod the entities
    synchronize:true, //  turn OFF in production
   // entities:[Post] // register all the entities in this array

    }),
    PostsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, DbLogger],
})
export class AppModule {}
