import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from './interfaces/auth.interfaces';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config/env.validation';
import { UsersService } from '../users/users.service';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { LoginDTO, LoginResponse } from './dtos/auth.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentVariables>,
    private encryptionService: EncryptionService,
    private usersService: UsersService,
  ) {}

  async login(data: LoginDTO): Promise<LoginResponse> {
    try {
      const { email, password } = data;

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new NotFoundException('User and/or password invalid');
      }

      const isValidPassword = await this.encryptionService.comparePassword(
        password,
        user.password,
      );

      if (!isValidPassword) {
        throw new ForbiddenException('User and/or password invalid');
      }

      const token = await this.generateTokenFromUser(user.id);

      return {
        token: token.token,
        user: new UserEntity(user),
      };
    } catch (error) {
      throw error;
    }
  }

  async generateTokenFromUser(id: string): Promise<{ token: string }> {
    try {
      const payload: Payload = { id };
      const token = await this.jwtService.signAsync(payload);

      return {
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string): Promise<Payload | null> {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      const decrypted = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      return decrypted;
    } catch (error) {
      throw error;
    }
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
