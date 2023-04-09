import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './httpException.filter';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // port number
  const port = process.env.PORT || 8000;

  // exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // class-validator
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // logger
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // swagger
  const config = new DocumentBuilder().setTitle('dev_classum API').setDescription('dev_classum API 문서입니다.').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
