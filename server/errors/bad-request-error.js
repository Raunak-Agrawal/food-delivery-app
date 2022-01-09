export class BadRequestError {
  statusCode = 400;

  constructor(message) {
    this.message = message;
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
