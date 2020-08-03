// avoidance.js v0.2.3  | (c) 2020 Stephen Zhao | GNU GPLv3 License | https://github.com/stephen-zhao/sophii.co
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Avoidance = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var Particle = /*#__PURE__*/function () {
    //===========================================================================
    // Ctor and Dtor
    //===========================================================================
    function Particle(element, container) {
      _classCallCheck(this, Particle);

      _defineProperty(this, "_element", void 0);

      _defineProperty(this, "_container", void 0);

      _defineProperty(this, "_originalPosRatio", void 0);

      _defineProperty(this, "_frozenStyledPosition", void 0);

      // Save both elements
      this._element = element;
      this._container = container; // Save the original position

      this._originalPosRatio = this.getPosRatio();
    }

    _createClass(Particle, [{
      key: "dispose",
      value: function dispose() {} // TODO: return particle to original location, either by setting style or removing location style
      //===========================================================================
      // Getters
      //===========================================================================

    }, {
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
      } //===========================================================================
      // Freezing and unfreezing the particle
      //===========================================================================

    }, {
      key: "unfreeze",
      // a CSSStyleDeclaration.position
      value: function unfreeze() {
        var _this = this;

        this._frozenStyledPosition = this.element.style.position;

        var delayedUnfreezeActions = function () {
          _this.element.style.position = 'absolute';

          _this.container.removeEventListener('mousemove', delayedUnfreezeActions);
        }.bind(this);

        this.container.addEventListener('mousemove', delayedUnfreezeActions);
      }
    }, {
      key: "freeze",
      value: function freeze() {
        this.element.style.position = this.element.style.position;
      }
    }, {
      key: "originalPosRatio",
      get: function get() {
        return this._originalPosRatio;
      }
    }, {
      key: "element",
      get: function get() {
        return this._element;
      }
    }, {
      key: "container",
      get: function get() {
        return this._container;
      }
    }]);

    return Particle;
  }();

  function floatToPctStr(x) {
    return 100.0 * x + "%";
  }

  var FRAME_DURATION = 10.0; // Timing functions

  var timings = {
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
  }; // Path functions

  var paths = {
    linear: function linear(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          p0 = _ref2[0],
          p1 = _ref2[1];

      return function (s) {
        return {
          x: p0.x + s * (p1.x - p0.x),
          y: p0.y + s * (p1.y - p0.y)
        };
      };
    },
    bezierQuad: function bezierQuad(_ref3) {
      var _ref4 = _slicedToArray(_ref3, 3),
          p0 = _ref4[0],
          p1 = _ref4[1],
          p2 = _ref4[2];

      return function (s) {
        return {
          x: p1.x + (1.0 - s) * (1.0 - s) * (p0.x - p1.x) + s * s * (p2.x - p1.x),
          y: p1.y + (1.0 - s) * (1.0 - s) * (p0.y - p1.y) + s * s * (p2.y - p1.y)
        };
      };
    }
  };
  function move(element, pathing, duration, timing) {
    var time = 0;
    var distance = 0;
    var distanceFromTime = timing(duration);
    var animation = setInterval(function () {
      // Check for final condition
      if (time >= duration) {
        clearInterval(animation);
      } // Calculate position


      var pos = pathing(distance); // Render

      element.style.left = floatToPctStr(pos.x);
      element.style.top = floatToPctStr(pos.y); // Update vars for next iteration

      time = time + FRAME_DURATION;
      distance = distanceFromTime(time);
    }, FRAME_DURATION);
  }

  function getRadius(point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  }
  function getUnitVector(point) {
    var radius = getRadius(point);
    return {
      x: point.x / radius,
      y: point.y / radius
    };
  }

  var DisplacementFactorMethodKeys;

  (function (DisplacementFactorMethodKeys) {
    DisplacementFactorMethodKeys["inverse"] = "inverse";
    DisplacementFactorMethodKeys["exponential"] = "exponential";
    DisplacementFactorMethodKeys["powerInverse"] = "powerInverse";
  })(DisplacementFactorMethodKeys || (DisplacementFactorMethodKeys = {}));

  var builtinDisplacementFactorMethods = {
    inverse: function inverse() {
      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.02;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      return function (originalDistance, elementSize) {
        if (originalDistance === 0) {
          return NaN;
        } else {
          return scale * 1.0 / originalDistance + offset;
        }
      };
    },
    exponential: function exponential() {
      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      return function (originalDistance, elementSize) {
        return Math.exp(scale - originalDistance) + offset;
      };
    },
    powerInverse: function powerInverse() {
      var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.02;
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
      var power = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.6;
      return function (originalDistance, elementSize) {
        if (originalDistance === 0) {
          return NaN;
        } else {
          return scale * 1.0 / Math.pow(originalDistance * 1.0, power) + offset;
        }
      };
    }
  };

  var ThresholdingMethodKeys;

  (function (ThresholdingMethodKeys) {
    ThresholdingMethodKeys["threshold"] = "threshold";
    ThresholdingMethodKeys["noThreshold"] = "noThreshold";
  })(ThresholdingMethodKeys || (ThresholdingMethodKeys = {}));

  var builtinThresholdingMethods = {
    threshold: function threshold() {
      var thresholdRadius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.1;
      return function (directionUnitVector, avoidanceFactor) {
        if (avoidanceFactor === NaN) {
          return null;
        }

        var offset = {
          x: directionUnitVector.x * avoidanceFactor,
          y: directionUnitVector.y * avoidanceFactor
        };

        if (getRadius(offset) > thresholdRadius) {
          return {
            x: directionUnitVector.x * thresholdRadius,
            y: directionUnitVector.y * thresholdRadius
          };
        } else {
          return offset;
        }
      };
    },
    noThreshold: function noThreshold() {
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
  };

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
          if (typeof userOptions.factorMethod === "string" && userOptions.factorMethod in builtinDisplacementFactorMethods) {
            options.factorMethod.name = userOptions.factorMethod;
            options.factorMethod.scale = undefined;
            options.factorMethod.offset = undefined;
            options.factorMethod.power = undefined;
          } else if (_typeof(userOptions.factorMethod) === "object") {
            if ("name" in userOptions.factorMethod && typeof userOptions.factorMethod.name === "string" && userOptions.factorMethod.name in builtinDisplacementFactorMethods) {
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
          if (typeof userOptions.displacementMethod === "string" && userOptions.displacementMethod in builtinThresholdingMethods) {
            options.displacementMethod.name = userOptions.displacementMethod;
            options.displacementMethod.thresholdRadius = undefined;
          } else if (_typeof(userOptions.displacementMethod) === "object") {
            if ("name" in userOptions.displacementMethod && typeof userOptions.displacementMethod.name === "string" && userOptions.displacementMethod.name in builtinThresholdingMethods) {
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


        if ("timing" in userOptions && typeof userOptions.timing === "string" && userOptions.timing in timings) {
          options.timing = timings[userOptions.timing];
        } else {
          options.timing = timings.easeOutExpo;
        } // Process pathing


        if ("pathing" in userOptions && typeof userOptions.pathing === "string" && userOptions.pathing in paths) {
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

          var particle = new Particle(particleElement, containerElement);
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
        this.containers.forEach(this.registerEventHandlers, this); // Let particles know movement has started

        this.trackedParticles.forEach(function (particle) {
          particle.unfreeze();
        });
        this.status = "running";
      }
    }, {
      key: "stop",
      value: function stop() {
        // Let all particles know to stop
        this.trackedParticles.forEach(function (particle) {
          particle.freeze();
        }); // remove all event handlers from each container

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
          var particleCentreOrigDistRelUser = getRadius(particleCentreOrigPosRatioRelUser);
          var avoidanceFactor = this.calculateAvoidanceFactor(particleCentreOrigDistRelUser, particleSizeRatio);
          var avoidanceDisplacement = this.calculateAvoidanceDisplacement(getUnitVector(particleCentreOrigPosRatioRelUser), avoidanceFactor);
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

          particle.element.style.left = floatToPctStr(particleNewPos.x);
          particle.element.style.top = floatToPctStr(particleNewPos.y);
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

          var pathing = this.options.pathing === "bezierQuad" ? paths.bezierQuad(particleOldPosRatio, particle.originalPosRatio, particleNewPosRatio) : paths.linear(particleOldPosRatio, particleNewPosRatio);
          move(particle.element, pathing, 1000, this.options.timing);
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
          methodFn = builtinDisplacementFactorMethods[method];
        } else {
          methodFn = builtinDisplacementFactorMethods.powerInverse;
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
          methodFn = builtinThresholdingMethods[method];
        } else {
          methodFn = builtinThresholdingMethods.threshold;
        }

        return methodFn(this.options.displacementMethod.thresholdRadius)(particleOrigPosRelMouse, avoidanceFactor);
      }
    }]);

    return Avoidance;
  }();

  return Avoidance;

})));
//# sourceMappingURL=avoidance.js.map
