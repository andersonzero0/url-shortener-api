import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsUUID } from 'class-validator';

export class CreateShortenerDTO {
  @ApiProperty({ type: 'string', format: 'url', example: 'https://google.com' })
  @IsUrl()
  url: string;
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
