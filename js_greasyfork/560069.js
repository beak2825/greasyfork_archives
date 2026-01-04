// ==UserScript==
// @name         北信科安全教育刷课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  我超了老铁这你扯不扯，是160节课香味飘，急的孩子直蹦高，学习通知昨刚到，还有7天就要交。
// @author       Storine
// @match        *://*.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560069/%E5%8C%97%E4%BF%A1%E7%A7%91%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/560069/%E5%8C%97%E4%BF%A1%E7%A7%91%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;
    const style = document.createElement('style');
    style.innerHTML = `
        #wb-helper {
            position: fixed; top: 15%; right: 20px; z-index: 999999;
            background: #fff; border: 2px solid #28a745; border-radius: 12px;
            padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            width: 170px; font-family: sans-serif;
        }
        .wb-btn {
            background: #007bff; color: white; border: none; padding: 10px;
            border-radius: 6px; cursor: pointer; width: 100%; margin: 10px 0;
            font-size: 13px; font-weight: bold;
        }
        .wb-main-option {
            font-size: 13px; font-weight: bold; color: #28a745;
            display: flex; align-items: center; gap: 6px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;
        }
        #wb-log { font-size: 11px; color: #666; text-align: center; padding-top: 5px; line-height: 1.5; min-height: 35px; }
        .timer-num { font-weight: bold; color: #d9534f; font-size: 14px; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'wb-helper';
    panel.innerHTML = `
        <div style="font-size:12px; color:#999; text-align:center; margin-bottom:5px;">北信科安全教育刷课</div>
        <label class="wb-main-option">
            <input type="checkbox" id="master-switch"> 自动刷课
        </label>
        <button id="manual-sub" class="wb-btn">立即手动提交</button>
        <div id="wb-log">Ready Sir！</div>
    `;
    document.body.appendChild(panel);

    const logEl = document.getElementById('wb-log');
    const masterSwitch = document.getElementById('master-switch');
    let cooldownTimer = null;
    masterSwitch.checked = GM_getValue('masterSwitch', false);
    masterSwitch.onchange = () => {
        GM_setValue('masterSwitch', masterSwitch.checked);
        logEl.innerText = masterSwitch.checked ? "开始扫描..." : "已关闭";
        if (masterSwitch.checked) runWorkflow();
        else clearInterval(cooldownTimer);
    };

    function getParams() {
        let url = window.location.href + window.location.hash;
        if (!url.includes('userCourseId')) {
            const iframes = document.querySelectorAll('iframe');
            for (let f of iframes) {
                try { if (f.src.includes('userCourseId')) { url = f.src; break; } } catch(e){}
            }
        }
        const p = new URLSearchParams(url.split('?')[1]);
        return { ucid: p.get('userCourseId'), tenant: p.get('tenantCode') || "10000024" };
    }

    function runWorkflow() {
        if (!masterSwitch.checked) return;

        const { ucid, tenant } = getParams();
        if (ucid) {
            logEl.innerHTML = "在课程页";
            startCountdown(ucid, tenant);
        }
        else {
            logEl.innerHTML = "寻找未完成的课程...";
            setTimeout(scanAndClickNext, 3000);
        }
    }

    function scanAndClickNext() {
        if (!masterSwitch.checked) return;

        const collapseItems = document.querySelectorAll('.van-collapse-item');
        for (let item of collapseItems) {
            const countEl = item.querySelector('.count');
            if (countEl) {
                const [current, total] = countEl.innerText.split('/').map(Number);
                if (current < total) {
                    const title = item.querySelector('.van-cell');
                    if (title && title.getAttribute('aria-expanded') === 'false') title.click();
                    setTimeout(() => {
                        const subCourses = item.querySelectorAll('.img-texts-item');
                        if (subCourses.length > 0) {
                            logEl.innerHTML = "找到课程";
                            subCourses[0].click();
                        }
                    }, 1000);
                    return;
                }
            }
        }
        logEl.innerHTML = "Yes Sir!";
    }

    function startCountdown(ucid, tenant) {
        let sec = 180;
        clearInterval(cooldownTimer);
        cooldownTimer = setInterval(() => {
            if (!masterSwitch.checked) { clearInterval(cooldownTimer); return; }
            sec--;
            logEl.innerHTML = `自动模式运行中...<br>等待 <span class="timer-num">${sec}</span> 秒后提交`;
            if (sec <= 0) {
                clearInterval(cooldownTimer);
                executeSubmit(ucid, tenant);
            }
        }, 1000);
    }
    function executeSubmit(ucid, tenant) {
        logEl.innerHTML = "提交...";
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://weiban.mycourse.cn/pharos/usercourse/v2/${ucid}.do?userCourseId=${ucid}&tenantCode=${tenant}&callback=cb_${Date.now()}`,
            onload: function(res) {
                if (res.responseText.includes('"code":0') || res.responseText.includes('"code":"0"')) {
                    logEl.innerHTML = "<span style='color:green'>好！</span>";
                    if (masterSwitch.checked) {
                        setTimeout(() => window.history.back(), 100);
                    }
                } else {
                    logEl.innerHTML = "<span style='color:red'>提交失败</span>";
                }
            }
        });
    }
    document.getElementById('manual-sub').onclick = () => {
        const { ucid, tenant } = getParams();
        if (ucid) executeSubmit(ucid, tenant);
        else logEl.innerText = "未找到课程ID";
    };

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (masterSwitch.checked) runWorkflow();
        }
    }, 2000);
    setTimeout(runWorkflow, 2000);

})();