import { EntityManager, MikroORM } from '@mikro-orm/core';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../app/infrastructure/nest/app.module.js';
import { Nullable } from '../shared/types.js';

export class TestApp {
  public nest: Nullable<NestFastifyApplication> = null;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.nest = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await this.nest.init();

    // Required for fastify to work in test
    await this.nest.getHttpAdapter().getInstance().ready();

    // Ensure the database has proper schema
    const orm = this.nest.get(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();
  }

  async teardown() {
    await this.nest!.close();
    this.nest = null;
  }

  /**
   * Return a dependency
   * @param token
   */
  get<T>(token: string | symbol | any) {
    return this.nest!.get<T>(token);
  }

  /**
   * Make a request to the server
   * @param handler
   */
  async request(
    handler: (req: request.Agent) => Promise<request.Response>,
  ): Promise<request.Response> {
    const req = request(this.nest!.getHttpServer());
    const res = await handler(req);

    // After the request is a good moment to flush the ORM
    this.flushOrm();

    return res;
  }

  /**
   * Clears the ORM of all entities.
   * This is necessary because the ORM's identity map is shared between the request
   * and the test. Hence, reading the ORM after a request will lead to read stale data.
   * Flushing the ORM forces it to re-read the data from the database.
   */
  flushOrm() {
    this.get<EntityManager>(EntityManager).clear();
  }
}
