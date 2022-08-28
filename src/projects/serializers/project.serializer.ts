export class ProjectEntity {
  uuid: string;
  name: string;
  description: string;
  collection: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
