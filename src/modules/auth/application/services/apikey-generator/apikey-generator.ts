export const I_API_KEY_GENERATOR = Symbol('I_API_KEY_GENERATOR');

export interface IApiKeyGenerator {
  generate(): Promise<string>;
}
