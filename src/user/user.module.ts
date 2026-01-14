import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HelloModule } from 'src/hello/hello.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[HelloModule] // if we want to use hello service then we have to import the HelloModule inside the user module
})
export class UserModule {}
