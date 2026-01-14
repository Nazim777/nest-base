import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    HelloModule,
    UserModule,
    ConfigModule.forRoot({ 
    isGlobal: true, // this makes the env variable available globally
    envFilePath: ['.env.local'] })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
