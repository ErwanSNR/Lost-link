import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as { message?: string | string[]; error?: string };
        if (Array.isArray(r.message)) {
          message = 'Validasi input gagal';
          errors = r.message;
        } else {
          message = r.message ?? message;
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      if (exception.code === 'P2002') {
        message = `Data dengan ${JSON.stringify(exception.meta?.target)} sudah terdaftar.`;
      } else if (exception.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Data yang dicari tidak ditemukan.';
      } else if (exception.code === 'P2003') {
        message = 'Data ini masih terkait dengan data lain, tidak bisa dihapus/diubah.';
      } else {
        message = 'Terjadi kesalahan pada data.';
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(exception.message, exception.stack);
    }

    response.status(statusCode).json({
      statusCode,
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}