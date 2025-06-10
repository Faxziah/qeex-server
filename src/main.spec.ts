import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('bootstrap', () => {
  let createSpy: jest.SpyInstance;
  let mockApp: any; // Изменено на any для упрощения мока

  beforeEach(() => {
    mockApp = {
      listen: jest.fn().mockResolvedValue(null),
      enableCors: jest.fn(),
      setGlobalPrefix: jest.fn(),
      useGlobalPipes: jest.fn(),
      close: jest.fn(),
    };
    createSpy = jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should bootstrap the application', async () => {
    const main = await import('./main');
    await main.bootstrap();

    expect(createSpy).toHaveBeenCalledWith(AppModule, expect.any(Object));
    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT ?? 3001);
    expect(mockApp.enableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:3000',
    });
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
  });
}); 