export class NotAuthorizedError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || 'Not Authorized Error')
    this.statusCode = 401
  }
}