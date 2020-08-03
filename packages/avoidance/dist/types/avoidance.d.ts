declare class Avoidance {
    constructor(containerSelector: any, options?: {}, addChildrenAsParticles?: boolean);
    containers: any[];
    options: {
        factorMethod: {
            name: any;
            scale: any;
            offset: any;
            power: any;
        };
        displacementMethod: {
            name: any;
            thresholdRadius: any;
        };
        timing: any;
        pathing: any;
    };
    trackedParticles: any[];
    trackedParticleElementsSet: Set<any>;
    mouseMoveHandler(event: any): void;
    clickHandler(event: any): void;
    touchStartHandler(event: any): void;
    touchEndHandler(event: any): void;
    status: string;
    initOptions(userOptions: any): {
        factorMethod: {
            name: any;
            scale: any;
            offset: any;
            power: any;
        };
        displacementMethod: {
            name: any;
            thresholdRadius: any;
        };
        timing: any;
        pathing: any;
    };
    addParticles(particleSelector: any, containerSelector: any): void;
    addParticleElement(particleElement: any, containerElement: any): void;
    removeParticles(particleSelector: any): void;
    removeParticleElement(particleElement: any): void;
    startTrackingParticleElement(particleElement: any, containerElement: any): void;
    stopTrackingParticleElement(particleElement: any): void;
    stopTrackingParticleElements(particleElements: any): void;
    start(): void;
    stop(): void;
    addContainers(containerSelector: any, addChildrenAsParticles?: boolean): void;
    removeContainers(containerSelector: any, removeChildrenAsParticles?: boolean): void;
    registerEventHandlers(container: any): void;
    deregisterEventHandlers(container: any): void;
    touchStarted: boolean | undefined;
    touchEnded: boolean | undefined;
    computeAvoidance(container: any, userPos: any, renderCallback: any): void;
    renderImmediateAvoidance(avoidanceDisplacement: any, particle: any): void;
    renderAnimatedAvoidance(avoidanceDisplacement: any, particle: any): void;
    calculateAvoidanceFactor(originalDistance: any, elementSize: any, method: any): any;
    calculateAvoidanceDisplacement(particleOrigPosRelMouse: any, avoidanceFactor: any, method: any): any;
}
declare namespace Avoidance {
    export namespace geometry {
        export function getDistance(pointA: any, pointB: any): number;
        export function getRadius(point: any): number;
        export function getUnitVector(point: any): {
            x: number;
            y: number;
        };
    }
    export namespace calculateAvoidanceFactor {
        export namespace builtinMethods {
            export function inverse(param_scale?: number, param_offset?: number, param_power?: any): (originalDistance: any, elementSize: any) => number;
            export function exponential(param_scale?: number, param_offset?: number, param_power?: any): (originalDistance: any, elementSize: any) => number;
            export function powerInverse(param_scale?: number, param_offset?: number, param_power?: number): (originalDistance: any, elementSize: any) => number;
        }
    }
    export namespace calculateAvoidanceDisplacement {
        export namespace builtinMethods_1 {
            export function threshold(param_threshold_radius?: number): (directionUnitVector: any, avoidanceFactor: any) => {
                x: number;
                y: number;
            } | null;
            export function noThreshold(param_threshold_radius?: any): (directionUnitVector: any, avoidanceFactor: any) => {
                x: number;
                y: number;
            } | null;
        }
        export { builtinMethods_1 as builtinMethods };
    }
    export namespace math {
        export function toPctStr(x: any): string;
    }
    export namespace animate {
        export const FRAME_DURATION: number;
        export namespace timings {
            export function linear(duration: any): (t: any) => number;
            export function easeOutCubic(duration: any): (t: any) => number;
            export function easeOutExpo(duration: any): (t: any) => number;
        }
        export namespace paths {
            export function linear_1(p0: any, p1: any): (s: any) => {
                x: any;
                y: any;
            };
            export { linear_1 as linear };
            export function bezierQuad(p0: any, p1: any, p2: any): (s: any) => {
                x: any;
                y: any;
            };
        }
        export function move(element: any, pathing: any, duration: any, timing: any): void;
    }
}
export default Avoidance;
