import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from './user-event.service';
import { UserRegisteredEventListener } from './listeners/user-registered.listener';

@Module({
    imports:[EventEmitterModule.forRoot({
        global:true,
        wildcard:true,
        maxListeners:10,
        verboseMemoryLeak:true
    })],
    providers:[UserEventService,UserRegisteredEventListener],
    exports:[UserEventService]
})
export class EventsModule {}
