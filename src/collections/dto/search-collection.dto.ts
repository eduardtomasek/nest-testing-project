import { IsString } from 'class-validator';

export class SearchCollectionDto {
  @IsString()
  readonly name: string;
}
