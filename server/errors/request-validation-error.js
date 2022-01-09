export class RequestValidationError {
  statusCode = 400;

  constructor(errors) {
    this.errors = errors;
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
