import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { CreateUserDTO } from './dtos/users.dto';
import { EncryptionService } from '../../services/encryption/encryption.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
  ) {}

  async create(data: CreateUserDTO) {
    const { email, password } = data;

    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new ForbiddenException('User already exists');
    }

    const hashPassword = await this.encryptionService.hashPassword(password);

    return this.prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id, deletedAt: null } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email, deletedAt: null } });
  }

  async update(id: string, data: CreateUserDTO) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists && userExists.id !== id) {
      throw new ForbiddenException('User already exists');
    }

    const hashPassword = await this.encryptionService.hashPassword(password);

    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data: {
        email,
        password: hashPassword,
      },
    });
  }

  async remove(id: string) {
    const userExists = await this.prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'User deleted' };
  }
}
