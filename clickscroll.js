
// the page coords for where the scroll starts
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems#page
var page = {x: -1, y: -1};

// used to prevent more than one click event listener from being bound
var clickBlocked = false;

function handleMousemove(ev) {
  ev.preventDefault();

  window.scroll({
    top: page.y - ev.clientY,
    left: page.x - ev.clientX
  });

  // do not allow following links if you've just happened to click
  // and drag the link
  if (!clickBlocked) {
    clickBlocked = true;
    addEventListener("click", blockClick);
  }
}

function blockClick(ev) {
  ev.preventDefault();
}

function handleMousedown(ev) {
  ev.preventDefault();

  page.y = ev.pageY;
  page.x = ev.pageX;

  document.addEventListener("mousemove", handleMousemove);
}

function handleMouseup(ev) {
  ev.preventDefault();

  document.removeEventListener("mousemove", handleMousemove);

  if (clickBlocked) {
    // a little timeout so that if the click event fires after the mouseup event
    // the click will still be blocked
    setTimeout((_) => {
      removeEventListener("click", blockClick);
    }, 20);
    clickBlocked = false;
  }
}

function main () {
  document.addEventListener("mousedown", handleMousedown, {capture: true});
  document.addEventListener("mouseup", handleMouseup);
}

main();
