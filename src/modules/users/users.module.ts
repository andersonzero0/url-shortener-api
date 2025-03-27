import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { UsersController } from './users.controller';
import { EncryptionModule } from '../../services/encryption/encryption.module';

@Module({
  imports: [PrismaModule, EncryptionModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
