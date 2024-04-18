import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApikeyId, ApikeyIdType } from './apikey-id.js';
import { BaseEntity } from '../../../shared/lib/base-entity.js';

export type ApikeyCreationProps = { id?: ApikeyId; value: string };

@Entity()
export class ApikeyEntity extends BaseEntity {
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
    return new ApikeyEntity({ value });
  }
}
