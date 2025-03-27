import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UrlShortenerEntity
  implements Prisma.UrlShortenerUncheckedCreateInput
{
  id?: string;
  url: string;
  shortCode: string;
  shortUrl: string;
  clickCount?: number;

  @Exclude()
  userId: string;

  createdAt?: string | Date;
  updatedAt?: string | Date;

  @Exclude()
  deletedAt?: string | Date;

  constructor(partial: Partial<UrlShortenerEntity>) {
    Object.assign(this, partial);
  }
}
