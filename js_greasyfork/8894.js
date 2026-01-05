// ==UserScript==
// @name           BlockUnloadEvents
// @namespace      http://theaceoffire.8k.com/STOPTHEMADDNESS
// @description    This stops ANY AND ALL javascript that stops you from leaving a page.
// @include        *
// @version 0.0.1.20150331095750
// @downloadURL https://update.greasyfork.org/scripts/8894/BlockUnloadEvents.user.js
// @updateURL https://update.greasyfork.org/scripts/8894/BlockUnloadEvents.meta.js
// ==/UserScript==
(function() {
      unsafeWindow.onbeforeunload = null;

      unsafeWindow.onunload = null;

      unsafeWindow.alert = null;

      unsafeWindow.confirm = null;

      unsafeWindow.prompt = null;

})();