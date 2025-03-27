import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentVariables } from '../../config/env.validation';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EncryptionModule } from '../../services/encryption/encryption.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '15d',
          algorithm: 'HS256',
          issuer: 'url-shortener',
          audience: 'url-shortener',
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    EncryptionModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
