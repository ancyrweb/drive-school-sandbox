import { IApiKeyGenerator } from './apikey-generator.js';

export class RandomApiKeyGenerator implements IApiKeyGenerator {
  async generate() {
    return Math.random().toString(36).substring(2);
  }
}
