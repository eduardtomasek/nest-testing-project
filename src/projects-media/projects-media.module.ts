import { Module } from '@nestjs/common';
import { ProjectsMediaController } from './projects-media.controller';
import { ProjectsMediaService } from './projects-media.service';

@Module({
  controllers: [ProjectsMediaController],
  providers: [ProjectsMediaService],
})
export class ProjectsMediaModule {}
