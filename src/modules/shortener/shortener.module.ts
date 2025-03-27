import { Module } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ShortenerController } from './shortener.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [ShortenerService],
  controllers: [ShortenerController],
})
export class ShortenerModule {}
