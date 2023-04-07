import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as { message: any; statusCode: number } | { error: string; statusCode: 400; message: string[] }; // class-validator 타이핑

    console.log(status, err);
    if (typeof err !== 'string' && err.statusCode === 400) {
      // class-validator 발생 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    // 사용자 정의 에러(HttpException, BadRequestException 등..)
    response.status(status).json({
      success: false,
      code: status,
      data: err,
    });
  }
}
