import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

try {
  process.loadEnvFile();
} catch {
  // In production, environment variables are usually provided by the host.
}

function getJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return jwtSecret;
}

function getJwtExpiresIn(): StringValue {
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtExpiresIn) {
    return '1d';
  }

  return jwtExpiresIn as StringValue;
}

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: {
        expiresIn: getJwtExpiresIn(),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
