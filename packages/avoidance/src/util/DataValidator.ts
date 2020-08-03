interface DataValidatorBase {
  isValidOrThrow(obj: unknown, name?: string): boolean;
  isValid(obj: unknown, name?: string): boolean;
  getValidationMessage(obj: unknown, name?: string): string | null;
}

export abstract class DataValidator<T> implements DataValidatorBase {
  isValidOrThrow(obj: unknown | T, name?: string): obj is T {
    const result = this.getValidationMessage(obj, name);
    if (result === null) {
      return true;
    }
    else {
      throw new Error(result);
    }
  }
  isValid(obj: unknown | T, name?: string): obj is T {
    return this.getValidationMessage(obj, name) === null;
  }
  getValidationMessage(obj: unknown | T, name?: string): string | null {
    if (!name) {
      name = 'obj';
    }
    return this.getValidationMessageImpl(obj, name);
  }
  protected abstract getValidationMessageImpl(obj: unknown | T, name: string): string | null;
}

function isDefinedAndNotNull<T>(obj: undefined | null | T): obj is T {
  return obj !== undefined && obj !== null;
}

function isNonEmptyString(obj: unknown): obj is string {
  return typeof obj === 'string' && obj !== '';
}

function isFiniteNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && isNaN(obj) && isFinite(obj);
}

export const PrimitiveGuards = {
  isDefinedAndNotNull,
  isNonEmptyString,
  isFiniteNumber,
};
