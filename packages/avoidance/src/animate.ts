import { IPoint } from './geometry';
import { floatToPctStr } from './util';

const FRAME_DURATION = 10.0;

// Timing functions
export enum BuiltinTimingFnBuilderKey {
  linear = "linear",
  easeOutCubic = "easeOutCubic",
  easeOutExpo = "easeOutExpo",
}
type TimingFn = (t: number) => number;
type TimingFnBuilder = (duration: number) => TimingFn;
type TimingFnBuilderMap = {
  [key in BuiltinTimingFnBuilderKey]: TimingFnBuilder;
}
export const timings: TimingFnBuilderMap = {
  linear: (duration: number) => (t: number) => t/duration,
  easeOutCubic: (duration: number) => (t: number) => 1+Math.pow(t/duration-1, 3),
  easeOutExpo: (duration: number) => (t: number) => 1-Math.pow(2, -10*t/duration),
}

// Path functions
export enum BuiltinPathingFnBuilderKey {
  linear = "linear",
  bezierQuad = "bezierQuad",
}
type PathFn = (s: number) => IPoint;
type PathFnBuilder = (controlPoints: Array<IPoint>) => PathFn;
type PathFnBuilderMap = {
  [key in BuiltinPathingFnBuilderKey]: PathFnBuilder;
}
export const paths: PathFnBuilderMap = {
  linear: function([p0, p1]) {
    return s => ({
      x: p0.x + s*(p1.x - p0.x),
      y: p0.y + s*(p1.y - p0.y),
    });
  },
  bezierQuad: function([p0, p1, p2]) {
    return s => ({
      x: p1.x + (1.0-s)*(1.0-s)*(p0.x-p1.x) + s*s*(p2.x-p1.x),
      y: p1.y + (1.0-s)*(1.0-s)*(p0.y-p1.y) + s*s*(p2.y-p1.y),
    });
  },
}

export function move(element: HTMLElement, pathing: PathFn, duration: number, timing: TimingFnBuilder) {
  var time = 0;
  var distance = 0;
  const distanceFromTime = timing(duration);
  const animation = setInterval(() => {
    // Check for final condition
    if (time >= duration) {
      clearInterval(animation);
    }
    // Calculate position
    const pos = pathing(distance);
    // Render
    element.style.left = floatToPctStr(pos.x);
    element.style.top = floatToPctStr(pos.y);
    // Update vars for next iteration
    time = time + FRAME_DURATION;
    distance = distanceFromTime(time);
  }, FRAME_DURATION);
}