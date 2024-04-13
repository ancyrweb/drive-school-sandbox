import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { InstructorController } from './instructor-controller.js';
import { SqlInstructorRepository } from '../persistence/sql/sql-instructor-repository.js';
import { I_INSTRUCTOR_REPOSITORY } from '../../application/ports/instructor-repository.js';
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs';
import { Instructor } from '../../domain/entities/instructor-entity.js';
import { CreateInstructorCommandHandler } from '../../application/commands/create-instructor.js';
import { RenameInstructorCommandHandler } from '../../application/commands/rename-instructor.js';
import { DeleteInstructorCommandHandler } from '../../application/commands/delete-instructor.js';

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Instructor])],
  controllers: [InstructorController],
  providers: [
    // Adapters
    {
      provide: I_INSTRUCTOR_REPOSITORY,
      inject: [getRepositoryToken(Instructor), EntityManager],
      useFactory: (
        instructorRepository: EntityRepository<Instructor>,
        entityManager: EntityManager,
      ) => {
        return new SqlInstructorRepository(instructorRepository, entityManager);
      },
    },
    // Commands & Queries
    CreateInstructorCommandHandler,
    RenameInstructorCommandHandler,
    DeleteInstructorCommandHandler,
  ],
})
export class InstructorModule {}
