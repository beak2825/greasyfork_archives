// ==UserScript==
// @name         Potato Counter (fixed)
// @namespace    neopets
// @version      0.2
// @description  Fills in the correct answer (does not auto-submit)
// @match        https://www.neopets.com/medieval/potatocounter.phtml
// @match        http://www.neopets.com/medieval/potatocounter.phtml
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548602/Potato%20Counter%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548602/Potato%20Counter%20%28fixed%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function fillGuess(count) {
    var input = document.querySelector("form[action$='potatocounter.phtml'] input[name='guess']");
    if (input) input.value = count;
  }

  function countWithNative() {
    var form = document.querySelector("form[action$='potatocounter.phtml']");
    var table = form && form.previousElementSibling && form.previousElementSibling.tagName === 'TABLE'
      ? form.previousElementSibling
      : null;

    var imgs = (table
      ? table.querySelectorAll("img[src*='/medieval/potato']:not([src*='think'])")
      : document.querySelectorAll("img[src*='/medieval/potato']:not([src*='think'])")
    );

    fillGuess(imgs.length);
  }

  if (window.jQuery) {
    jQuery(function ($) {
      var $form = $("form[action$='potatocounter.phtml']");
      var $table = $form.prev("table");
      var count = $table.find("img[src*='/medieval/potato']:not([src*='think'])").length;

      // Fallback in case the DOM shifts
      if (!count) {
        count = $("img[src*='/medieval/potato']:not([src*='think'])").length;
      }
      $form.find("input[name='guess']").val(count);
    });
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', countWithNative);
    } else {
      countWithNative();
    }
  }
})();
