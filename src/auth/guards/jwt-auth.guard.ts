import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CognitoService } from '../cognito.service';
import { PrismaService } from '../../prisma/prisma.service';

type AuthenticatedRequest = Request & {
  user?: {
    sub: string;
    email: string;
    cognitoSub: string;
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly cognitoService: CognitoService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.cognitoService.verifyAccessToken(token);

      const cognitoSub = payload.sub;

      const user = await this.prisma.user.findUnique({
        where: {
          cognitoSub,
        },
        select: {
          id: true,
          email: true,
          cognitoSub: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User is not synced');
      }

      request.user = {
        sub: user.id,
        email: user.email,
        cognitoSub: user.cognitoSub ?? cognitoSub,
      };

      return true;
    } catch (error) {
      console.error('AUTH GUARD ERROR', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
