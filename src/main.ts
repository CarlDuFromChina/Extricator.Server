import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { AppModule } from './app.module';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

async function bootstrap() {
  require('dayjs/locale/zh-cn');
  dayjs.locale('zh-cn');
  dayjs.extend(isToday);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(urlencoded({ extended: false }));
  app.use(json());
  await app.listen(5001);
}
bootstrap();
