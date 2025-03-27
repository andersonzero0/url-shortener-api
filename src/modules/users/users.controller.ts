import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, FindUserParamsDTO } from './dtos/users.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { RequestWithUserId } from '../../infra/http/http.interfaces';
import { Public } from '../auth/public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserEntity })
  @Public()
  @Post()
  async create(@Body() data: CreateUserDTO): Promise<UserEntity> {
    const user = await this.userService.create(data);

    return new UserEntity(user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserEntity],
  })
  @Public()
  @Get()
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userService.findAll();

    return users.map((user) => new UserEntity(user));
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a user by id',
    type: UserEntity,
  })
  @Public()
  @Get('details/:id')
  async findOne(@Param() params: FindUserParamsDTO): Promise<UserEntity> {
    const { id } = params;

    const user = await this.userService.findOne(id);

    return new UserEntity(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by token' })
  @ApiResponse({
    status: 200,
    description: 'Return a user by id',
    type: UserEntity,
  })
  @Get('self')
  async findOneByToken(@Req() request: RequestWithUserId): Promise<UserEntity> {
    const { userId } = request;

    const user = await this.userService.findOne(userId);

    return new UserEntity(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by token' })
  @ApiResponse({
    status: 200,
    description: 'Return a user updated',
    type: UserEntity,
  })
  @Put('self')
  async update(
    @Req() request: RequestWithUserId,
    @Body() data: CreateUserDTO,
  ): Promise<UserEntity> {
    const { userId } = request;

    const user = await this.userService.update(userId, data);

    return new UserEntity(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by token' })
  @ApiResponse({
    status: 200,
    description: 'Return a user deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted',
        },
      },
    },
  })
  @Delete('self')
  async remove(
    @Req() request: RequestWithUserId,
  ): Promise<{ message: string }> {
    const { userId } = request;

    return this.userService.remove(userId);
  }
}
