import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsUrl, IsUUID, MinDate } from 'class-validator';

export class CreateShortenerDTO {
  @ApiProperty({ type: 'string', format: 'url', example: 'https://google.com' })
  @IsUrl()
  url: string;

  @ApiProperty({
    type: 'string',
    description: 'Date in ISO 8601 format. Minimum date is now.',
    format: 'date-time',
    example: '2022-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message:
      'The date must be greater than or equal to the current date. Date is UTC',
  })
  expiresAt?: string;
}

export class UpdateShortenerDTO {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'url', example: 'https://google.com' })
  @IsUrl()
  url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Date in ISO 8601 format. Minimum date is now.',
    format: 'date-time',
    example: '2022-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @MinDate(new Date(), {
    message:
      'The date must be greater than or equal to the current date. Date is UTC',
  })
  expiresAt?: string;
}

export class UrlShortenerResponse {
  @ApiProperty({ type: 'string', format: 'url', readOnly: true })
  url: string;

  @ApiProperty({ type: 'string', format: 'url', readOnly: true })
  shortCode: string;

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  createdAt: string;

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  updatedAt: string;
}

export class UpdateUrlDTO {
  @ApiProperty({ type: 'string', format: 'url', example: 'https://google.com' })
  @IsUrl()
  value: string;
}

export class FindUrlShortenerParamsDTO {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID('7')
  id: string;
}
