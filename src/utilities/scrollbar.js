/**
 * Utility module to get scroll bar details
 */

// Get the current browser's scroll bar width
const getScrollBarWidth = () => {
  let outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100%";
  outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

  document.body.appendChild(outer);

  let widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  let inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  let widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
};

// Get the browser scroll bar state (visible or hidden)
const getScrollBarState = () => {
  let result = {
    vScrollBar: false,
    hScrollBar: false
  };
  try {
    var root = document.compatMode === 'BackCompat' ? document.body : document.documentElement;
    result.vScrollBar = root.scrollHeight > root.clientHeight;
    result.hScrollBar = root.scrollWidth > root.clientWidth;
  } catch (e) { }
  // console.dir(result);
  return (result);
}

// Export utility functions
module.exports.getScrollBarWidth = getScrollBarWidth;
module.exports.getScrollBarState = getScrollBarState;