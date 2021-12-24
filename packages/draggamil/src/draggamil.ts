const Draggamil = function(containerSelector: string, itemsSelector: string) {
  const ATTR_DRAG_ID = "data-draggamil-drag-id" as const;

  const dragItems = document.querySelectorAll(itemsSelector) as NodeListOf<HTMLElement>;
  const container = document.querySelector(containerSelector);
  const dragStates = {};
  let dragMaxZ = 0;

  dragItems.forEach(function (dragItem, idx) {
    const idxKey = "" + idx;
    dragItem.setAttribute(ATTR_DRAG_ID, idxKey);
    const initialTransform = window.getComputedStyle(dragItem).getPropertyValue('transform');
    dragStates[idxKey] = {
      active: false,
      currentX: undefined,
      currentY: undefined,
      initialX: undefined,
      initialY: undefined,
      initialTransform: initialTransform === "none" ? "" : initialTransform,
      xOffset: 0,
      yOffset: 0,
    };
    var initialZ = parseInt(window.getComputedStyle(dragItem).getPropertyValue('z-index')) ?? 0;
    if (initialZ > dragMaxZ) {
      dragMaxZ = initialZ;
    }
  });

  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragStop, false);
  container.addEventListener("touchmove", drag, false);

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragStop, false);
  container.addEventListener("mouseleave", dragStopIfLeavingContainer, false);
  container.addEventListener("mousemove", drag, false);

  function dragStart(e?: MouseEvent | TouchEvent) {
    // Check if event target exists
    if (!e || !e.target) {
      // Cannot start drag if no event target, so stop all dragging.
      dragStop();
      return;
    }

    const { dragItem, dragId } = getClosestDragItem(e.target as HTMLElement) ?? {};
    if (!dragId) {
      dragStop();
      return;
    }

    var dragState = dragStates[dragId];
    if (e.type === "touchstart") {
      dragState.initialX = (e as TouchEvent).touches[0].clientX - dragState.xOffset;
      dragState.initialY = (e as TouchEvent).touches[0].clientY - dragState.yOffset;
    }
    else {
      dragState.initialX = (e as MouseEvent).clientX - dragState.xOffset;
      dragState.initialY = (e as MouseEvent).clientY - dragState.yOffset;
    }

    ++dragMaxZ;
    dragItem.style['z-index'] = dragMaxZ;
    dragState.active = true;
  }

  function getClosestDragItem(el: HTMLElement): { dragItem: HTMLElement; dragId: string; } {
    let dragId = el.getAttribute(ATTR_DRAG_ID);
    if (dragId) {
      return { dragItem: el, dragId };
    }

    const maybeAncestorEl = el.closest(itemsSelector);
    dragId = maybeAncestorEl.getAttribute(ATTR_DRAG_ID);
    if (dragId) {
      return { dragItem: maybeAncestorEl as HTMLElement, dragId };
    }

    return undefined;
  }

  function dragStop() {
    // Stop all active drag states
    Object.keys(dragStates).forEach(function(dragId) {
      var dragState = dragStates[dragId];
      if (dragState.active) {
        dragState.initialX = dragState.currentX;
        dragState.initialY = dragState.currentY;
  
        dragState.active = false;
      }
    });
    return;
  }

  function dragStopIfLeavingContainer(e?: MouseEvent | TouchEvent) {
    if (container === e.target) {
      dragStop();
    }
  }

  function drag(e?: MouseEvent | TouchEvent) {
    dragItems.forEach(function(dragItem) {
      var dragId = dragItem.getAttribute(ATTR_DRAG_ID);
      if (!dragId) {
        return;
      }

      var dragState = dragStates[dragId];
      if (dragState.active) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
          dragState.currentX = (e as TouchEvent).touches[0].clientX - dragState.initialX;
          dragState.currentY = (e as TouchEvent).touches[0].clientY - dragState.initialY;
        } else {
          dragState.currentX = (e as MouseEvent).clientX - dragState.initialX;
          dragState.currentY = (e as MouseEvent).clientY - dragState.initialY;
        }
  
        dragState.xOffset = dragState.currentX;
        dragState.yOffset = dragState.currentY;
  
        dragItem.style.transform = "translate3d(" + dragState.currentX + "px, " + dragState.currentY + "px, 0) " + dragState.initialTransform;
      }
    });
  }
}

export default Draggamil;
