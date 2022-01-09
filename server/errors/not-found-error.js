export class NotFoundError {
  statusCode = 404;

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}
