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
    var $child = $(this);
    $child.data("zhaostephen.avoidance.origx", $child.position().left);
    $child.data("zhaostephen.avoidance.origy", $child.position().top);
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

Avoidance.getDistance = function(pointA, pointB) {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

Avoidance.calculateAvoidanceFactor = function(originalDistance, elementSize, containerSize, method) {
  // TODO: take into account the element size (and therefore centre)
  if (typeof method === "function") {
    return method(originalDistance, elementSize, containerSize)
  }
  else if (typeof method === "string" && method in Avoidance.calculateAvoidanceFactor.builtinMethods) {

    return Avoidance.calculateAvoidanceFactor.builtinMethods[method](originalDistance, elementSize, containerSize);
  }
  else {
    return Avoidance.calculateAvoidanceFactor.builtinMethods.inverse(originalDistance, elementSize, containerSize);
  }
}

Avoidance.calculateAvoidanceFactor.builtinMethods = {
  "inverse": function(param_scale=0.05, param_offset=1.0) {
    return function(originalDistance, elementSize, containerSize) {
      if (originalDistance === 0) {
        return NaN;
      }
      else {
        return (containerSize.width*param_scale)/originalDistance + param_offset;
      }
    }
  },
  "exponential": function(param_scale=0.01, param_offset=0.25) {
    return function(originalDistance, elementSize, containerSize) {
      return Math.exp(param_scale-originalDistance/containerSize.width) + param_offset;
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
    var $child = $(this);
    var childPos = { x: $child.data("zhaostephen.avoidance.origx"), y: $child.data("zhaostephen.avoidance.origy") };
    var childSize = { width: $child.width(), height: $child.height() };
    var origDist = Avoidance.getDistance(mousePos, childPos);
    var scaleFactor = Avoidance.calculateAvoidanceFactor(origDist, childSize, containerSize);
    if (scaleFactor === NaN) {
      $child.hide(0);
    }
    else {
      var newChildPos = {
        x: mousePos.x + (childPos.x - mousePos.x)*scaleFactor,
        y: mousePos.y + (childPos.y - mousePos.y)*scaleFactor
      };
      $child.show(0);
      $child.css("left", newChildPos.x);
      $child.css("top", newChildPos.y);
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