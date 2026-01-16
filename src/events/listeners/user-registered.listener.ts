import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { userRegisteredEvent } from '../user-event.service';

@Injectable()
export class UserRegisteredEventListener {
  private readonly logger = new Logger(UserRegisteredEventListener.name);

  @OnEvent('registered.user')
  handleUserRegisteredEvent(event: userRegisteredEvent): void {
    const { user, timestamps } = event;
    this.logger.log(
      `Welcome ${user.email} your account is created at ${timestamps}`,
    );
  }
}
