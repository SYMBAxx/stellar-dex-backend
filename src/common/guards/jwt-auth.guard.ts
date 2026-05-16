import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'] ?? '';
    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.slice(7);
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('app.jwtSecret'),
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
