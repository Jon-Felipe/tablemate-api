import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthenticatedRequest } from './types/authenticated-request.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException('Missing access token');

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token || token.includes(' '))
      throw new UnauthorizedException('Invalid authorization header');

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub?: unknown;
        role?: unknown;
      }>(token);

      if (typeof payload.sub !== 'string' || payload.sub.trim() === '')
        throw new UnauthorizedException('Invalid access token payload');

      if (typeof payload.role !== 'string' || payload.role.trim() === '')
        throw new UnauthorizedException('Invalid access token payload');

      request.user = {
        sub: payload.sub,
        role: payload.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;

      throw new UnauthorizedException('Invalid or expired access token');
    }

    return true;
  }
}
