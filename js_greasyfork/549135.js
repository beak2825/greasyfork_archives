// ==UserScript==
// @name         MW Idle 无所事事自动挤奶
// @namespace    mwidle-auto
// @version      1.0.1
// @description  每5分钟检测“无所事事”，若存在则自动执行：挤奶 → 奶牛 → 开始（每步1秒），并确认状态切换为“奶牛 [∞]”。
// @match        https://www.milkywayidle.com/*
// @grant        none
// @run-at       document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/549135/MW%20Idle%20%E6%97%A0%E6%89%80%E4%BA%8B%E4%BA%8B%E8%87%AA%E5%8A%A8%E6%8C%A4%E5%A5%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/549135/MW%20Idle%20%E6%97%A0%E6%89%80%E4%BA%8B%E4%BA%8B%E8%87%AA%E5%8A%A8%E6%8C%A4%E5%A5%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 5分钟检查一次
    const CHECK_INTERVAL_MS = 5 * 60 * 1000;
    const CLICK_DELAY_MS = 1000;
    const ENABLE_TEST_BUTTON = false; // 如需开启手动测试按钮，将此值改为 true
    const ENABLE_IDLE_OBSERVER = true; // 即时监听“无所事事”，检测到后立即尝试执行
    const ENABLE_KEEPALIVE = false; // 保活（降低后台节流），如需开启改为 true

    // 你提供的 XPath
    const XPATHS = {
        idle_indicator: '//*[@id="root"]/div/div/div[1]/div/div[1]/div[2]/div[1]/div/div[1]/div[2]',
        nav_milk: '//*[@id="root"]/div/div/div[2]/div[1]/div/div[2]/div[2]/div[5]/div[1]/div/div[1]/span[1]',
        cow_name: '//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div/div/div/div/div/div/div[1]/div[1]',
        start_button: '//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div[1]/div/div[1]/div/div[3]/div[2]/div[1]/div/div[3]/div[7]/button',
        header_cow: '//*[@id="root"]/div/div/div[1]/div/div[1]/div[2]/div[1]/div/div[1]/div[2]'
    };

    function isVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    }

    function evalXPath(xpath) {
        try {
            const res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return res.singleNodeValue || null;
        } catch (e) {
            return null;
        }
    }

    function safeClickElement(el) {
        if (!el || !isVisible(el)) return false;
        try {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            el.click();
            return true;
        } catch (e) {
            return false;
        }
    }

    function clickByXPath(xpath) {
        const el = evalXPath(xpath);
        return safeClickElement(el);
    }

    function getTextByXPath(xpath) {
        const el = evalXPath(xpath);
        return (el && (el.textContent || '').trim()) || '';
    }

    function isIdle() {
        const text = getTextByXPath(XPATHS.idle_indicator);
        return text.includes('无所事事');
    }

    function isCowHeader() {
        const text = getTextByXPath(XPATHS.header_cow);
        return text.includes('奶牛');
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function startMilkingSequence() {
        // 1) 挤奶（导航）
        clickByXPath(XPATHS.nav_milk);
        await sleep(CLICK_DELAY_MS);

        // 2) 奶牛（名称元素）
        clickByXPath(XPATHS.cow_name);
        await sleep(CLICK_DELAY_MS);

        // 3) 开始（按钮）
        clickByXPath(XPATHS.start_button);
        await sleep(CLICK_DELAY_MS);
    }

    async function runOnce() {
        try {
            // 仅当“无所事事”时才启动挤奶流程
            if (!isIdle()) return;

            await startMilkingSequence();

            // 尝试确认状态切换为“奶牛 [∞]”，最多等待3秒（分3次，每次1秒）
            for (let i = 0; i < 3; i++) {
                if (isCowHeader()) break;
                await sleep(1000);
            }
        } catch (e) {
            // 忽略错误，避免影响页面
        }
    }

    // 周期轮询
    setInterval(runOnce, CHECK_INTERVAL_MS);

    // 初始化首次检查（避免刚好空闲时需等5分钟）
    setTimeout(runOnce, 3000);

    // 即时监听“无所事事”状态变更
    function setupIdleObserver() {
        if (!ENABLE_IDLE_OBSERVER) return;
        let scheduled = false;
        const observer = new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;
            setTimeout(() => {
                scheduled = false;
                if (isIdle()) runOnce();
            }, 250);
        });
        try {
            observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
        } catch (e) {
            // 忽略
        }
        // 标签页重新可见时也尝试一次
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                setTimeout(runOnce, 500);
            }
        });
    }

    // 保活：使用 WebAudio 降低后台节流概率
    function setupKeepAlive() {
        if (!ENABLE_KEEPALIVE) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0.00001; // 接近静音
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            // 定期尝试恢复，防止被挂起
            setInterval(() => {
                if (ctx.state !== 'running') ctx.resume().catch(() => {});
            }, 15000);
            // 重新可见时恢复
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && ctx.state !== 'running') {
                    ctx.resume().catch(() => {});
                }
            });
        } catch (e) {
            // 忽略
        }
    }

    // 可选：页面上的手动测试按钮
    function createTestButton() {
        if (!ENABLE_TEST_BUTTON) return;
        if (document.getElementById('mwidle-milk-test')) return;
        if (!document.body) return;
        const btn = document.createElement('button');
        btn.id = 'mwidle-milk-test';
        btn.textContent = '测试挤奶';
        Object.assign(btn.style, {
            position: 'fixed',
            right: '16px',
            bottom: '64px', // 避开其它按钮
            zIndex: '99999',
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '6px',
            border: '1px solid #888',
            background: '#2a5',
            color: '#fff',
            cursor: 'pointer',
            opacity: '0.9'
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.9');
        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = '测试中...';
            try {
                await runOnce();
            } finally {
                btn.disabled = false;
                btn.textContent = '测试挤奶';
            }
        });
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            createTestButton();
            setupIdleObserver();
            setupKeepAlive();
        }, { once: true });
    } else {
        createTestButton();
        setupIdleObserver();
        setupKeepAlive();
    }
})();


