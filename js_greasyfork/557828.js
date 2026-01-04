// ==UserScript==
// @name         linux.do原地回复--假装回帖不跳转
// @namespace    http://tampermonkey.net/
// @version      8.4
// @description  通过点击进度重载位置来定位锚点
// @author       memor221 & gemini
// @match        https://linux.do/t/topic/*
// @match        https://idcflare.com/t/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557828/linuxdo%E5%8E%9F%E5%9C%B0%E5%9B%9E%E5%A4%8D--%E5%81%87%E8%A3%85%E5%9B%9E%E5%B8%96%E4%B8%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557828/linuxdo%E5%8E%9F%E5%9C%B0%E5%9B%9E%E5%A4%8D--%E5%81%87%E8%A3%85%E5%9B%9E%E5%B8%96%E4%B8%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    const STORAGE_KEY = 'linuxdo_reply_anchor';
    const LOCK_DURATION = 15000;
    const MIN_GUARD_TIME = 3000;
    const STABLE_THRESHOLD = 20;

    GM_addStyle(`
        .anchor-toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(33, 150, 243, 0.95);
            color: #fff;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 2147483647;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .anchor-toast.show {
            opacity: 1;
        }
        .click-marker {
            display: none;
        }
    `);

    let toast = document.querySelector('.anchor-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'anchor-toast';
        document.body.appendChild(toast);
    }

    function showToast(text, duration = 3000) {
        toast.innerText = text;
        toast.classList.add('show');
        if (duration > 0) {
            setTimeout(() => toast.classList.remove('show'), duration);
        }
    }

    function getCurrentTotalPosts() {
        const text = document.querySelector('.timeline-replies')?.innerText;
        if (text) {
            const parts = text.split('/');
            if (parts.length > 1) {
                const total = parseInt(parts[1].trim(), 10);
                if (!isNaN(total)) return total;
            }
        }
        return 0;
    }

    // 核心：模拟点击时间轴 (v8.4 精准版)
    function simulateTimelineClick(targetPostNum) {
        const timeline = document.querySelector('.timeline-scrollarea');
        if (!timeline) return false;

        // 确保时间轴可见
        const rect = timeline.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;

        const totalPosts = getCurrentTotalPosts();
        if (!totalPosts) return false;

        // 计算目标位置
        let ratio = targetPostNum / totalPosts;
        // 增加一点点偏移，防止正好点在两个像素交界处
        ratio = Math.max(0.01, Math.min(0.99, ratio));

        // 核心计算：相对于视口的坐标
        const offsetY = rect.height * ratio;
        const clientX = rect.left + (rect.width / 2);
        const clientY = rect.top + offsetY;

        // [v8.4 新增] 关键步骤：找到该坐标下真正的 DOM 元素
        // 可能是 .timeline-padding, .timeline-scroller 或其他装饰元素
        // 直接向这个元素发送事件，比向父容器发送更可靠
        const targetEl = document.elementFromPoint(clientX, clientY);

        if (!targetEl) {
            console.warn('❌ [Timeline] 目标坐标处无元素');
            return false;
        }

        console.log(`🖱️ [Timeline] 命中元素: <${targetEl.tagName.toLowerCase()} class="${targetEl.className}">, 目标#${targetPostNum} (Y:${clientY.toFixed(0)})`);

        // 调试标记
        const marker = document.createElement('div');
        marker.className = 'click-marker';
        marker.style.left = clientX + 'px';
        marker.style.top = clientY + 'px';
        document.body.appendChild(marker);
        setTimeout(() => { marker.style.opacity = 0; setTimeout(() => marker.remove(), 500); }, 500);

        // 构造事件参数
        const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const eventInit = {
            bubbles: true,
            cancelable: true,
            view: win,
            detail: 1,
            screenX: clientX,
            screenY: clientY,
            clientX: clientX,
            clientY: clientY,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            buttons: 1,
            relatedTarget: null
        };

        // 模拟完整的人类交互链：
        // MouseOver -> MouseMove -> MouseDown -> MouseUp -> Click
        const eventSequence = [
            new MouseEvent('mouseover', eventInit),
            new MouseEvent('mousemove', eventInit),
            new MouseEvent('mousedown', eventInit),
            new MouseEvent('mouseup', eventInit),
            new MouseEvent('click', eventInit)
        ];

        eventSequence.forEach(evt => targetEl.dispatchEvent(evt));

        return true;
    }

    function simulateLinkClick(postNumber) {
        let currentPath = window.location.pathname;
        const pathParts = currentPath.split('/');
        if (!isNaN(parseInt(pathParts[pathParts.length - 1]))) {
            pathParts.pop();
            currentPath = pathParts.join('/');
        }
        if (currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);

        const targetUrl = `${currentPath}/${postNumber}`;
        const link = document.createElement('a');
        link.href = targetUrl;
        link.style.display = 'none';
        link.className = 'd-link';
        document.body.appendChild(link);
        try { link.click(); } catch (e) {}
        setTimeout(() => link.remove(), 100);
    }

    function getMostVisiblePost() {
        const centerY = window.innerHeight / 2;
        const targets = [
            document.elementFromPoint(window.innerWidth / 2, centerY),
            document.elementFromPoint(window.innerWidth / 2, centerY - 100)
        ];
        for (const el of targets) {
            if (el) {
                const post = el.closest('[data-post-number]');
                if (post) return post;
            }
        }
        const posts = document.querySelectorAll('[data-post-number]');
        let closest = null, minDiff = Infinity;
        for (const post of posts) {
            const rect = post.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const diff = Math.abs((rect.top + rect.height/2) - centerY);
                if(diff < minDiff) { minDiff = diff; closest = post; }
            }
        }
        return closest;
    }

    function recordAnchor() {
        const scrollY = window.scrollY;
        const postElement = getMostVisiblePost();
        let relativeOffset = 0;
        let targetPostNumber = null;

        if (postElement) {
            targetPostNumber = parseInt(postElement.dataset.postNumber, 10);
            const rect = postElement.getBoundingClientRect();
            relativeOffset = rect.top;
        } else {
            const match = window.location.pathname.match(/\/(\d+)$/);
            if (match) targetPostNumber = parseInt(match[1], 10);
        }

        if (!targetPostNumber) return;

        const anchorData = {
            scrollY: scrollY,
            postNumber: targetPostNumber,
            relativeOffset: relativeOffset,
            timestamp: Date.now()
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(anchorData));
        console.log(`📍 [UserScript] 锁定目标: #${targetPostNumber}, 偏移: ${relativeOffset.toFixed(0)}px`);
        showToast(`⚓ 位置恢复中 #${targetPostNumber}...`, 0);

        startBackupGuard(anchorData);
    }

    function startBackupGuard(anchorData) {
        if (window._linuxDoGuardFrame) cancelAnimationFrame(window._linuxDoGuardFrame);

        let stableCount = 0;
        let missingCount = 0;
        let interactionCooldown = 0;
        const startTime = Date.now();
        const targetPostNum = anchorData.postNumber;

        const finish = (reason) => {
            if (window._linuxDoGuardFrame) {
                cancelAnimationFrame(window._linuxDoGuardFrame);
                window._linuxDoGuardFrame = null;
            }
            document.removeEventListener('wheel', wheelHandler);
            document.removeEventListener('keydown', escapeHandler);
            toast.classList.remove('show');
            sessionStorage.removeItem(STORAGE_KEY);
            console.log(`🛑 [Guard] 结束守卫: ${reason}`);
        };

        const wheelHandler = () => finish('用户主动滚动');
        const escapeHandler = (e) => { if(e.key === 'Escape') finish('用户按Esc'); };

        document.addEventListener('wheel', wheelHandler, { passive: true });
        document.addEventListener('keydown', escapeHandler);

        const guardLoop = () => {
            const now = Date.now();
            const timeElapsed = now - startTime;

            if (timeElapsed > LOCK_DURATION) {
                finish('超时自动释放');
                return;
            }

            const targetElement = document.querySelector(`[data-post-number="${targetPostNum}"]`);

            if (targetElement) {
                // 元素在 DOM 中，执行像素级对齐
                missingCount = 0;
                const rect = targetElement.getBoundingClientRect();
                const diff = rect.top - anchorData.relativeOffset;

                if (Math.abs(diff) > 5) {
                    window.scrollBy(0, diff);
                    stableCount = 0;
                } else {
                    stableCount++;
                }
            } else {
                // 元素丢失
                missingCount++;
                stableCount = 0;

                if (interactionCooldown > 0) interactionCooldown--;

                // 丢失超过 20 帧 (0.3秒)，尝试找回
                if (missingCount > 20 && interactionCooldown === 0) {
                    console.warn(`⚠️ [Guard] 楼层 #${targetPostNum} 丢失，尝试通过时间轴找回...`);

                    const success = simulateTimelineClick(targetPostNum);
                    if (!success) simulateLinkClick(targetPostNum);

                    interactionCooldown = 60;
                    missingCount = 0;
                }
            }

            if (stableCount > STABLE_THRESHOLD && timeElapsed > MIN_GUARD_TIME) {
                finish('位置已稳定');
            } else {
                window._linuxDoGuardFrame = requestAnimationFrame(guardLoop);
            }
        };

        window._linuxDoGuardFrame = requestAnimationFrame(guardLoop);
    }

    function checkRecovery() {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const anchorData = JSON.parse(saved);
                if (Date.now() - anchorData.timestamp < 120000) {
                    console.log('🔄 [UserScript] 恢复残留会话...');
                    if (!document.querySelector(`[data-post-number="${anchorData.postNumber}"]`)) {
                         simulateTimelineClick(anchorData.postNumber);
                    }
                    startBackupGuard(anchorData);
                } else {
                    sessionStorage.removeItem(STORAGE_KEY);
                }
            } catch (e) {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        }
    }

    document.addEventListener('click', function(e) {
        const target = e.target;
        const btn = target.closest('button.create');
        if (btn && btn.closest('#reply-control')) {
            if (!btn.disabled) {
                recordAnchor();
            }
        }
    }, true);

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (e.target.closest('#reply-control')) {
                recordAnchor();
            }
        }
    }, true);

    checkRecovery();

})();