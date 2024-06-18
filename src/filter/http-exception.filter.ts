import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const errorDetails =
      typeof errorResponse == 'string'
        ? { message: errorResponse }
        : { ...errorResponse };

    res.status(status).json({
      statusCode: status,
      ...errorDetails,
      timestamp: new Date().toISOString(),
    });

    this.logger.error(
      `${req.method} ${req.originalUrl} error: ${errorDetails.message} `,
    );
  }
}
