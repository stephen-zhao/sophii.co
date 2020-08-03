export enum BuiltinDisplacementMethodBuilderKey {
  inverse = "inverse",
  exponential = "exponential",
  powerInverse = "powerInverse",
}
export function isBuiltinDisplacementMethodBuilderKey(obj: unknown): obj is BuiltinDisplacementMethodBuilderKey {
  return Object.values(BuiltinDisplacementMethodBuilderKey).includes(obj as any);
}

export type DisplacementMethod = (originalDistance: number, elementSize: number) => number;
export type DisplacementMethodBuilder = (scale: number, offset?: number, power?: number) => DisplacementMethod;
type DisplacementMethodBuilderMap = {
  [key in BuiltinDisplacementMethodBuilderKey]: DisplacementMethodBuilder;
}
export const builtinDisplacementMethodBuilders: DisplacementMethodBuilderMap = {
  inverse: function(scale=0.02, offset=0.0, power=undefined) {
    return function(originalDistance, elementSize) {
      if (originalDistance === 0) {
        return NaN;
      }
      else {
        return (scale*1.0)/originalDistance + offset;
      }
    }
  },
  exponential: function(scale=0.1, offset=0.0, power=undefined) {
    return function(originalDistance, elementSize) {
      return Math.exp(scale-originalDistance) + offset;
    }
  },
  powerInverse: function(scale=0.02, offset=0.0, power=0.6) {
    return function(originalDistance, elementSize) {
      if (originalDistance === 0) {
        return NaN;
      }
      else {
        return ((scale*1.0)/Math.pow(originalDistance*1.0, power) + offset);
      }
    }
  }
}