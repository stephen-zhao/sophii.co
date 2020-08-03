import { IPositionRatio, ISizeRatio } from './dom';
export declare class Particle {
    protected _element: HTMLElement;
    protected _container: HTMLElement;
    protected _originalPosRatio: IPositionRatio;
    constructor(element: HTMLElement, container: HTMLElement);
    dispose(): void;
    get originalPosRatio(): IPositionRatio;
    get element(): HTMLElement;
    get container(): HTMLElement;
    getPosRatio(): IPositionRatio;
    getSizeRatio(): ISizeRatio;
    private _frozenStyledPosition?;
    unfreeze(): void;
    freeze(): void;
}
