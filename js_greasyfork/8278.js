// ==UserScript==
// @name        Hacker News - Highlight and navigate original poster's comments
// @description Highlight original poster comments on Hackers News and navigate them with the keyboard
// @namespace   valacar
// @author      valacar
// @include     https://news.ycombinator.com/item?id=*
// @version     0.3
// @grant       none
// @noframes
// @license     MIT
// @compatible  firefox Firefox
// @compatible  chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/8278/Hacker%20News%20-%20Highlight%20and%20navigate%20original%20poster%27s%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/8278/Hacker%20News%20-%20Highlight%20and%20navigate%20original%20poster%27s%20comments.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ENABLE_KEYBOARD_NAVIGATION = true;
  const VERTICAL_CENTER_PERCENT = 0.25; // percentage from the top

  function appendStyle(cssString) {
    const parent = document.head || document.documentElement;
    if (parent) {
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.textContent = cssString;
      parent.appendChild(style);
    }
  }

  appendStyle(
`
.originalPoster,
.opPostCountInfo
{
  background: #ffc;
}
.currentHighlight
{
  background: linear-gradient(to right, #ffc 66%, transparent);
}
`);

  const posterUserName = document.querySelector('.subtext a').textContent;
  let opPostCount = 0;

  if (posterUserName) {
    const commentUserLinks = document.querySelectorAll('.comhead a');

    if (commentUserLinks) {
      for (let i = 0; i < commentUserLinks.length; i++) {
        let commentUserName = commentUserLinks[i].textContent;
        if (posterUserName === commentUserName) {
          opPostCount++;
          commentUserLinks[i].classList.add('originalPoster');
          commentUserLinks[i].id = 'op-post-' + opPostCount;
        }
      }
    }
  }

  if (opPostCount > 0) {
    const newSpan = document.createElement('span');
    newSpan.textContent = ' (' + opPostCount + ' by original poster)';
    newSpan.className = 'opPostCountInfo';

    if (ENABLE_KEYBOARD_NAVIGATION) {
      newSpan.setAttribute('title', "Use the left/right arrow keys\n(or n/N, or n/p) to scroll to OP comments.");
      newSpan.setAttribute('style', "cursor: help;");
    }

    const subText = document.querySelectorAll('.subtext a[href^="item?id="')[1];
    subText.appendChild(newSpan);
  }

  // http://stackoverflow.com/questions/8922107/javascript-scrollintoview-middle-alignment
  Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + (this.offsetParent ? this.offsetParent.documentOffsetTop() : 0);
  };

  function ScrollToID(id) {
    const target = document.getElementById(id);
    const top = target.documentOffsetTop() - (window.innerHeight * VERTICAL_CENTER_PERCENT);
    window.scrollTo(0, top);
    const oldCurrent = document.querySelector(".currentHighlight");
    if (oldCurrent) {
      oldCurrent.classList.remove("currentHighlight");
    }
    // XXX: not the best idea to blindly go back two parents
    target.parentNode.parentNode.classList.add("currentHighlight");
  }

  if (ENABLE_KEYBOARD_NAVIGATION) {
    let num = 0;

    window.addEventListener("keydown", function (event) {
      // Should do nothing if the key event was already consumed.
      if (event.defaultPrevented) {
        return;
      }

      // don't break alt-left and alt-right history navigation
      // and exit if textarea is in focus
      if (event.altKey || /(input|textarea)/i.test(document.activeElement.nodeName)) {
        return;
      }

      switch (event.key) {
        case "n":
        case "ArrowRight":
        case "Right":
          if (num < opPostCount) {
            num++;
          }
          break;

        case "N":
        case "p":
        case "ArrowLeft":
        case "Left":
          if (num > 1) {
            num--;
          }
          break;

        default:
          return; // Quit when this doesn't handle the key event.
      }

      // Consume the event for suppressing "double action".
      event.preventDefault();

      //console.log('num = ' + num + ' focus = ' + document.activeElement.tagName);
      ScrollToID("op-post-" + num);

    }, true);
  }

})();
