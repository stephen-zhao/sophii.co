


interface IPoint {
  x: number;
  y: number;
}

const FRAME_DURATION = 10.0;

// Timing functions
type TimingFn = (t: number) => number;
type TimingFnBuilder = (duration: number) => TimingFn;
interface TimingFnBuilderMap {
  [key: string]: TimingFnBuilder;
}
export const timings: TimingFnBuilderMap = {
  linear: (duration: number) => (t: number) => t/duration,
  easeOutCubic: (duration: number) => (t: number) => 1+Math.pow(t/duration-1, 3),
  easeOutExpo: duration => t => 1-Math.pow(2, -10*t/duration),
}

// Path functions

type PathFn = (s: number) => IPoint;
type PathFnBuilder = (controlPoints: Array<IPoint>) => PathFn;
interface PathFnBuilderMap {
  [key: string]: PathFnBuilder;
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
    element.style.left = (100.0 * pos.x) + "%";
    element.style.top = (100.0 * pos.y) + "%";
    // Update vars for next iteration
    time = time + FRAME_DURATION;
    distance = distanceFromTime(time);
  }, FRAME_DURATION);
}