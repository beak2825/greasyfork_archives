// ==UserScript==
// @name         知学云自动化学习辅助工具-V1.0.3稳定版
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  适配 Vue+AntDesign 架构。
// @author       Advanced_JS_Bot
// @match        *://kc.zhixueyun.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557317/%E7%9F%A5%E5%AD%A6%E4%BA%91%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-V103%E7%A8%B3%E5%AE%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/557317/%E7%9F%A5%E5%AD%A6%E4%BA%91%E8%87%AA%E5%8A%A8%E5%8C%96%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-V103%E7%A8%B3%E5%AE%9A%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window !== window.top) return;

    // === 配置参数 ===
    const CONFIG = {
        heartbeat: 3000,
        maxBtnTextLength: 20,
        keywords: {
            start: ['开始学习', '继续学习'],
            more: ['查看更多', '加载更多', 'More'],
            popup: ['知道', '关闭', '继续', '下一节']
        },
        excludeWords: ['未完成', '已完成', '学时', '状态', '时间', '必修', '选修'],
        selectors: {
            iframe: '#paasIframe',
            clickable: '.ant-btn, button, .btn, a, div[role="button"], span, div'
        }
    };

    const STATE = {
        isClicking: false,
        learningStarted: false, // 核心标志：是否正在学习
        statusText: '初始化...',
        docCount: 0,
        blockedCourses: {}
    };

    // === 课程锁定机制 (辅助防止短期重复) ===
    const blockCourse = (text) => {
        STATE.blockedCourses[text] = Date.now() + 60000;
        const stored = JSON.parse(sessionStorage.getItem('zxy_blocked_list') || '{}');
        stored[text] = Date.now() + 60000;
        sessionStorage.setItem('zxy_blocked_list', JSON.stringify(stored));
    };

    const isBlocked = (text) => {
        const now = Date.now();
        if (STATE.blockedCourses[text] && STATE.blockedCourses[text] > now) return true;
        const stored = JSON.parse(sessionStorage.getItem('zxy_blocked_list') || '{}');
        if (stored[text] && stored[text] > now) return true;
        return false;
    };

    const getBlockedCount = () => {
        const now = Date.now();
        const stored = JSON.parse(sessionStorage.getItem('zxy_blocked_list') || '{}');
        let count = 0;
        for (let k in stored) {
            if (stored[k] > now) count++;
        }
        return count;
    };

    // === 状态面板 (UI) ===
    const createStatusPanel = () => {
        let panel = document.getElementById('zxy_status_panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'zxy_status_panel';
            Object.assign(panel.style, {
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: '999999',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '12px',
                pointerEvents: 'none',
                userSelect: 'none',
                lineHeight: '1.6',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                fontFamily: 'monospace'
            });
            document.body.appendChild(panel);
        }
        return panel;
    };

    const updateStatus = (text, subText = '') => {
        const panel = createStatusPanel();
        STATE.statusText = text;
        const blockedCount = getBlockedCount();
        panel.innerHTML = `
            <div style="color: #00BFFF; font-weight: bold; border-bottom: 1px solid #555; margin-bottom: 5px;">知学云自动化学习辅助工具-V1.0.3</div>
            <div>状态: <span style="color: #32CD32">${text}</span></div>
            <div>${subText || `文档: ${STATE.docCount} | 锁定: ${blockedCount}`}</div>
        `;
    };

    const log = (msg, type = 'info') => {
        const colors = { success: '#32CD32', warn: '#FFA500', error: '#FF0000', info: '#00BFFF' };
        console.log(`%c[全自动刷课] ${msg}`, `color: ${colors[type] || colors.info}; font-weight: bold;`);
    };

    const checkCoolDown = () => {
        const lastClick = sessionStorage.getItem('zxy_last_click_time');
        if (lastClick && Date.now() - parseInt(lastClick) < 3000) return true;
        return false;
    };

    const getAllDocuments = () => {
        const docs = [document];
        const paasIframe = document.querySelector(CONFIG.selectors.iframe) || document.querySelector('iframe[src*="paas"]');
        if (paasIframe) {
            try {
                const iDoc = paasIframe.contentDocument || paasIframe.contentWindow.document;
                if (iDoc) docs.push(iDoc);
            } catch (e) {}
        }
        document.querySelectorAll('iframe').forEach(ifr => {
            if (ifr !== paasIframe) {
                try {
                    const iDoc = ifr.contentDocument || ifr.contentWindow.document;
                    if (iDoc && !docs.includes(iDoc)) docs.push(iDoc);
                } catch (e) {}
            }
        });
        STATE.docCount = docs.length;
        return docs;
    };

    const findInteractiveParent = (element) => {
        const target = element.closest('button, a, .ant-btn, input[type="button"]');
        if (target && !target.disabled) return target;
        let current = element;
        try {
            const win = element.ownerDocument.defaultView || window;
            for (let i = 0; i < 3; i++) {
                if (!current || current === element.ownerDocument.body) break;
                const style = win.getComputedStyle(current);
                if (style.cursor === 'pointer' || current.getAttribute('role') === 'button') {
                    return current;
                }
                current = current.parentElement;
            }
        } catch (e) {}
        return element;
    };

    const simulateClick = (element) => {
        if (!element) return;
        log(`点击 -> [${element.innerText.replace(/\s+/g, '')}]`, 'info');
        updateStatus(`正在打开: ${element.innerText.substring(0, 8)}...`);
        try {
            if (['BUTTON', 'A', 'INPUT'].includes(element.tagName)) {
                element.click();
            } else {
                element.click();
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, buttons: 1 }));
            }
        } catch(e) {}
    };

    const matchesKeyword = (text, keywords) => {
        if (!text) return false;
        text = text.trim();
        if (CONFIG.excludeWords.some(bad => text.includes(bad))) return false;
        return text.length > 1 && text.length <= CONFIG.maxBtnTextLength && keywords.some(kw => text.includes(kw));
    };

    // === 核心：列表页处理逻辑 ===
    const handleListPage = (docs) => {
        // 1. 如果已经开始学习，强制停止扫描
        if (STATE.learningStarted) {
            updateStatus('正在学习中...', '等待视频关闭...');
            return; // 终止后续逻辑
        }

        if (checkCoolDown()) {
            updateStatus('冷却中...', '防止连点');
            return;
        }

        let potentialTargets = [];

        for (const doc of docs) {
            const elements = Array.from(doc.querySelectorAll(CONFIG.selectors.clickable));
            elements.forEach(el => {
                if (el.offsetParent === null) return;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) return;

                const text = el.innerText || el.textContent || "";

                if (matchesKeyword(text, CONFIG.keywords.start)) {
                    if (CONFIG.excludeWords.some(bad => text.includes(bad))) return;
                    if (isBlocked(text.trim())) return; // 检查锁定

                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        potentialTargets.push({ element: el, top: rect.top, text: text.trim(), tagName: el.tagName });
                    }
                }
            });
        }

        updateStatus(potentialTargets.length > 0 ? '发现未学课程' : '扫描中...', potentialTargets.length);

        if (potentialTargets.length > 0) {
            potentialTargets.sort((a, b) => {
                const tagScore = { 'BUTTON': 0, 'A': 1, 'SPAN': 2, 'DIV': 3 };
                const scoreA = tagScore[a.tagName] ?? 4;
                const scoreB = tagScore[b.tagName] ?? 4;
                if (scoreA !== scoreB) return scoreA - scoreB;
                const diffTop = a.top - b.top;
                if (diffTop < -10) return -1;
                if (diffTop > 10) return 1;
                return a.text.length - b.text.length;
            });

            const bestCandidate = potentialTargets[0].element;
            const bestText = potentialTargets[0].text;
            const realBtn = findInteractiveParent(bestCandidate);

            if (realBtn) {
                log(`锁定并点击: "${bestText}"`, 'success');
                blockCourse(bestText);

                // === 关键操作：标记开始学习 ===
                STATE.isClicking = true;
                STATE.learningStarted = true;
                sessionStorage.setItem('zxy_last_click_time', Date.now());

                // 重置心跳，防止误判之前的残留心跳
                localStorage.setItem('zxy_player_heartbeat', '0');

                simulateClick(realBtn);
            }
            return;
        }

        // 加载更多
        for (const doc of docs) {
            const elements = Array.from(doc.querySelectorAll(CONFIG.selectors.clickable));
            const moreBtn = elements.find(el => {
                if (el.offsetParent === null) return false;
                const text = el.innerText || "";
                return !CONFIG.excludeWords.some(bad => text.includes(bad)) &&
                       matchesKeyword(text.replace(/\s/g, ''), CONFIG.keywords.more);
            });

            if (moreBtn) {
                const realBtn = findInteractiveParent(moreBtn);
                updateStatus('点击加载更多');
                STATE.isClicking = true;
                simulateClick(realBtn);
                setTimeout(() => { STATE.isClicking = false; }, 3000);
                return;
            }
        }
    };

    // === 播放页处理逻辑 ===
    const handlePlayerPage = (docs) => {
        updateStatus('视频播放中...');

        // === 发送心跳信号 (告诉列表页我还在) ===
        localStorage.setItem('zxy_player_heartbeat', Date.now());

        let videoFound = false;
        for (const doc of docs) {
            const video = doc.querySelector('video');
            if (video) {
                videoFound = true;
                if (video.paused) {
                    video.muted = true;
                    video.play().catch(()=>{});
                }
            }
        }

        docs.forEach(doc => {
            const allTexts = Array.from(doc.querySelectorAll('span, div, button'));
            const popupBtn = allTexts.find(el => {
                 const t = el.innerText;
                 return t && t.length < 10 && matchesKeyword(t, CONFIG.keywords.popup) && el.offsetParent !== null;
            });
            if (popupBtn) {
                updateStatus('关闭弹窗');
                simulateClick(findInteractiveParent(popupBtn));
            }

            const textContent = doc.body.innerText || "";
            if (textContent.includes('本节播放结束') || textContent.includes('学完当前课程')) {
                 log('本节完成，即将关闭窗口...', 'success');
                 updateStatus('完成，准备刷新列表');

                 // 1. 尝试刷新父页面 (列表页)
                 try {
                     if(window.opener) window.opener.location.reload();
                 } catch(e) {}

                 // 2. 关闭自己
                 setTimeout(() => window.close(), 500);
            }
        });
    };

    // === 监听页面可见性 (列表页刷新逻辑 - 心跳增强版) ===
    document.addEventListener('visibilitychange', () => {
        // 只有当页面重新可见，且处于学习状态时才检查
        if (!document.hidden && STATE.learningStarted) {

            // 检查心跳
            const lastBeat = parseInt(localStorage.getItem('zxy_player_heartbeat') || '0');
            const timeDiff = Date.now() - lastBeat;

            // 如果心跳在 6秒内，说明视频页还在运行，此时不刷新！
            if (timeDiff < 6000) {
                log('检测到视频页仍在前台运行，暂不刷新列表', 'info');
                updateStatus('视频播放中，暂不刷新');
                return;
            }

            log('检测到视频页已关闭 (心跳中断)，执行刷新...', 'warn');
            updateStatus('学习结束，刷新列表...');
            setTimeout(() => window.location.reload(), 500);
        }
    });

    const mainTick = () => {
        const docs = getAllDocuments();
        if (window.location.href.includes('course/detail') || window.location.href.includes('play')) {
            handlePlayerPage(docs);
        } else {
            handleListPage(docs);
        }
    };

    log('全自动刷课脚本 v1.0.3 已启动 (Heartbeat Mode)', 'success');
    setInterval(mainTick, CONFIG.heartbeat);

})();