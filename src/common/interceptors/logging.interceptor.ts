import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterCeptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterCeptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    const userId = request?.user?.id || 'unauthenticated';

    this.logger.log(
      `${method} -${url} - user: ${userId} - user-agent ${userAgent}`,
    );

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(`[${method} ${url} - ${duration} - response size - ${JSON.stringify(data)?.length || 0} bytes]`);
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          this.logger.log(
            `[${method} ${url} - ${duration} - error ${error.message}]`,
          );
        },
      }),
    );
  }
}
