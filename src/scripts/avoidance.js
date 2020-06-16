// AVOIDANCE VERSION 0.1.0
// AUTHOR: Stephen Zhao
// REPO: github.com/stephen-zhao/sophii.co

// A standalone library for creating "avoidance cloud" effect.
// All children of given containers will be animated to avoid the user's mouse.
// Note: Assume jQuery is imported from browser

class Avoidance {
  constructor(containerSelector, options) {
    // save the container selector for future use
    this.containerSelector = containerSelector;
    // save options for future use
    this.options = options;
    // init tracked particles
    this.trackedParticles = [];
    // "fix" event listeners
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseClickTestHandler = this.mouseClickTestHandler.bind(this);
    // Create particles from all of the container's children
    // and add them to the list of tracked particles
    document.querySelectorAll(this.containerSelector).forEach(function (container) {
      for (var i = 0; i < container.children.length; ++i) {
        var particleElement = container.children[i];
        var particle = new Avoidance.Particle(particleElement);
        this.trackedParticles.push(particle);
      }
    }, this);
  }

  addTrackedParticles(particleSelector) {
    document.querySelectorAll(particleSelector).forEach(function (particleElement) {
      this.trackedParticles.push(new Avoidance.Particle(particleElement));
    }, this);
  }

  removeTrackedParticles(particleSelector) {
    document.querySelectorAll(particleSelector).forEach(function (particleElement) {
      if (!this.trackedParticles.includes(particle)) {
        return;
      }
      particle.dispose();
      this.trackedParticles.splice(this.trackedParticles.indexOf(particle), 1);
    }, this);
  }

  start() {
    // Add all event handlers to each container
    document.querySelectorAll(this.containerSelector).forEach(function (container) {
      container.addEventListener("mousemove", this.mouseMoveHandler);
      container.addEventListener("click", this.mouseClickTestHandler);
    }, this);
  }

  stop() {
    // remove all event handlers, in reverse order, from each container
    document.querySelectorAll(this.containerSelector).forEach(function (container) {
      container.removeEventListener("click", this.mouseClickTestHandler);
      container.removeEventListener("mousemove", this.mouseMoveHandler);
    }, this);
  }

  mouseMoveHandler(event) {
    var container = event.currentTarget;
    var containerSize = { width: container.offsetWidth, height: container.offsetHeight };
    // Determine the relative x and y of mouse position inside the container
    var mousePos = { x: event.pageX - container.offsetLeft, y: event.pageY - container.offsetTop };
    this.trackedParticles.forEach(function (particle) {
      var particleSize = { width: particle.element.offsetWidth, height: particle.element.offsetHeight };
      var particleOrigPosRelMouse = {
        x: particle.originalPos.x - mousePos.x,
        y: particle.originalPos.y - mousePos.y,
      };
      var particleOrigDistance = Avoidance.geometry.getRadius(particleOrigPosRelMouse);
      var avoidanceFactor = Avoidance.calculateAvoidanceFactor(particleOrigDistance, particleSize, containerSize);
      if (avoidanceFactor === NaN) {
        particle.element.style.display = "none";
      }
      else {
        var avoidanceDisplacement = Avoidance.calculateAvoidanceDisplacement(particleOrigPosRelMouse, avoidanceFactor);
        var newParticlePos = {
          x: particle.originalPos.x + avoidanceDisplacement.x,
          y: particle.originalPos.y + avoidanceDisplacement.y,
        };
        if (particle.element.style.display === "none") {
          particle.element.style.display = "";
        }
        particle.element.style.left = newParticlePos.x;
        particle.element.style.top = newParticlePos.y;
      }
    }, this);
  }

  mouseClickTestHandler(event) {
    var datastring = this.trackedParticles.map(function (particle, idx) {
      var particleString = "";
      var id = particle.element.getAttribute("id");
      particleString += `particle ${id !== null ? id : idx}\n`;
      particleString += `original x = ${particle.originalPos.x}\n`;
      particleString += `original y = ${particle.originalPos.y}\n`;
      particleString += `-------------------\n`;
      return particleString;
    }).join("");
    alert(datastring);
  }

  static getCentre(element, relativeTo) {
    return {
      x: element.offsetLeft + element.offsetWidth / 2 - (relativeTo ? relativeTo.offsetLeft : 0),
      y: element.offsetTop + element.offsetHeight / 2 - (relativeTo ? relativeTo.offsetTop : 0),
    };
  }

  static calculateAvoidanceFactor(originalDistance, elementSize, containerSize, method) {
    // TODO: take into account the element size (and therefore centre)
    if (typeof method === "function") {
      return method(originalDistance, elementSize, containerSize);
    }
    else if (typeof method === "string" && method in Avoidance.calculateAvoidanceFactor.builtinMethods) {

      return Avoidance.calculateAvoidanceFactor.builtinMethods[method]()(originalDistance, elementSize, containerSize);
    }
    else {
      return Avoidance.calculateAvoidanceFactor.builtinMethods.power_inverse()(originalDistance, elementSize, containerSize);
    }
  }
  
  static calculateAvoidanceDisplacement(particleOrigPosRelMouse, avoidanceFactor, method) {
    if (typeof method === "function") {
      return method(particleOrigPosRelMouse, avoidanceFactor);
    }
    else if (typeof method === "string" && method in Avoidance.calculateAvoidanceDisplacement.builtinMethods) {

      return Avoidance.calculateAvoidanceDisplacement.builtinMethods[method]()(particleOrigPosRelMouse, avoidanceFactor);
    }
    else {
      return Avoidance.calculateAvoidanceDisplacement.builtinMethods.threshold_absolute_radius()(particleOrigPosRelMouse, avoidanceFactor);
    }
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

Avoidance.calculateAvoidanceFactor.builtinMethods = {
  "inverse": function(param_scale=0.1, param_offset=0.0) {
    return function(originalDistance, elementSize, containerSize) {
      if (originalDistance === 0) {
        return NaN;
      }
      else {
        return (containerSize.width*param_scale*1.0)/originalDistance + param_offset;
      }
    }
  },
  "exponential": function(param_scale=0.01, param_offset=0.25) {
    return function(originalDistance, elementSize, containerSize) {
      return Math.exp(param_scale-originalDistance*1.0/containerSize.width) + param_offset;
    }
  },
  "power_inverse": function(param_scale=1.0, param_offset=0.0, param_power=1.6) {
    return function(originalDistance, elementSize, containerSize) {
      if (originalDistance === 0) {
        return NaN;
      }
      else {
        return ((containerSize.width*param_scale*1.0)/Math.pow(originalDistance*1.0, param_power) + param_offset);
      }
    }
  }
}

Avoidance.calculateAvoidanceDisplacement.builtinMethods = {
  "threshold_absolute_radius": function(param_threshold_radius=100.0) {
    return function(particleOrigPosRelMouse, avoidanceFactor) {
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
  "threshold_proportional_radius": function(param_threshold_radius=20.0) {
    return function(particleOrigPosRelMouse, avoidanceFactor) {
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
  "standard": function() {
    return function(particleOrigPosRelMouse, avoidanceFactor) {
      return {
        x: particleOrigPosRelMouse.x*avoidanceFactor,
        y: particleOrigPosRelMouse.y*avoidanceFactor,
      };
    }
  }
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