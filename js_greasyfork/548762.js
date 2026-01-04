// ==UserScript==
// @name        Internet Roadtrip - Disable Steering Wheel Turning
// @description Prevent the steering wheel from turning to point to the most voted options in neal.fun/internet-roadtrip
// @namespace   me.netux.site/user-scripts/internet-roadtrip/disable-steering-wheel-turning
// @version     1.0.0
// @author      Netux
// @license     MIT
// @match       https://neal.fun/*
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @run-at      document-start
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/548762/Internet%20Roadtrip%20-%20Disable%20Steering%20Wheel%20Turning.user.js
// @updateURL https://update.greasyfork.org/scripts/548762/Internet%20Roadtrip%20-%20Disable%20Steering%20Wheel%20Turning.meta.js
// ==/UserScript==

/* globals IRF */

(async () => {
  const wheelVDOM = await IRF.vdom.wheel;
  wheelVDOM.state._computedWatchers.angle.getter = () => 0;
})();
