// ==UserScript==
// @name         精斗云全能助手
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  自动登录、自动点击提示弹窗、增强多账套页面功能（防卡版）
// @author       YUE
// @icon         https://vip1-hz.jdy.com/favicon.ico
// @match        https://www.jdy.com/login*
// @match        *://service.jdy.com/*
// @match        https://*.jdy.com/mulAcct/*
// @match        https://vip*.jdy.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554158/%E7%B2%BE%E6%96%97%E4%BA%91%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554158/%E7%B2%BE%E6%96%97%E4%BA%91%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = location.href;

    // ========== 小提示泡泡 ==========
    function showStatus(text, color = '#409EFF') {
        const tip = document.createElement('div');
        tip.textContent = text;
        Object.assign(tip.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: color,
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 999999,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'opacity 1s',
        });
        document.body.appendChild(tip);
        setTimeout(() => tip.style.opacity = '0', 4000);
        setTimeout(() => tip.remove(), 5000);
    }

    // ======================================================
    // 模块一：自动登录（登录页）
    // ======================================================
    if (url.includes("https://www.jdy.com/login")) {
        showStatus('精斗云自动登录模块已启用', '#2ecc71');
        console.log("🔐【模块一】自动登录启动");

        const yourUsername = "13088860223"; // 👈 账号
        const yourPassword = "Kq123456.";   // 👈 密码
        const clickDelay = 800;              // 延迟点击登录(ms)

        window.addEventListener('load', function() {
            const usernameInput = document.getElementById('login_username');
            const passwordInput = document.getElementById('login_pwd');
            const agreementCheckbox = document.getElementById('reg_agreement');
            const loginBtnActive = document.getElementById('login_btn');
            const loginBtnGray = document.getElementById('login_btn_gray');
            if (!usernameInput || !passwordInput || !agreementCheckbox || (!loginBtnActive && !loginBtnGray)) return;

            usernameInput.value = yourUsername;
            passwordInput.value = yourPassword;
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.focus(); passwordInput.blur();
            if (!agreementCheckbox.checked) agreementCheckbox.click();
            console.log("✅ 已填写账号密码并勾选协议");

            setTimeout(() => {
                let btn = document.getElementById('login_btn') || document.getElementById('login_btn_gray');
                if (btn && btn.offsetParent !== null) {
                    btn.click();
                    console.log("🚀 已点击登录按钮");
                }
            }, clickDelay);
        });
    }

    // ======================================================
    // 模块二：自动点击“确定”和“进入使用”（工作台）
    // ======================================================
    else if (url.includes("service.jdy.com")) {
        showStatus('金蝶工作台弹窗自动点击已启用', '#e67e22');
        console.log("🪄【模块二】自动点击模块启动");

        setInterval(() => {
            const okBtn = document.querySelector('button.kd-btn-primary span');
            if (okBtn && okBtn.textContent.includes('确定')) {
                okBtn.click();
                console.log('✅ 已自动点击「确定」按钮');
            }
            const enterBtn = document.querySelector('button.serviceStartStatus__Zssvi span');
            if (enterBtn && enterBtn.textContent.includes('进入使用')) {
                enterBtn.click();
                console.log('✅ 已自动点击「进入使用」按钮');
            }
        }, 1000);
    }

    // ======================================================
    // 模块三：多账套增强（高亮 + 排序 + 屏蔽）
    // ======================================================
    else if (/https:\/\/.*\.jdy\.com\/mulAcct\//.test(url) || /https:\/\/vip.*\.jdy\.com\//.test(url)) {
        showStatus('多账套增强模块已启用', '#3498db');
        console.log("📦【模块三】多账套增强模块启动（防卡版）");

        const style = document.createElement('style');
        style.textContent = `
            .customerbox_li.expired .innerWrap { box-shadow:0 0 8px rgba(0,0,0,.2)!important;border-radius:4px; }
            .customerbox_li.expired .innerWrap .df { color:#000!important;font-weight:bold; }
            .customerbox_li .company-name { color:#db2d55!important;font-weight:normal!important; }
            .priority-tag { margin-left:6px;padding:1px 4px;border-radius:4px;font-size:12px;font-weight:bold;color:#fff; }
            .priority-high { background:#e74c3c; }
            .priority-mid { background:#f39c12; }
            .priority-low { background:#7f8c8d; }
            .glyphicon.glyphicon-pencil.edit,
            .glyphicon.glyphicon-paperclip,
            .customerbox_li.row.add { display:none !important; }
            .customerbox_li.blocked { display:none !important; }
        `;
        document.head.appendChild(style);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        const priorityMap = {
            "高": ["深圳老友福合康管理有限公司"],
            "中": ["深圳市福田区园岭街道老有福居家养老服务站", "广东好尔美康颐智能科技有限公司", "深圳市美伦堡实业发展有限公司", "深圳市星河优拓科技有限公司"],
            "低": ["深圳市艾理森投资有限公司", "深圳市麻雀云食餐饮科技有限公司", "深圳市一手餐饮管理有限公司", "深圳市崇升投资有限公司", "深圳市福凯成供应链有限公司", "深圳宏福堂中医综合诊所", "深圳市嘉盛投资有限公司", "深圳市福田区麻小雀社区盒饭餐饮店（个体工商户）", "深圳市天天过年智慧新零售有限公司", "深圳行多多旅游有限公司", "深圳联合航空有限公司", "深圳老友福适老家居有限公司", "深圳市利兹堡健康管理有限公司", "深圳星耀传媒文化有限公司", "深圳市元智源味餐饮管理有限公司"]
        };
        const blockedCompanies = ["深圳市天天过年智慧新零售有限公司","深圳市福田区麻小雀社区盒饭餐饮店（个体工商户）", "深圳市艾理森投资有限公司", "深圳市美伦堡实业发展有限公司", "深圳星耀传媒文化有限公司"];

        function getPriority(name) {
            if (priorityMap["高"].includes(name)) return 1;
            if (priorityMap["中"].includes(name)) return 2;
            if (priorityMap["低"].includes(name)) return 3;
            return 4;
        }

        function createPriorityTag(level) {
            const span = document.createElement("span");
            span.classList.add("priority-tag");
            if (level === 1) { span.textContent = "[高]"; span.classList.add("priority-high"); }
            else if (level === 2) { span.textContent = "[中]"; span.classList.add("priority-mid"); }
            else if (level === 3) { span.textContent = "[低]"; span.classList.add("priority-low"); }
            else return null;
            return span;
        }

        function getDynamicColor(year, month) {
            const currentDate = currentYear * 12 + currentMonth;
            const accountDate = year * 12 + month;
            const diff = accountDate - currentDate;
            if (diff >= 0) return '#ffffff';
            if (year !== currentYear) {
                const opacity = Math.min(0.1 + Math.abs(diff) * 0.05, 0.8);
                return `rgba(100,100,255,${opacity})`;
            } else {
                const opacity = Math.min(0.1 + Math.abs(diff) * 0.1, 0.8);
                return `rgba(255,100,100,${opacity})`;
            }
        }

        function parsePeriod(acc) {
            const el = acc.querySelector('.df');
            if (!el) return 999999;
            const match = el.textContent.trim().match(/会计期间：(\d{4})-(\d{1,2})/);
            if (!match) return 999999;
            return parseInt(match[1], 10) * 12 + parseInt(match[2], 10);
        }

        let isProcessing = false;
        let lastRun = 0;

        function processAccounts() {
            const now = Date.now();
            if (isProcessing || now - lastRun < 1500) return;
            isProcessing = true;
            lastRun = now;

            const accounts = document.querySelectorAll('.customerbox_li:not(.add)');
            accounts.forEach(acc => {
                const nameEl = acc.querySelector('.companyName');
                if (!nameEl) return;
                const name = nameEl.textContent.trim();
                if (blockedCompanies.includes(name)) { acc.classList.add('blocked'); return; }
                nameEl.classList.add('company-name');
                if (!nameEl.nextElementSibling?.classList.contains("priority-tag")) {
                    const tag = createPriorityTag(getPriority(name));
                    if (tag) nameEl.after(tag);
                }
                const match = acc.querySelector('.df')?.textContent.match(/会计期间：(\d{4})-(\d{1,2})/);
                if (match) {
                    const color = getDynamicColor(+match[1], +match[2]);
                    const wrap = acc.querySelector('.innerWrap');
                    if (wrap) { acc.classList.add('expired'); wrap.style.backgroundColor = color; }
                }
            });

            // 排序
            const container = document.querySelector('.customerbox');
            if (container) {
                const sorted = Array.from(container.querySelectorAll('.customerbox_li:not(.add):not(.blocked)')).sort((a,b)=>{
                    const nameA = a.querySelector('.companyName')?.textContent.trim() || "";
                    const nameB = b.querySelector('.companyName')?.textContent.trim() || "";
                    const priA = getPriority(nameA), priB = getPriority(nameB);
                    if (priA !== priB) return priA - priB;
                    return parsePeriod(a) - parsePeriod(b);
                });
                sorted.forEach(el => container.appendChild(el));
            }

            isProcessing = false;
        }

        const listContainer = document.querySelector('.customerbox');
        if (listContainer) {
            const observer = new MutationObserver(() => processAccounts());
            observer.observe(listContainer, { childList: true, subtree: true });
        }
        setTimeout(processAccounts, 1500);
    }

})();
