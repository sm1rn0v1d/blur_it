import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  
  app.enableCors();
  app.setGlobalPrefix("/api")
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const mikroOrm = app.get(MikroORM);
  await mikroOrm.migrator.up();

  const document = new DocumentBuilder()
    .setTitle('BlurIt')
    .setDescription('BlurIt API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('api/swagger', app, documentFactory);
  
  const port = config.get("APP_PORT") ?? 3000;
  await app.listen(port);
}
bootstrap();
