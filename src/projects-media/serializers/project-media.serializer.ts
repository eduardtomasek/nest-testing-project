export class ProjectMediaEntity {
  uuid: string;
  name: string;
  project: string;
  createdAt: string;
  updatedAt: string;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
