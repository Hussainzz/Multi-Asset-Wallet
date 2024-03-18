class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: any, statusCode: number, stat: string | null = null) {
    const status = stat
      ? stat
      : `${statusCode}`.startsWith("4")
      ? "error"
      : "error";
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
