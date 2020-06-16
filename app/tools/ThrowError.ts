
export default class ThrowError extends Error {
  public status: number;
  public expose: boolean;
  constructor(msg: string, code?: number) {
    super(msg);
    this.status = code || 400;
    this.expose = true;
  }
}
