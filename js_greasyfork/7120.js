// ==UserScript==
// @name Scroll like Opera
// @version 2.1.1
// @description Based on Linkify Plus. Turn plain text URLs into links.
// @license MIT
// @author eight04 <eight04@gmail.com>
// @homepageURL https://github.com/eight04/scroll-like-opera
// @supportURL https://github.com/eight04/scroll-like-opera/issues
// @namespace eight04.blogspot.com
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.deleteValue
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addValueChangeListener
// @compatible firefox Tampermonkey latest
// @compatible chrome Tampermonkey latest
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=29833
// @require https://greasyfork.org/scripts/7108-bezier-easing/code/bezier-easing.js?version=29098
// @include *
// @downloadURL https://update.greasyfork.org/scripts/7120/Scroll%20like%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/7120/Scroll%20like%20Opera.meta.js
// ==/UserScript==

/* eslint-env browser, greasemonkey */
/* global GM_config BezierEasing */

var config;

GM_config.init(
  "Scroll like Opera",
  {
    useWhenOnScrollbar: {
      label: "Scroll horizontally if cursor hover on horizontal scrollbar.",
      type: "checkbox",
      default: true
    },
    useWhenOneScrollbar: {
      label: "Scroll horizontally if there is only horizontal scrollbar presented.",
      type: "checkbox",
      default: true
    },
    useAlways: {
      label: "Always use script's scrolling handler. Enable this if you want to use the script's smooth scrolling on chrome.",
      type: "checkbox",
      default: false
    },
    scrollDelay: {
      label: "Smooth scrolling delay.",
      type: "text",
      default: 400
    },
    scrollOffset: {
      label: "Scrolling offset.",
      type: "text",
      default: 120
    },
    continueScrollingTimeout: {
      label: "Scrolled target changing delay.",
      type: "number",
      default: 400
    }
  }
);

config = GM_config.get();

GM_registerMenuCommand("Scroll like Opera - Configure", function(){
  GM_config.open();
});

GM_config.onclose = function(){
  config = GM_config.get();
};

/**
  Cache current scrolling target
*/
var cache = {
  timeout: null,
  target: null,
  cache: function(element) {
    cache.target = element;
    cache.delay();
  },
  reset: function() {
    clearTimeout(cache.timeout);
    cache.timeout = null;
    cache.target = null;
  },
  delay: function() {
    clearTimeout(cache.timeout);
    cache.timeout = setTimeout(cache.reset, config.continueScrollingTimeout);
  }
};

/**
  Register event
*/
window.addEventListener("wheel", function(e){
  var q;

  if (cache.target) {
    q = getScrollInfo(cache.target, e, true);

    // Scrolled to edge
    if (!q) {
      e.preventDefault();
      return;
    }

    cache.delay();
  } else {
    q = getScrollInfo(e.target, e);

    // Can't find scrollable element
    if (!q) {
      return;
    }

    cache.cache(q.element);
  }

  if (q.use || config.useAlways) {
    e.preventDefault();
    scrollElement(q.element, q.offsetX, q.offsetY);
  }
}, {passive: false});

window.addEventListener("mousemove", function(){
  cache.reset();
});

/**
  Main logic
*/
function getInfo(element, e) {
  var rect, css;

  if (element == document.documentElement) {
    return {
      element: element,
      onScrollbarX: e.clientY >= element.clientHeight && e.clientY <= window.innerHeight,
      scrollableX: element.scrollWidth > element.clientWidth,
      scrollableY: element.scrollHeight > element.clientHeight
    };
  } else if (element == document.body) {
    return {
      element: element,
      onScrollbarX: false,
      scrollableX: false,
      scrollableY: false
    };
  } else {
    rect = element.getBoundingClientRect();
    css = getCss(element);

    return {
      element: element,
      onScrollbarX: element.clientHeight && e.clientY >= rect.top + css.borderTop + element.clientHeight && e.clientY <= rect.bottom - css.borderBottom,
      scrollableX: element.clientWidth && element.scrollWidth > element.clientWidth && css.overflowX != "visible" && css.overflowX != "hidden",
      scrollableY: element.clientHeight && element.scrollHeight > element.clientHeight && css.overflowY != "visible" && css.overflowY != "hidden"
    };
  }
}

function getScrollInfo(element, e, noParent) {
  var q;

  // Get scrollable parent
  while (element) {

    q = getInfo(element, e);

    if (e.deltaY && (q.onScrollbarX || useHorizontalScroll(q)) && scrollable(element, e.deltaY, 0)) {
      // Horizontal scroll
      q.offsetX = getOffset(e.deltaY);
      q.offsetY = 0;
      q.use = true;
      return q;
    }

    if ((e.deltaX && q.scrollableX || e.deltaY && q.scrollableY) && scrollable(element, e.deltaX, e.deltaY)) {
      q.offsetX = getOffset(e.deltaX);
      q.offsetY = getOffset(e.deltaY);
      return q;
    }

    if (noParent) {
      return null;
    }

    element = element.parentNode;
    if (element == document) {
      return null;
    }
  }

  return null;
}

/**
  Scroll function. Should I put them into seperate library?
  Thanks to https://github.com/galambalazs/smoothscroll
*/
var animate = null;
var que = [];
function scrollElement(element, x, y) {
  var elapsed = config.scrollDelay;

  que.push({
    offsetX: x,
    offsetY: y,
    lastX: 0,
    lastY: 0,
    element: element,
    timeStart: null
  });

  if (animate != null) {
    return;
  }

  function animation(timestamp){
    var i, j, len, q, time, offsetX, offsetY, process, swap;

    swap = [];

    for (i = 0, j = 0, len = que.length; i < len; i++) {
      q = que[i];
      if (q.timeStart == null) {
        q.timeStart = timestamp;
      }
      if (timestamp - q.timeStart >= elapsed || !scrollable(q.element, q.offsetX, q.offsetY)) {
        scrollBy(q.element, q.offsetX - q.lastX, q.offsetY - q.lastY);
      } else {
        time = (timestamp - q.timeStart) / elapsed;
        process = ease(time);
        offsetX = Math.floor(q.offsetX * process);
        offsetY = Math.floor(q.offsetY * process);

        scrollBy(q.element, offsetX - q.lastX, offsetY - q.lastY);

        q.lastX = offsetX;
        q.lastY = offsetY;
        swap[j++] = q;
      }
    }

    que = swap;
    if (!que.length) {
      animate = null;
      return;
    }

    animate = requestAnimationFrame(animation);
  }
  animate = requestAnimationFrame(animation);

  function scrollBy(element, x, y) {
    if (element != document.documentElement) {
      element.scrollLeft += x;
      element.scrollTop += y;
    } else {
      window.scrollBy(x, y);
    }
  }
}

/**
  Helpers
*/
function useHorizontalScroll(q) {
  return config.useWhenOneScrollbar && q.scrollableX && !q.scrollableY;
}

function getOffset(delta) {
  var direction = 0;
  if (delta > 0) {
    direction = 1;
  } else if (delta < 0) {
    direction = -1;
  }
  return direction * config.scrollOffset;
}

function ease(t){
  return BezierEasing.css.ease(t);
}

function getCss(element){
  var css = getComputedStyle(element);

  return {
    borderTop: parseInt(css.getPropertyValue("border-top-width"), 10),
    borderRight: parseInt(css.getPropertyValue("border-right-width"), 10),
    borderBottom: parseInt(css.getPropertyValue("border-bottom-width"), 10),
    borderLeft: parseInt(css.getPropertyValue("border-left-width"), 10),
    overflowX: css.getPropertyValue("overflow-x"),
    overflowY: css.getPropertyValue("overflow-y")
  };
}

function scrollable(element, offsetX, offsetY) {
  var top, left;
  if (element == document.documentElement) {
    top = window.scrollY;
    left = window.scrollX;
  } else {
    top = element.scrollTop;
    left = element.scrollLeft;
  }

  if (top == 0 && offsetY < 0) {
    return false;
  }
  if (left == 0 && offsetX < 0) {
    return false;
  }
  if (top + element.clientHeight >= element.scrollHeight && offsetY > 0) {
    return false;
  }
  if (left + element.clientWidth >= element.scrollWidth && offsetX > 0) {
    return false;
  }
  return true;
}

