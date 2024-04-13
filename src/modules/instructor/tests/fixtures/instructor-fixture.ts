import { BaseFixture } from '../../../tests/fixture.js';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { TestApp } from '../../../tests/test-app.js';
import {
  I_INSTRUCTOR_REPOSITORY,
  IInstructorRepository,
} from '../../application/ports/instructor-repository.js';
import { IRepository } from '../../../shared/repository/repository.js';

export class InstructorFixture extends BaseFixture<Instructor> {
  getRepository(app: TestApp): IRepository<any, any> {
    return app.get<IInstructorRepository>(I_INSTRUCTOR_REPOSITORY);
  }
}
