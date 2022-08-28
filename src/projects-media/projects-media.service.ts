import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { uuid as uuidv4 } from 'uuidv4';
import { ProjectMediaUploadDto } from './dto/projects-media-upload.dto';
import { ProjectMedia } from './types/project-media.type';
import { snakeToCamel } from '../utils/transformers.utils';

@Injectable()
export class ProjectsMediaService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>,
  ) {}

  async upload(
    projectUUID: string,
    file: Express.Multer.File,
    projectMediaUploadDto: ProjectMediaUploadDto,
  ): Promise<ProjectMedia> | null {
    // here should be ownership check
    const fileUUID = uuidv4();

    const projectMedia: ProjectMedia[] = await this.pg
      .oneOrNone(
        `
      INSERT INTO projects_media (uuid, project, name)
      VALUES ($[uuid], $[projectUUID], $[name])
      RETURNING uuid, project, name, created_at, updated_at
    `,
        {
          uuid: fileUUID,
          projectUUID,
          name: projectMediaUploadDto.name,
        },
      )
      .then((data) => snakeToCamel<ProjectMedia>([data]));

    // upload into file storage (s3 with cloudfront, etc...)
    // fs.writeFileSync(
    //   `fileUUID.${file.originalname.split('.')[1]}`,
    //   file.buffer,
    // );

    return projectMedia.length ? projectMedia[0] : null;
  }
}
