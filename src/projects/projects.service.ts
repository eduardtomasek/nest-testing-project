import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { uuid as uuidv4 } from 'uuidv4';
import { CreateProjectDto } from './dto/create-project.dto';
import { snakeToCamel } from '../utils/transformers.utils';
import { Project } from './types/project.type';
import { CollectionsService } from '../collections/collections.service';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>,
    private readonly collectionService: CollectionsService,
  ) {}

  async create(
    userUUID: string,
    createProjectDto: CreateProjectDto,
  ): Promise<Project> | null {
    const { collectionUUID, name } = createProjectDto;

    const belongsToUser = await this.collectionService.belongsToUser(
      userUUID,
      collectionUUID,
    );

    if (!belongsToUser) {
      throw new UnauthorizedException('Unauthorized access to collection.');
    }

    // this should be in transaction with project_data as atomic operation
    const newProject: Project[] | [] = await this.pg
      .oneOrNone(
        `
      INSERT INTO projects (uuid, collection, name, name_ts)
      VALUES ($[uuid], $[collectionUUID], $[name], to_tsvector('english', $[name]))
      RETURNING uuid, collection, name, updated_at, created_at
    `,
        {
          uuid: uuidv4(),
          collectionUUID,
          name,
        },
      )
      .then((data) => snakeToCamel<Project>([data]));

    const newProjectObject = newProject.length ? newProject[0] : null;

    if (!newProject) {
      return null;
    }

    await this.pg.oneOrNone(
      `
      INSERT INTO projects_data (project, description)
      VALUES ($[projectUUID], $[description])
    `,
      {
        projectUUID: newProjectObject.uuid,
        description: createProjectDto.description,
      },
    );

    return {
      ...newProjectObject,
      description: createProjectDto.description,
    } as Project;
  }

  async list(
    userUUID: string,
    collectionUUID: string,
  ): Promise<Array<Project>> {
    const belongsToUser = await this.collectionService.belongsToUser(
      userUUID,
      collectionUUID,
    );

    if (!belongsToUser) {
      throw new UnauthorizedException('Unauthorized access to collection.');
    }

    const projects: Project[] = await this.pg
      .query(
        `
      SELECT uuid, name, created_at, updated_at
      FROM projects
      WHERE 
        collection = $[collectionUUID]
    `,
        {
          collectionUUID,
        },
      )
      .then((data) => snakeToCamel<Project>(data));

    return projects;
  }

  async listAll(userUUID: string): Promise<Array<Project>> {
    const userCollectionsIds = await this.collectionService
      .list(userUUID)
      .then((data) => data.map((i) => i.uuid));

    const projects = await this.pg
      .query(
        `
      SELECT uuid, collection, name, created_at, updated_at
      FROM projects
      WHERE
        collection = ANY($[userCollectionsIds]::uuid[])
        OR public = true
    `,
        {
          userCollectionsIds,
        },
      )
      .then((data) => snakeToCamel<Project>(data));

    return projects;
  }
}
