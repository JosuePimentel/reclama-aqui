export class BadRequestError extends Error {
  statusCode: number;

  constructor(message?: string) {
    super(message || 'Bad Request Error')
    this.statusCode = 400
  }
}