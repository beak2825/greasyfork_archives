// ==UserScript==
// @name         TRLink Bypasser
// @namespace    https://github.com/alper-dev/aylink.co-bypasser
// @version      1.5
// @description  Bypass aylink.co and cpmlink.pro short links automatically.
// @author       alperdev
// @license      MIT
// @match        *://aylink.co/*
// @match        *://cpmlink.pro/*
// @icon         https://raw.githubusercontent.com/alper-dev/aylink.co-bypasser/refs/heads/main/icon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554667/TRLink%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/554667/TRLink%20Bypasser.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const host = location.host.replace('www.', '').toLowerCase();
    if (host !== 'aylink.co' && host !== 'cpmlink.pro') return;

    if (!/^\/[A-Za-z0-9]+$/.test(location.pathname)) return;

    const showBypassingAnimation = (() => {
        let styleInjected = false;
        return () => {
            if (!styleInjected) {
                document.head.insertAdjacentHTML("beforeend", `
                    <style id="bypass-anim-style">
                        #bypass-anim {
                            position: fixed; inset: 0; width: 100vw; height: 100vh;
                            background: rgba(0, 0, 0, 0.85); 
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            z-index: 99999; display: flex;
                            align-items: center; justify-content: center; flex-direction: column;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        .bypass-container {
                            background: rgba(255, 255, 255, 0.95);
                            border-radius: 20px;
                            padding: 40px 60px;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                            text-align: center;
                        }
                        .bypass-spinner {
                            width: 50px; height: 50px; 
                            border: 5px solid #e0e0e0;
                            border-top: 5px solid #2196f3; 
                            border-radius: 50%;
                            animation: spin 0.8s linear infinite; 
                            margin: 0 auto 20px;
                        }
                        .bypass-text {
                            font-size: 1.2em;
                            font-weight: 600;
                            color: #333;
                            margin: 0;
                        }
                        @keyframes spin { to { transform: rotate(360deg); } }
                    </style>
                `);
                styleInjected = true;
            }
            const div = document.createElement('div');
            div.id = 'bypass-anim';
            div.innerHTML = `
                <div class="bypass-container">
                    <div class="bypass-spinner"></div>
                    <p class="bypass-text">Bypassing link...</p>
                </div>
            `;
            document.body.appendChild(div);
            return () => div.remove();
        };
    })();

    function makeRequest(url, method = 'GET', data = null, headers = {}, retries = 3, timeout = 30000) {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            const attemptRequest = () => {
                attemptCount++;
                GM_xmlhttpRequest({
                    method,
                    url,
                    headers,
                    data,
                    timeout: timeout,
                    onload: res => {
                        try {
                            if (headers.Accept && headers.Accept.includes('application/json')) {
                                resolve(JSON.parse(res.responseText));
                            } else {
                                resolve(res.responseText);
                            }
                        } catch {
                            resolve(res.responseText);
                        }
                    },
                    onerror: err => {
                        if (attemptCount < retries) {
                            // wait before retrying
                            const delay = Math.min(1000 * Math.pow(2, attemptCount - 1), 5000);
                            console.log(`Request failed, retrying in ${delay}ms... (Attempt ${attemptCount}/${retries})`);
                            setTimeout(attemptRequest, delay);
                        } else {
                            reject(new Error('Network error after ' + retries + ' attempts: ' + (err.error || 'Unknown error')));
                        }
                    },
                    ontimeout: () => {
                        if (attemptCount < retries) {
                            // wait before retrying
                            const delay = Math.min(1000 * Math.pow(2, attemptCount - 1), 5000);
                            console.log(`Request timeout, retrying in ${delay}ms... (Attempt ${attemptCount}/${retries})`);
                            setTimeout(attemptRequest, delay);
                        } else {
                            reject(new Error('Request timeout after ' + retries + ' attempts'));
                        }
                    }
                });
            };

            attemptRequest();
        });
    }

    async function bypassAylink() {
        const removeAnim = showBypassingAnimation();
        try {
            const html = document.documentElement.outerHTML;
            const m = html.match(/_a\s*=\s*'([^']+)',\s*_t\s*=\s*'([^']+)',\s*_d\s*=\s*'([^']+)'/);
            if (!m) return alert('Failed to extract data');
            const [_a, _t, _d] = m.slice(1);
            const m2 = html.match(/name="alias"\s+value="([^"]+)"[\s\S]+?name="csrf"\s+value="([^"]+)"/);
            if (!m2) return alert('Failed to extract data');
            const [alias, csrf] = m2.slice(1);

            const headers = {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": location.href,
                "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            };

            const tkData = await makeRequest(`https://${host}/get/tk`, 'POST',
                `_a=${_a}&_t=${_t}&_d=${_d}`, headers);

            if (!tkData.status) return alert('Failed to get token');
            const tkn = tkData.th;

            const go2Data = await makeRequest(`https://${host}/links/go2`, 'POST',
                `alias=${alias}&csrf=${csrf}&tkn=${tkn}`, headers);

            if (go2Data.url) {
                if (go2Data.url.includes("bildirim.vip")) {
                    const finalHtml = await makeRequest(go2Data.url, 'GET');
                    console.log(finalHtml)
                    const match = finalHtml.match(/url\s*=\s*'([^']+)'/) || finalHtml.match(/uri_full:\s*'([^']*)'/)
                    if (match) {
                        removeAnim();
                        location.href = match[1];
                    } else {
                        removeAnim();
                        location.href = go2Data.url;
                    }
                } else {
                    removeAnim();
                    location.href = go2Data.url;
                }
            } else {
                removeAnim();
                alert('No URL found in response');
            }
        } catch (e) {
            removeAnim();
            alert('Error: ' + e.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bypassAylink);
    } else {
        bypassAylink();
    }
})();
