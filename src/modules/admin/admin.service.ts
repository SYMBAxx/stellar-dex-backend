import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(password: string): Promise<{ accessToken: string }> {
    const adminHash = process.env.ADMIN_PASSWORD_HASH ?? '';
    const valid = await bcrypt.compare(password, adminHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ role: 'admin' });
    return { accessToken: token };
  }
}
