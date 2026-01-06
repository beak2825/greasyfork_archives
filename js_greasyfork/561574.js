// ==UserScript==
// @name         Sakura点击悬浮窗
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击Sakura烦人的跑马灯悬浮窗
// @author       ujsmusen
// @match        https://www.natfrp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=natfrp.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/561574/Sakura%E7%82%B9%E5%87%BB%E6%82%AC%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/561574/Sakura%E7%82%B9%E5%87%BB%E6%82%AC%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('#readTheDocsToLearnHowToCloseThisPromptPermenantlyInsteadOfBlockingItAndNotReadTheDocs a').click();

    // Your code here...
})();