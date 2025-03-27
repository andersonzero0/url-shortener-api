import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindUserParamsDTO {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID('7')
  id: string;
}
