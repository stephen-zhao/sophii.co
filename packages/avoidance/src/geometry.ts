export interface IPoint {
  x: number;
  y: number;
}

export function getDistance(pointA: IPoint, pointB: IPoint) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

export function getRadius(point: IPoint) {
    return Math.sqrt(point.x*point.x + point.y*point.y);
}

export function getUnitVector(point: IPoint) {
  const radius = getRadius(point);
  return {
    x: point.x / radius,
    y: point.y / radius,
  };
}