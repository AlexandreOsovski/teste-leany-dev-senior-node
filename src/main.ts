import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors();

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Pokémon Trainers API')
    .setDescription(
      'API REST para gerenciamento de treinadores Pokémon, times e Pokémon',
    )
    .setVersion('1.0')
    .addTag('Trainers', 'Gerenciamento de treinadores')
    .addTag('Teams', 'Gerenciamento de times')
    .addTag('Pokémon', 'Gerenciamento de Pokémon')
    .addTag('CEP', 'Consulta de endereços')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
