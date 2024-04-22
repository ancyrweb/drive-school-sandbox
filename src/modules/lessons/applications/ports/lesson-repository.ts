import { Optional } from '../../../shared/utils/optional.js';
import { LessonId } from '../../domain/entities/lesson-id.js';
import { Lesson } from '../../domain/entities/lesson.js';

export const I_LESSON_REPOSITORY = Symbol('I_LESSON_REPOSITORY');

export interface ILessonRepository {
  findById(id: LessonId): Promise<Optional<Lesson>>;
  save(user: Lesson): Promise<void>;
  delete(user: Lesson): Promise<void>;
  clear(): Promise<void>;
}
