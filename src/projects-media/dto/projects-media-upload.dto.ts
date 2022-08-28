import { IsString } from 'class-validator';

export class ProjectMediaUploadDto {
  @IsString()
  readonly name: string;
}
