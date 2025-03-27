import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateShortenerDTO } from './dtos/shortener.dto';
import * as crypto from 'node:crypto';
import { UsersService } from '../users/users.service';
import { EnvironmentVariables } from '../../config/env.validation';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ShortenerService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  private baseUrl = this.configService.get('BASE_URL');
  private port = this.configService.get('PORT');

  async create(data: CreateShortenerDTO, userId?: string) {
    const shortCode = this.generateShortCode();

    const shortenerExists = await this.findByShortCode(shortCode);

    if (shortenerExists) {
      throw new BadRequestException('Error generating short url, try again');
    }

    const user = userId ? await this.userService.findOne(userId) : null;

    const shortener = await this.prisma.urlShortener.create({
      data: {
        url: data.url,
        shortCode,
        ...(user
          ? {
              user: {
                connect: {
                  id: user.id,
                },
              },
            }
          : {}),
      },
    });

    return shortener;
  }

  async findById(id: string, userId: string) {
    const urlShortener = await this.prisma.urlShortener.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    return urlShortener;
  }

  async findByShortCode(shortCode: string) {
    const urlShortener = await this.prisma.urlShortener.findUnique({
      where: {
        shortCode,
        deletedAt: null,
      },
    });

    return urlShortener;
  }

  async redirect(shortCode: string) {
    const urlShortener = await this.findByShortCode(shortCode);

    if (!urlShortener) {
      throw new NotFoundException('Shortener not found');
    }

    await this.prisma.urlShortener.update({
      where: {
        shortCode,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return urlShortener;
  }

  async findByUser(userId: string) {
    const urlShorteners = await this.prisma.urlShortener.findMany({
      where: {
        user: {
          id: userId,
        },
        deletedAt: null,
      },
    });

    return urlShorteners;
  }

  generateShortCode(): string {
    const hash = crypto.randomBytes(3).toString('hex');

    return hash;
  }

  getShortUrl(shortCode: string): string {
    return `${this.baseUrl || `http://localhost:${this.port}`}/shortener/${shortCode}`;
  }

  async updateUrl(id: string, url: string, userId: string) {
    const urlShortener = await this.findById(id, userId);

    if (!urlShortener) {
      throw new NotFoundException('Shortener not found');
    }

    const urlShortenerUpdated = await this.prisma.urlShortener.update({
      where: {
        id,
        userId: userId,
      },
      data: {
        url,
      },
    });

    return urlShortenerUpdated;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const urlShortener = await this.findById(id, userId);

    if (!urlShortener) {
      throw new NotFoundException('Shortener not found');
    }

    await this.prisma.urlShortener.update({
      where: {
        id,
        userId: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Url deleted' };
  }
}
