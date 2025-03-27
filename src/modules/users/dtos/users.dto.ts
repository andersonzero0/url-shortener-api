import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8, default: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class FindUserParamsDTO {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID('7')
  id: string;
}
