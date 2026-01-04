// ==UserScript==
// @name         kemonochecker
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  pixivの作者がkemonoにいるかどうかチェックしてサムネに赤緑の枠で表示 (相対パス指定)
// @author       You
// @match        *://*.pixiv.net/*
// @icon         https://kemono.cr/static/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/553859/kemonochecker.user.js
// @updateURL https://update.greasyfork.org/scripts/553859/kemonochecker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定項目 ---
    const MISSING_CACHE_TTL_HOURS = 24;
    // ----------------

    const MISSING_CACHE_TTL_MS = MISSING_CACHE_TTL_HOURS * 60 * 60 * 1000;
    const STORAGE_PREFIX = "kemono_status_";

    async function checkKemonoFanboxExists(userId) {
        if (!userId) {
            console.error("ユーザーIDが必要です。");
            return "400";
        }
        const apiUrl = `https://kemono.cr/api/v1/fanbox/user/${userId}/profile`;
        try {
            const response = await request({ method: "HEAD", url: apiUrl });
            if (response.status === 200 || response.status === 202) {
                return "found";
            } else if (response.status === 404) {
                return "missing";
            } else {
                return String(response.status);
            }
        } catch (error) {
            console.error("存在チェック中にエラーが発生しました:", error);
            return "error";
        }
    }
    //

    //
    function request(details) {
        return new Promise((resolve, reject) => {
            if (typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined') {
                const errorMsg = "GM.xmlHttpRequest が利用できません。ユーザースクリプト環境で実行してください。";
                console.error(errorMsg);
                reject(new Error(errorMsg));
                return;
            }
            GM.xmlHttpRequest({
                ...details,
                onload: resolve,
                onerror: reject
            });
        });
    }
    //
    async function getFanboxStatus(fanboxId) {
        const storageKey = STORAGE_PREFIX + fanboxId;
        const cachedData = await GM.getValue(storageKey);

        if (cachedData === "found") {
            return "found";
        }

        if (typeof cachedData === "object" && cachedData !== null && cachedData.status === "missing") {
            const now = Date.now();
            const elapsedTime = now - cachedData.timestamp;
            if (elapsedTime < MISSING_CACHE_TTL_MS) {
                return "missing";
            }
        }

        const apiStatus = await checkKemonoFanboxExists(fanboxId);

        try {
            if (apiStatus === "found") {
                await GM.setValue(storageKey, "found");
            } else if (apiStatus === "missing") {
                await GM.setValue(storageKey, { status: "missing", timestamp: Date.now() });
            }
        } catch (e) {
            console.error("GM.setValue failed:", e);
        }

        return apiStatus;
    }


    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const TARGET_SELECTOR = 'a[href*="/users/"][data-gtm-value], a[href*="/users/"][data-ga4-label="user_name_link"]';


    function processElement(targetElement) {

        if (targetElement.firstElementChild) {
            return;
        }

        // -----------------------------------------------------

        if (targetElement.dataset.kemonoChecked) {
            return;
        }
        targetElement.dataset.kemonoChecked = 'pending';

        let userContainer;
        let styleTargetElement;

        try {
            userContainer = targetElement.parentElement.parentElement.parentElement;
            styleTargetElement = userContainer.firstElementChild;

        } catch (e) {
            targetElement.dataset.kemonoChecked = 'error-dom-structure';
            return;
        }

        if (!styleTargetElement) {
            targetElement.dataset.kemonoChecked = 'error-no-target';
            return;
        }

        (async () => {
            const fanboxId = targetElement.href.split('/').pop();
            let status = await getFanboxStatus(fanboxId);

            targetElement.dataset.kemonoChecked = 'true';

            let color;
            if (status === "found") {
                color = "lime";
            } else if (status === "missing") {
                color = "red";
            } else {
                color = "yellow";
            }

            styleTargetElement.style.border = `1.5px solid ${color}`;
            styleTargetElement.style.borderRadius = `4px`;
        })();
    }

    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type !== 'childList') continue;

            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.matches(TARGET_SELECTOR)) {
                    processElement(node);
                }
                node.querySelectorAll(TARGET_SELECTOR).forEach(processElement);
            }
        }
    };

    const observer = new MutationObserver(callback);

    document.querySelectorAll(TARGET_SELECTOR).forEach(processElement);

    observer.observe(targetNode, config);
})();