import { IPoint, getRadius } from './geometry'

export enum BuiltinThresholdingMethodBuilderKey {
  threshold = "threshold",
  noThreshold = "noThreshold",
}
export function isBuiltinThresholdingMethodBuilderKey(obj: unknown): obj is BuiltinThresholdingMethodBuilderKey {
  return Object.values(BuiltinThresholdingMethodBuilderKey).includes(obj as any);
}

type ThresholdingMethod = (directionUnitVector: IPoint, avoidanceFactor: number) => IPoint | null;
type ThresholdingMethodBuilder = (thresholdRadius?: number) => ThresholdingMethod;
type BuiltinThresholdingMethodBuildersMap = {
  [key in BuiltinThresholdingMethodBuilderKey]: ThresholdingMethodBuilder;
}
export const builtinThresholdingMethodBuilders: BuiltinThresholdingMethodBuildersMap = {
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
