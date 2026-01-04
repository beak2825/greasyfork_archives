// ==UserScript==
// @name         Fetch & XHR Hook with Infinite Retry (5s Timeout)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hook fetch and XHR, retry infinitely every 5s if no response, log retries
// @author       You
// @match        https://openreview.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555086/Fetch%20%20XHR%20Hook%20with%20Infinite%20Retry%20%285s%20Timeout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555086/Fetch%20%20XHR%20Hook%20with%20Infinite%20Retry%20%285s%20Timeout%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TIMEOUT = 5000; // 5초

    // --------------------------------------
    // Hook fetch
    // --------------------------------------
    const originalFetch = window.fetch;

    async function fetchWithRetry(resource, options = {}, attempt = 1) {
        console.log(`%c[Fetch Hook] 요청 시작 (시도 ${attempt}) →`, "color: cyan;", resource);
        console.log("%c[Fetch Hook] Options:", "color: yellow;", options);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT);

        try {
            const response = await originalFetch(resource, { ...options, signal: controller.signal });
            clearTimeout(timer);
            console.log(`%c[Fetch Hook] 응답 성공 (시도 ${attempt})`, "color: lightgreen;");
            return response;
        } catch (err) {
            clearTimeout(timer);
            console.warn(`[Fetch Hook] 실패 (시도 ${attempt}): ${err.message}`);
            console.warn(`[Fetch Hook] ${TIMEOUT / 1000}초 초과로 재시도합니다...`);
            await new Promise(res => setTimeout(res, 1000)); // 1초 대기 후 재시도
            return fetchWithRetry(resource, options, attempt + 1);
        }
    }

    window.fetch = (resource, options) => fetchWithRetry(resource, options);

    // --------------------------------------
    // Hook XMLHttpRequest
    // --------------------------------------
    const OriginalXHR = window.XMLHttpRequest;
    function HookedXHR() {
        const xhr = new OriginalXHR();
        let url = '';
        let method = '';
        let body = null;
        let attempt = 1;
        let timeoutTimer = null;

        const open = xhr.open;
        xhr.open = function(_method, _url, ...rest) {
            method = _method;
            url = _url;
            console.log("%c[XHR Hook] open:", "color: cyan;", method, url);
            return open.apply(xhr, [_method, _url, ...rest]);
        };

        const send = xhr.send;
        xhr.send = function(_body) {
            body = _body;
            console.log("%c[XHR Hook] send data:", "color: yellow;", body);
            attempt = 1;

            const doRequest = () => {
                console.log(`%c[XHR Hook] 요청 시작 (시도 ${attempt}) → ${method} ${url}`, "color: cyan;");
                const retryXHR = new OriginalXHR();

                timeoutTimer = setTimeout(() => {
                    console.warn(`[XHR Hook] ${TIMEOUT / 1000}초 초과. 요청 중단 후 재시도...`);
                    retryXHR.abort();
                    attempt++;
                    doRequest(); // 무한 반복 재시도
                }, TIMEOUT);

                retryXHR.onreadystatechange = function() {
                    if (retryXHR.readyState === 4) {
                        clearTimeout(timeoutTimer);
                        if (retryXHR.status >= 200 && retryXHR.status < 300) {
                            console.log(`%c[XHR Hook] 응답 성공 (시도 ${attempt})`, "color: lightgreen;");
                        } else {
                            console.warn(`[XHR Hook] 실패 (시도 ${attempt}) 상태: ${retryXHR.status}`);
                            attempt++;
                            doRequest();
                        }
                    }
                };

                retryXHR.open(method, url, true);
                retryXHR.send(body);
            };

            doRequest();
        };

        return xhr;
    }

    window.XMLHttpRequest = HookedXHR;

    console.log("%c[Hook Installed] fetch & XMLHttpRequest hooked (5s timeout, infinite retry)", "color: lime;");
})();
