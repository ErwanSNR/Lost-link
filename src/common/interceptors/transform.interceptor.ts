import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface ApiSuccessResponse<T> {
  statusCode: number;
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    const statusCode: number = response.statusCode;

    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: true,
        message: customMessage ?? 'Permintaan berhasil diproses',
        data: data === undefined ? null : data,
      })),
    );
  }
}