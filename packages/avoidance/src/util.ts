export function floatToPctStr(x: number) {
  return (100.0 * x) + "%";
}

export function assert(predicate: boolean, msg?: string) {
  if (!predicate) {
    throw new Error("Assertion failed." + (msg ? ` Message: ${msg}` : ""));
  }
}