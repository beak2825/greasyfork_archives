// ==UserScript==
// @name         [Pokechill] Auto Rejoin Area
// @description  自动点击“重新战斗”按钮
// @namespace    https://play-pokechill.github.io/
// @version      1.1
// @author       GPT-DiamondMoo
// @license      MIT
// @icon         https://play-pokechill.github.io/img/icons/icon.png
// @match        https://play-pokechill.github.io/*
// @match        https://g1tyx.github.io/play-pokechill/*
// @downloadURL https://update.greasyfork.org/scripts/560607/%5BPokechill%5D%20Auto%20Rejoin%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/560607/%5BPokechill%5D%20Auto%20Rejoin%20Area.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       Storage
    ========================= */
    const STORAGE = {
        enabled: 'autoRejoinEnabled',
        position: 'autoRejoinBtnPos',
        count: 'autoRejoinCount'
    };

    let autoEnabled = localStorage.getItem(STORAGE.enabled) === '1';
    let rejoinCount = parseInt(localStorage.getItem(STORAGE.count) || '0', 10);

    /* =========================
       State
    ========================= */
    let clickedThisCycle = false;
    let lastVisible = false;

    /* =========================
       Utils
    ========================= */
    function isActuallyVisible(el) {
        return !!(
            el &&
            el.offsetParent !== null &&
            el.getClientRects().length > 0
        );
    }

    /* =========================
       Floating UI
    ========================= */
    const floatBtn = document.createElement('div');
    floatBtn.style.cssText = `
        position: fixed;
        z-index: 99999;
        background: rgba(0,0,0,0.75);
        color: #fff;
        padding: 10px 14px;
        border-radius: 10px;
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        line-height: 1.4;
    `;

    const mainText = document.createElement('div');
    const countText = document.createElement('div');

    floatBtn.appendChild(mainText);
    floatBtn.appendChild(countText);
    document.body.appendChild(floatBtn);

    function updateUI() {
        mainText.textContent = `自动重开：${autoEnabled ? '开启' : '关闭'}`;
        if (autoEnabled) {
            countText.textContent = `重开次数：${rejoinCount}`;
            countText.style.display = 'block';
        } else {
            countText.style.display = 'none';
        }
    }
    updateUI();

    /* =========================
       Restore position
    ========================= */
    const pos = JSON.parse(localStorage.getItem(STORAGE.position) || '{}');
    floatBtn.style.left = pos.left || '20px';
    floatBtn.style.top = pos.top || '20px';

    /* =========================
       Toggle (off = reset count)
    ========================= */
    floatBtn.addEventListener('click', () => {
        if (floatBtn._dragging) return;

        autoEnabled = !autoEnabled;
        localStorage.setItem(STORAGE.enabled, autoEnabled ? '1' : '0');

        if (!autoEnabled) {
            rejoinCount = 0;
            localStorage.setItem(STORAGE.count, '0');
            clickedThisCycle = false;
            lastVisible = false;
        }

        updateUI();
    });

    /* =========================
       Drag (clamped)
    ========================= */
    let sx, sy, sl, st;

    floatBtn.addEventListener('mousedown', (e) => {
        sx = e.clientX;
        sy = e.clientY;
        sl = floatBtn.offsetLeft;
        st = floatBtn.offsetTop;
        floatBtn._dragging = false;

        const move = (ev) => {
            const dx = ev.clientX - sx;
            const dy = ev.clientY - sy;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) floatBtn._dragging = true;

            const left = Math.max(0, Math.min(window.innerWidth - floatBtn.offsetWidth, sl + dx));
            const top = Math.max(0, Math.min(window.innerHeight - floatBtn.offsetHeight, st + dy));

            floatBtn.style.left = left + 'px';
            floatBtn.style.top = top + 'px';
        };

        const up = () => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            localStorage.setItem(STORAGE.position, JSON.stringify({
                left: floatBtn.style.left,
                top: floatBtn.style.top
            }));
            setTimeout(() => floatBtn._dragging = false, 0);
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    });

    /* =========================
       Core auto rejoin logic
    ========================= */
    function checkAutoRejoin() {
        if (!autoEnabled) return;

        const btn = document.getElementById('area-rejoin');
        const visible = isActuallyVisible(btn);

        // 可见 → 不可见：重置周期
        if (!visible && lastVisible) {
            clickedThisCycle = false;
        }

        // 不可见 → 可见：执行一次
        if (visible && !lastVisible && !clickedThisCycle) {
            clickedThisCycle = true;
            btn.click();

            rejoinCount++;
            localStorage.setItem(STORAGE.count, rejoinCount);
            updateUI();
        }

        lastVisible = visible;
    }

    /* =========================
       Observer
    ========================= */
    const observer = new MutationObserver(checkAutoRejoin);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

})();
