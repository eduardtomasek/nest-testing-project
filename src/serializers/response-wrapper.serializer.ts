export class GeneralResponseEntity {
  data: any;
  meta: any;

  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
