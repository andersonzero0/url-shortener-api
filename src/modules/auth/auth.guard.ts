import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const token = this.authService.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) {
        return true;
      }

      throw new UnauthorizedException();
    }
    try {
      const payload = await this.authService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedException();
      }

      request['userId'] = payload.id;
    } catch {
      if (isPublic) {
        return true;
      }

      throw new UnauthorizedException();
    }
    return true;
  }
}
