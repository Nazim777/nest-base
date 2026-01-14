import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
 // imports:[] // we can import other module here if nessarry
  exports:[HelloService] // we can export service to other module if nessary
})
export class HelloModule {}
