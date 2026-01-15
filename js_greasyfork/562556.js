// ==UserScript==
// @name         南京大学快速查看GPA
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  在南大交换生系统首页直接显示GPA和排名，而无需点开申请页面
// @author       Coxine and MellowWinds
// @match        http://elite.nju.edu.cn/exchangesystem/
// @match        http://elite.nju.edu.cn/exchangesystem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nju.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562556/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8BGPA.user.js
// @updateURL https://update.greasyfork.org/scripts/562556/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8BGPA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NJU_PURPLE = '#660874';

    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #gpa-ios-card {
                position: fixed;
                right: 25px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10000;
                width: 190px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(20px) saturate(160%);
                -webkit-backdrop-filter: blur(20px) saturate(160%);
                border: 0.5px solid rgba(0, 0, 0, 0.1);
                border-radius: 28px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                padding: 24px 18px;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", sans-serif;
                text-align: center;
                transition: transform 0.4s ease;
            }
            .loading-title {
                font-size: 19px;
                font-weight: 600;
                color: ${NJU_PURPLE};
                margin-bottom: 6px;
            }
            /* 专门为未登录设计的大标题 */
            .not-logged-title {
                font-size: 24px;
                font-weight: 700;
                color: ${NJU_PURPLE};
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }
            .loading-sub {
                font-size: 11px;
                color: rgba(0, 0, 0, 0.4);
                line-height: 1.4;
            }
            .gpa-header {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.5);
                margin-bottom: 2px;
            }
            .gpa-main-value {
                font-size: 35px;
                font-weight: 700;
                color: #000;
                margin: 4px 0;
                font-variant-numeric: tabular-nums;
            }
            .rank-container {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 0.5px solid rgba(0, 0, 0, 0.08);
            }
            .rank-label {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.5);
                margin-bottom: 4px;
            }
            .rank-text {
                font-size: 18px;
                font-weight: 600;
                color: ${NJU_PURPLE};
            }
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 2px;
                margin-top: 12px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: ${NJU_PURPLE};
                width: 0%;
                transition: width 1.6s ease-out;
            }
        `;
        document.head.appendChild(style);
    };

    const animateValue = (element, start, end, duration, decimals = 0) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const value = easeOutProgress * (end - start) + start;
            element.innerHTML = value.toFixed(decimals);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    const init = () => {
        injectStyles();
        const card = document.createElement('div');
        card.id = 'gpa-ios-card';
        document.body.appendChild(card);

        const loginDiv = document.querySelector('.login-in');

        if (!loginDiv) {
            // 未登录状态：字号放大至 24px
            card.innerHTML = `
                <div class="not-logged-title">未登录</div>
                <div class="loading-sub">请先登录交换生系统<br>以获取您的成绩排名</div>
            `;
            return;
        }

        card.innerHTML = `
            <div class="loading-title">加载中</div>
            <div class="loading-sub">请耐心等待系统响应</div>
        `;

        calcRank().then(data => {
            if (data) {
                const [gpa, rank, total] = data;
                const percent = total > 0 ? ((1 - rank / total) * 100).toFixed(1) : 0;

                card.innerHTML = `
                    <div class="gpa-header">平均绩点（GPA）</div>
                    <div class="gpa-main-value" id="count-gpa">0.000</div>
                    <div class="rank-container">
                        <div class="rank-label">排名</div>
                        <div class="rank-text">
                            <span id="count-rank">0</span> <span style="font-size:12px; color:rgba(0,0,0,0.3); font-weight:400;">/ ${total}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="gpa-bar"></div>
                        </div>
                        <div style="font-size:10px; color:${NJU_PURPLE}; margin-top:8px; font-weight:500; opacity:0.6;">超越了 ${percent}% 的同学</div>
                    </div>
                `;

                setTimeout(() => {
                    if(document.getElementById('count-gpa')) animateValue(document.getElementById('count-gpa'), 0, gpa, 1600, 3);
                    if(document.getElementById('count-rank')) animateValue(document.getElementById('count-rank'), 0, rank, 1600, 0);
                    if(document.getElementById('gpa-bar')) document.getElementById('gpa-bar').style.width = `${percent}%`;
                }, 100);
            } else {
                card.innerHTML = `<div style="font-size:12px; color:${NJU_PURPLE};">获取失败<br><small>接口响应异常</small></div>`;
            }
        });
    };

    async function calcRank() {
        const url = "http://elite.nju.edu.cn/exchangesystem/index/create?pid=380";
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const gpaElement = doc.querySelector('body > div > div:nth-child(4) > div:nth-child(11) > div:nth-child(3) > div.xm_text_span > span');
            if (!gpaElement) return null;
            const gpa = parseFloat(gpaElement.innerText);
            const rankPercentStr = doc.querySelector('input[name="data.pmbfb"]')?.value || "0%";
            const total = parseInt(doc.querySelector('input[name="data.zyzrs"]')?.value || "0");
            const rank = Math.round(parseFloat(rankPercentStr) * total / 100);
            return [gpa, rank, total];
        } catch (e) { return null; }
    }

    init();
})();