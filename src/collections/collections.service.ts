import { Inject, Injectable } from '@nestjs/common';
import { uuid as uuidv4 } from 'uuidv4';

import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './types/collection.type';
import { snakeToCamel } from '../utils/transformers.utils';
import { SearchCollectionDto } from './dto/search-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>,
  ) {}

  async listAll(userUUID: string) {
    const collections: Collection[] = await this.pg
      .query(
        `
      SELECT uuid, "user", name, created_at, updated_at
      FROM collections
      WHERE
        "user" = $[userUUID] OR public = true 
    `,
        {
          userUUID,
        },
      )
      .then((data) => snakeToCamel(data));

    return collections;
  }

  async list(userUUID: string) {
    const collections: Collection[] = await this.pg
      .query(
        `
      SELECT uuid, "user", name, created_at, updated_at
      FROM collections
      WHERE
        "user" = $[userUUID]
    `,
        {
          userUUID,
        },
      )
      .then((data) => snakeToCamel(data));

    return collections;
  }

  async search(userUUID: string, searchCollectionDto: SearchCollectionDto) {
    const collections: Collection[] = await this.pg
      .query(
        `
      SELECT uuid, "user", name, created_at, updated_at
      FROM collections
      WHERE
        ("user" = $[userUUID] AND name_ts @@ to_tsquery('english', $[name]))
        OR (name_ts @@ to_tsquery('english', $[name]) AND public = true) 
    `,
        {
          userUUID,
          name: searchCollectionDto.name,
        },
      )
      .then((data) => snakeToCamel(data));

    return collections;
  }

  async create(
    userUUID: string,
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection | null> {
    const newCollection: Collection[] | [] = await this.pg
      .oneOrNone(
        `
      INSERT INTO collections (uuid, "user", name, name_ts)
      VALUES ($[uuid], $[user], $[name], to_tsvector('english', $[name]))
      RETURNING uuid, name, created_at, updated_at
    `,
        {
          uuid: uuidv4(),
          user: userUUID,
          name: createCollectionDto.name,
        },
      )
      .then((data) => snakeToCamel<Collection>([data]));

    return newCollection.length ? newCollection[0] : null;
  }

  // update(id: string, updateCollectionDto: any) {
  //   return {};
  // }
  //
  // remove(id: string) {
  //   return {};
  // }

  async belongsToUser(
    userUUID: string,
    collectionUUID: string,
  ): Promise<boolean> {
    return this.pg
      .oneOrNone(
        `SELECT uuid FROM collections WHERE uuid = $[collectionUUID] AND "user" = $[userUUID] LIMIT 1`,
        { userUUID, collectionUUID },
      )
      .then((data) => !!data);
  }
}
