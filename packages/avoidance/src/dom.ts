export interface IPositionRatio {
  x: number; // between 0 and 1, inclusive
  y: number; // between 0 and 1, inclusive
}

export interface ISizeRatio {
  width: number; // between 0 and 1, inclusive
  height: number; // between 0 and 1, inclusive
}

export function htmlCollectionToHtmlElements(htmlCollection: HTMLCollection): Array<HTMLElement> {
  return Array.from(htmlCollection).filter(x => x instanceof HTMLElement) as Array<HTMLElement>;
}