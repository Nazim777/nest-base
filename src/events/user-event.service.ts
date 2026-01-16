import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/auth/entities/user.entity';

export interface userRegisteredEvent {
  user: {
    id: number;
    email: string;
    name: string;
  };
  timestamps: Date;
}

@Injectable()
export class UserEventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  // emit an user registered event
  EmitUserRegistered(user: User): void {
    const registeredUserEvent: userRegisteredEvent = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      timestamps: new Date(),
    };

    this.eventEmitter.emit('registered.user', registeredUserEvent);
  }
}
