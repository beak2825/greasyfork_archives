// ==UserScript==
// @name          Focus input text field on Esc
// @description   Focus the first visible input text field when you press Esc key, or restore the previously focused element on second press
// @version       1.0.11
// @include       *
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/9525/Focus%20input%20text%20field%20on%20Esc.user.js
// @updateURL https://update.greasyfork.org/scripts/9525/Focus%20input%20text%20field%20on%20Esc.meta.js
// ==/UserScript==

var TEXT_FIELD = ' search text number url textarea ';
var previousElement;
var scrollPos;
var first;

window.addEventListener('keydown', function (e) {
  if (e.defaultPrevented || e.which !== 27 || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
    return;
  }
  if (window !== top) {
    rememberFocus();
    window.addEventListener('message', maybeRestoreFocus);
    top.postMessage(GM_info.script.name, '*');
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  run();
}, true);

if (window === top) {
  window.addEventListener('message', function (e) {
    if (e.data === GM_info.script.name) {
      run({relayedFromFrame: true});
    }
  });
}

function run(params) {
  // find text inputs inside visible DOM containers
  var inputs = [];
  populateInputs(inputs);
  for (var i = 0, input, il = inputs.length; i < il && (input = inputs[i]); i++) {
    var priority = TEXT_FIELD.indexOf(' ' + input.type + ' ');
    if (priority < 0) continue;
    var n = input, style;
    while (n && n.style && (style = getComputedStyle(n)) && style.display !== 'none' && style.visibility !== 'hidden') {
      n = n.parentNode;
    }
    // visible if reached DOM root
    if (n && n.style) continue;
    // set the first OR if it's empty, try to select an identically named input field with some text (happens on some sites)
    if (!first || (
      input.value &&
      input.name === first.name && (
        !input.form && !first.form ||
        input.form && first.form && input.form.action === first.form.action
      )
    )) {
      first = input;
      if (first.value) break;
    }
  }

  if (!first) return;

  var invoke = params && params.relayedFromFrame ? passthru : onkeyup;

  if (first !== getActiveElement()) {
    rememberFocus();
    invoke(setFocus);
  } else if (previousElement) {
    invoke(restoreFocus);
    if (previousElement && previousElement.localName === 'iframe') {
      previousElement.contentWindow.postMessage(GM_info.script.name, '*');
    }
  }
}

function populateInputs(inputs, root) {
  var walker = document.createTreeWalker(root || document, NodeFilter.SHOW_ELEMENT);
  var el;
  while ((el = walker.nextNode())) {
    if (el.shadowRoot)
      populateInputs(inputs, el.shadowRoot);
    if (/^(input|textarea)$/.test(el.localName))
      inputs.push(el);
  }
}

function getActiveElement() {
  var el = document.activeElement;
  while (el) {
    if (!el.shadowRoot)
      return el;
    el = el.shadowRoot.activeElement;
  }
}

function rememberFocus() {
  previousElement = document.activeElement;
  scrollPos = [scrollX, scrollY];
}

function setFocus() {
  first.focus();
}

function restoreFocus() {
  // in case document.body (page "background") was previously selected
  document.activeElement.blur();
  previousElement.focus();
  scrollTo(scrollPos[0], scrollPos[1]);
}

function maybeRestoreFocus(e) {
  if (e.data === GM_info.script.name) {
    restoreFocus();
  }
}

// focusing should be done at key-up to prevent the Esc-keydown being also chain-handled by the just focused element
function onkeyup(cb) {
  window.addEventListener('keyup', function keyup(e) {
    if (e.which !== 27) return;
    window.removeEventListener('keyup', keyup);
    if (e.defaultPrevented) return;
    cb(e);
  });
}

function passthru(fn) {
  return fn.apply(this, arguments);
}
