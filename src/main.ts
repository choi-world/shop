import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  let requestUrl = `http://${process.env.DEFAULT_ALLOWED_CORS}`;

  switch (process.env.ENVIRONMENT) {
    case 'production':
      requestUrl = ''; // 차후에 가비아 도메인 추가 예정
      break;
    default:
      break;
  }

  app.use(cookieParser()); // cookie
  app.setGlobalPrefix('api'); // prefix

  // CORS
  app.enableCors({
    origin: requestUrl,
    credentials: true,
  });

  // DTO ValidationPipe
  /**
   * whiteList: DTO에 없는 값은 제거
   * forbidNonWhitelisted: DTO에 없는 값이 오면 400 에러
   * transform: payload를 DTO 클래스로 변환
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 요청 로깅
  app.use((req, res, next) => {
    console.log(
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      '[REQ]',
      req.method,
      req.originalUrl,
    );
    next();
  });

  await app.listen(Number(process.env.PORT));
}
bootstrap();
