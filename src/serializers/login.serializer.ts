import { Exclude } from 'class-transformer';

export class LoginEntity {
  uuid: string;
  name: string;

  @Exclude()
  email: string;
  accessToken: string;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
