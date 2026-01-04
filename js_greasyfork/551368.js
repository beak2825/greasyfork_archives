// ==UserScript==
// @name               VTC Moodle: Auto-hide Sidebar
// @name:zh-TW         VTC Moodle：自動隱藏側邊欄
// @description        Hide the sidebar automatically after the page loaded.
// @description:zh-TW  在頁面載入後自動隱藏側邊欄。
// @icon               https://icons.duckduckgo.com/ip3/moodle2526.vtc.edu.hk.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://moodle2526.vtc.edu.hk/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/551368/feedback
// @downloadURL https://update.greasyfork.org/scripts/551368/VTC%20Moodle%3A%20Auto-hide%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/551368/VTC%20Moodle%3A%20Auto-hide%20Sidebar.meta.js
// ==/UserScript==

const body = document.body;
const toggle = document.querySelector(".tgsdbb_toggle");
if (toggle)
{
    const interval = setInterval(() =>
    {
        if (!body.classList.contains("tgsdbb_open"))
        {
            clearInterval(interval);
            return;
        }

        toggle.click();
    }, 50);
}
