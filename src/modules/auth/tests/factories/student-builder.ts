import { GetFactoryProps } from '../../../shared/utils/types.js';
import { Student } from '../../domain/entities/student.js';
import { StudentId } from '../../domain/entities/student-id.js';
import { CreditPoints } from '../../domain/model/credit-points.js';

type Props = GetFactoryProps<typeof Student>;

export class StudentBuilder {
  private props: Props;

  constructor(props?: Partial<Props>) {
    this.props = {
      id: new StudentId(),
      firstName: 'John',
      lastName: 'Doe',
      creditPoints: new CreditPoints(0),
      ...props,
    };
  }

  build() {
    return Student.create(this.props);
  }
}
