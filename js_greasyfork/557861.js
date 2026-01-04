// ==UserScript==
// @name         蜜柑计划评分显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  评分显示
// @author       CNOS
// @match        https://mikanani.me/*
// @connect      mikanani.me
// @connect      bgm.tv
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557861/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E8%AF%84%E5%88%86%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557861/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E8%AF%84%E5%88%86%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        requestInterval: 1500, // 抓取间隔 1.5秒
        cacheExpiry: 15 * 24 * 60 * 60 * 1000, // 缓存15天
        retryLimit: 2,
        style: `
            /* 评分标签样式 */
            .bgm-score-tag {
                position: absolute;
                /*
                   核心修复逻辑：
                   锚定在文字区域(.an-info)的顶部(top:0)，
                   然后通过 translateY(-100%) 向上位移自身的全部高度。
                   这样它就会精准地贴在封面图的右下角，而不会触碰封面图本身。
                */
                top: 0;
                right: 0;
                transform: translateY(-100%);

                background: rgba(0, 0, 0, 0.85);
                color: #ff4d4d;
                font-weight: 900;
                font-size: 14px;
                padding: 2px 8px;
                border-top-left-radius: 6px;
                z-index: 20; /* 确保浮在图片上面 */
                font-family: Arial, sans-serif;
                pointer-events: none;
                line-height: normal;
                box-shadow: -1px -1px 2px rgba(0,0,0,0.3);
            }

            /* 确保文字区域是定位基准 */
            .an-info {
                position: relative !important;
                overflow: visible !important; /* 允许标签浮出区域显示在图片上 */
            }
        `
    };

    GM_addStyle(CONFIG.style);

    // ================= 缓存系统 =================
    const Cache = {
        get: (id) => {
            const data = GM_getValue(`bgm_score_${id}`);
            if (!data) return null;
            if (Date.now() - data.timestamp > CONFIG.cacheExpiry) return null;
            return data.score;
        },
        set: (id, score) => {
            GM_setValue(`bgm_score_${id}`, {
                score: score,
                timestamp: Date.now()
            });
        }
    };

    // ================= 任务队列 =================
    const queue = [];
    let isRunning = false;

    function enqueueTask(mikanId, infoElement) {
        const cachedScore = Cache.get(mikanId);
        if (cachedScore) {
            renderScore(infoElement, cachedScore);
            return;
        }

        // 查重
        if (!queue.some(t => t.id === mikanId)) {
            queue.push({ id: mikanId, el: infoElement, retries: 0 });
            runQueue();
        }
    }

    async function runQueue() {
        if (isRunning || queue.length === 0) return;
        isRunning = true;

        const task = queue.shift();

        try {
            const score = await fetchFullChain(task.id);
            Cache.set(task.id, score);
            renderScore(task.el, score);
        } catch (err) {
            console.error(`[BGM Fetcher] ID: ${task.id} Error:`, err);
            if (task.retries < CONFIG.retryLimit) {
                task.retries++;
                queue.push(task);
            } else {
                Cache.set(task.id, "Err");
            }
        } finally {
            setTimeout(() => {
                isRunning = false;
                runQueue();
            }, CONFIG.requestInterval);
        }
    }

    // ================= 网络请求 =================
    function request(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 15000,
                headers: { "Referer": "https://mikanani.me/" },
                onload: (res) => {
                    if (res.status >= 200 && res.status < 400) resolve(res.responseText);
                    else reject(`HTTP ${res.status}`);
                },
                onerror: reject,
                ontimeout: reject
            });
        });
    }

    async function fetchFullChain(mikanId) {
        // 1. 获取 Mikan 详情页
        const htmlB = await request(`https://mikanani.me/Home/Bangumi/${mikanId}`);

        // 2. 提取 BGM 链接
        const bgmLinkMatch = htmlB.match(/href="(https?:\/\/bgm\.tv\/subject\/\d+)"/);
        if (!bgmLinkMatch) return "";

        // 3. 获取 BGM 详情页
        const htmlC = await request(bgmLinkMatch[1]);

        // 4. 提取评分
        const scoreMatch = htmlC.match(/property="v:average">([\d\.]+)<\/span>/);
        return scoreMatch ? scoreMatch[1] : "N/A";
    }

    // ================= 渲染 =================
    function renderScore(container, score) {
        if (container.querySelector('.bgm-score-tag')) return;
        if (!score || score === "Err" || score === "") return;

        const tag = document.createElement('div');
        tag.className = 'bgm-score-tag';
        tag.innerText = score;
        container.appendChild(tag);
    }

    // ================= 初始化 =================
    function init() {
        const scan = () => {
            // 我们依然寻找带有 id 的封面元素，但我们操作的是它的兄弟元素 .an-info
            const coverSpans = document.querySelectorAll('.js-expand_bangumi[data-bangumiid]');

            coverSpans.forEach(span => {
                if (span.dataset.bgmHandled) return;
                span.dataset.bgmHandled = "true";

                const id = span.getAttribute('data-bangumiid');
                // 找到同级的 .an-info 容器 (封面图的下一个兄弟节点通常是 .an-info)
                const parentLi = span.closest('li');
                if (!parentLi) return;

                const infoDiv = parentLi.querySelector('.an-info');

                if (id && infoDiv) {
                    enqueueTask(id, infoDiv);
                }
            });
        };

        scan();

        // 监听动态加载（支持周一到周日所有 Tab 切换）
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            mutations.forEach(m => {
                if (m.addedNodes.length > 0) shouldScan = true;
            });
            if (shouldScan) scan();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();