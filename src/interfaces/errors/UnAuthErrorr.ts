class UnAuthError extends Error {
  statusCode: number;

  constructor() {
    super("Invalid username or password");
    this.name = "UnAuthError";
    this.statusCode = 401;
  }
}

export default UnAuthError;
