import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO, LoginResponse } from './dtos/auth.dto';
import { Public } from './public.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Return the user and token',
    type: LoginResponse,
  })
  @Public()
  @Post('login')
  async login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }
}
