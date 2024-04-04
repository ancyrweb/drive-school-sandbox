import { Nullable } from './types.js';
import { z } from 'zod';

/**
 * Represent a command that can be dispatched to our Application Services layer.
 * That command will be executed by a CommandHandler.
 */
export abstract class AbstractCommand<TProps extends Record<string, any>> {
  constructor(public readonly props: TProps) {
    this.validate();
  }

  /**
   * Get the schema of the command.
   * The schema will be used to validate the command's data.
   */
  public getSchema(): Nullable<z.Schema<TProps>> {
    return null;
  }

  public validate(): void {
    const schema = this.getSchema();
    if (schema === null) {
      return;
    }

    schema.parse(this.props);
  }
}
