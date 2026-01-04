// ==UserScript==
// @name         GeoGuessr - Play GIF on 5k
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.4.0
// @description  Show a celebratory GIF when you 5k
// @author       Rotski
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/550751/GeoGuessr%20-%20Play%20GIF%20on%205k.user.js
// @updateURL https://update.greasyfork.org/scripts/550751/GeoGuessr%20-%20Play%20GIF%20on%205k.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- CONFIG (adjust these) --------------------------------------------------
  var GIF_URL    = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2d6Y3RicHg0aGg5dXp1MHZicHJxb3F4d3EzYjhhNTZqM3YwNzF6diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/j0vs5H7Kcz3Pm9LRDa/giphy.gif';
  var SHOW_MS    = 1700;   // << how long the GIF stays visible (milliseconds)
  var MAX_WIDTH  = 1200;    // << max GIF width in px
  var MAX_HEIGHT = 1200;    // << max GIF height in px
  var MIN_FONT_PX = 32;    // << minimum font-size (px) for the number to count as "big score"
  var MIN_INTERVAL = 1500; // debounce between triggers (ms)
  // ---------------------------------------------------------------------------

  var lastTrigger = 0;

  function digitsOnly(s) { return (s || '').replace(/\D+/g, ''); }
  function isFiveThousandText(s) {
    if (!s) return false;
    var t = (s + '').trim();
    return t === '5,000' || digitsOnly(t) === '5000';
  }

  // Exclude “OF 5,000 POINTS”, “OUT OF 5,000”, etc., within a nearby ancestor.
  function inOfClause(node) {
    var i, n = node;
    for (i = 0; i < 3 && n && n !== document; i++) {
      var txt = (n.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      if (/OF\s*5,?000(\s*POINTS)?/.test(txt) || /OUT\s*OF\s*5,?000/.test(txt) || /\/\s*5,?000/.test(txt)) {
        return true;
      }
      n = n.parentNode || n.host;
    }
    return false;
  }

  // Is this element the BIG score “5,000” (not the small subtitle)?
  function isBigScoreFiveThousand(el) {
    if (!el || el.nodeType !== 1) return false;
    var text = (el.textContent || '').trim();
    if (!isFiveThousandText(text)) return false;

    // Must not be part of "OF 5,000 POINTS" block
    if (inOfClause(el)) return false;

    // Check computed font-size to ensure it's the large number
    try {
      var cs = window.getComputedStyle(el);
      var fontPx = parseFloat(cs && cs.fontSize ? cs.fontSize : '0') || 0;
      if (fontPx < MIN_FONT_PX) return false;
    } catch (e) {
      // If we can't read styles, fall back to allowing it (rare)
      // but the inOfClause guard still protects us.
    }

    return true;
  }

  function showGifOnce() {
    var now = Date.now();
    if (now - lastTrigger < MIN_INTERVAL) return;
    lastTrigger = now;

    if (document.getElementById('gg-perfect-gif-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'gg-perfect-gif-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2147483647';

    var img = document.createElement('img');
    img.src = GIF_URL;
    img.alt = 'Perfect 5,000!';
    img.style.width = MAX_WIDTH + 'px';     // force width
    img.style.height = 'auto';              // preserve aspect ratio
    img.style.maxHeight = MAX_HEIGHT + 'px';
    img.style.objectFit = 'contain';
    img.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
    img.style.borderRadius = '12px';
    img.style.opacity = '0';
    img.style.transition = 'opacity 200ms ease';


    overlay.appendChild(img);
    document.documentElement.appendChild(overlay);

    // fade in
    requestAnimationFrame(function(){ img.style.opacity = '1'; });

    setTimeout(function () {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, SHOW_MS);
  }

  function scanForBigFiveK(root) {
    var doc = root || document;
    // Quick scan: any element whose full text is 5,000 and looks big
    var candidates = (doc.querySelectorAll && doc.querySelectorAll('*')) || [];
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      if (isBigScoreFiveThousand(el)) {
        showGifOnce();
        return true;
      }
    }
    return false;
  }

  // Initial pass
  scanForBigFiveK(document);

  // Observe SPA updates & text changes
  if (window.MutationObserver) {
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];

        if (m.addedNodes && m.addedNodes.length) {
          for (var j = 0; j < m.addedNodes.length; j++) {
            var n = m.addedNodes[j];
            if (n.nodeType === 1) {
              if (scanForBigFiveK(n)) return;
            } else if (n.nodeType === 3 && isFiveThousandText(n.nodeValue)) {
              // Text node changed to "5,000"; check its parent element size/context
              var p = n.parentElement;
              if (p && isBigScoreFiveThousand(p)) { showGifOnce(); return; }
            }
          }
        }

        if (m.type === 'characterData' && isFiveThousandText(m.target && m.target.nodeValue)) {
          var parent = m.target && m.target.parentElement;
          if (parent && isBigScoreFiveThousand(parent)) { showGifOnce(); return; }
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  }

  // Nudge after route changes (round transitions)
  function wrap(fn) {
    return function () {
      var r = fn.apply(this, arguments);
      setTimeout(function(){ scanForBigFiveK(document); }, 0);
      setTimeout(function(){ scanForBigFiveK(document); }, 200);
      return r;
    };
  }
  try {
    if (!history.__ggPerfectWrapped) {
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function () {
        setTimeout(function(){ scanForBigFiveK(document); }, 0);
      }, false);
      history.__ggPerfectWrapped = true;
    }
  } catch (e) {}
})();
