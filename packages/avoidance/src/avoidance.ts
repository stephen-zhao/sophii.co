// avoidance.js
// AUTHOR: Stephen Zhao
// REPO: github.com/stephen-zhao/sophii.co

// A standalone library for creating "avoidance cloud" effect.
// All children of given containers will be animated to avoid the user's mouse.

import { Particle } from './particle';
import * as animate from './animate';
import * as geometry from './geometry';
import * as dom from './dom';
import * as util from './util';
import { builtinDisplacementMethodBuilders, BuiltinDisplacementMethodBuilderKey } from './displacing';
import { builtinThresholdingMethodBuilders, BuiltinThresholdingMethodBuilderKey } from './thresholding';

enum StatusKind {
  Ready = "Ready",
  Running = "Running",
  Suspended = "Suspended",
}


interface DisplacementMethodInternalConfig {
  name: BuiltinDisplacementMethodBuilderKey;
  scale?: number;
  offset?: number;
  power?: number;
};


interface ThresholdingMethodInternalConfig {
  name: BuiltinThresholdingMethodBuilderKey;
  thresholdRadius?: number;
};


export interface AvoidanceInternalConfig {
    displacementMethod: DisplacementMethodInternalConfig;
    thresholdingMethod: ThresholdingMethodInternalConfig;
    timing: string;
    pathing: string;
}

// The class which exposes the public API
export default class Avoidance {
  protected _containers: Array<HTMLElement>;
  protected _trackedParticles: Array<Particle>;
  protected _trackedParticleElementSet: Set<HTMLElement>;
  private _status: StatusKind;

  protected _config: AvoidanceInternalConfig;

  // input:
  //   containerSelector
  //    - css-selector string which specifies the elements
  //      inside which the avoidance effect is triggered.
  //   options
  //    - an settings object that takes the following *optional* key/values:
  //      factorMethod: {
  //        name: one of "inverse", "powerInverse", or "exponential"
  //        scale: a number
  //        offset: a number
  //        power: a number
  //      },
  //      displacementMethod: {
  //        name: one of "noThreshold" or "threshold"
  //        thresholdRadius: a number
  //      },
  //      timing: one of
  //        "linear", "easeOutCubic", "easeOutExpo"
  //      pathing: one of
  //        "linear", "bezierQuad"
  //   addChildrenAsParticles
  //    - boolean which specifies whether or not the children
  //      of the containers are added initially as tracked
  //      particles. Defaults to true.
  constructor(containerSelector: string, config: AvoidanceUserConfig = {}, addChildrenAsParticles = true) {
    // save the containers
    var containersCollection = document.querySelectorAll(containerSelector);
    this._containers = Array.from(containersCollection).filter(c => c instanceof HTMLElement) as Array<HTMLElement>;
    // save options for future use
    this._config = this.reconcileConfig(config);
    // init tracked particles
    this._trackedParticles = [];
    this._trackedParticleElementSet = new Set();
    // "fix" event listeners
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    // Create particles from all of the container's children
    // and add them to the list of tracked particles, if specified to do so
    if (addChildrenAsParticles) {
      this._containers.forEach(container => {
        if (container instanceof HTMLElement) {
          for (const child of container.children) {
            if (child instanceof HTMLElement) {
              this.startTrackingParticleElement(child, container);
            }
          }
        }
      });
    }
    // set the initial status
    this._status = StatusKind.Ready;
  }

  private reconcileConfig(userConfig: AvoidanceUserConfig): AvoidanceInternalConfig {
    // Process displacementMethod option
    const displacementMethod: DisplacementMethodInternalConfig = {};
    if ("displacementMethod" in userConfig) {
      if (typeof userConfig.displacementMethod === "string"
          && (userConfig.displacementMethod in builtinDisplacementMethodBuilders)) {
        displacementMethod.name = userConfig.displacementMethod;
      }
      else if (typeof userConfig.displacementMethod === "object") {
        if (("name" in userConfig.displacementMethod)
            && (typeof userConfig.displacementMethod.name === "string")
            && (userConfig.displacementMethod.name in builtinDisplacementMethodBuilders)) {
          displacementMethod.name = userConfig.displacementMethod.name;
        }
        if (("scale" in userConfig.displacementMethod)
            && (typeof userConfig.displacementMethod.scale === "number")) {
          displacementMethod.scale = userConfig.displacementMethod.scale;
        }
        if (("offset" in userConfig.displacementMethod)
            && (typeof userConfig.displacementMethod.offset === "number")) {
          displacementMethod.offset = userConfig.displacementMethod.offset;
        }
        if (("power" in userConfig.displacementMethod)
            && (typeof userConfig.displacementMethod.power === "number")) {
          displacementMethod.power = userConfig.displacementMethod.power;
        }
      }
    }

    // Process displacementMethod
    const thresholdingMethod: ThresholdingMethodInternalConfig = {};
    if ("displacementMethod" in userConfig) {
      if (typeof userConfig.thresholdingMethod === "string"
          && (userConfig.thresholdingMethod in builtinThresholdingMethodBuilders)) {
        thresholdingMethod.name = userConfig.thresholdingMethod;
      }
      else if (typeof userConfig.thresholdingMethod === "object") {
        if (("name" in userConfig.thresholdingMethod)
            && (typeof userConfig.thresholdingMethod.name === "string")
            && (userConfig.thresholdingMethod.name in builtinThresholdingMethodBuilders)) {
          thresholdingMethod.name = userConfig.thresholdingMethod.name;
        }
        if (("thresholdRadius" in userConfig.thresholdingMethod)
            && (typeof userConfig.thresholdingMethod.thresholdRadius === "number")) {
          thresholdingMethod.thresholdRadius = userConfig.thresholdingMethod.thresholdRadius;
        }
      }
    }

    // Process timings
    let timing: string;
    if ("timing" in userConfig
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

    return {
      displacementMethod: factorMethod,
      thresholdingMethod: displacementMethod,
      timing,
      pathing,
    };
  }

  addParticles(particleSelector: string, containerSelector: string) {
    const container = document.querySelector(containerSelector);
    if (container instanceof HTMLElement) {
      document.querySelectorAll(particleSelector).forEach(particleElement => {
        if (particleElement instanceof HTMLElement) {
          this.startTrackingParticleElement(
            particleElement,
            container ? container : undefined
          );
        }
      });
    }
  }

  addParticleElement(particleElement: HTMLElement, containerElement: HTMLElement) {
    this.startTrackingParticleElement(particleElement, containerElement);
  }

  removeParticles(particleSelector: string) {
    this.stopTrackingParticleElements(Array.from(document.querySelectorAll(particleSelector)));
  }

  removeParticleElement(particleElement: HTMLElement) {
    this.stopTrackingParticleElement(particleElement);
  }

  private startTrackingParticleElement(particleElement: HTMLElement, containerElement?: HTMLElement) {
    if (!this._trackedParticleElementSet.has(particleElement)) {
      if (!containerElement) {
        containerElement = document.body;
      }
      var particle = new Particle(particleElement, containerElement);
      this._trackedParticles.push(particle);
      this._trackedParticleElementSet.add(particleElement);
    }
  }

  private stopTrackingParticleElement(particleElement: HTMLElement) {
    if (this._trackedParticleElementSet.has(particleElement)) {
      // First remove from lookup set
      this._trackedParticleElementSet.delete(particleElement);
      var foundIdx = this._trackedParticles.findIndex(function(particle) {
        return particle.element === particleElement;
      });
      if (foundIdx !== -1) {
        // Then dispose
        this._trackedParticles[foundIdx].dispose();
        // Then remove from tracked particles
        this._trackedParticles.splice(foundIdx, 1);
      }
    }
  }

  private stopTrackingParticleElements(particleElements: Array<HTMLElement>) {
    var particleElementSet = new Set(particleElements);
    const trackedParticlesWithRemove = this._trackedParticles as Array<Particle | "removed">;
    for (var i = 0; i < this._trackedParticles.length; ++i) {
      if (particleElementSet.has(this._trackedParticles[i].element)) {
        // First remove from lookup set
        this._trackedParticleElementSet.delete(this._trackedParticles[i].element);
        // Then dispose
        this._trackedParticles[i].dispose();
        // Then remove from tracked particles
        trackedParticlesWithRemove[i] = "removed";
      }
    }
    // Realize the removal
    this._trackedParticles = trackedParticlesWithRemove.filter(function(particle) {
      return particle !== "removed";
    }) as Array<Particle>;
  }

  start() {
    // Add all event handlers to each container
    this._containers.forEach(this.registerEventHandlers, this);
    // Let particles know movement has started
    this._trackedParticles.forEach(particle => {
      particle.unfreeze();
    });
    this._status = StatusKind.Running;
  }

  suspend() {
    // Let all particles know to stop
    this._trackedParticles.forEach(particle => {
      particle.freeze();
    });
    // remove all event handlers from each container
    this._containers.forEach(this.deregisterEventHandlers, this);
    this._status = StatusKind.Suspended;
  }

  addContainers(containerSelector: string, addChildrenAsParticles = true) {
    // Split work by processing each selected container iteratively
    var containersCollection = document.querySelectorAll(containerSelector);
    containersCollection.forEach(container => {
      if (container instanceof HTMLElement) {
        // Only add if not already added
        var idx = this._containers.indexOf(container);
        if (idx >= 0) {
          return;
        }
        this._containers.push(container);
        // Add children as particles if specified to do so
        if (addChildrenAsParticles) {
          for (const child of container.children) {
            if (child instanceof HTMLElement) {
              this.startTrackingParticleElement(child);
            }
          }
        }
        // Register handlers if we are already running
        if (this._status === StatusKind.Running) {
          this.registerEventHandlers(container);
        }
      }
    });
  }

  removeContainers(containerSelector: string, removeChildrenAsParticles = true) {
    // Process each selected container iteratively
    var containersCollection = document.querySelectorAll(containerSelector);
    containersCollection.forEach(container => {
      if (container instanceof HTMLElement) {
        // Process only if the container is tracked
        var idx = this._containers.indexOf(container);
        if (idx < 0) {
          return;
        }
        // Remove children as particles if specified to do so
        if (removeChildrenAsParticles) {
          this.stopTrackingParticleElements(dom.htmlCollectionToHtmlElements(container.children));
        }
        // Deregister events if we are running
        if (this._status === StatusKind.Running) {
          this.deregisterEventHandlers(container);
        }
        // Remove from tracked containers
        this._containers.splice(idx, 1);
      }
    }, this);
  }

  registerEventHandlers(container: HTMLElement) {
    container.addEventListener("touchend", this.touchEndHandler);
    container.addEventListener("touchstart", this.touchStartHandler);
    container.addEventListener("mousemove", this.mouseMoveHandler);
    container.addEventListener("click", this.clickHandler);
  }

  deregisterEventHandlers(container: HTMLElement) {
    container.removeEventListener("click", this.clickHandler);
    container.removeEventListener("mousemove", this.mouseMoveHandler);
    container.removeEventListener("touchstart", this.touchStartHandler);
    container.removeEventListener("touchend", this.touchEndHandler);
  }

  private touchStarted: boolean = false;
  private touchEnded: boolean = false;

  mouseMoveHandler(event: MouseEvent) {
    if (this.touchStarted || this.touchEnded) {
      // Do not handle a mouseMove for touch events
      event.preventDefault();
    }
    else {
      const container = event.currentTarget;
      if (container instanceof HTMLElement) {
        const mousePos = { x: event.pageX - container.offsetLeft, y: event.pageY - container.offsetTop };
        this.computeAvoidance(container, mousePos, this.renderImmediateAvoidance.bind(this));
      }
    }
  }

  clickHandler(event: MouseEvent) {
    if (this.touchStarted || this.touchEnded) {
      const container = event.currentTarget;
      if (container instanceof HTMLElement) {
        const touchPos = { x: event.pageX - container.offsetLeft, y: event.pageY - container.offsetTop };
        this.computeAvoidance(container, touchPos, this.renderAnimatedAvoidance.bind(this));
        this.touchStarted = false;
        this.touchEnded = false;
      }
    }
    else {
      // click, but not touched
    }
  }

  touchStartHandler(event: TouchEvent) {
    this.touchStarted = true;
  }

  touchEndHandler(event: TouchEvent) {
    this.touchEnded = true;
  }

  computeAvoidance(container: HTMLElement, userPos: geometry.IPoint, renderCallback: (d: dom.IPositionRatio | null, p: Particle) => void) {
    const containerRect = container.getBoundingClientRect();
    const userPosRatio = {
      x: userPos.x / containerRect.width,
      y: userPos.y / containerRect.height,
    };
    this._trackedParticles.forEach(particle => {
      const particleSizeRatio = particle.getSizeRatio();
      const particleCentreOrigPosRatioRelUser = {
        x: particle.originalPosRatio.x + particleSizeRatio.width*1.0 / 2 - userPosRatio.x,
        y: particle.originalPosRatio.y + particleSizeRatio.height*1.0 / 2 - userPosRatio.y,
      };
      const particleCentreOrigDistRelUser = geometry.getRadius(particleCentreOrigPosRatioRelUser);
      const avoidanceFactor = this.calculateAvoidanceFactor(particleCentreOrigDistRelUser, particleSizeRatio);
      const avoidanceDisplacement = this.calculateAvoidanceDisplacement(
        geometry.getUnitVector(particleCentreOrigPosRatioRelUser), avoidanceFactor);
      renderCallback(avoidanceDisplacement, particle);
    }, this);
  }

  renderImmediateAvoidance(avoidanceDisplacement: dom.IPositionRatio | null, particle: Particle) {
    if (avoidanceDisplacement === null) {
      particle.element.style.display = "none";
    }
    else {
      const particleNewPos = {
        x: particle.originalPosRatio.x + avoidanceDisplacement.x,
        y: particle.originalPosRatio.y + avoidanceDisplacement.y,
      };
      if (particle.element.style.display === "none") {
        particle.element.style.display = "";
      }
      particle.element.style.left = util.floatToPctStr(particleNewPos.x);
      particle.element.style.top = util.floatToPctStr(particleNewPos.y);
    }
  }

  renderAnimatedAvoidance(avoidanceDisplacement: dom.IPositionRatio | null, particle: Particle) {
    if (avoidanceDisplacement === null) {
      particle.element.style.display = "none";
    }
    else {
      const particleOldPosRatio = particle.getPosRatio();
      const particleNewPosRatio = {
        x: particle.originalPosRatio.x + avoidanceDisplacement.x,
        y: particle.originalPosRatio.y + avoidanceDisplacement.y,
      };
      if (particle.element.style.display === "none") {
        particle.element.style.display = "";
      }
      const pathing = this._config.pathing === "bezierQuad"
        ? animate.paths.bezierQuad([particleOldPosRatio, particle.originalPosRatio, particleNewPosRatio])
        : animate.paths.linear([particleOldPosRatio, particleNewPosRatio]);
      animate.move(particle.element, pathing, 1000, this._config.timing);
    }
  }

  calculateAvoidanceFactor(originalDistance: number, elementSize: dom.ISizeRatio): number {
    const method = this._config.displacementMethod.name;
    var methodFn = null;
    if (method !== undefined) {
      methodFn = builtinDisplacementMethodBuilders[method];
    }
    else {
      methodFn = builtinDisplacementMethodBuilders.powerInverse;
    }
    return methodFn(
      this._config.displacementMethod.scale,
      this._config.displacementMethod.offset,
      this._config.displacementMethod.power
    )(originalDistance, elementSize);
  }
  
  calculateAvoidanceDisplacement(particleOrigPosRelMouse: dom.IPositionRatio, avoidanceFactor: number) {
    if (method === undefined) {
      method = this._config.thresholdingMethod.name;
    }
    var methodFn = null;
    if (method !== undefined) {
      methodFn = builtinThresholdingMethodBuilders[method];
    }
    else {
      methodFn = builtinThresholdingMethodBuilders.threshold;
    }
    return methodFn(
      this._config.thresholdingMethod.thresholdRadius
    )(particleOrigPosRelMouse, avoidanceFactor);
  }
}