import { IPoint, getRadius } from './geometry'

export enum ThresholdingMethodKeys {
  threshold = "threshold",
  noThreshold = "noThreshold",
}

type ThresholdingFn = (directionUnitVector: IPoint, avoidanceFactor: number) => IPoint | null;
type ThresholdingMethod = (thresholdRadius?: number) => ThresholdingFn;
type ThresholdingMethodsMap = {
  [key in ThresholdingMethodKeys]: ThresholdingMethod;
}
export const builtinThresholdingMethods: ThresholdingMethodsMap = {
  threshold: function(thresholdRadius=0.1) {
    return function(directionUnitVector: IPoint, avoidanceFactor: number) {
      if (avoidanceFactor === NaN) {
        return null;
      }
      var offset = {
        x: directionUnitVector.x*avoidanceFactor,
        y: directionUnitVector.y*avoidanceFactor,
      };
      if (getRadius(offset) > thresholdRadius) {
        return {
          x: directionUnitVector.x*thresholdRadius,
          y: directionUnitVector.y*thresholdRadius,
        };
      }
      else {
        return offset;
      }
    }
  },
  noThreshold: function(thresholdRadius=undefined) {
    return function(directionUnitVector: IPoint, avoidanceFactor: number) {
      if (avoidanceFactor === NaN) {
        return null;
      }
      return {
        x: directionUnitVector.x*avoidanceFactor,
        y: directionUnitVector.y*avoidanceFactor,
      };
    }
  }
}