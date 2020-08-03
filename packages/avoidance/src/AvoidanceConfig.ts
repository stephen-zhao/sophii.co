import { DataValidator, PrimitiveGuards } from './util/DataValidator';
import { BuiltinThresholdingMethodBuilderKey, isBuiltinThresholdingMethodBuilderKey } from './thresholding';
import { BuiltinDisplacementMethodBuilderKey, isBuiltinDisplacementMethodBuilderKey } from './displacing';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface DisplacementMethodUserConfig {
  name?: BuiltinDisplacementMethodBuilderKey;
  scale?: number;
  offset?: number;
  power?: number;
};

interface ThresholdingMethodUserConfig {
  name?: BuiltinThresholdingMethodBuilderKey;
  thresholdRadius?: number;
};

export interface AvoidanceUserConfig {
  displacementMethod?: string | DisplacementMethodUserConfig;
  thresholdingMethod?: string | ThresholdingMethodUserConfig;
  timing?: string;
  pathing?: string;
}

export class AvoidanceUserConfigValidator extends DataValidator<AvoidanceUserConfig> {
  getValidationMessageImpl(obj: unknown, name: string): string | null {
    // Validate the object itself
    if (!(typeof obj === 'object')) {
      return `${name} must be an object.`;
    }
    if (obj === null) {
      return `${name} must not be null.`;
    }

    // Prepare object for validation
    const userConfig = obj as Partial<Nullable<AvoidanceUserConfig>>;

    // Validate displacementMethod option
    if (userConfig.displacementMethod !== undefined) {
      if (userConfig.displacementMethod === null) {
        return `${name}.displacementMethod must not be null.`;
      }
      // displacementMethod is a string
      if (PrimitiveGuards.isNonEmptyString(userConfig.displacementMethod)) {
        if (!isBuiltinDisplacementMethodBuilderKey(userConfig.displacementMethod)) {
          return `${name}.displacementMethod must be a valid built-in displacement method name string.`;
        }
      }
      // displacementMethod is an object
      else if (typeof userConfig.displacementMethod === 'object') {
        // Validate displacementMethod.name option
        if (!PrimitiveGuards.isDefinedAndNotNull(userConfig.displacementMethod.name)) {
          return `${name}.displacementMethod is missing a name.`;
        }
        if (!isBuiltinDisplacementMethodBuilderKey(userConfig.displacementMethod.name)) {
          return `${name}.displacementMethod.name must be a valid built-in displacement method name string.`;
        }
        // Validate displacementMethod.scale option
        if (PrimitiveGuards.isDefinedAndNotNull(userConfig.displacementMethod.scale)) {
          if (!PrimitiveGuards.isFiniteNumber(userConfig.displacementMethod.scale)) {
            return `${name}.displacementMethod.scale must be a finite number.`;
          }
        }
        // Validate displacementMethod.offset option
        if (PrimitiveGuards.isDefinedAndNotNull(userConfig.displacementMethod.offset)) {
          if (!PrimitiveGuards.isFiniteNumber(userConfig.displacementMethod.offset)) {
            return `${name}.displacementMethod.offset must be a finite number.`;
          }
        }
        // Validate displacementMethod.power option
        if (PrimitiveGuards.isDefinedAndNotNull(userConfig.displacementMethod.power)) {
          if (!PrimitiveGuards.isFiniteNumber(userConfig.displacementMethod.power)) {
            return `${name}.displacementMethod.power must be a finite number.`;
          }
        }
      }
      // displacementMethod is neither a string nor an object
      else {
        return `${name}.displacementMethod must be a string or an object.`
      }
    }

    // Validate thresholdingMethod
    if (userConfig.thresholdingMethod !== undefined) {
      if (userConfig.thresholdingMethod === null) {
        return `${name}.thresholdingMethod must not be null.`;
      }
      // thresholdingMethod is a string
      if (PrimitiveGuards.isNonEmptyString(userConfig.thresholdingMethod)) {
        if (!isBuiltinThresholdingMethodBuilderKey(userConfig.thresholdingMethod)) {
          return `${name}.thresholdingMethod must be a valid built-in thresholding method name string.`;
        }
      }
      // thresholdingMethod is an object
      else if (typeof userConfig.thresholdingMethod === 'object') {
        // Validate thresholdingMethod.name option
        if (!PrimitiveGuards.isDefinedAndNotNull(userConfig.thresholdingMethod.name)) {
          return `${name}.thresholdingMethod is missing a name.`;
        }
        if (!isBuiltinThresholdingMethodBuilderKey(userConfig.thresholdingMethod.name)) {
          return `${name}.thresholdingMethod.name must be a valid built-in thresholding method name string.`;
        }
        // Validate thresholdingMethod.thresholdRadius option
        if (PrimitiveGuards.isDefinedAndNotNull(userConfig.thresholdingMethod.thresholdRadius)) {
          if (!PrimitiveGuards.isFiniteNumber(userConfig.thresholdingMethod.thresholdRadius)) {
            return `${name}.thresholdingMethod.thresholdRadius must be a finite number.`;
          }
        }
      }
      // thresholdingMethod is neither a string nor an object
      else {
        return `${name}.thresholdingMethod must be a string or an object.`
      }
    }

    // Validate timings
    if (userConfig.timing !== undefined) {
      if (userConfig.timing === null) {
        return `${name}.timing must not be null.`;
      }
      if (userConfig.timing === null) {
        return `${name}.timing must not be null.`;
      }
    }
        && (typeof userConfig.timing === "string")
        && (userConfig.timing in animate.timings)) {
      timing = userConfig.timing;
    }
    else {
      timing = "easeOutExpo";
    }
    
    // Process pathing
    let pathing: string;
    if ("pathing" in userConfig
        && (typeof userConfig.pathing === "string")
        && (userConfig.pathing in animate.paths)) {
      pathing = userConfig.pathing;
    }
    else {
      pathing = "bezierQuad";
    }
  }
}