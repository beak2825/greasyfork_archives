// ==UserScript==
// @name         TradingView Replay Shortcuts (Aria Check)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  仅在回放开启(aria-pressed=true)时：Space->Shift+Down, Tab->Shift+Right
// @author       netcan
// @license MIT
// @match        *://*.tradingview.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556663/TradingView%20Replay%20Shortcuts%20%28Aria%20Check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556663/TradingView%20Replay%20Shortcuts%20%28Aria%20Check%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true; // 调试开关

    function log(msg) {
        if (DEBUG) console.log(`[TV-Replay] ${msg}`);
    }

    window.addEventListener('keydown', function(e) {
        // 1. 初步筛选按键
        const isSpace = (e.code === 'Space' || e.key === ' ' || e.keyCode === 32);
        const isTab = (e.code === 'Tab' || e.key === 'Tab' || e.keyCode === 9);

        if (!isSpace && !isTab) return;

        // 2. 输入框防误触
        const active = document.activeElement;
        const isInput = active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        );
        if (isInput) return;

        // 3. 【关键修改】通过 ID 和 aria-pressed 判断回放状态
        const replayBtn = document.getElementById('header-toolbar-replay');

        // 如果找不到按钮，或者 aria-pressed 不等于 "true"，则视为未开启回放
        if (!replayBtn || replayBtn.getAttribute('aria-pressed') !== 'true') {
            // log('回放未开启 (aria-pressed != true)，忽略拦截');
            return;
        }

        log(`回放已开启，拦截按键: ${e.code}`);

        // 4. 阻止默认行为并执行映射
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (isSpace) {
            // Space -> Shift + Down
            simulateKey(40, 'ArrowDown', true);
        } else if (isTab) {
            // Tab -> Shift + Right
            simulateKey(39, 'ArrowRight', true);
        }

    }, true);

    // 模拟按键函数
    function simulateKey(keyCode, keyName, withShift) {
        const target = document.activeElement || document.body;

        const eventOptions = {
            key: keyName,
            code: keyName,
            keyCode: keyCode,
            which: keyCode,
            shiftKey: withShift, // 强制开启 Shift
            ctrlKey: false,
            altKey: false,
            metaKey: false,
            bubbles: true,
            cancelable: true,
            composed: true,
            view: window
        };

        const event = new KeyboardEvent('keydown', eventOptions);

        // 兼容旧逻辑
        Object.defineProperty(event, 'keyCode', {get : () => keyCode});
        Object.defineProperty(event, 'which', {get : () => keyCode});

        target.dispatchEvent(event);
    }

})();