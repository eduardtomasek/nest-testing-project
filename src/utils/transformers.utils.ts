import * as _ from 'lodash';

export function snakeToCamel<T>(data: Array<any>): Array<T> | [] {
  const out: T[] = [];

  for (const item of data) {
    out.push(_.mapKeys(item, (value, key) => _.camelCase(key)) as T);
  }

  return out;
}
