export class NotAuthorizedException extends Error {
  constructor() {
    super('You are not authorized to perform this action');
  }
}
