import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbLogger implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database connected successfully');
    }
  }
}
