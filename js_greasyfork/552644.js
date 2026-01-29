// ==UserScript==
// @name         gitlab-toolkit
// @namespace    http://tampermonkey.net/
// @version      0.02
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
        let stl = document.createElement('style');
        // 美化头像
        var str = `img.avatar.s20{max-width:20px;max-height:20px;}`;
        // ？？
        //str = str + `a.gl-link{max-width:calc(100% - 14px) !important;width:100%;}`;
        // release-card hover
        str = str + `.release-block:hover{box-shadow: 0 -2px 2px 0 rgba(34, 97, 161, 0.5);background: rgb(228 239 249 / 30%); margin-left: -10px; margin-right: -10px; padding-left: 10px; padding-right: 10px; border-radius: 4px;}`;
        // tags-row hover
        str = str + `.tags .flex-list .flex-row:hover{ background: rgb(228 239 249 / 30%); margin-left: -10px; margin-right: -10px; padding-left: 10px; padding-right: 10px; border-radius: 4px;}`;

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