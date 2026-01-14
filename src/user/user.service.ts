import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    constructor(private readonly helloService:HelloService) {};

    getAllUser():{id:number,name:string}[]{

     return [
        {
            id:1,
            name:'Rahim Islam'
        },
        {
            id:2,
            name:'Karim Islam'
        }
     ]

    }

    getUserById (id:number):{id:number, name:string}{
        const user = this.getAllUser().find(user=>user.id===id)
        if(!user) return {id,name:'user not found!'}
        return user;
    }

    getWelcomeMessage(id:number):string{
        const user = this.getUserById(id);
        if(!user) return 'User not found';
        return this.helloService.getHelloWithName(user.name);
    }
}
