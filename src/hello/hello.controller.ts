import { Controller, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';
import { Get } from '@nestjs/common';
@Controller('hello')
export class HelloController {
    constructor(private readonly helloService:HelloService){}
    
    @Get()
    getHello():string{
        return this.helloService.getHello()
    }

    // hello with name with param
    // hello/user/habib
    @Get('user/:name')
    getHelloWithName(@Param('name') name:string):string{
     return this.helloService.getHelloWithName(name)
    }

    // hello with name with query
    // hello/username?name=habib
    @Get('username')
    getHelloWithQuery(@Query('name') name:string):string{
     return this.helloService.getHelloWithName(name)
    }
}
