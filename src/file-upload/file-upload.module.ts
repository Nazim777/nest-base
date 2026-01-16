import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {File} from './entities/file.entity'
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
@Module({
  imports:[
  TypeOrmModule.forFeature([File]),
  CloudinaryModule, // to use cloudinary service we have to import cloadinary module
  MulterModule.register({storage:memoryStorage()}) // register the multer module
],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
