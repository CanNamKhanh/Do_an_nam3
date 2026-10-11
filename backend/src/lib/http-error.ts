export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }

  static badRequest(message: string): HttpError {
    return new HttpError(400, message);
  }

  static unauthorized(message: string): HttpError {
    return new HttpError(401, message);
  }

  static notFound(message: string): HttpError {
    return new HttpError(404, message);
  }
}
