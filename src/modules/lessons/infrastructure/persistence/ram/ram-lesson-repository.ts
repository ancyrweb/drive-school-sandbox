import { GenericRamRepository } from '../../../../shared/repository/generic-ram-repository.js';
import { LessonId } from '../../../domain/entities/lesson-id.js';
import { Lesson } from '../../../domain/entities/lesson.js';
import { ILessonRepository } from '../../../applications/ports/lesson-repository.js';

export class RamLessonRepository
  extends GenericRamRepository<LessonId, Lesson>
  implements ILessonRepository {}
