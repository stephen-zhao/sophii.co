// avoidance v0.1.1
// AUTHOR: Stephen Zhao
// REPO: github.com/stephen-zhao/sophii.co

// A standalone library for creating "avoidance cloud" effect.
// All children of given containers will be animated to avoid the user's mouse.

// The class which exposes the public API
export default class Avoidance {
  // input:
  //   containerSelector
  //    - css-selector string which specifies the elements
  //      inside which the avoidance effect is triggered.
  //   options
  //    - an settings object that takes the following *optional* key/values:
  //      factorMethod: {
  //        name: one of "inverse", "power_inverse", or "exponential"
  //        scale: a number
  //        offset: a number
  //        power: a number
  //      },
  //      displacementMethod: {
  //        name: one of "standard", "proportional_threshold", or "absolute_threshold"
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
  constructor(containerSelector, options = {}, addChildrenAsParticles = true) {
    // save the containers
    var containersCollection = document.querySelectorAll(containerSelector);
    this.containers = Array.prototype.slice.call(containersCollection);
    // save options for future use
    this.options = this.initOptions(options);
    // init tracked particles
    this.trackedParticles = [];
    this.trackedParticleElementsSet = new Set();
    // "fix" event listeners
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this);
    // Create particles from all of the container's children
    // and add them to the list of tracked particles, if specified to do so
    if (addChildrenAsParticles) {
      this.containers.forEach(function (container) {
        for (var i = 0; i < container.children.length; ++i) {
          this.startTrackingParticleElement(container.children[i]);
        }
      }, this);
    }
    // set the initial status
    this.status = "ready";
  }

  initOptions(userOptions) {
    var options = {};

    // Process factorMethod option
    options.factorMethod = {};
    if ("factorMethod" in userOptions) {
      if (typeof userOptions.factorMethod === "string"
          && (userOptions.factorMethod in Avoidance.calculateAvoidanceFactor.builtinMethods)) {
        options.factorMethod.name = userOptions.factorMethod;
        options.factorMethod.scale = undefined;
        options.factorMethod.offset = undefined;
        options.factorMethod.power = undefined;
      }
      else if (typeof userOptions.factorMethod === "object") {
        if (("name" in userOptions.factorMethod)
            && (typeof userOptions.factorMethod.name === "string")
            && (userOptions.factorMethod.name in Avoidance.calculateAvoidanceFactor.builtinMethods)) {
          options.factorMethod.name = userOptions.factorMethod.name;
        }
        else {
          options.factorMethod.name = undefined;
        }
        if (("scale" in userOptions.factorMethod)
            && (typeof userOptions.factorMethod.scale === "number")) {
          options.factorMethod.scale = userOptions.factorMethod.scale;
        }
        else {
          options.factorMethod.scale = undefined;
        }
        if (("offset" in userOptions.factorMethod)
            && (typeof userOptions.factorMethod.offset === "number")) {
          options.factorMethod.offset = userOptions.factorMethod.offset;
        }
        else {
          options.factorMethod.offset = undefined;
        }
        if (("power" in userOptions.factorMethod)
            && (typeof userOptions.factorMethod.power === "number")) {
          options.factorMethod.power = userOptions.factorMethod.power;
        }
        else {
          options.factorMethod.power = undefined;
        }
      }
      else {
        options.factorMethod.name = undefined;
        options.factorMethod.scale = undefined;
        options.factorMethod.offset = undefined;
        options.factorMethod.power = undefined;
      }
    }

    // Process displacementMethod
    options.displacementMethod = {};
    if ("displacementMethod" in userOptions) {
      if (typeof userOptions.displacementMethod === "string"
          && (userOptions.displacementMethod in Avoidance.calculateAvoidanceDisplacement.builtinMethods)) {
        options.displacementMethod.name = userOptions.displacementMethod;
        options.displacementMethod.thresholdRadius = undefined;
      }
      else if (typeof userOptions.displacementMethod === "object") {
        if (("name" in userOptions.displacementMethod)
            && (typeof userOptions.displacementMethod.name === "string")
            && (userOptions.displacementMethod.name in Avoidance.calculateAvoidanceDisplacement.builtinMethods)) {
          options.displacementMethod.name = userOptions.displacementMethod.name;
        }
        else {
          options.displacementMethod.name = undefined;
        }
        if (("thresholdRadius" in userOptions.displacementMethod)
            && (typeof userOptions.displacementMethod.thresholdRadius === "number")) {
          options.displacementMethod.thresholdRadius = userOptions.displacementMethod.thresholdRadius;
        }
        else {
          options.displacementMethod.thresholdRadius = undefined;
        }
      }
      else {
        options.displacementMethod.name = undefined;
        options.displacementMethod.thresholdRadius = undefined;
      }
    }

    // Process timings
    if ("timing" in userOptions
        && (typeof userOptions.timing === "string")
        && (userOptions.timing in Avoidance.animate.timings)) {
      options.timing = Avoidance.animate.timings[userOptions.timing];
    }
    else {
      options.timing = Avoidance.animate.timings.easeOutExpo;
    }
    
    // Process pathing
    if ("pathing" in userOptions
        && (typeof userOptions.pathing === "string")
        && (userOptions.pathing in Avoidance.animate.paths)) {
      options.pathing = userOptions.pathing;
    }
    else {
      options.pathing = "bezierQuad";
    }

    return options;
  }

  addParticles(particleSelector) {
    document.querySelectorAll(particleSelector).forEach(this.startTrackingParticleElement, this);
  }

  addParticleElement(particleElement) {
    this.startTrackingParticleElement(particleElement);
  }

  removeParticles(particleSelector) {
    this.stopTrackingParticleElements(document.querySelectorAll(particleSelector));
  }

  removeParticleElement(particleElement) {
    this.stopTrackingParticleElement(particleElement);
  }

  startTrackingParticleElement(particleElement) {
    if (!this.trackedParticleElementsSet.has(particleElement)) {
      var particle = new Avoidance.Particle(particleElement);
      this.trackedParticles.push(particle);
      this.trackedParticleElementsSet.add(particleElement);
    }
  }

  stopTrackingParticleElement(particleElement) {
    if (this.trackedParticleElementsSet.has(particleElement)) {
      // First remove from lookup set
      this.trackedParticleElementsSet.delete(particleElement);
      var foundIdx = this.trackedParticles.findIndex(function(particle) {
        return particle.element === particleElement;
      });
      if (foundIdx !== -1) {
        // Then dispose
        this.trackedParticles[foundIdx].dispose();
        // Then remove from tracked particles
        this.trackedParticles.splice(foundIdx, 1);
      }
    }
  }

  stopTrackingParticleElements(particleElements) {
    var particleElementSet = new Set(particleElements);
    for (var i = 0; i < this.trackedParticles.length; ++i) {
      if (particleElementSet.has(this.trackedParticles[i].element)) {
        // First remove from lookup set
        this.trackedParticleElementsSet.delete(this.trackedParticles[i].element);
        // Then dispose
        this.trackedParticles[i].dispose();
        // Then remove from tracked particles
        this.trackedParticles[i] = "removed";
      }
    }
    // Realize the removal
    this.trackedParticles = this.trackedParticles.filter(function(particle) {
      return particle !== "removed";
    });
  }

  start() {
    // Add all event handlers to each container
    this.containers.forEach(this.registerEventHandlers, this);
    this.status = "running";
  }

  stop() {
    // remove all event handlers from each container
    this.containers.forEach(this.deregisterEventHandlers, this);
    this.status = "stopped";
  }

  addContainers(containerSelector, addChildrenAsParticles = true) {
    // Split work by processing each selected container iteratively
    var containersCollection = document.querySelectorAll(containerSelector);
    containersCollection.forEach(function(container) {
      // Only add if not already added
      var idx = this.containers.indexOf(container);
      if (idx >= 0) {
        return;
      }
      this.containers.push(container);
      // Add children as particles if specified to do so
      if (addChildrenAsParticles) {
        for (var i = 0; i < container.children.length; ++i) {
          this.startTrackingParticleElement(container.children[i]);
        }
      }
      // Register handlers if we are already running
      if (this.status === "running") {
        this.registerEventHandlers(container);
      }
    }, this);
  }

  removeContainers(containerSelector, removeChildrenAsParticles = true) {
    // Process each selected container iteratively
    var containersCollection = document.querySelectorAll(containerSelector);
    containersCollection.forEach(function(container) {
      // Process only if the container is tracked
      var idx = this.containers.indexOf(container);
      if (idx < 0) {
        return;
      }
      // Remove children as particles if specified to do so
      if (removeChildrenAsParticles) {
        this.stopTrackingParticleElements(container.children);
      }
      // Deregister events if we are running
      if (this.status === "running") {
        this.deregisterEventHandlers(container);
      }
      // Remove from tracked containers
      this.containers.splice(idx, 1);
    }, this);
  }

  registerEventHandlers(container) {
    container.addEventListener("touchend", this.touchEndHandler);
    container.addEventListener("touchstart", this.touchStartHandler);
    container.addEventListener("mousemove", this.mouseMoveHandler);
    container.addEventListener("click", this.clickHandler);
  }

  deregisterEventHandlers(container) {
    container.removeEventListener("click", this.clickHandler);
    container.removeEventListener("mousemove", this.mouseMoveHandler);
    container.removeEventListener("touchstart", this.touchStartHandler);
    container.removeEventListener("touchend", this.touchEndHandler);
  }

  mouseMoveHandler(event) {
    if (this.touchStarted || this.touchEnded) {
      // Do not handle a mouseMove for touch events
      event.preventDefault();
    }
    else {
      const container = event.currentTarget;
      const mousePos = { x: event.pageX - container.offsetLeft, y: event.pageY - container.offsetTop };
      this.computeAvoidance(container, mousePos, this.renderImmediateAvoidance.bind(this));
    }
  }

  clickHandler(event) {
    if (this.touchStarted || this.touchEnded) {
      const container = event.currentTarget;
      const touchPos = { x: event.pageX - container.offsetLeft, y: event.pageY - container.offsetTop };
      this.computeAvoidance(container, touchPos, this.renderAnimatedAvoidance.bind(this));
      this.touchStarted = false;
      this.touchEnded = false;
    }
    else {
      // click, but not touched
    }
  }

  touchStartHandler(event) {
    this.touchStarted = true;
  }

  touchEndHandler(event) {
    this.touchEnded = true;
  }

  computeAvoidance(container, userPos, renderCallback) {
    const containerSizeScalar = Avoidance.geometry.getRadius({ x: container.offsetWidth, y: container.offsetHeight });
    this.trackedParticles.forEach(function (particle) {
      const particleSize = { width: particle.element.offsetWidth, height: particle.element.offsetHeight };
      const particleOrigPosToCentreRelUser = {
        x: particle.originalPos.x + particleSize.width*1.0 / 2 - userPos.x,
        y: particle.originalPos.y + particleSize.height*1.0 / 2 - userPos.y,
      };
      const particleOrigDistToCentreRelUser = Avoidance.geometry.getRadius(particleOrigPosToCentreRelUser);
      const avoidanceFactor = this.calculateAvoidanceFactor(particleOrigDistToCentreRelUser, particleSize, containerSizeScalar);
      const avoidanceDisplacement = this.calculateAvoidanceDisplacement(particleOrigPosToCentreRelUser, avoidanceFactor);
      renderCallback(avoidanceDisplacement, particle);
    }, this);
  }

  renderImmediateAvoidance(avoidanceDisplacement, particle) {
    if (avoidanceDisplacement === null) {
      particle.element.style.display = "none";
    }
    else {
      const particleNewPos = {
        x: particle.originalPos.x + avoidanceDisplacement.x,
        y: particle.originalPos.y + avoidanceDisplacement.y,
      };
      if (particle.element.style.display === "none") {
        particle.element.style.display = "";
      }
      particle.element.style.left = particleNewPos.x;
      particle.element.style.top = particleNewPos.y;
    }
  }

  renderAnimatedAvoidance(avoidanceDisplacement, particle) {
    if (avoidanceDisplacement === null) {
      particle.element.style.display = "none";
    }
    else {
      const particleOldPos = {
        x: particle.element.offsetLeft,
        y: particle.element.offsetTop,
      };
      const particleNewPos = {
        x: particle.originalPos.x + avoidanceDisplacement.x,
        y: particle.originalPos.y + avoidanceDisplacement.y,
      };
      if (particle.element.style.display === "none") {
        particle.element.style.display = "";
      }
      const pathing = this.options.pathing === "bezierQuad"
        ? Avoidance.animate.paths.bezierQuad(particleOldPos, particle.originalPos, particleNewPos)
        : Avoidance.animate.paths.linear(particleOldPos, particleNewPos);
      Avoidance.animate.move(particle.element, pathing, 1000, this.options.timing);
    }
  }

  calculateAvoidanceFactor(originalDistance, elementSize, containerSizeScalar, method) {
    if (method === undefined) {
      method = this.options.factorMethod.name;
    }
    var methodFn = null;
    if (method !== undefined) {
      methodFn = Avoidance.calculateAvoidanceFactor.builtinMethods[method];
    }
    else {
      methodFn = Avoidance.calculateAvoidanceFactor.builtinMethods.power_inverse;
    }
    return methodFn(
      this.options.factorMethod.scale,
      this.options.factorMethod.offset,
      this.options.factorMethod.power
    )(originalDistance, elementSize, containerSizeScalar);
  }
  
  calculateAvoidanceDisplacement(particleOrigPosRelMouse, avoidanceFactor, method) {
    if (method === undefined) {
      method = this.options.displacementMethod.name;
    }
    var methodFn = null;
    if (method !== undefined) {
      methodFn = Avoidance.calculateAvoidanceDisplacement.builtinMethods[method];
    }
    else {
      methodFn = Avoidance.calculateAvoidanceDisplacement.builtinMethods.absolute_threshold;
    }
    return methodFn(
      this.options.displacementMethod.thresholdRadius
    )(particleOrigPosRelMouse, avoidanceFactor);
  }
}

Avoidance.geometry = {
  getDistance: function(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
  },
  getRadius: function(point) {
    return Math.sqrt(point.x*point.x + point.y*point.y);
  },
}

Avoidance.calculateAvoidanceFactor = {
  builtinMethods: {
    inverse: function(param_scale=0.1, param_offset=0.0, param_power=undefined) {
      return function(originalDistance, elementSize, containerSizeScalar) {
        if (originalDistance === 0) {
          return NaN;
        }
        else {
          return (containerSizeScalar*param_scale*1.0)/originalDistance + param_offset;
        }
      }
    },
    exponential: function(param_scale=0.01, param_offset=0.25, param_power=undefined) {
      return function(originalDistance, elementSize, containerSizeScalar) {
        return Math.exp(param_scale-originalDistance*1.0/containerSizeScalar) + param_offset;
      }
    },
    power_inverse: function(param_scale=1.0, param_offset=0.0, param_power=1.6) {
      return function(originalDistance, elementSize, containerSizeScalar) {
        if (originalDistance === 0) {
          return NaN;
        }
        else {
          return ((containerSizeScalar*param_scale*1.0)/Math.pow(originalDistance*1.0, param_power) + param_offset);
        }
      }
    }
  }
}

Avoidance.calculateAvoidanceDisplacement = {
  builtinMethods: {
    absolute_threshold: function(param_threshold_radius=80.0) {
      return function(particleOrigPosRelMouse, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }
        var offset = {
          x: particleOrigPosRelMouse.x*avoidanceFactor,
          y: particleOrigPosRelMouse.y*avoidanceFactor,
        };
        if (Avoidance.geometry.getRadius(offset) > param_threshold_radius) {
          var origRadius = Avoidance.geometry.getRadius(particleOrigPosRelMouse);
          var scaleFactor = (param_threshold_radius / origRadius);
          return {
            x: particleOrigPosRelMouse.x*scaleFactor,
            y: particleOrigPosRelMouse.y*scaleFactor,
          };
        }
        else {
          return offset;
        }
      }
    },
    proportional_threshold: function(param_threshold_radius=20.0) {
      return function(particleOrigPosRelMouse, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }
        var offset = {
          x: particleOrigPosRelMouse.x*avoidanceFactor,
          y: particleOrigPosRelMouse.y*avoidanceFactor,
        };
        if (avoidanceFactor > param_threshold_radius) {
          return {
            x: particleOrigPosRelMouse.x*param_threshold_radius,
            y: particleOrigPosRelMouse.y*param_threshold_radius,
          };
        }
        else {
          return offset;
        }
      }
    },
    standard: function(param_threshold_radius=undefined) {
      return function(particleOrigPosRelMouse, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }
        return {
          x: particleOrigPosRelMouse.x*avoidanceFactor,
          y: particleOrigPosRelMouse.y*avoidanceFactor,
        };
      }
    }
  }
}

Avoidance.dom = {
  pageOffset: function(element) {
    var rect = element.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { x: rect.left + scrollLeft, y: rect.top + scrollTop }
  },
  getCentre: function(element, relativeTo) {
    return {
      x: element.offsetLeft + element.offsetWidth / 2 - (relativeTo ? relativeTo.offsetLeft : 0),
      y: element.offsetTop + element.offsetHeight / 2 - (relativeTo ? relativeTo.offsetTop : 0),
    };
  }
}

Avoidance.animate = {
  FRAME_DURATION: 10.0,
  timings: {
    linear: duration => t => t/duration,
    easeOutCubic: duration => t => 1+Math.pow(t/duration-1, 3),
    easeOutExpo: duration => t => 1-Math.pow(2, -10*t/duration),
  },
  paths: {
    linear: function(p0, p1) {
      return s => ({
        x: p0.x + s*(p1.x - p0.x),
        y: p0.y + s*(p1.y - p0.y),
      });
    },
    bezierQuad: function(p0, p1, p2) {
      return s => ({
        x: p1.x + (1.0-s)*(1.0-s)*(p0.x-p1.x) + s*s*(p2.x-p1.x),
        y: p1.y + (1.0-s)*(1.0-s)*(p0.y-p1.y) + s*s*(p2.y-p1.y),
      }); // 0 <= s <= 1
    },
  },
  move: function(element, pathing, duration, timing) {
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
      element.style.left = pos.x;
      element.style.top = pos.y;
      // Update vars for next iteration
      time = time + this.FRAME_DURATION;
      distance = distanceFromTime(time);
    }, this.FRAME_DURATION);
  },
}

Avoidance.Particle = class {
  constructor(element) {
    this.element = element;
    this.originalPos = {
      x: element.offsetLeft,
      y: element.offsetTop,
    };
  }
  dispose() {
    // TODO: return particle to original location, either by setting style or removing location style
  }
}