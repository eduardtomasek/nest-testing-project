import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CollectionsModule } from './collections/collections.module';
import { ConfigModule } from '@nestjs/config';
import { NestPgpromiseModule } from 'nestjs-pgpromise';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsService } from './projects/projects.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsMediaModule } from './projects-media/projects-media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    NestPgpromiseModule.register({
      connection: process.env.PG_CONN_STRING,
    }),
    CollectionsModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ProjectsMediaModule,
  ],
  controllers: [AppController, ProjectsController],
  providers: [AppService, ProjectsService],
})
export class AppModule {}
