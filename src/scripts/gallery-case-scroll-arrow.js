var handleGalleryTrackScrollVisualState = function(theWindow) {
  alert("foo");
  var window = theWindow;
  return function() {
    var scrollTop = $(window).scrollTop();
    var scrollBottom = $(window).scrollTop() + $(window).height();

    var caseATop = $('#Case-A').offset().top;
    var caseBTop = $('#Case-B').offset().top;
    var caseCTop = $('#Case-C').offset().top;
    var caseDTop = $('#Case-D').offset().top;

    var boundaryAB = caseBTop - $(window).height();
    var boundaryBC = caseCTop - $(window).height();
    var boundaryCD = caseDTop - $(window).height();

    // Between top of A and boundary of A-B
    if (caseATop <= scrollBottom && scrollTop < boundaryAB) {
      $(".gallery-case-scroll-arrow.left").attr("href", "#Case-A");
      $(".gallery-case-scroll-arrow.right").attr("href", "#Case-B");
      $(".gallery-case-scroll-arrow.left").css("opacity", "0");
      // switch to A circle link line
      $(".gallery-case-scroll-circles[href!='#Case-A'] .circle-link-line").css("height", "0");
      $(".gallery-case-scroll-circles[href='#Case-A'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".gallery-case-scroll-circles[href!='#Case-A']").css("background-color", "");
      $(".gallery-case-scroll-circles[href='#Case-A']").css("background-color", "#ff8e9b");
    }
    // Between boundary of A-B and boundary of B-C
    else if (boundaryAB <= scrollTop && scrollTop < boundaryBC) {
      $(".gallery-case-scroll-arrow.left").attr("href", "#Case-A");
      $(".gallery-case-scroll-arrow.right").attr("href", "#Case-C");
      $(".gallery-case-scroll-arrow.left").css("opacity", "1");
      // switch to B circle link line
      $(".gallery-case-scroll-circles[href!='#Case-B'] .circle-link-line").css("height", "0");
      $(".gallery-case-scroll-circles[href='#Case-B'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".gallery-case-scroll-circles[href!='#Case-B']").css("background-color", "");
      $(".gallery-case-scroll-circles[href='#Case-B']").css("background-color", "#ff8e9b");
    }
    // Between boundary of B-C and boundary of C-D
    else if (boundaryBC <= scrollTop && scrollTop < boundaryCD) { 
      $(".gallery-case-scroll-arrow.left").attr("href", "#Case-B");
      $(".gallery-case-scroll-arrow.right").attr("href", "#Case-D");
      $(".gallery-case-scroll-arrow.right").css("opacity", "1");
      // switch to C circle link line
      $(".gallery-case-scroll-circles[href!='#Case-C'] .circle-link-line").css("height", "0");
      $(".gallery-case-scroll-circles[href='#Case-C'] .circle-link-line").css("height", "12vh");
      // switch to C circle
      $(".gallery-case-scroll-circles[href!='#Case-C']").css("background-color", "");
      $(".gallery-case-scroll-circles[href='#Case-C']").css("background-color", "#ff8e9b");
    }
    // Between boundary of C-D
    else if (boundaryCD <= scrollTop) {
      $(".gallery-case-scroll-arrow.left").attr("href", "#Case-C");
      $(".gallery-case-scroll-arrow.right").attr("href", "#Case-D");
      $(".gallery-case-scroll-arrow.right").css("opacity", "0");
      // switch to D circle link line
      $(".gallery-case-scroll-circles[href!='#Case-D'] .circle-link-line").css("height", "0");
      $(".gallery-case-scroll-circles[href='#Case-D'] .circle-link-line").css("height", "12vh");
      // switch to D circle
      $(".gallery-case-scroll-circles[href!='#Case-D']").css("background-color", "");
      $(".gallery-case-scroll-circles[href='#Case-D']").css("background-color", "#ff8e9b");
    }
  }
}

// Handle visual state of "gallery track scroll":
// - whenever user scrolls
$(window).on("scroll", handleGalleryTrackScrollVisualState(window));
// - whenever user loads page with an anchor hash
$(function() {
  if (window.location.hash) {
    handleGalleryTrackScrollVisualState(window)();
    alert("hey");
  }
});
