import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/contexts/users/infrastructure/auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';

export const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Simulate an authenticated user with ID 1
    request.user = { userId: 1, role: 'RESTAURANT' };
    return true;
  },
};

export async function setupE2EApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return app;
}
