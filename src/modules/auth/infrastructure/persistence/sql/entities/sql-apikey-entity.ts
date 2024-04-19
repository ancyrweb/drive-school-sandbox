import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import {
  ApikeyId,
  ApikeyIdType,
} from '../../../../domain/entities/apikey-id.js';
import { SqlEntity } from '../../../../../shared/lib/sql-entity.js';

export type ApikeyCreationProps = { id?: ApikeyId; value: string };

@Entity()
export class SqlApikeyEntity extends SqlEntity {
  @PrimaryKey({ type: ApikeyIdType, unique: true })
  id: ApikeyId;

  @Property({ unique: true })
  value: string;

  protected constructor(props: ApikeyCreationProps) {
    super();
    this.id = props.id ?? new ApikeyId();
    this.value = props.value;
  }

  static generate(value: string) {
    return new SqlApikeyEntity({ value });
  }
}
