import { GetFactoryProps } from '../../../shared/utils/types.js';
import { Instructor } from '../../domain/entities/instructor.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

type InstructorProps = GetFactoryProps<typeof Instructor>;

export class InstructorBuilder {
  private props: InstructorProps;

  constructor(props?: Partial<InstructorProps>) {
    this.props = {
      id: new InstructorId(),
      firstName: 'John',
      lastName: 'Doe',
      ...props,
    };
  }

  build() {
    return Instructor.create(this.props);
  }
}
