export function isString(value: string | unknown): value is string {
  return typeof value === "string" || value instanceof String;
}
