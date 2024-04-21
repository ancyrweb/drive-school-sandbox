import { z } from 'zod';
import { Nullable } from '../utils/types.js';
import { AuthContext } from '../../auth/domain/model/auth-context.js';
import { ValidationException } from '../exceptions/validation-exception.js';
import { NotAuthorizedException } from '../exceptions/not-authorized-exception.js';

/**
 * Represent a command that can be dispatched to our Application Services layer.
 * That command will be executed by a CommandHandler.
 */
export abstract class AbstractCommand<TProps extends Record<string, any>> {
  constructor(
    public readonly auth: AuthContext,
    public readonly props: TProps,
  ) {
    this.check();
  }

  private check(): void {
    this.checkProps();
    this.checkAuth();
  }

  private checkProps() {
    const schema = this.getSchema();
    if (schema === null) {
      return;
    }

    const validation = schema.safeParse(this.props);
    if (!validation.success) {
      throw new ValidationException(validation.error);
    }
  }

  private checkAuth() {
    if (!this.isAuthorized(this.auth)) {
      throw new NotAuthorizedException();
    }
  }

  /**
   * Get the schema of the command.
   * The schema will be used to validate the command's data.
   */
  protected getSchema(): Nullable<z.Schema<TProps>> {
    return null;
  }

  /**
   * If this method returns false, a not-authorized exception will be raised.
   * This method follows an "everything is authorized by default" approach.
   * @param auth
   * @protected
   */
  protected isAuthorized(auth: AuthContext): boolean {
    return true;
  }
}

export type GetCommandPayload<T> =
  T extends AbstractCommand<infer U> ? U : never;
