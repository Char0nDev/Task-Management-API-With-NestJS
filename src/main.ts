import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Task management API is a simple API for management tasks. build with NestJS framework') 
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app , config)
  SwaggerModule.setup('api' , app , document)
  await app.listen(3000);
}
bootstrap();
