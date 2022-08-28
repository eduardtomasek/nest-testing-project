import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nestjs-pgpromise';
import { IDatabase } from 'pg-promise';

export type User = {
  uuid: string;
  email: string;
  name: string;
};

@Injectable()
export class UsersService {
  constructor(
    @Inject(NEST_PGPROMISE_CONNECTION) private readonly pg: IDatabase<any>,
  ) {}

  async create() {}

  async findAll(): Promise<User[] | null> {
    const users: User[] = await this.pg.manyOrNone(
      `
        SELECT uuid, email, name 
        FROM usersx 
    `,
    );

    return users ?? null;
  }

  async findOne(email: string): Promise<User | null> {
    const user: User = await this.pg.oneOrNone(
      `
        SELECT uuid, email, name 
        FROM usersx 
        WHERE 
            enabled = true 
            AND email = $[email] 
            LIMIT 1
    `,
      {
        email,
      },
    );

    return user ?? null;
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user: User = await this.pg.oneOrNone(
      `
        SELECT uuid, email, name 
        FROM usersx 
        WHERE 
            enabled = true 
            AND email = $[email] 
            AND password = $[password] 
            LIMIT 1
    `,
      {
        email,
        password,
      },
    );

    return user ?? null;
  }
}
