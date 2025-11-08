/* eslint-disable @typescript-eslint/no-explicit-any */
export function stringifyBigInts(obj: any): any {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(stringifyBigInts);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, stringifyBigInts(value)])
    );
  }
  return obj;
}
