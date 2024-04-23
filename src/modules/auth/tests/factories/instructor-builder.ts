import { GetFactoryProps } from '../../../shared/utils/types.js';
import { Instructor } from '../../domain/entities/instructor.js';
import { InstructorId } from '../../domain/entities/instructor-id.js';

type Props = GetFactoryProps<typeof Instructor>;

export class InstructorBuilder {
  private props: Props;

  constructor(props?: Partial<Props>) {
    this.props = {
      id: new InstructorId(),
      firstName: 'John',
      lastName: 'Doe',
      ...props,
    };
  }

  id(id: string) {
    this.props.id = new InstructorId(id);
    return this;
  }

  build() {
    return Instructor.create(this.props);
  }
}
