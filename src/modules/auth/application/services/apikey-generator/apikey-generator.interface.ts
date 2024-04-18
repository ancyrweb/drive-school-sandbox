import { ApikeyEntity } from '../../../domain/entities/apikey-entity.js';

export const I_API_KEY_GENERATOR = Symbol('I_API_KEY_GENERATOR');

/**
 * Generates apikeys
 * The generated apikeys must be unique
 */
export interface IApiKeyGenerator {
  generate(): Promise<ApikeyEntity>;
}
