export class NotAuthorizedException extends Error {
  constructor(reason?: string) {
    super(
      reason
        ? `You are not authorized to perform this action: ${reason}`
        : 'You are not authorized to perform this action',
    );
  }
}
