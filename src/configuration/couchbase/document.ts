import * as objectPath from 'object-path';

export class Document<T extends {}> {
  private readonly doc: T;

  public constructor(document: T) {
    this.doc = document;
  }

  public document(): T {
    return this.doc;
  }

  public get<K extends keyof T>(field: K): T[K] {
    return objectPath.get(this.doc, field as string, undefined) as unknown as T[K];
  }
}