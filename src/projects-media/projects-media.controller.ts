import {
  Body,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsMediaService } from './projects-media.service';
import { ProjectMediaUploadDto } from './dto/projects-media-upload.dto';
import { ProjectMedia } from './types/project-media.type';
import { GeneralResponseEntity } from '../serializers/response-wrapper.serializer';
import { ProjectMediaEntity } from './serializers/project-media.serializer';

@Controller('projects-media')
export class ProjectsMediaController {
  constructor(private readonly projectsMediaService: ProjectsMediaService) {}

  @Post(':projectUUID')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('projectUUID') projectUUID: string,
    @Body() projectMediaUploadDto: ProjectMediaUploadDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const projectMedia: ProjectMedia = await this.projectsMediaService.upload(
      projectUUID,
      file,
      projectMediaUploadDto,
    );

    return new GeneralResponseEntity({
      data: new ProjectMediaEntity(projectMedia),
      meta: {},
    });
  }
}
