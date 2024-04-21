import { Mapper } from '../../../../../shared/lib/mapper.js';
import { Instructor } from '../../../../domain/entities/instructor.js';
import { SqlInstructor } from '../entities/sql-instructor.js';
import { InstructorId } from '../../../../domain/entities/instructor-id.js';

export class SqlInstructorMapper extends Mapper<Instructor, SqlInstructor> {
  toDomain(obj: SqlInstructor): Instructor {
    return Instructor.create({
      id: new InstructorId(obj.id),
      firstName: obj.firstName,
      lastName: obj.lastName,
    }).attachRecord(obj);
  }

  toPersistence(obj: Instructor): SqlInstructor {
    const snapshot = obj.takeSnapshot();
    const record = obj.getRecord<SqlInstructor>() ?? new SqlInstructor();

    record.id = snapshot.id;
    record.firstName = snapshot.firstName;
    record.lastName = snapshot.lastName;

    return record;
  }
}
