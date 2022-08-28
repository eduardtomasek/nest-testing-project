import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../types/jwt-user.type';
import { GeneralResponseEntity } from '../serializers/response-wrapper.serializer';
import { CollectionEntity } from './serializers/collection.serializer';
import { SearchCollectionDto } from './dto/search-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get()
  async listAll(@Req() req) {
    const jwtUser: JwtUser = req.user;

    const collections = await this.collectionService.listAll(jwtUser.uuid);

    return new GeneralResponseEntity({
      data: collections.map((i) => new CollectionEntity(i)),
      meta: {},
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(@Req() req, @Query() searchCollectionDto: SearchCollectionDto) {
    const jwtUser: JwtUser = req.user;

    const collections = await this.collectionService.search(
      jwtUser.uuid,
      searchCollectionDto,
    );

    return new GeneralResponseEntity({
      data: collections.map((i) => new CollectionEntity(i)),
      meta: {},
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createCollectionDto: CreateCollectionDto) {
    const jwtUser: JwtUser = req.user;

    const collection = await this.collectionService.create(
      jwtUser.uuid,
      createCollectionDto,
    );

    if (!collection) {
      throw new InternalServerErrorException();
    }

    return new GeneralResponseEntity({
      data: new CollectionEntity(collection),
      meta: {},
    });
  }

  // @Patch(':id')
  // update() {
  //   return {};
  // }
  //
  // @Delete(':id')
  // remove() {
  //   return {};
  // }
}
