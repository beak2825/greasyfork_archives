// ==UserScript==
// @name         gitlab-toolkit
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  gitlab toolkit by Theo·Chan
// @author       iTheo
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4.217
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/552644/gitlab-toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/552644/gitlab-toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 美化头像
     */
    function addStyles() {
        let stl = document.createElement('style'),
            str = `img.avatar.s20{max-width:20px;max-height:20px;}a.gl-link{max-width:calc(100% - 14px) !important;width:100%;}`;
        stl.setAttribute('type', 'text/css');
        if (stl.styleSheet) { //ie下
            stl.styleSheet.cssText = str;
        } else {
            stl.innerHTML = str;
        }
        document.getElementsByTagName('head')[0].appendChild(stl);
    }
    addStyles();
    // Your code here...
})();