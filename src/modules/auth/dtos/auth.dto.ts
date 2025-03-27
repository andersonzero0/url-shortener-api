import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ type: 'string', format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', minLength: 8, default: '12345678' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class LoginResponse {
  @ApiProperty({
    type: 'string',
    format: 'jwt',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    readOnly: true,
  })
  token: string;

  @ApiProperty({
    type: UserEntity,
    readOnly: true,
  })
  user: UserEntity;
}
