import { IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  readonly collectionUUID: string;

  @IsString()
  readonly name: string;

  readonly description?: string;
}
