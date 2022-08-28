export class CollectionEntity {
  uuid: string;
  name: string;
  user?: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
