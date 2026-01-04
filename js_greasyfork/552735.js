// ==UserScript==
// @name         Bangumi 自动加小组
// @namespace    http://tampermonkey.net/
// @version      12.1
// @description  完全后台自动运行。常规扫描自动加入最新小组，定期进行一次深度全扫描
// @author       Sedoruee
// @match        https://bgm.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_openInTab
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552735/Bangumi%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%B0%8F%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/552735/Bangumi%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E5%B0%8F%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const CHECK_COOLDOWN = 5 * 60 * 1000;
    const INITIAL_DELAY = 10 * 1000;
    const FULL_SCAN_INTERVAL = 1 * 24 * 60 * 60 * 1000;
    const LAST_FULL_SCAN_KEY = 'bgm_autojoin_last_full_scan_v12';
    const PREVIOUS_HREFS_KEY = 'bgm_autojoin_previous_hrefs_v12';
    const LOCK_KEY = 'bgm_autojoin_lock_v12';
    const LOCK_UPDATE_INTERVAL = 10 * 1000;
    const LOCK_TTL = 30 * 1000;
    const ROUTINE_PAGES_TO_SCAN = 3;
    const MAX_FULL_SCAN_PAGES = 500;
    const TAB_ID = Date.now() + Math.random();

    let lastCheckTimestamp = 0;
    let isRunning = false;
    let initialTimeoutId = null;

    const log = (message) => console.log(`[BGM自动补全 v12.1] ${message}`);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function getGroupHrefs(url) {
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) { log(`错误: 无法访问页面 ${url}`); return new Set(); }
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const links = doc.querySelectorAll('#memberGroupList a[href*="/group/"]');
            const hrefs = new Set();
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.includes('/category/')) hrefs.add(href);
            });
            return hrefs;
        } catch (error) {
            log(`获取 ${url} 时出错: ${error.message}`);
            return new Set();
        }
    }

    function joinGroup(groupHref) {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            let timeoutId = setTimeout(() => { cleanup(); resolve({ status: 'TIMEOUT' }); }, 45000);
            const cleanup = () => { clearTimeout(timeoutId); if (iframe.parentNode) iframe.remove(); };

            iframe.onload = async () => {
                try {
                    const doc = iframe.contentDocument;
                    if (!doc || !doc.body || doc.body.innerHTML === '') return;
                    if (doc.querySelector('#groupJoinAction a[href*="/bye"]')) {
                        cleanup(); resolve({ status: 'ALREADY_JOINED' }); return;
                    }
                    const joinLink = doc.querySelector('#groupJoinAction a[href*="/join"]');
                    if (joinLink) {
                        await new Promise(res => { iframe.onload = res; joinLink.click(); });
                        const finalDoc = iframe.contentDocument;
                        if (finalDoc?.querySelector('#groupJoinAction a[href*="/bye"]')) {
                            cleanup(); resolve({ status: 'SUCCESS' });
                        } else {
                            cleanup(); resolve({ status: 'VERIFY_FAILED' });
                        }
                    } else {
                        cleanup(); resolve({ status: 'LOCKED_OR_NOT_FOUND' });
                    }
                } catch (e) {
                    cleanup(); resolve({ status: 'ERROR', message: e.message });
                }
            };
            iframe.onerror = () => { cleanup(); resolve({ status: 'ERROR', message: 'Iframe加载失败' }); };
            document.body.appendChild(iframe);
            iframe.src = groupHref;
        });
    }

    async function mainTask() {
        const now = Date.now();
        if (isRunning) { return; } // 如果任务已在运行，则直接退出
        if (now - lastCheckTimestamp < CHECK_COOLDOWN) {
            const timeLeft = Math.round((CHECK_COOLDOWN - (now - lastCheckTimestamp)) / 1000);
            log(`冷却中，剩余 ${timeLeft} 秒。`);
            return;
        }

        isRunning = true;
        let isFullScan = false; // 先声明，以便在finally块中使用
        log('开始新一轮检查...');

        try {
            const lastFullScan = await GM_getValue(LAST_FULL_SCAN_KEY, 0);
            isFullScan = now - lastFullScan > FULL_SCAN_INTERVAL;
            if (isFullScan) log('触发每周深度全扫描。');

            const username = document.querySelector('.idBadgerNeue a.avatar')?.href.split('/user/')[1];
            if (!username) { log('错误：未能获取当前用户名。'); return; }

            const myGroupsUrl = `https://bgm.tv/user/${username}/groups`;
            const myGroupsHrefs = await getGroupHrefs(myGroupsUrl);
            log(`已找到你加入了 ${myGroupsHrefs.size} 个小组。`);

            const allGroupHrefs = new Set();
            if (isFullScan) {
                for (let i = 1; i <= MAX_FULL_SCAN_PAGES; i++) {
                    log(`正在进行全扫描，第 ${i} 页...`);
                    const pageHrefs = await getGroupHrefs(`https://bgm.tv/group/all?page=${i}`);
                    if (pageHrefs.size === 0) { log(`在第 ${i} 页未发现小组，全扫描结束。`); break; }
                    pageHrefs.forEach(href => allGroupHrefs.add(href));
                    await sleep(1000);
                }
            } else {
                for (let i = 1; i <= ROUTINE_PAGES_TO_SCAN; i++) {
                    const pageHrefs = await getGroupHrefs(`https://bgm.tv/group/all?page=${i}`);
                    pageHrefs.forEach(href => allGroupHrefs.add(href));
                    await sleep(500);
                }
            }
            log(`扫描完成，共获取到 ${allGroupHrefs.size} 个唯一小组链接。`);

            const previousHrefsRaw = await GM_getValue(PREVIOUS_HREFS_KEY, '[]');
            const previousHrefs = new Set(JSON.parse(previousHrefsRaw));

            if (previousHrefs.size === 0) {
                log('首次运行，将当前小组链接列表设为基准。');
                await GM_setValue(PREVIOUS_HREFS_KEY, JSON.stringify([...allGroupHrefs]));
                return;
            }

            const toJoinHrefs = [...allGroupHrefs].filter(href => !myGroupsHrefs.has(href) && !previousHrefs.has(href));

            if (toJoinHrefs.length > 0) {
                log(`发现 ${toJoinHrefs.length} 个新小组，开始处理...`);
                for (const [index, href] of toJoinHrefs.entries()) {
                    log(`--- [${index + 1}/${toJoinHrefs.length}] 尝试加入: ${href} ---`);
                    const result = await joinGroup(href);
                    log(result.status === 'SUCCESS' ? `✔ 成功加入 ${href}` : `ⓘ 跳过 ${href}，原因: ${result.status}`);
                    await sleep(3000);
                }
            } else {
                log('没有发现需要新加入的小组。');
            }

            await GM_setValue(PREVIOUS_HREFS_KEY, JSON.stringify([...allGroupHrefs]));

        } catch (error) {
            log(`主任务发生严重错误: ${error.message}`);
        } finally {
            // **关键改动：在任务完全结束后才更新时间戳**
            isRunning = false;
            lastCheckTimestamp = Date.now();
            if (isFullScan) {
                log('全扫描任务已完成，正在更新全扫描时间戳...');
                await GM_setValue(LAST_FULL_SCAN_KEY, lastCheckTimestamp);
            }
            log('本轮检查结束，进入静止和冷却状态。');
        }
    }

    // --- 触发器 ---
    function scheduleInitialCheck() {
        if (initialTimeoutId) clearTimeout(initialTimeoutId);
        log(`页面加载，将在 ${INITIAL_DELAY / 1000} 秒后尝试触发检查...`);
        initialTimeoutId = setTimeout(mainTask, INITIAL_DELAY);
    }

    async function main() {
        async function acquireLock() {
            const lock = JSON.parse(await GM_getValue(LOCK_KEY, '{}'));
            const now = Date.now();
            if (!lock.id || (now - lock.timestamp > LOCK_TTL)) {
                await GM_setValue(LOCK_KEY, JSON.stringify({ id: TAB_ID, timestamp: now }));
                return true;
            }
            if (lock.id === TAB_ID) {
                await GM_setValue(LOCK_KEY, JSON.stringify({ id: TAB_ID, timestamp: now }));
                return true;
            }
            return false;
        }

        if (await acquireLock()) {
            log('当前标签页已成为主控，哨兵启动。');
            setInterval(acquireLock, LOCK_UPDATE_INTERVAL);
            scheduleInitialCheck();
            setInterval(mainTask, CHECK_COOLDOWN);
        } else {
            log('已存在主控标签页，当前标签页进入休眠。');
        }
    }

    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

})();