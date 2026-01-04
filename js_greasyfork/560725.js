// ==UserScript==
// @name         Linux.do GIFT 抢码助手 (老板尊享版 v7.0)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  完美适配SPA跳转、自动扫描、可视化日志、自动刷新、防重复提交、状态记忆、可拖拽、可最小化。
// @author       您的专属程序员
// @match        https://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      cdk.hybgzs.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560725/Linuxdo%20GIFT%20%E6%8A%A2%E7%A0%81%E5%8A%A9%E6%89%8B%20%28%E8%80%81%E6%9D%BF%E5%B0%8A%E4%BA%AB%E7%89%88%20v70%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560725/Linuxdo%20GIFT%20%E6%8A%A2%E7%A0%81%E5%8A%A9%E6%89%8B%20%28%E8%80%81%E6%9D%BF%E5%B0%8A%E4%BA%AB%E7%89%88%20v70%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= ⚙️ 老板配置区域 =================

    const MAX_MINUTES = 10;      // 帖子发布时间阈值
    const REFRESH_INTERVAL = 10; // 自动刷新间隔 (秒)
    const TARGET_URL_KEYWORD = "search?q=GIFT"; // 只有URL包含这个才工作 (不区分大小写)

    const USER_COOKIES = {
        "__Host-authjs.csrf-token": "2e448456ced8c0661146f76b9048e2f9320b0c5dccc0df9e1fe948d2f5fd0fae|0c05c9560ea34a5407099b621d3b6467c21bd199370af3b168cf0b1867e031af",
        "__Secure-authjs.callback-url": "https://cdk.hybgzs.com/dashboard",
        "__Secure-authjs.session-token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiSmQybU84N3I1alZRX2ZtNTRPM1RJQjBpcUxaMGR3NmVSZ3NEQ0N5S052MGctTXJYTnphem5zLTZMNnhObXdqV3VBQ2cya0d6OFFfYlNCb2tfY3o2VUEifQ..sri2MeVG37oD6aWA7GmbzA.YSF-9EXKHWOGDkYg6HJAc5GhIjSylt5tvhDoEVfQw2xG_nZGYV9SXaRvjcSaENJrK30CAVjf3CtOczBFL9zxlI41jxVO3VsmRzYgowxSREmxFaY2v9EMQYyARTbki6JNXqPHgP4mJBALPFMG3aeIqEDIqfAszI1YQSu8FUjC-P-m6ikILZw4aNzq39asTFx7FKUNY_fn6B73Kg0C-H5g-NswuM3Fj0InqAwO5J0KXuxswIj3TFROG_mvd5e-3yHNttH5Gg571-uPSrVrv2la3Xac9pzvhNYbp8ke7bchhzRniWazyouRvg-mXvbMg5x-x_ILWA0MAB48EwG7iM9U4kM7FDdEPsQCqPQVfaS9Baq7G_JsdaExnS4xuwPnMkze8gOmFCoFUuNl6Mk6Atp1pienDtpvFZOfau0-XGxkE1KM-OmKKzJRVrrTlEV7k7rfpsZsDuik4aBA1Xemrn2CmroziJvejVi1Czj485UlPVCVeAww_M2DRpob6U0R55dsQ71v6o3TftB1Qn5CBhWXAg.KAVYym65MIeCS1NUrAKEfhlGot6KTbejWKfqTsdsTTM",
        "cf_clearance": "RFByX9n0CTnizw1TaHVIpaK_2Lyn8Ny65cHZuyNao4U-1767080023-1.2.1.1-FXLjngP2kGAmqBRE_6Gby1RPt17F4Iyx6SJntOOClYvV0m43pvStbSOhKK6Cd4245Y9w2nlz_t1.qnWe1oJzcM5SIhLuXM3wV24lUpL9XYiHivdnQSx7BXLNwuy9J9LmoXyxizJ4sPhq0_nHJS_jONrCAyY6NJPnnBOJH5mEwWnuvHYIkW2oLyGKJH1VJB.bp.By9oYjt2hVMIe9k8k714bW8JEmrU9wxjUmXghQbAI",
        "server_name_session": "d3f720203959cc0a12912969c1a9caa8",
        "userUUID": "cmjcmk5wv2i02oh7r0ooi8sko"
    };

    const API_URL = "https://cdk.hybgzs.com/api/cards/giftcode/claim";

    // ================= 🖥️ UI 界面构建 =================

    let logPanel, logContent, timerSpan, controlBtn, minBtn;

    // --- 状态记忆 ---
    let isRunning = GM_getValue('auto_refresh_status', true);
    let isMinimized = GM_getValue('panel_minimized', false);
    let panelPos = GM_getValue('panel_position', { top: '60px', left: 'auto', right: '20px' });

    let refreshTimer = null;
    let timeLeft = REFRESH_INTERVAL;

    // 路由监控变量
    let urlCheckInterval = null;
    let isPanelVisible = false;

    function initUI() {
        if (document.getElementById('gift-panel-v7')) return; // 防止重复创建

        logPanel = document.createElement('div');
        logPanel.id = 'gift-panel-v7';
        logPanel.style.cssText = `
            position: fixed;
            top: ${panelPos.top};
            left: ${panelPos.left};
            right: ${panelPos.right};
            width: 380px;
            height: ${isMinimized ? 'auto' : '500px'};
            background: rgba(0, 0, 0, 0.9); color: #00ff00; z-index: 99999;
            font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
            border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
            display: none; /* 默认隐藏，由路由控制显示 */
            flex-direction: column; border: 1px solid #444;
            transition: height 0.3s ease, opacity 0.3s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 10px; border-bottom: 1px solid #444;
            display: flex; align-items: center; justify-content: space-between;
            background: #1a1a1a; border-radius: 8px 8px 0 0;
            cursor: move; user-select: none;
        `;

        const title = document.createElement('span');
        title.innerHTML = `🤖 GIFT 终端 v7.0`;
        title.style.fontWeight = 'bold';
        title.style.pointerEvents = 'none';

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '8px';

        minBtn = document.createElement('button');
        minBtn.innerText = isMinimized ? "⬜" : "➖";
        minBtn.title = "最小化/展开";
        minBtn.style.cssText = `
            background: #444; color: white; border: none; padding: 4px 8px;
            border-radius: 4px; cursor: pointer; font-size: 10px;
        `;
        minBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMinimize();
        };

        controlBtn = document.createElement('button');
        controlBtn.style.cssText = `
            color: white; border: none; padding: 4px 10px;
            border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;
            transition: background 0.2s;
        `;
        controlBtn.onclick = (e) => {
            e.stopPropagation();
            toggleRunningState();
        };

        timerSpan = document.createElement('span');
        timerSpan.style.color = '#ffeb3b';
        timerSpan.style.minWidth = '40px';
        timerSpan.style.textAlign = 'right';

        updateControlUI();

        controls.appendChild(controlBtn);
        controls.appendChild(timerSpan);
        controls.appendChild(minBtn);
        header.appendChild(title);
        header.appendChild(controls);

        logContent = document.createElement('div');
        logContent.style.cssText = `
            flex: 1; overflow-y: auto; padding: 10px;
            white-space: pre-wrap; word-break: break-all;
            scrollbar-width: thin; scrollbar-color: #444 #1a1a1a;
            display: ${isMinimized ? 'none' : 'block'};
        `;

        logPanel.appendChild(header);
        logPanel.appendChild(logContent);
        document.body.appendChild(logPanel);

        makeDraggable(logPanel, header);
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            element.style.right = 'auto';
            element.style.left = `${initialLeft}px`;
            element.style.top = `${initialTop}px`;
            element.style.opacity = '0.8';

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.top = `${initialTop + dy}px`;
            element.style.left = `${initialLeft + dx}px`;
        }

        function onMouseUp() {
            isDragging = false;
            element.style.opacity = '1';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            GM_setValue('panel_position', {
                top: element.style.top,
                left: element.style.left,
                right: 'auto'
            });
        }
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        GM_setValue('panel_minimized', isMinimized);

        if (isMinimized) {
            logContent.style.display = 'none';
            logPanel.style.height = 'auto';
            minBtn.innerText = "⬜";
        } else {
            logContent.style.display = 'block';
            logPanel.style.height = '500px';
            minBtn.innerText = "➖";
        }
    }

    function updateControlUI() {
        if (isRunning) {
            controlBtn.innerText = "⏹ 停止";
            controlBtn.style.background = "#d32f2f";
            timerSpan.innerText = `⟳ ${timeLeft}s`;
        } else {
            controlBtn.innerText = "▶ 启动";
            controlBtn.style.background = "#388e3c";
            timerSpan.innerText = "暂停";
        }
    }

    function toggleRunningState() {
        isRunning = !isRunning;
        GM_setValue('auto_refresh_status', isRunning);
        updateControlUI();

        if (isRunning) {
            log("▶️ 系统已恢复运行", 'system');
            scanPage(); // 立即尝试扫描
        } else {
            log("⏸️ 系统已暂停", 'warn');
            stopAutoRefresh();
        }
    }

    function log(msg, type = 'info') {
        // 如果面板不可见，不记录日志，节省性能
        if (!isPanelVisible) return;

        const time = new Date().toLocaleTimeString();
        let color = '#00ff00';
        if (type === 'error') color = '#ff5252';
        if (type === 'warn') color = '#ffab40';
        if (type === 'system') color = '#b0bec5';

        const line = document.createElement('div');
        line.style.marginBottom = '4px';
        line.style.borderBottom = '1px dashed #333';
        line.style.paddingBottom = '2px';
        line.innerHTML = `<span style="color:#666">[${time}]</span> <span style="color:${color}">${msg}</span>`;

        logContent.appendChild(line);
        logContent.scrollTop = logContent.scrollHeight;
    }

    // ================= 🧠 核心逻辑 =================

    let history = GM_getValue('claimed_history', {});

    function cleanHistory() {
        const now = Date.now();
        let changed = false;
        for (let code in history) {
            if (now - history[code] > 24 * 60 * 60 * 1000) {
                delete history[code];
                changed = true;
            }
        }
        if (changed) GM_setValue('claimed_history', history);
    }

    function getCookieString(cookies) {
        return Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ');
    }

    function isWithinTimeLimit(text, limitMinutes) {
        if (!text) return false;
        if (text.includes('刚刚') || text.includes('just now')) return true;
        const secMatch = text.match(/(\d+)\s*(?:秒|sec)/);
        if (secMatch) return true;
        const minMatch = text.match(/(\d+)\s*(?:分钟|min)/);
        if (minMatch) return parseInt(minMatch[1], 10) <= limitMinutes;
        return false;
    }

    function claimGiftCode(code) {
        if (history[code]) {
            log(`跳过已处理: ${code}`, 'system');
            return;
        }

        log(`🚀 正在提交: ${code}`, 'warn');
        history[code] = Date.now();
        GM_setValue('claimed_history', history);

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Content-Type": "application/json",
                "Cookie": getCookieString(USER_COOKIES),
                "User-Agent": navigator.userAgent,
                "Origin": "https://cdk.hybgzs.com",
                "Referer": "https://cdk.hybgzs.com/dashboard"
            },
            data: JSON.stringify({ "code": code }),
            onload: function(response) {
                try {
                    const json = JSON.parse(response.responseText);
                    const resultStr = JSON.stringify(json);
                    if (response.status === 200) {
                        log(`✅ 成功 [${code}]: ${resultStr}`, 'info');
                    } else {
                        log(`❌ 失败 [${code}]: ${resultStr}`, 'error');
                    }
                } catch (e) {
                    log(`⚠️ 解析错误 [${code}]: ${response.responseText}`, 'error');
                }
            },
            onerror: function(err) {
                log(`❌ 网络错误 [${code}]`, 'error');
            }
        });
    }

    function stopAutoRefresh() {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }
    }

    function startAutoRefresh() {
        stopAutoRefresh();

        // 只有在运行状态 且 面板可见（意味着在正确的页面）时才倒计时
        if (!isRunning || !isPanelVisible) return;

        timeLeft = REFRESH_INTERVAL;
        if (timerSpan) timerSpan.innerText = `⟳ ${timeLeft}s`;

        refreshTimer = setInterval(() => {
            if (!isRunning || !isPanelVisible) {
                stopAutoRefresh();
                return;
            }

            timeLeft--;
            if (timerSpan) timerSpan.innerText = `⟳ ${timeLeft}s`;

            if (timeLeft <= 0) {
                stopAutoRefresh();
                log("🔄 正在刷新页面...", 'system');
                location.reload();
            }
        }, 1000);
    }

    function scanPage() {
        // 只有在运行状态 且 面板可见（意味着在正确的页面）时才扫描
        if (!isRunning || !isPanelVisible) return;

        cleanHistory();
        log(`开始扫描 (阈值: ${MAX_MINUTES}分钟)...`, 'system');

        const blurbs = document.querySelectorAll('div.blurb');
        let foundCount = 0;

        blurbs.forEach(blurb => {
            const resultContainer = blurb.closest('.fps-result');
            if (!resultContainer) return;

            const fullText = resultContainer.innerText;
            const timeTextMatch = fullText.match(/\d+\s*(?:分钟|秒|min|sec)|刚刚|just now/);
            const timeDisplay = timeTextMatch ? timeTextMatch[0] : "未知时间";

            if (isWithinTimeLimit(fullText, MAX_MINUTES)) {
                const regex = /GIFT-[A-Z0-9]+(?:-[A-Z0-9]+)+/g;
                const matches = fullText.match(regex);

                if (matches) {
                    matches.forEach(code => {
                        foundCount++;
                        log(`🔍 发现 [${timeDisplay}]: ${code}`);
                        claimGiftCode(code);
                    });
                }
            }
        });

        if (foundCount === 0) log("😴 未发现新码", 'system');

        startAutoRefresh();
    }

    // ================= 🕵️ 路由监控 =================

    function checkUrlAndRender() {
        const currentUrl = window.location.href;
        const isTargetPage = currentUrl.toLowerCase().includes(TARGET_URL_KEYWORD.toLowerCase());

        if (isTargetPage) {
            // 进入目标页面
            if (!isPanelVisible) {
                logPanel.style.display = 'flex';
                isPanelVisible = true;
                log("👋 检测到 GIFT 搜索页，面板已激活", 'system');

                // 如果之前是开启状态，恢复工作
                if (isRunning) {
                    // 稍微延迟一下，等待页面内容渲染
                    setTimeout(scanPage, 1000);
                }
            }
        } else {
            // 离开目标页面
            if (isPanelVisible) {
                logPanel.style.display = 'none';
                isPanelVisible = false;
                // 强制停止倒计时，防止在其他页面刷新
                stopAutoRefresh();
            }
        }
    }

    // ================= 🚀 启动 =================
    initUI();

    // 启动路由监控，每秒检查一次URL变化
    setInterval(checkUrlAndRender, 1000);

    // 首次运行检查
    checkUrlAndRender();

})();
