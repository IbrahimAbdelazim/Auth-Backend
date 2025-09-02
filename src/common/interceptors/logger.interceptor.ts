/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body } = request;

    const now = Date.now();

    return next.handle().pipe(
      tap((responseData) => {
        const delay = Date.now() - now;

        this.logger.log(
          `→ ${method} ${url}\nHeaders: ${JSON.stringify(headers)}\nBody: ${JSON.stringify(body)}\n← Status: ${context.switchToHttp().getResponse().statusCode} (${delay}ms)\nResponse: ${JSON.stringify(responseData)}\n`,
        );
      }),
    );
  }
}
