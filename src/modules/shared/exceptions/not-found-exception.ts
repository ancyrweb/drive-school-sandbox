export class NotFoundException extends Error {
  constructor(entityName: string, value: string, key: string = 'id') {
    super(`${entityName} with ${key} ${value} not found`);
    this.name = 'NotFoundException';
  }
}
