import { IPositionRatio, ISizeRatio } from './dom';

export class Particle {
  protected _element: HTMLElement;
  protected _container: HTMLElement;
  protected _originalPosRatio: IPositionRatio;

  //===========================================================================
  // Ctor and Dtor
  //===========================================================================

  constructor(element: HTMLElement, container: HTMLElement) {
    // Save both elements
    this._element = element;
    this._container = container;
    // Save the original position
    this._originalPosRatio = this.getPosRatio();
  }
  
  dispose() {
    // TODO: return particle to original location, either by setting style or removing location style
  }
  
  //===========================================================================
  // Getters
  //===========================================================================

  get originalPosRatio(): IPositionRatio {
    return this._originalPosRatio;
  }

  get element(): HTMLElement {
    return this._element;
  }

  get container(): HTMLElement {
    return this._container;
  }

  getPosRatio(): IPositionRatio {
    // Get position as percentage of container to get built-in responsiveness!
    const elementRect = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    return {
      x: (elementRect.left - containerRect.left) / containerRect.width,
      y: (elementRect.top - containerRect.top) / containerRect.height,
    };
  }
  getSizeRatio(): ISizeRatio {
    // Get size as percentage of container to get built-in responsiveness!
    const elementRect = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    return {
      width: elementRect.width / containerRect.width,
      height: elementRect.height / containerRect.height,
    };
  }
  
  //===========================================================================
  // Freezing and unfreezing the particle
  //===========================================================================

  private _frozenStyledPosition?: string; // a CSSStyleDeclaration.position
  unfreeze() {
    this._frozenStyledPosition = this.element.style.position;
    const delayedUnfreezeActions = (() => {
      this.element.style.position = 'absolute';
      this.container.removeEventListener('mousemove', delayedUnfreezeActions);
    }).bind(this);
    this.container.addEventListener('mousemove', delayedUnfreezeActions);
  }
  freeze() {
    this.element.style.position = this.element.style.position;
  }
}