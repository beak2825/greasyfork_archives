// ==UserScript==
// @name         LeetCode 频率显示 (CodeTop)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  这是一个专为LeetCode学习计划打造的辅助脚本。它能将 CodeTop 的面试考察数据直接无缝融合到 LeetCode 的题目列表中。
// @author       YPeting
// @match        https://leetcode.cn/studyplan/*
// @connect      codetop.cc
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561495/LeetCode%20%E9%A2%91%E7%8E%87%E6%98%BE%E7%A4%BA%20%28CodeTop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561495/LeetCode%20%E9%A2%91%E7%8E%87%E6%98%BE%E7%A4%BA%20%28CodeTop%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const TOKEN_STORAGE_KEY = 'codetop_auth_token_storage';
    const DATA_STORAGE_KEY = 'codetop_hot100_data';
    const MARKED_STORAGE_KEY = 'codetop_marked_problems';
    const API_ENDPOINT = 'https://codetop.cc/api/questions/?page=1&ordering=-frequency&search=';
    const AUTH_ENDPOINT = 'https://codetop.cc/oauth/checkUser/?code=';
    const QR_CODE_URL = 'https://codetop.cc/img/codetopWechat.edeeba41.jpg';
    const REQUEST_DELAY = 300; // 请求间隔，防止被封

    let AUTH_TOKEN = '';

    console.log('[CodeTop] 脚本启动 - v1.0');

    // --- 核心工具函数 ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchData = (title, token) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_ENDPOINT + encodeURIComponent(title),
                headers: { 'Authorization': token },
                timeout: 10000,
                onload: (res) => {
                    // 2. 在这里添加打印代码，查看真实的服务器响应
                    console.log("👉【CodeTop 响应详情】:", res);
                    //console.log("👉【状态码】:", res.status);
                    //console.log("👉【返回内容】:", res.responseText);
                    if (res.status >= 200 && res.status < 300) {
                        try { resolve(JSON.parse(res.responseText)); } catch (e) { reject(new Error(`JSON解析失败`)); }
                    } else if (res.status === 401||res.status === 403) {
                        // 明确返回 401 错误
                        reject(new Error(`请求失败:${res.status}`));
                    }
                    else { reject(new Error(`请求失败: ${res.statusText}`)); }
                },
                onerror: () => reject(new Error(`网络错误`)),
                ontimeout: () => reject(new Error(`请求超时`))
            });
        });
    };

    // --- 标记逻辑 ---
    const toggleMark = async (title, starSpan) => {
        let markedMap = await GM_getValue(MARKED_STORAGE_KEY, {});
        if (markedMap[title]) {
            delete markedMap[title];
            starSpan.textContent = '☆';
            starSpan.style.color = '#ccc';
            starSpan.title = "点击标记为重点";
        } else {
            markedMap[title] = true;
            starSpan.textContent = '★';
            starSpan.style.color = '#ff4d4f';
            starSpan.title = "已标记 (点击取消)";
        }
        await GM_setValue(MARKED_STORAGE_KEY, markedMap);
    };

    // --- 核心渲染逻辑 (精准定位) ---
    const renderTags = async (titleContainer, info) => {
        if (!titleContainer.closest('.text-body')) return;

        const rowContainer = titleContainer.closest('div[class*="border-b"]') || titleContainer.parentElement?.parentElement?.parentElement;
        const rowText = rowContainer ? rowContainer.innerText : "";
        if (!/简单|中等|困难/.test(rowText)) return;

        const title = titleContainer.innerText.trim();
        const markedMap = await GM_getValue(MARKED_STORAGE_KEY, {});
        const isMarked = markedMap[title];

        // 1. 频率标签
        const parent = titleContainer.parentElement;
        if (parent) {
            let oldTag = parent.querySelector('.codetop-info-tag');
            if (oldTag) oldTag.remove();

            if (info) {
                const infoTag = document.createElement('span');
                infoTag.className = 'codetop-info-tag';
                infoTag.textContent = `🔥频度：${info.freq} |最近：${info.date}`;
                Object.assign(infoTag.style, {
                    marginLeft: '12px', padding: '2px 8px', backgroundColor: '#ffc107',
                    color: '#212529', borderRadius: '6px', fontSize: '12px',
                    fontWeight: '600', whiteSpace: 'nowrap', verticalAlign: 'middle',
                    fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace'
                });
                titleContainer.insertAdjacentElement('afterend', infoTag);
            }
        }

        // 2. 星星标记
        const textBody = titleContainer.closest('.text-body');
        if (textBody) {
            let oldStar = textBody.querySelector('.codetop-star-btn');
            if (oldStar) oldStar.remove();

            const starSpan = document.createElement('span');
            starSpan.className = 'codetop-star-btn';
            starSpan.textContent = isMarked ? '★' : '☆';
            Object.assign(starSpan.style, {
                cursor: 'pointer', fontSize: '22px', marginRight: '8px', marginLeft: '2px',
                color: isMarked ? '#ff4d4f' : '#ccc', lineHeight: '1',
                transition: 'transform 0.1s, color 0.2s', display: 'flex', alignItems: 'center'
            });
            starSpan.title = isMarked ? "已标记重点" : "标记为重点";
            starSpan.onmousedown = () => starSpan.style.transform = 'scale(0.8)';
            starSpan.onmouseup = () => starSpan.style.transform = 'scale(1)';
            starSpan.onmouseover = () => { if(!markedMap[title]) starSpan.style.color = '#ff4d4f'; };
            starSpan.onmouseout = () => { if(!markedMap[title]) starSpan.style.color = '#ccc'; };
            starSpan.onclick = (e) => {
                e.preventDefault(); e.stopPropagation(); toggleMark(title, starSpan);
            };
            textBody.style.display = 'flex';
            textBody.style.alignItems = 'center';
            textBody.insertBefore(starSpan, titleContainer);
        }
    };

    const getRealProblemElements = () => {
        return Array.from(document.querySelectorAll('.text-body .truncate'));
    };

    const displayInfoFromStorage = async () => {
        const storedData = await GM_getValue(DATA_STORAGE_KEY, {});
        const titleDivs = getRealProblemElements();
        for (const titleDiv of titleDivs) {
            if (titleDiv && titleDiv.innerText) {
                renderTags(titleDiv, storedData[titleDiv.innerText.trim()]);
            }
        }
    };

    const startUpdateProcess = async (button) => {
        AUTH_TOKEN = await GM_getValue(TOKEN_STORAGE_KEY, '');
        if (!AUTH_TOKEN) { showLoginPopup(button); return; }

        button.textContent = '更新中...'; button.disabled = true;
        let storedData = await GM_getValue(DATA_STORAGE_KEY, {});
        const problemItems = getRealProblemElements();

        if (problemItems.length === 0) {
             button.textContent = '未找到题目';
             setTimeout(() => { button.textContent = '更新CodeTop数据'; button.disabled = false; }, 3000);
             return;
        }

        for (let i = 0; i < problemItems.length; i++) {
            const titleDiv = problemItems[i];
            const title = titleDiv.innerText.trim();
            if (!title) continue;
            button.textContent = `更新: ${i + 1}/${problemItems.length}`;

            try {
                const data = await fetchData(title, AUTH_TOKEN);
                if (data && data.list && data.list.length > 0) {
                    const { value, time } = data.list[0];
                    storedData[title] = { freq: value, date: time ? time.substring(0, 10) : 'N/A' };
                    renderTags(titleDiv, storedData[title]);
                }
            } catch (error) {
                // --- 401 过期处理 ---
                if (error.message.includes("请求失败")) {
                    await GM_setValue(TOKEN_STORAGE_KEY, ''); // 清空旧 token
                    button.textContent = '授权过期';
                    button.disabled = false;

                    // 弹窗提示用户
                    alert("CodeTop 授权已过期，请重新扫码验证。");
                    showLoginPopup(button);
                    return; // 终止循环
                }
            }
            await sleep(REQUEST_DELAY);
        }
        await GM_setValue(DATA_STORAGE_KEY, storedData);
        button.textContent = '完成!';
        setTimeout(() => { button.textContent = '手动更新CodeTop数据'; button.disabled = false; }, 3000);
    };

    // --- 界面元素 ---
    const createUpdateButton = () => {
        if (document.getElementById('codetop-update-button')) return;
        const button = document.createElement('button');
        button.id = 'codetop-update-button';
        button.textContent = '更新CodeTop数据';
        Object.assign(button.style, {
            position: 'fixed', top: '80px', right: '25px', zIndex: '9999', padding: '8px 12px',
            backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        button.onclick = () => startUpdateProcess(button);
        document.body.appendChild(button);
    };

    const showLoginPopup = (originalButton) => {
        if (document.getElementById('codetop-login-popup')) return;
        const overlay = document.createElement('div');
        overlay.id = 'codetop-login-popup';
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '300px', textAlign: 'center'
        });

        // --- 修复：使用 margin: 10px auto 和 display: block 强制居中 ---
        modal.innerHTML = `
            <h3 style="margin-bottom:15px; font-weight:bold;">CodeTop 登录</h3>
            <img src="${QR_CODE_URL}" style="width: 150px; margin: 10px auto; display: block;">
            <p style="font-size:12px; color:#666; margin-bottom:10px;">微信扫码关注，点击“登录验证”获取</p>
            <input type="text" id="codetop-verify-code" placeholder="输入6位验证码" style="width: 80%; padding: 8px; margin: 10px 0; text-align: center; border: 1px solid #ddd; border-radius: 4px;">
            <button id="codetop-verify-btn" style="width: 85%; padding: 10px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top:5px;">验证</button>
            <div id="codetop-status-msg" style="color: red; margin-top: 8px; font-size: 12px; height: 16px;"></div>

            <div style="font-size:12px; color:#999; margin-top:15px; border-top:1px solid #eee; padding-top:10px; line-height:1.5; text-align: left; background: #f9f9f9; padding: 10px; border-radius: 4px;">
                ⚠️ <b>说明</b>：验证码服务由 <strong>CodeTop</strong> 官方提供，本脚本仅作为数据搬运助手。<br>
                数据来之不易，请大家多多关注支持 CodeTop！
            </div>
        `;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('codetop-verify-btn').onclick = function() {
            const btn = this; const msg = document.getElementById('codetop-status-msg');
            const code = document.getElementById('codetop-verify-code').value.trim();
            if (code.length !== 6) { msg.textContent = '请输入6位验证码'; return; }
            btn.textContent = '验证中...'; btn.disabled = true;
            GM_xmlhttpRequest({
                method: 'GET', url: AUTH_ENDPOINT + code,
                onload: async (res) => {
                    if (res.status === 200) {
                        try {
                            const d = JSON.parse(res.responseText);
                            if (d.token) {
                                await GM_setValue(TOKEN_STORAGE_KEY, 'Token ' + d.token);
                                msg.style.color = 'green'; msg.textContent = '验证成功！';
                                setTimeout(() => { overlay.remove(); if(originalButton) startUpdateProcess(originalButton); }, 800);
                            } else {
                                msg.style.color = 'red'; msg.textContent = d.message || '验证失败，请检查验证码';
                                btn.disabled = false; btn.textContent = '验证';
                            }
                        } catch(e) { msg.textContent = '解析错误'; btn.disabled = false; btn.textContent = '验证'; }
                    } else { msg.textContent = '网络错误'; btn.disabled = false; btn.textContent = '验证'; }
                }
            });
        };
        overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
    };

    // --- Main ---
    function main() {
        createUpdateButton();
        GM_registerMenuCommand('重新登录', () => showLoginPopup(document.getElementById('codetop-update-button')));
        GM_registerMenuCommand('导出重点题目', async () => {
            const marked = await GM_getValue(MARKED_STORAGE_KEY, {});
            prompt('已标记题目:', Object.keys(marked).join('\n'));
        });

        let stableCount = 0; let lastCount = -1;
        const timer = setInterval(() => {
            const count = getRealProblemElements().length;
            if (count > 0 && count === lastCount) stableCount++;
            else stableCount = 0;
            lastCount = count;

            if (stableCount >= 2) {
                displayInfoFromStorage();
                clearInterval(timer);
                setInterval(displayInfoFromStorage, 2000);
            }
        }, 800);
    }

    if (document.readyState === 'complete') main(); else window.addEventListener('load', main);
})();