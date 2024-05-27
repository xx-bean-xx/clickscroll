
// contains objects with a reference to scrollable elements under the cursor
// and their initial scroll positions {element, x, y}
var offsets = [];

// the viewport coordinates where the cursor started
var viewport = {x: -1, y: -1};


// this div is overlain on the viewport and captures all mouse events
// so nothing can stop the propagation down the tree
var overlay = document.createElement("div");

function handleMousemove(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  // pass scroll down to whatever element is under the cursor
  offsets.forEach((offset) => {
    offset.element.scrollTo({
      top: offset.y + (viewport.y - ev.clientY),
                            left: offset.x + (viewport.x - ev.clientX)
    });
  });
}

function handleMousedown(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  viewport.y = ev.clientY;
  viewport.x = ev.clientX;

  // have to track all the elements you may need to scroll
  offsets = [];
  let scroll_candidates = document.elementsFromPoint(viewport.x, viewport.y);
  scroll_candidates.forEach((el) => {
    if ((el != overlay)
      && (el.scrollHeight > el.clientHeight)) {
      offsets.push({
        element: el,
        x: el.scrollLeft,
        y: el.scrollTop
      });
      }
  });

  overlay.addEventListener("mousemove", handleMousemove);
}

function handleMouseup(ev) {
  ev.preventDefault();
  ev.stopPropagation();


  overlay.removeEventListener("mousemove", handleMousemove);

  // if the mouse moved less than ten pixels assume you meant to click
  // and pass the event down to the next element at this position
  if ( ( Math.abs(ev.clientX - viewport.x) < 10 )
    && ( Math.abs(ev.clientY - viewport.y) < 10 ) )
  {
    let click_candidates = document.elementsFromPoint(ev.clientX, ev.clientY);
    click_candidates.every((el) => {
      if (el == overlay || el.click == undefined) {
        return true;
      }
      el.click();
      return false;
    });
  }
}

function main () {
  // styling to place the overlay as an overlay
  overlay.id = "clickscroll-overlay";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "transparent";
  overlay.style.position = "fixed";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.zIndex = "9999";


  // add all the click and drag handlers to the overlay
  overlay.addEventListener("mousedown", handleMousedown, {capture: true});
  overlay.addEventListener("mouseup", handleMouseup);
  overlay.addEventListener("click", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
  });

  document.body.appendChild(overlay);
}

main();
