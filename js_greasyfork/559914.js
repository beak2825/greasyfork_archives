// ==UserScript==
// @name         sgidi_lecture_auto_learn
// @match        *://192.168.2.188:6001/*
// @match        *://192.168.2.189:4001/*
// @connect      192.168.2.188
// @connect      192.168.2.48
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @author       sgidi_devs
// @description  😍用于记录学时 - API版 (一键学习/列表学习)
// @version      1.0.0.5
// @namespace https://greasyfork.org/users/62112
// @downloadURL https://update.greasyfork.org/scripts/559914/sgidi_lecture_auto_learn.user.js
// @updateURL https://update.greasyfork.org/scripts/559914/sgidi_lecture_auto_learn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Configuration
     */
    const CONFIG = {
        apiBase: 'http://192.168.2.188:6001/api/sgidicol/recordingperiod', // Learning Action API
        dataApi: 'http://192.168.2.48:2001/api/VideoInfo/CategoryList'// Course Data Source
    };

    // Store: Title -> { Id, Duration (seconds) }
    const courseStore = new Map();
    let authHeader = null;

    const log = (...args) => console.log('%c[AutoLearn]', 'color: #00bcd4; font-weight: bold;', ...args);

    /**
     * 1. Data Initialization (Fetch CategoryList)
     */
    async function initData() {
        log('Fetching Course Data from API...');
        try {
            const res = await fetch(CONFIG.dataApi);
            const json = await res.json();

            let list = null;
            if (Array.isArray(json)) {
                list = json;
            } else if (json && Array.isArray(json.data)) {
                list = json.data;
            } else if (json && Array.isArray(json.result)) {
                list = json.result;
            }

            if (list) {
                parseCategoryList(list);
                log(`Data Loaded! ${courseStore.size} courses mapped.`);
            } else {
                console.error('API Response unexpected structure:', json);
            }
        } catch (e) {
            console.error('Failed to fetch/parse API:', e);
        }
    }

    function parseCategoryList(list) {
        if (!Array.isArray(list)) return;

        list.forEach(item => {
            // Check for videos in this item
            if (item.EduVideoList && Array.isArray(item.EduVideoList)) {
                item.EduVideoList.forEach(video => {
                    if (video.Title && video.Id) {
                        const title = video.Title.trim();
                        courseStore.set(title, {
                            id: video.Id,
                            // ClassHour seems to be in hours? If API says 1.5, implies 1.5 hours.
                            duration: (Number(video.ClassHour) || 1) * 3600
                        });
                    }
                });
            }

            // Recursively check children
            if (item.ChildList && Array.isArray(item.ChildList)) {
                parseCategoryList(item.ChildList);
            }
        });
    }

    /**
     * 2. Network Hook (Fetch) - ONLY for Auth Header
     */
    const originalFetch = unsafeWindow.fetch.bind(unsafeWindow);
    unsafeWindow.fetch = async function (input, init) {
        // Robust logic from old.js
        try {
            if (init && init.headers) {
                const h = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
                const a = h.get('Authorization');
                if (a) authHeader = a;
            }
        } catch (e) {}

        try {
            if (!authHeader && input && input.headers) {
                const h2 = input.headers instanceof Headers ? input.headers : new Headers(input.headers);
                const a2 = h2.get('Authorization');
                if (a2) authHeader = a2;
            }
        } catch (e) {}

        return originalFetch(input, init);
    };

    /**
     * 3. Logic: Send Learning Request
     */
    function learnCourse(courseId, durationSeconds, callbacks) {
        if (!authHeader) {
            callbacks.onError('无AuthToken, 请刷新');
            return;
        }

        const now = Date.now();
        const startTimeStr = new Date().toJSON().replace('T', ' ').slice(0, 19);
        const tParam = now + (durationSeconds * 1000);

        const url = `${CONFIG.apiBase}?educateCount=${courseId}&StartTime=${encodeURIComponent(startTimeStr)}&_t=${tParam}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json, text/plain, */*'
            },
            withCredentials: true,
            onload: function (res) {
                if (res.status >= 200 && res.status < 300) {
                    callbacks.onSuccess();
                } else {
                    callbacks.onError(`HTTP ${res.status}`);
                }
            },
            onerror: function (err) {
                callbacks.onError('网络错误');
            }
        });
    }

    /**
     * 4. UI: Inject Buttons
     */
    const UI = {
        init: function () {
            // Ensure body exists
            if (!document.body) {
                setTimeout(() => UI.init(), 100);
                return;
            }

            const target = document.body || document.documentElement;
            const observer = new MutationObserver((mutations) => {
                const rows = document.querySelectorAll('.institute-rows');
                rows.forEach(row => {
                    if (row.dataset.alInjected) return;
                    UI.injectRowButton(row);
                });

                const titleBlock = document.querySelector('.institute-title');
                if (titleBlock && !titleBlock.dataset.alInjected) {
                    UI.injectBatchButton(titleBlock);
                }
            });

            observer.observe(target, { childList: true, subtree: true });
        },

        injectBatchButton: function (container) {
            container.dataset.alInjected = 'true';
            const btn = document.createElement('button');
            btn.innerText = '🔥 一键学习本页';
            btn.style.cssText = 'margin-left: 15px; padding: 4px 12px; background: #e91e63; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';

            btn.onclick = async (e) => {
                e.stopPropagation();
                if(!confirm('确定要一键学习本页所有课程吗？')) return;
                const buttons = document.querySelectorAll('.al-row-btn');
                for (const b of buttons) {
                    if (b.innerText === '学习') {
                        b.click();
                        await new Promise(r => setTimeout(r, 500));
                    }
                }
            };
            container.appendChild(btn);
        },

        injectRowButton: function (row) {
            row.dataset.alInjected = 'true';

            // Get Title to lookup in Store
            const titleDiv = row.querySelector('.title');
            const title = titleDiv ? titleDiv.innerText.trim() : null;

            const btn = document.createElement('button');
            btn.className = 'al-row-btn';
            btn.innerText = '学习';
            btn.style.cssText = 'float: right; margin-right: 10px; padding: 4px 10px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; z-index: 999; position: absolute; top: 10px; right: 10px;';
            row.style.position = 'relative';

            btn.onclick = (e) => {
                e.stopPropagation();

                if (!title) {
                    btn.innerText = '无标题';
                    return;
                }

                const data = courseStore.get(title);
                if (!data) {
                    btn.innerText = '未找到ID';
                    btn.style.background = '#9E9E9E';
                    console.error('Course not found in store:', title);
                    return;
                }

                btn.innerText = 'Loading...';
                btn.disabled = true;

                learnCourse(data.id, data.duration, {
                    onSuccess: () => {
                        btn.innerText = '完成 ✅';
                        btn.style.background = '#4CAF50';
                    },
                    onError: (msg) => {
                        btn.innerText = `Err: ${msg}`;
                        btn.style.background = '#f44336';
                        btn.disabled = false;
                    }
                });
            };

            row.appendChild(btn);
        }
    };

    // Main
    // Fetch data immediately
    initData();

    // UI Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UI.init());
    } else {
        UI.init();
    }
})();
