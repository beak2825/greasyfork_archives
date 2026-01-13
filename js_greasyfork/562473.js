// ==UserScript==
// @name         Google MyActivity Keyword Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.4.20260113.1000
// @description  Clean Google MyActivity history based on keywords.
// @author       You
// @match        https://myactivity.google.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562473/Google%20MyActivity%20Keyword%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/562473/Google%20MyActivity%20Keyword%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === I18n Logic ===
    // Detect page language from <html lang="..."> attribute, fallback to navigator
    const pageLang = document.documentElement.lang.toLowerCase();
    const LANG = (pageLang.startsWith('zh') || navigator.language.startsWith('zh')) ? 'zh' : 'en';

    const TRANSLATIONS = {
        zh: {
            title: '清理器配置',
            resetTotal: '重置',
            confirmReset: '确认重置累计删除总数吗？',
            keywordLabel: '关键词 (匹配 Aria-Label):',
            session: '本次会话',
            total: '累计总数',
            ready: '就绪',
            start: '开始清理',
            stop: '停止',
            alertKeyword: '请输入关键词！',
            scanning: '正在扫描: ',
            scrolling: '正在滚动加载...',
            finished: '已完成！检查中...',
            completed: '已完成所有清理',
            stopped: '已停止',
            running: '清理中... 已删除: ',
            errorTooMany: '🚫 连续错误过多，已紧急停止。请检查验证码或页面。',
            deleteTriggers: ['删除', 'Delete', 'Remove']  // Robust keywords for button detection
        },
        en: {
            title: 'Cleaner Config',
            resetTotal: 'Reset',
            confirmReset: 'Reset total cumulative count?',
            keywordLabel: 'Keyword (Aria-Label match):',
            session: 'SESSION',
            total: 'TOTAL',
            ready: 'Ready',
            start: 'Start Cleaning',
            stop: 'Stop',
            alertKeyword: 'Please enter a keyword!',
            scanning: 'Scanning for: ',
            scrolling: 'Scrolling to load more...',
            finished: 'Finished! Checking...',
            completed: 'Cleaning Completed',
            stopped: 'Stopped',
            running: 'Running... Deleted: ',
            errorTooMany: '🚫 Too many consecutive errors. Auto-stopped. Check captcha.',
            deleteTriggers: ['Delete', 'Remove', '删除']
        }
    };

    function t(key) {
        return TRANSLATIONS[LANG][key] || TRANSLATIONS['en'][key] || key;
    }

    // === UI Logic ===
    const UI_ID = 'gmkc-ui-panel';
    let isRunning = false;
    let sessionDeleted = 0;
    let consecutiveErrors = 0;

    // Inject Styles including animations
    const styles = `
        @keyframes gmkc-pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        .gmkc-running-indicator {
            width: 8px;
            height: 8px;
            background-color: #34a853;
            border-radius: 50%;
            display: inline-block;
            margin-right: 6px;
            animation: gmkc-pulse 2s infinite ease-in-out;
        }
        .gmkc-glass {
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(10px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(10px) saturate(180%) !important;
        }
        .gmkc-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        .gmkc-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        }
        .gmkc-btn:active {
            transform: translateY(0);
        }
        #gmkc-keyword-input:focus {
            border-color: #1a73e8 !important;
            box-shadow: 0 0 0 2px rgba(26,115,232,0.2) !important;
        }
    `;

    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Create UI Panel
    function createUI() {
        if (document.getElementById(UI_ID)) return;
        injectStyles();

        const panel = document.createElement('div');
        panel.id = UI_ID;
        panel.className = 'gmkc-glass';
        panel.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 240px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            padding: 16px;
            z-index: 10000;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #202124;
        `;

        // Title Row
        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.justifyContent = 'space-between';
        titleRow.style.alignItems = 'center';
        titleRow.style.marginBottom = '16px';

        const titleText = document.createElement('div');
        titleText.style.display = 'flex';
        titleText.style.alignItems = 'center';

        const indicator = document.createElement('span');
        indicator.id = 'gmkc-indicator';
        indicator.style.display = 'none';
        indicator.className = 'gmkc-running-indicator';
        titleText.appendChild(indicator);

        const title = document.createElement('span');
        title.textContent = t('title');
        title.style.fontWeight = '600';
        title.style.fontSize = '15px';
        titleText.appendChild(title);
        titleRow.appendChild(titleText);

        const resetTotalBtn = document.createElement('button');
        resetTotalBtn.textContent = t('resetTotal');
        resetTotalBtn.className = 'gmkc-btn';
        resetTotalBtn.style.cssText = `
            font-size: 11px;
            padding: 4px 8px;
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 6px;
            background: rgba(0,0,0,0.03);
            color: #5f6368;
        `;
        resetTotalBtn.onclick = () => {
            if (confirm(t('confirmReset'))) {
                GM_setValue('totalDeleted', 0);
                updateCounts();
            }
        };
        titleRow.appendChild(resetTotalBtn);
        panel.appendChild(titleRow);

        // Keyword Input
        const inputGroup = document.createElement('div');
        inputGroup.style.marginBottom = '16px';

        const label = document.createElement('label');
        label.textContent = t('keywordLabel');
        label.style.display = 'block';
        label.style.marginBottom = '6px';
        label.style.fontSize = '12px';
        label.style.color = '#5f6368';
        inputGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'gmkc-keyword-input';
        input.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border-radius: 8px;
            border: 1px solid #dadce0;
            box-sizing: border-box;
            outline: none;
            font-size: 13px;
            transition: all 0.2s;
            background: rgba(255,255,255,0.7);
        `;
        input.value = GM_getValue('lastKeyword', 'Role: Professional Bilibili');
        inputGroup.appendChild(input);
        panel.appendChild(inputGroup);

        // Stats Box
        const statsBox = document.createElement('div');
        statsBox.style.cssText = `
            display: flex;
            background: rgba(26, 115, 232, 0.04);
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 16px;
            border: 1px solid rgba(26, 115, 232, 0.1);
        `;

        function createStat(id, labelKey, color) {
            const container = document.createElement('div');
            container.style.flex = '1';
            container.style.textAlign = 'center';

            const label = document.createElement('div');
            label.style.fontSize = '10px';
            label.style.color = '#5f6368';
            label.style.textTransform = 'uppercase';
            label.style.letterSpacing = '0.5px';
            label.textContent = t(labelKey);

            const val = document.createElement('div');
            val.id = id;
            val.style.fontSize = '20px';
            val.style.fontWeight = '700';
            val.style.color = color;
            val.textContent = '0';

            container.appendChild(label);
            container.appendChild(val);
            return container;
        }

        statsBox.appendChild(createStat('gmkc-session-count', 'session', '#1a73e8'));
        const divider = document.createElement('div');
        divider.style.width = '1px';
        divider.style.background = '#dadce0';
        divider.style.margin = '0 12px';
        statsBox.appendChild(divider);
        statsBox.appendChild(createStat('gmkc-total-count', 'total', '#202124'));
        panel.appendChild(statsBox);

        // Status Text
        const statusText = document.createElement('div');
        statusText.id = 'gmkc-status-text';
        statusText.textContent = t('ready');
        statusText.style.fontSize = '12px';
        statusText.style.color = '#5f6368';
        statusText.style.marginBottom = '16px';
        statusText.style.textAlign = 'center';
        statusText.style.fontWeight = '500';
        panel.appendChild(statusText);

        // Action Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'gmkc-toggle-btn';
        toggleBtn.textContent = t('start');
        toggleBtn.className = 'gmkc-btn';
        toggleBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            cursor: pointer;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        `;
        toggleBtn.onclick = () => {
            if (isRunning) stopCleaner();
            else startCleaner();
        };
        panel.appendChild(toggleBtn);

        document.body.appendChild(panel);
        updateCounts();
    }

    function updateCounts() {
        const sessionEl = document.getElementById('gmkc-session-count');
        const totalEl = document.getElementById('gmkc-total-count');
        if (sessionEl) sessionEl.textContent = sessionDeleted;
        if (totalEl) totalEl.textContent = GM_getValue('totalDeleted', 0);
    }

    function updateStatusUI(running, text) {
        const toggleBtn = document.getElementById('gmkc-toggle-btn');
        const indicator = document.getElementById('gmkc-indicator');
        const statusText = document.getElementById('gmkc-status-text');
        const keywordInput = document.getElementById('gmkc-keyword-input');

        if (toggleBtn) {
            toggleBtn.textContent = running ? t('stop') : t('start');
            toggleBtn.style.background = running ? '#ea4335' : '#1a73e8';
        }
        if (indicator) indicator.style.display = running ? 'inline-block' : 'none';
        if (statusText) {
            statusText.textContent = text || (running ? t('running') : t('ready'));
            statusText.style.color = running ? '#1a73e8' : '#5f6368';
        }
        if (keywordInput) {
            keywordInput.disabled = running;
            keywordInput.style.opacity = running ? '0.7' : '1';
            keywordInput.style.cursor = running ? 'not-allowed' : 'text';
        }
    }

    // === Core Logic ===
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function startCleaner() {
        if (isRunning) return;
        const input = document.getElementById('gmkc-keyword-input');
        const keyword = input.value.trim();
        if (!keyword) { alert(t('alertKeyword')); return; }

        GM_setValue('lastKeyword', keyword);
        isRunning = true;
        sessionDeleted = 0;
        consecutiveErrors = 0;
        updateCounts();
        updateStatusUI(true, t('scanning') + `"${keyword}"...`);

        while (isRunning) {
            const keepGoing = await processLoop(keyword);
            if (!keepGoing && isRunning) {
                updateStatusUI(true, t('finished'));
                await sleep(2000);
                if (document.body.scrollHeight <= window.scrollY + 1000) {
                    stopCleaner(t('completed'));
                    break;
                }
            }
            await sleep(1000);
        }
    }

    function stopCleaner(reason) {
        isRunning = false;
        updateStatusUI(false, reason || t('stopped'));
    }

    async function processLoop(keyword) {
        if (!isRunning) return false;

        const lowerTriggers = [
            ...TRANSLATIONS[LANG].deleteTriggers,
            "remove", "dismiss", "x", "关闭", "移除", "取消", "dismiss activity"
        ].map(t => t.toLowerCase());

        const normalize = (str) => (str || "").toLowerCase().trim().replace(/：/g, ':');
        const searchKeyword = normalize(keyword);

        // Find all interactive elements with labels
        const allPotential = Array.from(document.querySelectorAll('button[aria-label], [role="button"][aria-label], a[aria-label]'));

        const targetButtons = allPotential.filter(btn => {
            const label = normalize(btn.getAttribute('aria-label'));
            const isDeleteBtn = lowerTriggers.some(t => label.includes(t));
            if (!isDeleteBtn) return false;

            // Check 1: In button's label
            if (label.includes(searchKeyword)) return true;

            // Check 2: In button's visible text or title (Using textContent for speed)
            if (normalize(btn.textContent).includes(searchKeyword)) return true;
            if (normalize(btn.title).includes(searchKeyword)) return true;

            // Check 3: Deep ancestor scan (15 levels, optimized with textContent)
            let current = btn.parentElement;
            for (let i = 0; i < 15; i++) {
                if (!current || current.tagName === 'BODY' || current.tagName === 'HTML') break;
                // textContent is 10-100x faster than innerText as it doesn't trigger layout
                const text = normalize(current.textContent);
                if (text.includes(searchKeyword) && text.length < 5000) return true;
                current = current.parentElement;
            }
            return false;
        });

        if (!isRunning) return false;
        console.log(`🔍 [GMKC] Found ${targetButtons.length} targets for "${keyword}" (Scanned ${allPotential.length} candidates).`);

        if (targetButtons.length === 0) {
            window.scrollTo(0, document.body.scrollHeight);
            console.log("⬇️ Loading more...");
            updateStatusUI(true, t('scrolling'));
            await sleep(2000);
            return isRunning && document.body.scrollHeight > window.scrollY + 1000;
        }

        for (const btn of targetButtons) {
            if (!isRunning) return false;

            try {
                if (!btn.isConnected) continue;

                btn.style.outline = "3px solid #ea4335";
                btn.style.borderRadius = "50%";
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(300);
                if (!isRunning) return false;

                const label = btn.getAttribute('aria-label');
                console.log(`🗑️ Deleting: ${label.substring(0, 50)}...`);

                btn.click();
                if (!isRunning) return false;

                consecutiveErrors = 0; // Reset on success
                sessionDeleted++;
                GM_setValue('totalDeleted', GM_getValue('totalDeleted', 0) + 1);

                updateCounts();
                updateStatusUI(true, t('running') + sessionDeleted);

                await sleep(800);
            } catch (e) {
                console.error("❌ Delete failed:", e);
                consecutiveErrors++;
                if (consecutiveErrors >= 3) {
                    stopCleaner(t('errorTooMany'));
                    return false;
                }
            }
        }
        return isRunning;
    }

    // Initialize
    window.addEventListener('load', () => setTimeout(createUI, 1500));
    if (document.readyState === 'complete') setTimeout(createUI, 500);

})();
