module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Avoidance; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// avoidance.js
// AUTHOR: Stephen Zhao
// REPO: github.com/stephen-zhao/sophii.co
// A standalone library for creating "avoidance cloud" effect.
// All children of given containers will be animated to avoid the user's mouse.
// The class which exposes the public API
var Avoidance = /*#__PURE__*/function () {
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
  function Avoidance(containerSelector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var addChildrenAsParticles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Avoidance);

    // save the containers
    var containersCollection = document.querySelectorAll(containerSelector);
    this.containers = Array.prototype.slice.call(containersCollection); // save options for future use

    this.options = this.initOptions(options); // init tracked particles

    this.trackedParticles = [];
    this.trackedParticleElementsSet = new Set(); // "fix" event listeners

    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.touchStartHandler = this.touchStartHandler.bind(this);
    this.touchEndHandler = this.touchEndHandler.bind(this); // Create particles from all of the container's children
    // and add them to the list of tracked particles, if specified to do so

    if (addChildrenAsParticles) {
      this.containers.forEach(function (container) {
        for (var i = 0; i < container.children.length; ++i) {
          this.startTrackingParticleElement(container.children[i], container);
        }
      }, this);
    } // set the initial status


    this.status = "ready";
  }

  _createClass(Avoidance, [{
    key: "initOptions",
    value: function initOptions(userOptions) {
      var options = {}; // Process factorMethod option

      options.factorMethod = {};

      if ("factorMethod" in userOptions) {
        if (typeof userOptions.factorMethod === "string" && userOptions.factorMethod in Avoidance.calculateAvoidanceFactor.builtinMethods) {
          options.factorMethod.name = userOptions.factorMethod;
          options.factorMethod.scale = undefined;
          options.factorMethod.offset = undefined;
          options.factorMethod.power = undefined;
        } else if (_typeof(userOptions.factorMethod) === "object") {
          if ("name" in userOptions.factorMethod && typeof userOptions.factorMethod.name === "string" && userOptions.factorMethod.name in Avoidance.calculateAvoidanceFactor.builtinMethods) {
            options.factorMethod.name = userOptions.factorMethod.name;
          } else {
            options.factorMethod.name = undefined;
          }

          if ("scale" in userOptions.factorMethod && typeof userOptions.factorMethod.scale === "number") {
            options.factorMethod.scale = userOptions.factorMethod.scale;
          } else {
            options.factorMethod.scale = undefined;
          }

          if ("offset" in userOptions.factorMethod && typeof userOptions.factorMethod.offset === "number") {
            options.factorMethod.offset = userOptions.factorMethod.offset;
          } else {
            options.factorMethod.offset = undefined;
          }

          if ("power" in userOptions.factorMethod && typeof userOptions.factorMethod.power === "number") {
            options.factorMethod.power = userOptions.factorMethod.power;
          } else {
            options.factorMethod.power = undefined;
          }
        } else {
          options.factorMethod.name = undefined;
          options.factorMethod.scale = undefined;
          options.factorMethod.offset = undefined;
          options.factorMethod.power = undefined;
        }
      } // Process displacementMethod


      options.displacementMethod = {};

      if ("displacementMethod" in userOptions) {
        if (typeof userOptions.displacementMethod === "string" && userOptions.displacementMethod in Avoidance.calculateAvoidanceDisplacement.builtinMethods) {
          options.displacementMethod.name = userOptions.displacementMethod;
          options.displacementMethod.thresholdRadius = undefined;
        } else if (_typeof(userOptions.displacementMethod) === "object") {
          if ("name" in userOptions.displacementMethod && typeof userOptions.displacementMethod.name === "string" && userOptions.displacementMethod.name in Avoidance.calculateAvoidanceDisplacement.builtinMethods) {
            options.displacementMethod.name = userOptions.displacementMethod.name;
          } else {
            options.displacementMethod.name = undefined;
          }

          if ("thresholdRadius" in userOptions.displacementMethod && typeof userOptions.displacementMethod.thresholdRadius === "number") {
            options.displacementMethod.thresholdRadius = userOptions.displacementMethod.thresholdRadius;
          } else {
            options.displacementMethod.thresholdRadius = undefined;
          }
        } else {
          options.displacementMethod.name = undefined;
          options.displacementMethod.thresholdRadius = undefined;
        }
      } // Process timings


      if ("timing" in userOptions && typeof userOptions.timing === "string" && userOptions.timing in Avoidance.animate.timings) {
        options.timing = Avoidance.animate.timings[userOptions.timing];
      } else {
        options.timing = Avoidance.animate.timings.easeOutExpo;
      } // Process pathing


      if ("pathing" in userOptions && typeof userOptions.pathing === "string" && userOptions.pathing in Avoidance.animate.paths) {
        options.pathing = userOptions.pathing;
      } else {
        options.pathing = "bezierQuad";
      }

      return options;
    }
  }, {
    key: "addParticles",
    value: function addParticles(particleSelector, containerSelector) {
      var _this = this;

      document.querySelectorAll(particleSelector).forEach(function (particleElement) {
        _this.startTrackingParticleElement(particleElement, containerSelector ? document.querySelector(containerSelector) : undefined);
      }, this);
    }
  }, {
    key: "addParticleElement",
    value: function addParticleElement(particleElement, containerElement) {
      this.startTrackingParticleElement(particleElement, containerElement);
    }
  }, {
    key: "removeParticles",
    value: function removeParticles(particleSelector) {
      this.stopTrackingParticleElements(document.querySelectorAll(particleSelector));
    }
  }, {
    key: "removeParticleElement",
    value: function removeParticleElement(particleElement) {
      this.stopTrackingParticleElement(particleElement);
    }
  }, {
    key: "startTrackingParticleElement",
    value: function startTrackingParticleElement(particleElement, containerElement) {
      if (!this.trackedParticleElementsSet.has(particleElement)) {
        if (!containerElement) {
          containerElement = document.body;
        }

        var particle = new Avoidance.Particle(particleElement, containerElement);
        this.trackedParticles.push(particle);
        this.trackedParticleElementsSet.add(particleElement);
      }
    }
  }, {
    key: "stopTrackingParticleElement",
    value: function stopTrackingParticleElement(particleElement) {
      if (this.trackedParticleElementsSet.has(particleElement)) {
        // First remove from lookup set
        this.trackedParticleElementsSet["delete"](particleElement);
        var foundIdx = this.trackedParticles.findIndex(function (particle) {
          return particle.element === particleElement;
        });

        if (foundIdx !== -1) {
          // Then dispose
          this.trackedParticles[foundIdx].dispose(); // Then remove from tracked particles

          this.trackedParticles.splice(foundIdx, 1);
        }
      }
    }
  }, {
    key: "stopTrackingParticleElements",
    value: function stopTrackingParticleElements(particleElements) {
      var particleElementSet = new Set(particleElements);

      for (var i = 0; i < this.trackedParticles.length; ++i) {
        if (particleElementSet.has(this.trackedParticles[i].element)) {
          // First remove from lookup set
          this.trackedParticleElementsSet["delete"](this.trackedParticles[i].element); // Then dispose

          this.trackedParticles[i].dispose(); // Then remove from tracked particles

          this.trackedParticles[i] = "removed";
        }
      } // Realize the removal


      this.trackedParticles = this.trackedParticles.filter(function (particle) {
        return particle !== "removed";
      });
    }
  }, {
    key: "start",
    value: function start() {
      // Add all event handlers to each container
      this.containers.forEach(this.registerEventHandlers, this);
      this.status = "running";
    }
  }, {
    key: "stop",
    value: function stop() {
      // remove all event handlers from each container
      this.containers.forEach(this.deregisterEventHandlers, this);
      this.status = "stopped";
    }
  }, {
    key: "addContainers",
    value: function addContainers(containerSelector) {
      var addChildrenAsParticles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      // Split work by processing each selected container iteratively
      var containersCollection = document.querySelectorAll(containerSelector);
      containersCollection.forEach(function (container) {
        // Only add if not already added
        var idx = this.containers.indexOf(container);

        if (idx >= 0) {
          return;
        }

        this.containers.push(container); // Add children as particles if specified to do so

        if (addChildrenAsParticles) {
          for (var i = 0; i < container.children.length; ++i) {
            this.startTrackingParticleElement(container.children[i]);
          }
        } // Register handlers if we are already running


        if (this.status === "running") {
          this.registerEventHandlers(container);
        }
      }, this);
    }
  }, {
    key: "removeContainers",
    value: function removeContainers(containerSelector) {
      var removeChildrenAsParticles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      // Process each selected container iteratively
      var containersCollection = document.querySelectorAll(containerSelector);
      containersCollection.forEach(function (container) {
        // Process only if the container is tracked
        var idx = this.containers.indexOf(container);

        if (idx < 0) {
          return;
        } // Remove children as particles if specified to do so


        if (removeChildrenAsParticles) {
          this.stopTrackingParticleElements(container.children);
        } // Deregister events if we are running


        if (this.status === "running") {
          this.deregisterEventHandlers(container);
        } // Remove from tracked containers


        this.containers.splice(idx, 1);
      }, this);
    }
  }, {
    key: "registerEventHandlers",
    value: function registerEventHandlers(container) {
      container.addEventListener("touchend", this.touchEndHandler);
      container.addEventListener("touchstart", this.touchStartHandler);
      container.addEventListener("mousemove", this.mouseMoveHandler);
      container.addEventListener("click", this.clickHandler);
    }
  }, {
    key: "deregisterEventHandlers",
    value: function deregisterEventHandlers(container) {
      container.removeEventListener("click", this.clickHandler);
      container.removeEventListener("mousemove", this.mouseMoveHandler);
      container.removeEventListener("touchstart", this.touchStartHandler);
      container.removeEventListener("touchend", this.touchEndHandler);
    }
  }, {
    key: "mouseMoveHandler",
    value: function mouseMoveHandler(event) {
      if (this.touchStarted || this.touchEnded) {
        // Do not handle a mouseMove for touch events
        event.preventDefault();
      } else {
        var container = event.currentTarget;
        var mousePos = {
          x: event.pageX - container.offsetLeft,
          y: event.pageY - container.offsetTop
        };
        this.computeAvoidance(container, mousePos, this.renderImmediateAvoidance.bind(this));
      }
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(event) {
      if (this.touchStarted || this.touchEnded) {
        var container = event.currentTarget;
        var touchPos = {
          x: event.pageX - container.offsetLeft,
          y: event.pageY - container.offsetTop
        };
        this.computeAvoidance(container, touchPos, this.renderAnimatedAvoidance.bind(this));
        this.touchStarted = false;
        this.touchEnded = false;
      } else {// click, but not touched
      }
    }
  }, {
    key: "touchStartHandler",
    value: function touchStartHandler(event) {
      this.touchStarted = true;
    }
  }, {
    key: "touchEndHandler",
    value: function touchEndHandler(event) {
      this.touchEnded = true;
    }
  }, {
    key: "computeAvoidance",
    value: function computeAvoidance(container, userPos, renderCallback) {
      var containerRect = container.getBoundingClientRect();
      var userPosRatio = {
        x: userPos.x / containerRect.width,
        y: userPos.y / containerRect.height
      };
      this.trackedParticles.forEach(function (particle) {
        var particleSizeRatio = particle.getSizeRatio();
        var particleCentreOrigPosRatioRelUser = {
          x: particle.originalPosRatio.x + particleSizeRatio.width * 1.0 / 2 - userPosRatio.x,
          y: particle.originalPosRatio.y + particleSizeRatio.height * 1.0 / 2 - userPosRatio.y
        };
        var particleCentreOrigDistRelUser = Avoidance.geometry.getRadius(particleCentreOrigPosRatioRelUser);
        var avoidanceFactor = this.calculateAvoidanceFactor(particleCentreOrigDistRelUser, particleSizeRatio);
        var avoidanceDisplacement = this.calculateAvoidanceDisplacement(Avoidance.geometry.getUnitVector(particleCentreOrigPosRatioRelUser), avoidanceFactor);
        renderCallback(avoidanceDisplacement, particle);
      }, this);
    }
  }, {
    key: "renderImmediateAvoidance",
    value: function renderImmediateAvoidance(avoidanceDisplacement, particle) {
      if (avoidanceDisplacement === null) {
        particle.element.style.display = "none";
      } else {
        var particleNewPos = {
          x: particle.originalPosRatio.x + avoidanceDisplacement.x,
          y: particle.originalPosRatio.y + avoidanceDisplacement.y
        };

        if (particle.element.style.display === "none") {
          particle.element.style.display = "";
        }

        particle.element.style.left = Avoidance.math.toPctStr(particleNewPos.x);
        particle.element.style.top = Avoidance.math.toPctStr(particleNewPos.y);
      }
    }
  }, {
    key: "renderAnimatedAvoidance",
    value: function renderAnimatedAvoidance(avoidanceDisplacement, particle) {
      if (avoidanceDisplacement === null) {
        particle.element.style.display = "none";
      } else {
        var particleOldPosRatio = particle.getPosRatio();
        var particleNewPosRatio = {
          x: particle.originalPosRatio.x + avoidanceDisplacement.x,
          y: particle.originalPosRatio.y + avoidanceDisplacement.y
        };

        if (particle.element.style.display === "none") {
          particle.element.style.display = "";
        }

        var pathing = this.options.pathing === "bezierQuad" ? Avoidance.animate.paths.bezierQuad(particleOldPosRatio, particle.originalPosRatio, particleNewPosRatio) : Avoidance.animate.paths.linear(particleOldPosRatio, particleNewPosRatio);
        Avoidance.animate.move(particle.element, pathing, 1000, this.options.timing);
      }
    }
  }, {
    key: "calculateAvoidanceFactor",
    value: function calculateAvoidanceFactor(originalDistance, elementSize, method) {
      if (method === undefined) {
        method = this.options.factorMethod.name;
      }

      var methodFn = null;

      if (method !== undefined) {
        methodFn = Avoidance.calculateAvoidanceFactor.builtinMethods[method];
      } else {
        methodFn = Avoidance.calculateAvoidanceFactor.builtinMethods.powerInverse;
      }

      return methodFn(this.options.factorMethod.scale, this.options.factorMethod.offset, this.options.factorMethod.power)(originalDistance, elementSize);
    }
  }, {
    key: "calculateAvoidanceDisplacement",
    value: function calculateAvoidanceDisplacement(particleOrigPosRelMouse, avoidanceFactor, method) {
      if (method === undefined) {
        method = this.options.displacementMethod.name;
      }

      var methodFn = null;

      if (method !== undefined) {
        methodFn = Avoidance.calculateAvoidanceDisplacement.builtinMethods[method];
      } else {
        methodFn = Avoidance.calculateAvoidanceDisplacement.builtinMethods.threshold;
      }

      return methodFn(this.options.displacementMethod.thresholdRadius)(particleOrigPosRelMouse, avoidanceFactor);
    }
  }]);

  return Avoidance;
}();


Avoidance.geometry = {
  getDistance: function getDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
  },
  getRadius: function getRadius(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  },
  getUnitVector: function getUnitVector(point) {
    var radius = Avoidance.geometry.getRadius(point);
    return {
      x: point.x / radius,
      y: point.y / radius
    };
  }
};
Avoidance.calculateAvoidanceFactor = {
  builtinMethods: {
    inverse: function inverse() {
      var param_scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.02;
      var param_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var param_power = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return function (originalDistance, elementSize) {
        if (originalDistance === 0) {
          return NaN;
        } else {
          return param_scale * 1.0 / originalDistance + param_offset;
        }
      };
    },
    exponential: function exponential() {
      var param_scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
      var param_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var param_power = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return function (originalDistance, elementSize) {
        return Math.exp(param_scale - originalDistance) + param_offset;
      };
    },
    powerInverse: function powerInverse() {
      var param_scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.02;
      var param_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var param_power = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.6;
      return function (originalDistance, elementSize) {
        if (originalDistance === 0) {
          return NaN;
        } else {
          return param_scale * 1.0 / Math.pow(originalDistance * 1.0, param_power) + param_offset;
        }
      };
    }
  }
};
Avoidance.calculateAvoidanceDisplacement = {
  builtinMethods: {
    threshold: function threshold() {
      var param_threshold_radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
      return function (directionUnitVector, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }

        var offset = {
          x: directionUnitVector.x * avoidanceFactor,
          y: directionUnitVector.y * avoidanceFactor
        };

        if (Avoidance.geometry.getRadius(offset) > param_threshold_radius) {
          return {
            x: directionUnitVector.x * param_threshold_radius,
            y: directionUnitVector.y * param_threshold_radius
          };
        } else {
          return offset;
        }
      };
    },
    noThreshold: function noThreshold() {
      var param_threshold_radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      return function (directionUnitVector, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }

        return {
          x: directionUnitVector.x * avoidanceFactor,
          y: directionUnitVector.y * avoidanceFactor
        };
      };
    }
  }
};
Avoidance.math = {
  toPctStr: function toPctStr(x) {
    return 100.0 * x + "%";
  }
};
Avoidance.animate = {
  FRAME_DURATION: 10.0,
  timings: {
    linear: function linear(duration) {
      return function (t) {
        return t / duration;
      };
    },
    easeOutCubic: function easeOutCubic(duration) {
      return function (t) {
        return 1 + Math.pow(t / duration - 1, 3);
      };
    },
    easeOutExpo: function easeOutExpo(duration) {
      return function (t) {
        return 1 - Math.pow(2, -10 * t / duration);
      };
    }
  },
  paths: {
    linear: function linear(p0, p1) {
      return function (s) {
        return {
          x: p0.x + s * (p1.x - p0.x),
          y: p0.y + s * (p1.y - p0.y)
        };
      };
    },
    bezierQuad: function bezierQuad(p0, p1, p2) {
      return function (s) {
        return {
          x: p1.x + (1.0 - s) * (1.0 - s) * (p0.x - p1.x) + s * s * (p2.x - p1.x),
          y: p1.y + (1.0 - s) * (1.0 - s) * (p0.y - p1.y) + s * s * (p2.y - p1.y)
        };
      }; // 0 <= s <= 1
    }
  },
  move: function move(element, pathing, duration, timing) {
    var _this2 = this;

    var time = 0;
    var distance = 0;
    var distanceFromTime = timing(duration);
    var animation = setInterval(function () {
      // Check for final condition
      if (time >= duration) {
        clearInterval(animation);
      } // Calculate position


      var pos = pathing(distance); // Render

      element.style.left = Avoidance.math.toPctStr(pos.x);
      element.style.top = Avoidance.math.toPctStr(pos.y); // Update vars for next iteration

      time = time + _this2.FRAME_DURATION;
      distance = distanceFromTime(time);
    }, this.FRAME_DURATION);
  }
};

Avoidance.Particle = /*#__PURE__*/function () {
  function _class(element, container) {
    _classCallCheck(this, _class);

    // Save both elements
    this.element = element;
    this.container = container;
    this.originalPosRatio = this.getPosRatio();
  }

  _createClass(_class, [{
    key: "getPosRatio",
    value: function getPosRatio() {
      // Get position as percentage of container to get built-in responsiveness!
      var elementRect = this.element.getBoundingClientRect();
      var containerRect = this.container.getBoundingClientRect();
      return {
        x: (elementRect.left - containerRect.left) / containerRect.width,
        y: (elementRect.top - containerRect.top) / containerRect.height
      };
    }
  }, {
    key: "getSizeRatio",
    value: function getSizeRatio() {
      // Get size as percentage of container to get built-in responsiveness!
      var elementRect = this.element.getBoundingClientRect();
      var containerRect = this.container.getBoundingClientRect();
      return {
        width: elementRect.width / containerRect.width,
        height: elementRect.height / containerRect.height
      };
    }
  }, {
    key: "dispose",
    value: function dispose() {// TODO: return particle to original location, either by setting style or removing location style
    }
  }]);

  return _class;
}();

/***/ })
/******/ ])["default"];
//# sourceMappingURL=avoidance.commonjs2.js.map