var getPrevIdx = function(idx) {
  return (idx == 0) ? idx : idx - 1;
}

var getNextIdx = function(idx) {
  return (idx == numCases - 1) ? idx : idx + 1;
}

var useIsInGalleryCaseChecker = function(scrollPosition, viewSize) {
  var scrollStart = scrollPosition;
  var scrollMiddle = scrollPosition + viewSize/2;
  var scrollEnd = scrollPosition + viewSize;
  return function(i) {
    var numCases = $(".fake-gallery-case").length;
    var case_ = $(".fake-gallery-case[data-key="+i+"]");
    var nextCase_ = $(".fake-gallery-case[data-key="+(i+1)+"]");
    // For the first case, check if
    //    (a) case started to enter view
    //    (b) middle of window is before the start of the next case
    if (i == 0) {
      return case_.offset().top <= scrollEnd && scrollMiddle < nextCase_.offset().top;
    }
    // For the last case, check if
    //    (a) middle of window is past the start of case
    //    (b) case has not fully left view
    else if (i == numCases - 1) {
      return case_.offset().top <= scrollMiddle && scrollStart < case_.offset().top + case_.height();
    }
    // Otherwise, for non-terminal cases, check if
    //    (a) middle of window is past the start of case
    //    (b) middle of window is before the start of the next case
    else {
      return case_.offset().top <= scrollMiddle && scrollMiddle < nextCase_.offset().top;
    }
  };
};

var useGalleryVisualStateHandler = function(window) {
  return function(e) {
    var isInCase = useIsInGalleryCaseChecker($(window).scrollTop(), $(window).height());
    var numCases = $(".fake-gallery-case").length;
    for (var idx = 0; idx < numCases; ++idx) {
      if (isInCase(idx)) {
        // Grab the Ids
        var prevId = "#" + $(".fake-gallery-case[data-key="+getPrevIdx(idx)+"]").attr("id");
        var thisId = "#" + $(".fake-gallery-case[data-key="+idx+"]").attr("id");
        var nextId = "#" + $(".fake-gallery-case[data-key="+getNextIdx(idx)+"]").attr("id");
        // Give the arrows their respective links
        $(".gallery-case-scroll-arrow.left").attr("href", prevId);
        $(".gallery-case-scroll-arrow.right").attr("href", nextId);
        // Make the arrows visible/invisible accordingly
        $(".gallery-case-scroll-arrow.left").css("visibility", (idx == 0) ? "hidden" : "visible");
        $(".gallery-case-scroll-arrow.right").css("visibility", (idx == (numCases - 1)) ? "hidden" : "visible");
        // Switch the circle link line to the correct one
        $(".gallery-case-scroll-circles[href!='"+thisId+"'] .circle-link-line").css("height", "0");
        $(".gallery-case-scroll-circles[href='"+thisId+"'] .circle-link-line").css("height", "12vh");
        // Switch the circle to the correct one
        $(".gallery-case-scroll-circles[href!='"+thisId+"']").css("background-color", "");
        $(".gallery-case-scroll-circles[href='"+thisId+"']").css("background-color", "#ff8e9b");
      }
    }
  };
};

var useTabletGalleryVisualStateHandler = function(galleryTrackContainer) {
  return function(e) {
    var arrowClass = ".tablet-gallery-case-scroll-arrow";
    var scrollLeft = $(galleryTrackContainer).scrollLeft();
    var scrollMiddle = scrollLeft + $(galleryTrackContainer).width() / 2;

    var caseALeft = $('#Tablet-Case-A').position().left + scrollLeft;
    var caseBLeft = $('#Tablet-Case-B').position().left + scrollLeft;
    var caseCLeft = $('#Tablet-Case-C').position().left + scrollLeft;
    var caseDLeft = $('#Tablet-Case-D').position().left + scrollLeft;

    var boundaryAB = caseBLeft;
    var boundaryBC = caseCLeft;
    var boundaryCD = caseDLeft;

    // Between top of A and boundary of A-B
    if (scrollMiddle < boundaryAB) {
      $(arrowClass+".left").attr("href", "#Tablet-Case-A");
      $(arrowClass+".right").attr("href", "#Tablet-Case-B");
      $(arrowClass+".left").css("visibility", "hidden");
      // switch to A circle link line
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-A'] .circle-link-line").css("height", "0");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-A'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-A']").css("background-color", "");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-A']").css("background-color", "#ff8e9b");
    }
    // Between boundary of A-B and boundary of B-C
    else if (boundaryAB <= scrollMiddle && scrollMiddle < boundaryBC) {
      $(arrowClass+".left").attr("href", "#Tablet-Case-A");
      $(arrowClass+".right").attr("href", "#Tablet-Case-C");
      $(arrowClass).css("visibility", "visible");
      // switch to B circle link line
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-B'] .circle-link-line").css("height", "0");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-B'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-B']").css("background-color", "");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-B']").css("background-color", "#ff8e9b");
    }
    // Between boundary of B-C and boundary of C-D
    else if (boundaryBC <= scrollMiddle && scrollMiddle < boundaryCD) { 
      $(arrowClass+".left").attr("href", "#Tablet-Case-B");
      $(arrowClass+".right").attr("href", "#Tablet-Case-D");
      $(arrowClass).css("visibility", "visible");
      // switch to C circle link line
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-C'] .circle-link-line").css("height", "0");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-C'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-C']").css("background-color", "");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-C']").css("background-color", "#ff8e9b");
    }
    // Between boundary of C-D
    else if (boundaryCD <= scrollMiddle) {
      $(arrowClass+".left").attr("href", "#Tablet-Case-C");
      $(arrowClass+".right").attr("href", "#Tablet-Case-D");
      $(arrowClass+".right").css("visibility", "hidden");
      // switch to D circle link line
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-D'] .circle-link-line").css("height", "0");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-D'] .circle-link-line").css("height", "12vh");
      // switch to D circle
      $(".tablet-gallery-case-scroll-circles[href!='#Tablet-Case-D']").css("background-color", "");
      $(".tablet-gallery-case-scroll-circles[href='#Tablet-Case-D']").css("background-color", "#ff8e9b");
    }
  };
};

var getLeft = function(elId, containerId) {
  var scrollLeft = $(containerId).scrollLeft();
  var left = $(elId).position().left + scrollLeft;
  return left;
};

var useScrollToHandler = function(containerId) {
  return function(e) {
    if (this.hash !== "") {
      if (e) e.preventDefault();
      var id = this.hash;
      var elLeft = getLeft(id, containerId);
      $(containerId).animate({
        scrollLeft: elLeft
      }, 800, function(){
        window.location.hash = id;
      });
    }
  }
}

var useSwipePromptHandler = function(containerId, swipePromptId) {
  var theHandler = function() {
    if ($(containerId).scrollLeft() > theHandler.lastScroll) {
      $(swipePromptId).hide(400);
    }
  };
  theHandler.lastScroll = $(containerId).scrollLeft();
  return theHandler;
}

// When document loads:
$(function() {
  // ====== ATTACH HANDLERS ======
  // Attach "scroll-to" for each tablet gallery circle & arrow
  $(".tablet-gallery-case-scroll-circles, .tablet-gallery-case-scroll-arrow")
    .on('click', useScrollToHandler('.tablet-gallery-container'));
  // Attach visual state handler for gallery track
  // - for tablet & smaller
  $(".tablet-gallery-container")
    .on("scroll", useTabletGalleryVisualStateHandler(".tablet-gallery-container"));
  // - for desktop
  $(window).on("scroll", useGalleryVisualStateHandler(window));
  // Attach handler for swipe prompt
  $(".tablet-gallery-container")
    .on("scroll", useSwipePromptHandler(".tablet-gallery-container", ".tablet-gallery-case-swipe"));
  
  // ====== SETUP INITIAL STATE ======
  // After all handlers are attached,
  // set up the initial state of the page:
  useTabletGalleryVisualStateHandler(".tablet-gallery-container")();
  useGalleryVisualStateHandler(window)();
  useScrollToHandler('.tablet-gallery-container').bind({ hash: window.location.hash })();
});
