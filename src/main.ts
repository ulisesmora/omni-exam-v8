import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

// AppClusterService.clusterize(bootstrap);  //if you want use multithreads without pm2 you must discoment this line and comment 12 line
bootstrap();
