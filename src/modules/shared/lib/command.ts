import { z } from 'zod';
import { Nullable } from '../utils/types.js';
import { AuthContext } from '../../auth/domain/model/auth-context.js';
import { Role } from '../../auth/domain/entities/role.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
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
      throw new BadRequestException();
    }
  }

  private checkAuth() {
    const requirements = this.requires();
    if (requirements.length > 0) {
      const isAuthorized = requirements.some((role) =>
        role.equals(this.auth.type),
      );

      if (!isAuthorized) {
        throw new NotAuthorizedException();
      }
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
   * Returns a list of roles that are allowed to execute this command.
   * If the list is empty, the command is allowed to be executed by any authenticated user.
   * @protected
   */
  protected requires(): Role[] {
    return [];
  }
}
