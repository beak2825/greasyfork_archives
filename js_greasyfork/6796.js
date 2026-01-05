// ==UserScript==
// @id             scrollyId
// @name           scrolly <3
// @version        1.0
// @namespace      azeirah
// @author         Martijn Brekelmans
// @description    Scrolling by dragging the mouse.
// @locale         English
// @include        *
// @run-at         document-end

// @downloadURL https://update.greasyfork.org/scripts/6796/scrolly%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/6796/scrolly%20%3C3.meta.js
// ==/UserScript==

"use strict";
var az = {};

az.toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

az.format = function(str, args) {
  var re = /\{([^}]+)\}/g;
  return str.replace(re, function(_, match) {
    return args[match];
  });
};

az.$ = function(queryString) {
  return document.querySelector(queryString);
};

az.createElement = function(element, cls, attributes) {
  var attr;
  cls = cls || "";
  attributes = attributes || {};
  element = document.createElement(element);
  element.className = cls;
  for (attr in attributes) {
    if (attributes.hasOwnProperty(attr)) {
      element.setAttribute(attr, attributes[attr]);
    }
  }
  return element;
};

az.magicMousey = (function() {
  var lastPosition;
  var body = document.body;
  var keys = {};
  var lastTimes = {};

  var keyCodes = {
    "leftMouse": 1,
    "middleMouse": 2,
    "rightMouse": 3,
    "backspace": 8,
    "tab": 9,
    "enter": 13,
    "shift": 16,
    "ctrl": 17,
    "alt": 18,
    "pause": 19,
    "break": 19,
    "caps": 20,
    "caps lock": 20,
    "capsLock": 20,
    "escape": 27,
    "pageup": 33,
    "page up": 33,
    "pagedown": 34,
    "page down": 34,
    "end": 35,
    "home": 36,
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "insert": 45,
    "delete": 46,
    "leftWindows": 91,
    "rightWindows": 92,
    "select": 93,
    "numLock": 144,
    "scrollLock": 145,
    "semiColon": 186,
    "equals": 187,
    "comma": 188,
    "period": 190,
    "forwardSlash": 191,
    "graveAccent": 192,
    "openBracket": 219,
    "backSlash": 220,
    "closeBracket": 221,
    "singleQuote": 222
  };

  function collectKeycodes(offset) {
    return function(value, index) {
      keyCodes[value] = index + offset;
    };
  }

  function aggregateKeycodes(offset, prefix) {
    return function(value, index) {
      keyCodes[prefix + value] = index + offset;
    };
  }

  "abcdefghijklmnopqrstuvwxyz".split("").forEach(collectKeycodes(65));
  "0123456789".split("").forEach(collectKeycodes(48));
  "0123456789".split("").forEach(aggregateKeycodes("num", 96));
  ["multiply", "add", "subtract", "point", "divide"].forEach(collectKeycodes(106));
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(aggregateKeycodes(112, "f"));

  keys.leftMouse = false;
  keys.middleMouse = false;
  keys.rightMouse = false;

  function generateKeydown(key, keyCode) {
    if (key && keyCode) {
      keys[key] = false;
    }
    window.addEventListener('keydown', function(event) {
      if (event.keyCode === keyCode) {
        keys[key] = true;
      }
    });
    window.addEventListener('keyup', function(event) {
      if (event.keyCode === keyCode) {
        keys[key] = false;
      }
    });
  }

  (function() {
    var key;
    var keyCode;
    for (key in keyCodes) {
      if (keyCodes.hasOwnProperty(key)) {
        keyCode = keyCodes[key];
        generateKeydown(key, keyCode);
      }
    }
  }());

  window.addEventListener('mousedown', function(event) {
    var returnVal = true;
    lastPosition = {
      x: event.clientX,
      y: event.clientY
    };
    if (event.which === 1) {
      keys.leftMouse = true;
    } else if (event.which === 3) {
      keys.rightMouse = true;
    } else if (event.which === 2) {
      keys.middleMouse = true;
      returnVal = false;
    }
    return returnVal;
  });

  window.addEventListener('mouseup', function(event) {
    if (event.which === 1) {
      keys.leftMouse = false;
    } else if (event.which === 3) {
      keys.rightMouse = false;
    } else if (event.which === 2) {
      keys.middleMouse = false;
    }
  });

  function mouseDelta(func) {
    window.addEventListener("mousemove", function(event) {
      var deltaX;
      var deltaY;
      var deltaTime;
      var newTime;
      event.preventDefault();
      if (keys.leftMouse || keys.rightMouse || keys.middleMouse) {
        if (lastTimes.mousemove !== "undefined") {
            newTime = +new Date();
            deltaTime = newTime - lastTimes.mousemove;
        }
        var newPosition = {
          x: event.clientX,
          y: event.clientY
        };
        if (!lastPosition) {
          lastPosition = newPosition;
          return;
        }
        deltaX = newPosition.x - lastPosition.x;
        deltaY = newPosition.y - lastPosition.y;
        func(deltaX, deltaY, deltaTime, keys);
        lastPosition = newPosition;
        lastTimes.mousemove = newTime;
        event.returnValue = false;
      }
    });
  }

  return {
    mouseDelta: mouseDelta
  };
}(window));

(function () {
    var text;
    var lastTime = +new Date();

    function getText(e) {
        text = (document.all) ? document.selection.createRange().text : document.getSelection();
        text += "";
    }

    az.magicMousey.mouseDelta(function (dx, dy, dt, keys) {
        getText();
        if (keys.leftMouse && (!text)) {
            window.scrollBy(-dx, -dy);
        }
    });
}());

// anarchist-state-free scrolling
az.$("html").style.margin = "1000px";
az.$("html").style.width = window.innerWidth + "px";
az.$("html").style.height = window.innerHeight + "px";
// az.$("html").style.height = "1px";
az.$("body").style.width = window.innerWidth + "px";
az.$("body").style.position = "relative";
az.$("body").style.top = "-500px";
az.$("body").style.left = "-500px";
window.scrollTo(500, 500);

// text-selection with the scrollwheel
// (function () {
//     var text = "";
//     var textRange;
//     var lastTime = +new Date();

//     function getText(e) {
//         textRange = (document.all) ? document.selection.createRange().text : document.getSelection();
//     }

//     function deltaWheel(dt) {
//         var tRange;
//         var offsetDelta = Math.floor(dt / 500);
//         if (textRange) {
//             console.log(textRange.focusOffset + offsetDelta);
//             tRange = document.createRange();
//             tRange.setStart(textRange.anchorNode, textRange.anchorOffset);
//             tRange.setEnd(textRange.anchorNode, textRange.focusOffset + offsetDelta);
//             window.getSelection().addRange(tRange);
//             textRange = window.getSelection();
//         }
//     }

//     document.addEventListener("wheel", function (e) {
//         var newTime = +new Date();
//         e.preventDefault();
//         deltaWheel(lastTime - newTime);
//         lastTime = newTime;
//     });

//     document.addEventListener("mouseup", getText);
// }());

az.translate = function(value, leftMin, leftMax, rightMin, rightMax) {
  var leftSpan = leftMax - leftMin;
  var rightSpan = rightMax - rightMin;

  var scaled = (value - leftMin) / leftSpan;
  return rightMin + scaled * rightSpan;
};

az.constrainValue = function(value, min, max) {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};