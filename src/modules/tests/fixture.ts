import { TestApp } from './test-app.js';
import { IRepository } from '../shared/repository/repository.js';

export interface IFixture {
  load(app: TestApp): Promise<void>;
}

export abstract class BaseFixture<T> implements IFixture {
  constructor(public readonly entity: T) {}

  abstract getRepository(app: TestApp): IRepository<any, any>;

  async load(app: TestApp): Promise<void> {
    const repository = this.getRepository(app);
    await repository.save(this.entity);
  }
}
