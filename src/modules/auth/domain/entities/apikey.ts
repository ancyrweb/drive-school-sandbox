import { ApikeyId } from './apikey-id.js';
import { Entity } from '../../../shared/lib/entity.js';

type State = {
  id: ApikeyId;
  value: string;
};

type Snapshot = {
  id: string;
  value: string;
};

export class Apikey extends Entity<ApikeyId, State, Snapshot> {
  takeSnapshot(): Snapshot {
    return {
      id: this._state.id.value,
      value: this._state.value,
    };
  }

  static generate(value: string) {
    return new Apikey({
      id: new ApikeyId(),
      value,
    });
  }

  getValue(): string {
    return this._state.value;
  }
}
