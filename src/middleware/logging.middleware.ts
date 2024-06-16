import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction , Request , Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger()
  use(req: Request, res: Response, next: NextFunction) {
    const {method , originalUrl : url} = req;
    const reqTime = new Date().getTime();
    
    res.on('finish' , () => {
      const resTime = new Date().getTime()
      const resStatusCode = res.statusCode;

      if(resStatusCode == 200 || resStatusCode == 201){
        this.logger.log(
          `${method} ${url} +${resTime - reqTime}ms`
        )
      }

    })

    next();
  }
}
