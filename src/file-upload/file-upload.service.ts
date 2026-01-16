import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {File} from './entities/file.entity'
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class FileUploadService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository:Repository<File>,
        private readonly cloudinaryService:CloudinaryService
    ){}

    async uploadFile(file:Express.Multer.File , description:string | undefined, user:User):Promise<File>{
      const uploadResponse = await this.cloudinaryService.uploadFile(file)
      const createdFile = await this.fileRepository.create({
        size:file.size,
        originalName:file.originalname,
        mimeType:file.mimetype,
        publicId:uploadResponse.public_id,
        url:uploadResponse.secure_url,
        description,
        uploader:user
      })

      return await this.fileRepository.save(createdFile)
    }

    async findAll():Promise<File[]>{
      return await this.fileRepository.find({relations:['uploader'],order:{'createdAt':'DESC'}})
    }

    async remove(id:number){
      const fileToDelete = await this.fileRepository.findOne({where:{id}})
      if(!fileToDelete){
        throw new NotFoundException(`File with id ${id} not found`)
      }

      // first delete from cloudinary
      await this.cloudinaryService.deleteFile(fileToDelete.publicId);
     // delete from database
     await this.fileRepository.remove(fileToDelete);

    }
}
