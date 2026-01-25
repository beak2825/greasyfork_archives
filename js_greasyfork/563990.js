// ==UserScript==
// @name         V3 Ctrl+Enter to post comments
// @namespace    aubymori
// @version      1.0.0
// @description  Ctrl+Enter to post comments in V3
// @author       aubymori
// @match        https://www.youtube.com/*
// @icon         https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563990/V3%20Ctrl%2BEnter%20to%20post%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/563990/V3%20Ctrl%2BEnter%20to%20post%20comments.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(e)
{
    if (e.key == "Enter" && e.ctrlKey && e.target.classList.contains("sb_text_input"))
    {
        let postButton = e.target.parentElement.querySelector(".jfk-button-action");
        if (postButton)
            postButton.click();
    }
});