import {
  CreateShortenerDTO,
  FindUrlShortenerParamsDTO,
  UpdateUrlDTO,
  UrlShortenerResponse,
} from './dtos/shortener.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { RequestWithUserId } from '../../infra/http/http.interfaces';
import { UrlShortenerEntity } from './entities/shortener.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('SHORTENER')
@Controller('shortener')
export class ShortenerController {
  constructor(private shortenerService: ShortenerService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new shortener. No need to be authenticated',
  })
  @ApiResponse({
    status: 201,
    description: 'Shortener created',
    type: UrlShortenerResponse,
  })
  @Public()
  @Post()
  async create(
    @Body() data: CreateShortenerDTO,
    @Req() req: RequestWithUserId,
  ) {
    const shortener = await this.shortenerService.create(data, req.userId);

    return new UrlShortenerEntity({
      ...shortener,
      shortUrl: `${this.shortenerService.getShortUrl(shortener.shortCode)}`,
    });
  }

  @ApiOperation({ summary: 'Redirect to the original url' })
  @Public()
  @Redirect()
  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string) {
    const shortener = await this.shortenerService.redirect(shortCode);

    return { url: shortener.url };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shortener by user token' })
  @ApiResponse({
    status: 200,
    description: 'Return a shortener by token',
    type: UrlShortenerResponse,
  })
  @Get()
  async findByToken(@Req() req: RequestWithUserId) {
    const shorteners = await this.shortenerService.findByUser(req.userId);

    return shorteners.map(
      (shortener) =>
        new UrlShortenerEntity({
          ...shortener,
          shortUrl: `${this.shortenerService.getShortUrl(shortener.shortCode)}`,
        }),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get shortener by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a shortener by id',
    type: UrlShortenerResponse,
  })
  @Get('details/:id')
  async findById(
    @Param() params: FindUrlShortenerParamsDTO,
    @Req() request: RequestWithUserId,
  ) {
    const { id } = params;

    const shortener = await this.shortenerService.findById(id, request.userId);

    if (!shortener) {
      throw new NotFoundException('Shortener not found');
    }

    return new UrlShortenerEntity({
      ...shortener,
      shortUrl: `${this.shortenerService.getShortUrl(shortener.shortCode)}`,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update url shortener by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a shortener updated',
    type: UrlShortenerResponse,
  })
  @Patch(':id/url')
  async update(
    @Param() params: FindUrlShortenerParamsDTO,
    @Query() data: UpdateUrlDTO,
    @Req() request: RequestWithUserId,
  ) {
    const { id } = params;

    const shortener = await this.shortenerService.updateUrl(
      id,
      data.value,
      request.userId,
    );

    return new UrlShortenerEntity({
      ...shortener,
      shortUrl: `${this.shortenerService.getShortUrl(shortener.shortCode)}`,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a shortener by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a shortener deleted',
    type: UrlShortenerResponse,
  })
  @Delete(':id')
  async delete(
    @Param() params: FindUrlShortenerParamsDTO,
    @Req() request: RequestWithUserId,
  ) {
    const { id } = params;

    return this.shortenerService.remove(id, request.userId);
  }
}
