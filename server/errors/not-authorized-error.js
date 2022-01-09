export class NotAuthorizedError {
  statusCode = 401;

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
