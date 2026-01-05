// ==UserScript==
// @name Select text inside a link like Opera
// @version 6.0.0
// @description Disable link dragging and select text.
// @homepageURL https://github.com/eight04/select-text-inside-a-link-like-opera#readme
// @supportURL https://github.com/eight04/select-text-inside-a-link-like-opera/issues
// @license MIT
// @author eight <eight04@gmail.com> (http://eight04.blogspot.tw)
// @namespace eight04.blogspot.com
// @include *
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/789/Select%20text%20inside%20a%20link%20like%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/789/Select%20text%20inside%20a%20link%20like%20Opera.meta.js
// ==/UserScript==

// const IS_FIREFOX = typeof InstallTrigger !== 'undefined';
// const tracker = IS_FIREFOX && createMovementTracker();
const tracker = createMovementTracker();
const selection = window.getSelection();
// waiting -> starting -> started -> ending -> waiting
let state = "WAITING";
let preState;
let mousemoves = 0;
let linkTarget;
const initPos = [0, 0];
let selectType;

const EVENTS = {
  mousedown: e => {
    if (state === "WAITING") {
      if (e.altKey || e.button) {
        return;
      }
      if (/img/i.test(e.target.nodeName)) {
        return;
      }
      const target = findLinkTarget(e.target);
      if (!target || !target.href) {
        return;
      }
      selectType = e.ctrlKey ? "add" :
        e.shiftKey ? "extend" : "new";
      initPos[0] = e.pageX;
      initPos[1] = e.pageY;
      if (selectType === "new") {
        if (!selection.isCollapsed && inSelect(getInitPos(), selection)) {
          return;
        }
      }
      mousemoves = 0;
      state = "STARTING";
      linkTarget = target;
      linkTarget.classList.add("select-text-inside-a-link");
    }
  },
  mousemove: e => {
    if (state === "STARTING") {
      mousemoves++;
      // dragstart event may not fire all the time
      // https://github.com/eight04/select-text-inside-a-link-like-opera/issues/9
      if (mousemoves >= 3) {
        startSelecting(e);
      }
    }
    if (state === "STARTED") {
      const caretPos = caretPositionFromPoint(
        e.pageX - window.scrollX,
        e.pageY - window.scrollY
      );
      selection.extend(caretPos.offsetNode, caretPos.offset);
    }
  },
  mouseup: () => {
    if (state !== "WAITING") {
      preState = state;
      state = "ENDING";
      // delay uninit to cancel click event
      setTimeout(startWaiting);
    }
  },
  click: e => {
    if (state === "ENDING") {
      if (preState === "STARTED") {
        // fix browser clicking issue. Cancel click event if we have selected
        // something.
        const clickedTarget = findLinkTarget(e.target);
        if (clickedTarget === linkTarget) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
      startWaiting();
    }
  },
  dragstart: e => {
    if (state === "STARTED") {
      e.preventDefault();
      return;
    }
    if (state === "STARTING") {
      startSelecting(e);
    }
  }
};

for (const key in EVENTS) {
  document.addEventListener(key, EVENTS[key], true);
}

if (!document.contentType || !document.contentType.endsWith("/xml")) {
  document.addEventListener("DOMContentLoaded", function(){
    GM_addStyle(".select-text-inside-a-link{ -moz-user-select: text!important; }");
  });
}

function startSelecting(e) {
  if (!shouldStart(e)) {
    startWaiting();
    return;
  }
  if (e.type === "dragstart") {
    e.preventDefault();
  }
  if (selectType === "new") {
    const pos = getInitPos();
    selection.collapse(pos.offsetNode, pos.offset);
  } else if (selectType === "add") {
    const range = new Range;
    const pos = getInitPos();
    range.setStart(pos.offsetNode, pos.offset);
    selection.addRange(range);
  }
  state = "STARTED";
}

function getInitPos() {
  return caretPositionFromPoint(initPos[0] - window.scrollX, initPos[1] - window.scrollY);
}

function shouldStart(e) {
  const delta = tracker ? tracker() :
    [Math.abs(e.pageX - initPos[0]), Math.abs(e.pageY - initPos[1])];
  return delta[0] >= delta[1];
}

function startWaiting() {
  if (linkTarget) {
    linkTarget.classList.remove("select-text-inside-a-link");
  }
  state = "WAITING";
  linkTarget = null;
}

function createMovementTracker() {
  // we always have to track mouse movement so we can use the delta on dragstart
  // event.
  // it is possible to calculate the movement between mousedown and dragstart
  // events in Chrome. In Firefox, the two events are fired at the same time.
  const moves = [[0, 0], [0, 0], [0, 0]];
  let index = 0;
  document.addEventListener("mousemove", e => {
    moves[index][0] = e.pageX;
    moves[index][1] = e.pageY;
    index = (index + 1) % 3;
  });
  return () => {
    const output = [];
    for (let i = 0; i < 2; i++) {
      // FIXME: should we assume that the array contains initial values [0, 0]?
      output.push(
        Math.abs(moves[index][i] - moves[(index + 1) % 3][i]) +
        Math.abs(moves[(index + 1) % 3][i] - moves[(index + 2) % 3][i])
      );
    }
    return output;
  };
}

function caretPositionFromPoint(x, y) {
	if (document.caretPositionFromPoint) {
		return document.caretPositionFromPoint(x, y);
	}
	var r = document.caretRangeFromPoint(x, y);
	return {
		offsetNode: r.startContainer,
		offset: r.startOffset
	};
}

function inSelect(caretPos, selection){
	var i, len = selection.rangeCount, range;
	for (i = 0; i < len; i++) {
		range = selection.getRangeAt(i);
		if (range.isPointInRange(caretPos.offsetNode, caretPos.offset)) {
			return true;
		}
	}
	return false;
}

function findLinkTarget(target) {
  while (target && target.nodeName !== "A" && target.nodeName !== "a") {
    target = target.parentNode;
  }
  return target;
}
