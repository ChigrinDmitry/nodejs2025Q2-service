import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger documentation
  const swaggerDocument = yaml.load(
    fs.readFileSync(path.join(__dirname, '../doc/api.yaml'), 'utf8'),
  );
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/doc`);
}
bootstrap();
