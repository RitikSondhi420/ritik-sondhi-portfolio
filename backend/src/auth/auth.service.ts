import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const defaultUser = this.configService.get<string>('ADMIN_USERNAME', 'ritik');
    const defaultPass = this.configService.get<string>('ADMIN_PASSWORD', '$Ritik5$Portfolio9$');

    if (username === defaultUser && pass === defaultPass) {
      return { username, role: 'admin' };
    }

    try {
      const dbUser = await this.prisma.adminUser.findUnique({
        where: { username },
      });
      if (dbUser && dbUser.passwordHash === pass) {
        return { username: dbUser.username, role: 'admin' };
      }
    } catch {
      // Ignore if DB not ready
    }

    return null;
  }

  async login(loginDto: { username?: string; password?: string }) {
    const user = await this.validateUser(loginDto.username || '', loginDto.password || '');
    if (!user) {
      throw new UnauthorizedException('Invalid administrative credentials.');
    }

    const payload = { username: user.username, role: user.role };
    return {
      success: true,
      accessToken: this.jwtService.sign(payload),
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async verify(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return { valid: true, user: payload };
    } catch {
      return { valid: false };
    }
  }
}
