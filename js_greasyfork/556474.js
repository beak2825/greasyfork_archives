// ==UserScript==
// @license MIT
// @name         Ingress OPR / Wayfarer 自动 thumbs up + 随机选 radio（不提交）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动点击 thumbs-up、随机选 radio，并滚动到“送出”按钮，但绝不自动提交。
// @match        https://opr.ingress.com/new/review*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556474/Ingress%20OPR%20%20Wayfarer%20%E8%87%AA%E5%8A%A8%20thumbs%20up%20%2B%20%E9%9A%8F%E6%9C%BA%E9%80%89%20radio%EF%BC%88%E4%B8%8D%E6%8F%90%E4%BA%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556474/Ingress%20OPR%20%20Wayfarer%20%E8%87%AA%E5%8A%A8%20thumbs%20up%20%2B%20%E9%9A%8F%E6%9C%BA%E9%80%89%20radio%EF%BC%88%E4%B8%8D%E6%8F%90%E4%BA%A4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 点击所有 thumbs-up 按钮 */
    function clickAllThumbUps() {
        const buttons = Array.from(
            document.querySelectorAll('button.wf-button.thumbs-button.wf-button--icon')
        );

        buttons.forEach(btn => {
            if (btn.dataset.tmThumbDone === '1') return;

            const icon = btn.querySelector('mat-icon');
            if (!icon) return;

            const text = icon.textContent.trim();
            if (text === 'thumb_up' || text === 'thumb_up_alt') {
                if (btn.getAttribute('aria-pressed') !== 'true') {
                    btn.click();
                }
                btn.dataset.tmThumbDone = '1';
            }
        });
    }

    /* 随机选择你给的那组 radio（一些人 / 大型團體 / 大型集會） */
    function pickRandomRadio() {
        // 找到包含“一些人（5～10人）”这个文字的 radio 组（避免误选其他问题的 radio）
        const groups = Array.from(document.querySelectorAll('mat-radio-group'))
            .filter(g => g.textContent.includes('一些人（5～10人）'));

        groups.forEach(group => {
            if (group.dataset.tmRadioPicked === '1') return;

            const radios = Array.from(group.querySelectorAll('mat-radio-button'));
            if (!radios.length) return;

            // 随机取一个 radio
            const idx = Math.floor(Math.random() * radios.length);
            const chosen = radios[idx];

            // 点击 label 触发 Angular Material 的选中事件
            const label = chosen.querySelector('label.mat-radio-label');
            if (label) {
                label.click();
            } else {
                const input = chosen.querySelector('input[type="radio"]');
                if (input) input.click();
                else chosen.click();
            }

            group.dataset.tmRadioPicked = '1';
            console.log(`[OPR Helper] 已随机选择 Radio 选项：第 ${idx + 1} 个`);
        });
    }

    /* 自动滚动到“送出”按钮（不点） */
    function scrollToSubmit() {
        let submit = document.querySelector('button.wf-button--primary');

        if (!submit) {
            submit = Array.from(document.querySelectorAll('button'))
                .find(b => b.textContent.includes('送出'));
        }

        if (submit) {
            submit.scrollIntoView({ behavior: 'smooth', block: 'center' });
            try { submit.focus(); } catch (_) {}
        }
    }

    /* 整体流程 */
    function processReview() {
        clickAllThumbUps();
        pickRandomRadio();

        setTimeout(scrollToSubmit, 300);
    }

    /* 监控 DOM (SPA 页面需要) */
    const observer = new MutationObserver(() => {
        clearTimeout(observer._tmTimer);
        observer._tmTimer = setTimeout(processReview, 250);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* 初次加载也跑一次 */
    window.addEventListener('load', () => {
        processReview();
        setTimeout(processReview, 800);
    });
})();