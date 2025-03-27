import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsOptional()
  BASE_URL?: string;

  @IsNumber()
  @IsOptional()
  PORT?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  let message = 'Environment validation error: \n';

  if (errors.length > 0) {
    errors.forEach((error) => {
      if (error.constraints) {
        message += `- ${Object.values(error.constraints)[0]}\n`;
      }
    });

    Logger.error(message);
    throw new Error();
  }
  return validatedConfig;
}
