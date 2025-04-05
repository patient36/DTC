import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let status = 
      exception instanceof HttpException 
        ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Something went wrong';

    // If the exception is a BadRequestException (validation error)
    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      // You can extract detailed validation errors from the exception response
      message = exception.getResponse();

      // If you want to customize how the validation errors are returned:
      if (typeof message === 'object' && message.message) {
        message = {
          statusCode: status,
          errors: message.message, // Array of validation error messages
        };
      }
    }

    // Return the formatted response
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
