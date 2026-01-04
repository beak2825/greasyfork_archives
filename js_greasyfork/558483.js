// ==UserScript==
// @name         桃寝-安全weiban 国安教育 课程学习部分自动化
// @namespace    https://greasyfork.org/zh-CN/users/123456
// @version      1.0
// @description  1. 第一次检测到第一门课立即点击；2. 之后每5s检测，课时未刷新则停手并立即弹出右下角彩蛋按钮；3. 连续8次找不到元素报警；4. 提供手动按钮；5. 适用 weiban.mycourse.cn 与 mcwk.mycourse.cn
// @author       桃寝
// @match        https://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/558483/%E6%A1%83%E5%AF%9D-%E5%AE%89%E5%85%A8weiban%20%E5%9B%BD%E5%AE%89%E6%95%99%E8%82%B2%20%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558483/%E6%A1%83%E5%AF%9D-%E5%AE%89%E5%85%A8weiban%20%E5%9B%BD%E5%AE%89%E6%95%99%E8%82%B2%20%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FIRST_COURSE = '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div.van-list > ul > li:nth-child(1)';
    const COMPLETION_EM = '#app > div > div.viewport > div.tabs-container > div.van-tabs.van-tabs--line.items2 > div.van-tabs__wrap.van-tabs__wrap--scrollable > div > div.van-tab.van-tab--active > span > span.completion > em';

    /* ===== 通用工具 ===== */
    function click(sel, txt = '点击') {
        const el = document.querySelector(sel);
        if (el) {
            console.log(`%c[桃寝] ${txt} >>> 元素存在，立即点击`, 'color:#0f9d58;font-weight:bold;font-size:14px;', el);
            el.click();
            console.log(`%c[桃寝] ${txt} >>> click() 已调用`, 'color:#0f9d58;font-weight:bold;');
            return true;
        }
        console.warn(`%c[桃寝] ${txt} >>> 元素不存在: ${sel}`, 'color:#f44336;font-weight:bold;');
        return false;
    }

    function createBtn(id, text, color, bottomOffset = 20) {
        const b = document.createElement('button');
        b.id = id;
        b.textContent = text;
        b.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: ${bottomOffset}px;
            z-index: 9999;
            padding: 8px 16px;
            font-size: 14px;
            color: #fff;
            background: ${color};
            border: none;
            border-radius: 18px;
            cursor: pointer;
            transition: all .3s;
        `;
        document.body.appendChild(b);
        return b;
    }

    /* ===== 统一提示音 ===== */
    function beep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            console.warn('[桃寝] 无法播放提示音:', e);
        }
    }

    /* ===== 读取当前课时数 ===== */
    function getCompletionText() {
        const em = document.querySelector(COMPLETION_EM);
        return em ? em.textContent.trim() : '';
    }

    /* ========== 核心：第一次立即点，之后每5s检测，未刷新就停+弹按钮 ========== */
    function startForeverDetect() {
        const blackList = ['/course/', '/exam/', '/play/'];
        if (blackList.some(k => location.pathname.includes(k))) return;

        const MAX_MISS = 8;
        let missCount  = 0;
        let firstDone  = false;   // 第一次是否已点完
        let baseValue  = '';      // 第一次点完后的课时数
        let btnShown   = false;   // 彩蛋按钮只弹一次

        /* 第一次：立即执行，不等待 */
        (function firstClick() {
            console.log(`%c[桃寝] ===== 第一次立即点击第一门课 =====`, 'color:#2196F3;font-weight:bold;');
            const clicked = click(FIRST_COURSE, '第一次立即点击');
            if (clicked) {
                firstDone = true;
                baseValue = getCompletionText();
                console.log(`%c[桃寝] 第一次点击成功，记录基准课时: ${baseValue}`, 'color:#0f9d58;font-weight:bold;');
            } else {
                /* 极端情况：页面还没渲染好，1s 后重试一次 */
                setTimeout(firstClick, 1000);
            }
        })();

        /* 之后每 5 秒检测一次 */
        const intervalId = setInterval(() => {
            console.log(`%c[桃寝] ===== 检测第一门课（第二次及以后）=====`, 'color:#2196F3;font-weight:bold;');

            /* 先判断课时是否刷新 */
            const nowValue = getCompletionText();
            if (nowValue === baseValue && nowValue !== '' && !btnShown) {
                console.warn(`%c[桃寝] 课时数未刷新（${nowValue}），停止点击并立即弹按钮！`, 'color:#f44336;font-size:16px;font-weight:bold;');
                beep();
                clearInterval(intervalId);

                /* 立即插入大按钮 */
                btnShown = true;
                const btn = document.createElement('a');
                btn.href = 'https://www.bilibili.com/video/BV1hYh8zcENQ?p=20';
                btn.target = '_blank';
                btn.textContent = '完成刷课-点击欣赏「魔法少女的魔女审判」原声集';
                btn.style.cssText = `
                    position:fixed; right:20px; bottom:20px; z-index:99999;
                    padding:14px 24px; font-size:18px; font-weight:bold; color:#fff;
                    background:linear-gradient(135deg,#ff4081 0%,#7c4dff 100%);
                    border:none; border-radius:28px; cursor:pointer;
                    box-shadow:0 4px 12px rgba(0,0,0,.25); transition:transform .2s;`;
                btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
                btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
                document.body.appendChild(btn);
                return;
            }

            /* 课时已刷新，继续点 */
            const clicked = click(FIRST_COURSE, '循环检测点击第一门课');
            if (clicked) {
                missCount = 0;
                baseValue = nowValue;   // 更新基准
            } else {
                missCount++;
                if (missCount >= MAX_MISS) {
                    console.warn(`%c[桃寝] 已连续 ${MAX_MISS} 次未点到第一门课，发出响声警报！`, 'color:#f44336;font-size:16px;font-weight:bold;');
                    beep();
                    missCount = 0;
                }
            }
        }, 5000);
    }

    /* ===== 一键完成按钮（仅 mcwk 域名） ===== */
    function insertFinishBtn() {
        const btn = createBtn('auto-finish-btn', '一键完成 (18s)', '#ccc');
        btn.style.color = '#666';
        btn.style.cursor = 'not-allowed';
        let t = 18;
        const timer = setInterval(() => {
            t--;
            btn.innerHTML = `一键完成 (${t}s)`;
            if (t <= 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.style.background = '#4285F4';
                btn.style.color = '#fff';
                btn.style.cursor = 'pointer';
                btn.innerHTML = '🚀 一键完成';
                btn.click();
            }
        }, 1000);

        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            if (typeof finishWxCourse === 'function') {
                console.log('%c[桃寝] 一键完成按钮被点击，开始执行 finishWxCourse', 'color:#FF9800;font-weight:bold;');
                finishWxCourse();
                setTimeout(() => click('body > div.pop-jsv a', '关闭弹窗'), 600);
            } else {
                alert('未找到 finishWxCourse 函数');
            }
        });
    }

    /* ===== 手动按钮 ===== */
    function insertManualBtn() {
        const btn = createBtn('manual-first-btn', '手动点第一门课', '#FF9800', 70);
        btn.addEventListener('click', () => click(FIRST_COURSE, '手动点第一门课'));
    }

    /* ===== 主入口 ===== */
    function main() {
        startForeverDetect();
        if (location.hostname === 'mcwk.mycourse.cn') insertFinishBtn();
        insertManualBtn();
    }

    if (document.readyState === 'complete') main();
    else window.addEventListener('load', main);
})();