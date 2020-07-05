export enum DisplacementFactorMethodKeys {
  inverse = "inverse",
  exponential = "exponential",
  powerInverse = "powerInverse",
}

type DisplacementFactorFn = (originalDistance: number, elementSize: number) => number;
type DisplacementFactorMethod = (scale: number, offset?: number, power?: number) => DisplacementFactorFn;
type DisplacementFactorMethodsMap = {
  [key in DisplacementFactorMethodKeys]: DisplacementFactorMethod;
}
export const builtinDisplacementFactorMethods: DisplacementFactorMethodsMap = {
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