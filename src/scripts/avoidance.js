// AVOIDANCE VERSION 0.1.0
// AUTHOR: Stephen Zhao
// REPO: github.com/stephen-zhao/sophii.co

// A standalone library for creating "avoidance cloud" effect.
// All children of given containers will be animated to avoid the user's mouse.
// Note: Assume jQuery is imported from browser

var Avoidance = function(containerSelector, options) {
  this.containerSelector = containerSelector;
  this.options = options;
  // Prep all children of container
  // TODO: support children being added to/removed from the container
  var $container = $(this.containerSelector);
  $container.children().each(function() {
    this.dataset.zhaostephenAvoidanceOrigx = this.offsetLeft;
    this.dataset.zhaostephenAvoidanceOrigy = this.offsetTop;
  });
}

Avoidance.prototype.start = function() {
  $(this.containerSelector).on("mousemove", { options: this.options }, Avoidance.mouseMoveHandler);
  $(this.containerSelector).on("click", { options: this.options }, Avoidance.mouseClickTestHandler);
}

Avoidance.getCentre = function($element, $relativeTo) {
  return {
    x: $element.offset().left + $element.width() / 2 - ($relativeTo ? $relativeTo.offset().left : 0),
    y: $element.offset().top + $element.height() / 2 - ($relativeTo ? $relativeTo.offset().top : 0)
  };
}

// Avoidance.getRelativeX = function($element, $relativeTo) {
//   return $element.offset().left - ($relativeTo ? $relativeTo.offset().left : 0);
// }

// Avoidance.getRelativeY = function($element, $relativeTo) {
//   return $element.offset().top - ($relativeTo ? $relativeTo.offset().top : 0);
// }

Avoidance.geometry = {
  getDistance: function(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
  },
  getRadius: function(point) {
    return Math.sqrt(point.x*point.x + point.y*point.y);
  },
}

Avoidance.calculateAvoidanceFactor = function(originalDistance, elementSize, containerSize, method) {
  // TODO: take into account the element size (and therefore centre)
  if (typeof method === "function") {
    return method(originalDistance, elementSize, containerSize)
  }
  else if (typeof method === "string" && method in Avoidance.calculateAvoidanceFactor.builtinMethods) {

    return Avoidance.calculateAvoidanceFactor.builtinMethods[method]()(originalDistance, elementSize, containerSize);
  }
  else {
    return Avoidance.calculateAvoidanceFactor.builtinMethods.power_inverse()(originalDistance, elementSize, containerSize);
  }
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

Avoidance.calculateAvoidanceDisplacement = function(childPosRelToMousePos, avoidanceFactor, method) {
  // TODO: take into account the element size (and therefore centre)
  if (typeof method === "function") {
    return method(childPosRelToMousePos, avoidanceFactor)
  }
  else if (typeof method === "string" && method in Avoidance.calculateAvoidanceDisplacement.builtinMethods) {

    return Avoidance.calculateAvoidanceDisplacement.builtinMethods[method]()(childPosRelToMousePos, avoidanceFactor);
  }
  else {
    return Avoidance.calculateAvoidanceDisplacement.builtinMethods.threshold_proportional_radius()(childPosRelToMousePos, avoidanceFactor);
  }
}

Avoidance.calculateAvoidanceDisplacement.builtinMethods = {
  "threshold_absolute_radius": function(param_threshold_radius=100.0) {
    return function(childPosRelToMousePos, avoidanceFactor) {
      var offset = {
        x: childPosRelToMousePos.x*avoidanceFactor,
        y: childPosRelToMousePos.y*avoidanceFactor,
      };
      if (Avoidance.geometry.getRadius(offset) > param_threshold_radius) {
        var origRadius = Avoidance.geometry.getRadius(childPosRelToMousePos);
        var scaleFactor = (param_threshold_radius / origRadius);
        return {
          x: childPosRelToMousePos.x*scaleFactor,
          y: childPosRelToMousePos.y*scaleFactor,
        };
      }
      else {
        return offset;
      }
    }
  },
  "threshold_proportional_radius": function(param_threshold_radius=20.0) {
    return function(childPosRelToMousePos, avoidanceFactor) {
      var offset = {
        x: childPosRelToMousePos.x*avoidanceFactor,
        y: childPosRelToMousePos.y*avoidanceFactor,
      };
      if (avoidanceFactor > param_threshold_radius) {
        return {
          x: childPosRelToMousePos.x*param_threshold_radius,
          y: childPosRelToMousePos.y*param_threshold_radius,
        };
      }
      else {
        return offset;
      }
    }
  },
  "standard": function() {
    return function(childPosRelToMousePos, avoidanceFactor) {
      return {
        x: childPosRelToMousePos.x*avoidanceFactor,
        y: childPosRelToMousePos.y*avoidanceFactor,
      };
    }
  }
}

Avoidance.mouseMoveHandler = function(event) {
  var $container = $(this);
  var containerSize = { width: $container.width(), height: $container.height() };
  var containerX = $container.offset().left;
  var containerY = $container.offset().top;
  // Determine the relative x and y of mouse position inside the container
  var mousePos = { x: event.pageX - containerX, y: event.pageY - containerY };
  $container.children().each(function() {
    var childPos = {
      x: parseInt(this.dataset.zhaostephenAvoidanceOrigx),
      y: parseInt(this.dataset.zhaostephenAvoidanceOrigy),
    };
    var childSize = { width: this.offsetWidth, height: this.offsetHeight };
    var origDist = Avoidance.geometry.getDistance(mousePos, childPos);
    var avoidanceFactor = Avoidance.calculateAvoidanceFactor(origDist, childSize, containerSize);
    if (avoidanceFactor === NaN) {
      this.style.display = "none";
    }
    else {
      var childRelPos = {
        x: childPos.x - mousePos.x,
        y: childPos.y - mousePos.y,
      };
      var avoidanceDisplacement = Avoidance.calculateAvoidanceDisplacement(childRelPos, avoidanceFactor);
      var newChildPos = {
        x: childPos.x + avoidanceDisplacement.x,
        y: childPos.y + avoidanceDisplacement.y,
      };
      if (this.style.display === "none") {
        this.style.display = "";
      }
      this.style.left = newChildPos.x;
      this.style.top = newChildPos.y;
    }
  });
}

Avoidance.mouseClickTestHandler = function(event) {
  var datastring = "";
  $(this).children().each(function() {
    var $child = $(this);
    datastring += `child ${$child.attr("id")}\n`;
    datastring += `original x = ${$child.data("zhaostephen.avoidance.origx")}\n`;
    datastring += `original y = ${$child.data("zhaostephen.avoidance.origy")}\n`;
    datastring += `-------------------\n`;
  });
  alert(datastring);
}