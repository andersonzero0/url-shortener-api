import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { EncryptionModule } from './services/encryption/encryption.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [configuration],
      validate,
      isGlobal: true,
      expandVariables: true,
    }),
    PrismaModule,
    UsersModule,
    EncryptionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
