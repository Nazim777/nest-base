import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req.body?.email || 'unknown';
    return `login ${email}`;
  }

  // set limit to 5
  protected getLimit(): Promise<number> {
    return Promise.resolve(5);
  }

  // set ttl mean time
  protected getTtl(): Promise<number> {
    return Promise.resolve(60000);
  }

  protected async throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many attemts , Please try again after 1 minute',
    );
  }
}
