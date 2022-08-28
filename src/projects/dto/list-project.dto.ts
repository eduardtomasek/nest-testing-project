import { IsString } from 'class-validator';

export class ListProjectDto {
  @IsString()
  readonly collectionUUID: string;
}
