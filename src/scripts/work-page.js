<script>
  var useGalleryVisualStateHandler = function(window) {
    return function(e) {
      var scrollTop = $(window).scrollTop();
      var scrollBottom = scrollTop + $(window).height();

      var caseATop = $('#Case-A').offset().top;
      var caseBTop = $('#Case-B').offset().top;
      var caseCTop = $('#Case-C').offset().top;
      var caseDTop = $('#Case-D').offset().top;

      var boundaryAB = caseBTop - $(window).height();
      var boundaryBC = caseCTop - $(window).height();
      var boundaryCD = caseDTop - $(window).height();

      var caseDBottom = $('#Case-D').offset().top + $('#Case-D').height();

      // Between top of A and boundary of A-B
      if (caseATop <= scrollBottom && scrollTop < boundaryAB) {
        $(".gallery-case-scroll-arrow.left").attr("href", "#Case-A");
        $(".gallery-case-scroll-arrow.right").attr("href", "#Case-B");
        $(".gallery-case-scroll-arrow.left").css("visibility", "hidden");
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
        $(".gallery-case-scroll-arrow").css("visibility", "visible");
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
        $(".gallery-case-scroll-arrow").css("visibility", "visible");
        // switch to C circle link line
        $(".gallery-case-scroll-circles[href!='#Case-C'] .circle-link-line").css("height", "0");
        $(".gallery-case-scroll-circles[href='#Case-C'] .circle-link-line").css("height", "12vh");
        // switch to C circle
        $(".gallery-case-scroll-circles[href!='#Case-C']").css("background-color", "");
        $(".gallery-case-scroll-circles[href='#Case-C']").css("background-color", "#ff8e9b");
      }
      // Between boundary of C-D
      else if (boundaryCD <= scrollTop && scrollTop < caseDBottom) {
        $(".gallery-case-scroll-arrow.left").attr("href", "#Case-C");
        $(".gallery-case-scroll-arrow.right").attr("href", "#Case-D");
        $(".gallery-case-scroll-arrow.right").css("visibility", "hidden");
        // switch to D circle link line
        $(".gallery-case-scroll-circles[href!='#Case-D'] .circle-link-line").css("height", "0");
        $(".gallery-case-scroll-circles[href='#Case-D'] .circle-link-line").css("height", "12vh");
        // switch to D circle
        $(".gallery-case-scroll-circles[href!='#Case-D']").css("background-color", "");
        $(".gallery-case-scroll-circles[href='#Case-D']").css("background-color", "#ff8e9b");
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
</script>

