// ==UserScript==
// @name          番茄小说网页版完整阅读器
// @name:en Fanqie Web Chapter Unlocker
// @name:zh-CN 番茄网页版免费阅读器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description Replace chapter content via API to bypass reading limits on fanqienovel.com
// @description:zh-CN  在网页端完整阅读番茄小说章节，无需跳转 App。
// @match        *://fanqienovel.com/reader/*
// @author Yunyan
// @license MIT
// @grant        GM_xmlhttpRequest
// @connect      tt.sjmyzq.cn
// @downloadURL https://update.greasyfork.org/scripts/555657/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%8C%E6%95%B4%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555657/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%8C%E6%95%B4%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastChapterId = null;

    function getChapterId() {
        const canonical = document.querySelector('link[rel="canonical"]')?.href;
        return canonical?.match(/reader\/(\d+)/)?.[1] || null;
    }

    function replaceChapterContent(chapterId) {
        const targetDiv = document.querySelector(".muye-reader-content.noselect");
        if (targetDiv) {
            targetDiv.innerHTML = "<p style='text-align:center; font-size:16px;'>Loading chapter content...</p>";
        }

        const apiUrl = `https://tt.sjmyzq.cn/api/raw_full?item_id=${chapterId}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: {
                "Accept": "application/json"
            },
            onload: function(response) {
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.code === 200 && json.data && json.data.content) {
                        if (targetDiv) {
                            targetDiv.innerHTML = json.data.content;
                        }
                        const annoyingDiv = document.querySelector('.muye-to-fanqie');
                        if (annoyingDiv) annoyingDiv.remove();
                    }
                } catch (e) {
                    console.error("Failed to parse JSON response:", e);
                }
            },
            onerror: function(err) {
                console.error("API request failed:", err);
            }
        });
    }

    function checkAndReplace() {
        const chapterId = getChapterId();
        if (chapterId && chapterId !== lastChapterId) {
            lastChapterId = chapterId;
            replaceChapterContent(chapterId);
        }
    }

    // Initial load
    window.addEventListener("load", checkAndReplace);

    // Hook into pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(checkAndReplace, 100); // slight delay to allow DOM update
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(checkAndReplace, 100);
    };

    // Also listen to popstate (e.g., browser back/forward)
    window.addEventListener("popstate", checkAndReplace);
})();
