import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements Prisma.UserUncheckedCreateInput {
  @ApiProperty({ type: 'string', format: 'uuid', readOnly: true })
  id?: string;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  createdAt?: string | Date;

  @ApiProperty({ type: 'string', format: 'date-time', readOnly: true })
  updatedAt?: string | Date;

  @Exclude()
  deletedAt?: string | Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
