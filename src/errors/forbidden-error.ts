export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || 'Forbidden Error')
    this.statusCode = 403
  }
}