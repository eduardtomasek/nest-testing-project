import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CollectionsService } from '../collections/collections.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, CollectionsService],
})
export class ProjectsModule {}
