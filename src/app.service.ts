import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService:ConfigService){}

  getHello(): string {
    const UserName = this.configService.get<string>('USER_NAME')
    return `Hello ${UserName}`;
  }
}
