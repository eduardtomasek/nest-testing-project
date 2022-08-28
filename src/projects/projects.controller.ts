import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../types/jwt-user.type';
import { GeneralResponseEntity } from '../serializers/response-wrapper.serializer';
import { ProjectEntity } from './serializers/project.serializer';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const jwtUser: JwtUser = req.user;

    const project = await this.projectsService.create(
      jwtUser.uuid,
      createProjectDto,
    );

    if (!project) {
      throw new InternalServerErrorException();
    }

    return new GeneralResponseEntity({
      data: new ProjectEntity(project),
      meta: {},
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('listAll')
  async listAll(@Req() req) {
    const jwtUser: JwtUser = req.user;

    const projects = await this.projectsService.listAll(jwtUser.uuid);

    return new GeneralResponseEntity({
      data: projects.map((i) => new ProjectEntity(i)),
      meta: {},
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get(':collectionUUID')
  async list(@Req() req, @Param('collectionUUID') collectionUUID: string) {
    const jwtUser: JwtUser = req.user;

    const projects = await this.projectsService.list(
      jwtUser.uuid,
      collectionUUID,
    );

    return new GeneralResponseEntity({
      data: projects.map((i) => new ProjectEntity(i)),
      meta: {},
    });
  }
}
