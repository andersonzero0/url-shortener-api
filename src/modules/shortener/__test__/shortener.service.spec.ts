import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { ShortenerService } from '../shortener.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../../services/encryption/encryption.service';
import { BadRequestException } from '@nestjs/common';

export const mockShortener = {
  id: '1',
  url: 'https://example.com',
  shortCode: 'abc123',
  userId: 'user123',
  clickCount: 0,
  createdAt: new Date('2025-03-27T20:43:14.129Z'),
  updatedAt: new Date('2025-03-27T20:43:14.129Z'),
  deletedAt: null,
};

describe('ShortenerService', () => {
  let shortenerService: ShortenerService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShortenerService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
        UsersService,
        ConfigService,
        EncryptionService,
      ],
    }).compile();

    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    prismaService = moduleRef.get(PrismaService);
  });

  describe('create', () => {
    it('should create a shortener', async () => {
      jest
        .spyOn(shortenerService, 'generateShortCode')
        .mockReturnValue('abc123');

      jest
        .spyOn(shortenerService, 'findByShortCode')
        .mockResolvedValueOnce(null);

      jest
        .spyOn(prismaService.urlShortener, 'create')
        .mockResolvedValueOnce(mockShortener);

      const shortener = await shortenerService.create(
        { url: 'https://example.com' },
        'user123',
      );

      expect(shortener).toEqual(mockShortener);
    });

    it('should throw BadRequest if short code already exists', async () => {
      jest
        .spyOn(shortenerService, 'findByShortCode')
        .mockResolvedValueOnce(mockShortener);

      await expect(
        shortenerService.create({ url: 'https://example.com' }, 'user123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateShortCode', () => {
    it('should generate a short code', () => {
      const shortCode = shortenerService.generateShortCode();

      expect(shortCode).toBeDefined();

      expect(shortCode.length).toBe(6);
    });
  });

  describe('redirect', () => {
    it('should redirect to the original url', async () => {
      jest
        .spyOn(shortenerService, 'findByShortCode')
        .mockResolvedValueOnce(mockShortener);

      prismaService.urlShortener.update.mockResolvedValueOnce({
        ...mockShortener,
        clickCount: mockShortener.clickCount + 1,
      });

      const shortener = await shortenerService.redirect('abc123');

      expect(shortener).toEqual({
        ...mockShortener,
        clickCount: mockShortener.clickCount + 1,
      });
    });

    it('should throw NotFoundException if shortener not found', async () => {
      jest
        .spyOn(shortenerService, 'findByShortCode')
        .mockResolvedValueOnce(null);

      await expect(shortenerService.redirect('abc123')).rejects.toThrow();
    });
  });
});
