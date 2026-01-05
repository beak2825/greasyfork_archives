// ==UserScript==
// @name         Bangumi 终端
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 bgm.tv 显示本地 AI 生成的用户画像和手动备注，支持复制 Markdown 和复杂链接格式
// @author       You
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      127.0.0.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558186/Bangumi%20%E7%BB%88%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/558186/Bangumi%20%E7%BB%88%E7%AB%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE = "http://127.0.0.1:8000";
    let hoverTimer = null;
    let currentUid = null;
    let currentAiRaw = ""; // 存储原始 Markdown 数据用于复制

    // --- CSS 样式 ---
    const css = `
        #bgm-detective-card {
            position: absolute;
            z-index: 10000;
            width: 380px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            padding: 0;
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            font-family: "Microsoft YaHei", sans-serif;
            overflow: hidden;
            pointer-events: none;
        }
        #bgm-detective-card.visible {
            display: block;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        .bd-header {
            background: linear-gradient(90deg, #f09199, #ffc0cb);
            color: white;
            padding: 8px 12px;
            font-size: 13px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bd-status {
            font-size: 10px;
            background: rgba(0,0,0,0.2);
            padding: 2px 6px;
            border-radius: 4px;
        }
        .bd-content {
            padding: 12px;
            max-height: 400px;
            overflow-y: auto;
        }
        .bd-section {
            margin-bottom: 12px;
        }
        .bd-label {
            font-size: 12px;
            color: #f09199;
            font-weight: bold;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bd-text {
            font-size: 12px;
            color: #444;
            line-height: 1.5;
            background: rgba(255,255,255,0.6);
            padding: 8px;
            border-radius: 6px;
            border: 1px solid rgba(0,0,0,0.05);
            white-space: pre-wrap;
        }
        .bd-text.ai {
            max-height: 200px;
            overflow-y: auto;
            border-left: 3px solid #f09199;
        }
        /* 编辑与复制按钮样式 */
        .bd-action-btn {
            cursor: pointer;
            color: #999;
            font-size: 10px;
            text-decoration: none;
            margin-left: 8px;
            transition: color 0.2s;
        }
        .bd-action-btn:hover { color: #f09199; text-decoration: underline; }

        .bd-textarea {
            width: 100%;
            height: 80px;
            font-size: 12px;
            padding: 5px;
            border: 1px solid #f09199;
            border-radius: 4px;
            box-sizing: border-box;
            font-family: inherit;
            resize: vertical;
        }
        .bd-actions {
            margin-top: 5px;
            text-align: right;
        }
        .bd-btn {
            background: #f09199;
            color: white;
            border: none;
            padding: 4px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
        }
        .bd-btn:hover { background: #e07179; }
        /* 滚动条美化 */
        #bgm-detective-card ::-webkit-scrollbar { width: 4px; }
        #bgm-detective-card ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
    `;
    GM_addStyle(css);

    // --- 创建 UI 元素 ---
    const card = document.createElement('div');
    card.id = 'bgm-detective-card';
    card.innerHTML = `
        <div class="bd-header">
            <span>终端 <span id="bd-uid"></span></span>
            <span class="bd-status" id="bd-status">Loading...</span>
        </div>
        <div class="bd-content">
            <div class="bd-section" id="sec-manual">
                <div class="bd-label">
                    <span>📝 手动档案</span>
                    <span class="bd-action-btn" id="btn-edit">编辑</span>
                </div>
                <div class="bd-text" id="content-manual">无备注。</div>
                <div id="editor-manual" style="display:none;">
                    <textarea class="bd-textarea" id="input-remark"></textarea>
                    <div class="bd-actions">
                        <button class="bd-btn" id="btn-save">保存档案</button>
                    </div>
                </div>
            </div>
            <div class="bd-section" id="sec-ai">
                <div class="bd-label">
                    <span>🤖 AI 侧写 (自动)</span>
                    <span class="bd-action-btn" id="btn-copy">复制 Markdown</span>
                </div>
                <div class="bd-text ai" id="content-ai">暂无数据。</div>
            </div>
        </div>
    `;
    document.body.appendChild(card);

    // --- 逻辑处理 ---

    const els = {
        uid: document.getElementById('bd-uid'),
        status: document.getElementById('bd-status'),
        manual: document.getElementById('content-manual'),
        ai: document.getElementById('content-ai'),
        editBtn: document.getElementById('btn-edit'),
        copyBtn: document.getElementById('btn-copy'),
        editor: document.getElementById('editor-manual'),
        input: document.getElementById('input-remark'),
        saveBtn: document.getElementById('btn-save'),
        card: card
    };

    // 绑定编辑/保存事件
    els.editBtn.addEventListener('click', () => {
        els.manual.style.display = 'none';
        els.editor.style.display = 'block';
        els.input.value = els.manual.innerText === "无备注。" ? "" : els.manual.innerText;
        els.input.focus();
    });

    els.saveBtn.addEventListener('click', () => {
        if(!currentUid) return;
        const text = els.input.value;
        saveRemark(currentUid, text);
    });

    // 绑定复制事件
    els.copyBtn.addEventListener('click', () => {
        if (!currentAiRaw) return;

        // 优先使用 GM_setClipboard 兼容性更好，或者使用 navigator
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(currentAiRaw, 'text');
        } else {
            navigator.clipboard.writeText(currentAiRaw);
        }

        const originalText = els.copyBtn.innerText;
        els.copyBtn.innerText = "✅ 已复制";
        els.copyBtn.style.color = "#4CAF50";

        setTimeout(() => {
            els.copyBtn.innerText = originalText;
            els.copyBtn.style.color = "";
        }, 1500);
    });

    // 鼠标移入卡片时，保持显示
    card.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
    });
    card.addEventListener('mouseleave', () => {
        hideCard();
    });

    function saveRemark(uid, text) {
        els.status.innerText = "保存中...";
        GM_xmlhttpRequest({
            method: "POST",
            url: `${API_BASE}/api/remark`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ uid: uid, remark: text }),
            onload: function(response) {
                if (response.status === 200) {
                    els.status.innerText = "已保存";
                    els.manual.innerText = text || "无备注。";
                    els.manual.style.display = 'block';
                    els.editor.style.display = 'none';
                } else {
                    els.status.innerText = "保存失败";
                }
            },
            onerror: function() {
                els.status.innerText = "服务器错误";
            }
        });
    }

    function fetchProfile(uid) {
        els.uid.innerText = `(${uid})`;
        els.status.innerText = "连接中...";
        els.ai.innerHTML = "查询中...";
        els.manual.innerText = "...";
        els.editor.style.display = 'none';
        els.manual.style.display = 'block';
        currentAiRaw = ""; // 重置原始文本

        GM_xmlhttpRequest({
            method: "GET",
            url: `${API_BASE}/api/user/${uid}`,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.has_data) {
                            els.status.innerText = "Ready";

                            // 保存原始 Markdown 供复制使用
                            currentAiRaw = data.ai_profile;

                            // 处理 AI 文本中的引用链接格式
                            // 正则修改：匹配 {文本=ID} 或 {文本=ID-额外信息}
                            // 兼容格式如：{新闻联播是洗脑吗？=444344-#12-1}
                            // [^={}]+? : 匹配左侧文本
                            // [^}]+?   : 匹配右侧ID（包含数字、连字符、井号等）
                            let aiHtml = data.ai_profile.replace(/\{\s*([^={}]+?)\s*=\s*([^}]+?)\s*\}/g,
                                '<a href="https://bgm.tv/group/topic/$2" target="_blank" style="color:#0084b4;text-decoration:underline" title="点击跳转">$1</a>');

                            // 换行处理
                            aiHtml = aiHtml.replace(/\n/g, '<br>');

                            els.ai.innerHTML = aiHtml || "AI 未生成画像 (数据量不足)";
                            els.manual.innerText = data.manual_remark || "无备注。";
                        } else {
                            els.status.innerText = "无本地数据";
                            els.ai.innerHTML = "本地数据库中未找到此用户记录。";
                            els.manual.innerText = data.manual_remark || "无备注。";
                        }
                    } catch(e) {
                        console.error(e);
                        els.status.innerText = "解析错误";
                        els.ai.innerText = "JSON Error";
                    }
                } else {
                    els.status.innerText = "Error " + response.status;
                    els.ai.innerText = "API 请求失败";
                }
            },
            onerror: function(err) {
                els.status.innerText = "离线";
                els.ai.innerHTML = "无法连接本地后端。<br>请确认 bgm_server.py 已运行。";
                els.manual.innerText = "无法获取。";
            }
        });
    }

    function showCard(x, y, uid) {
        currentUid = uid;

        // 简单的位置判断，防止溢出屏幕右侧
        let left = x + 10;
        if (left + 380 > window.innerWidth) {
            left = x - 390;
        }

        card.style.left = `${left}px`;
        card.style.top = `${y + 10}px`;
        card.classList.add('visible');

        fetchProfile(uid);
    }

    function hideCard() {
        hoverTimer = setTimeout(() => {
            card.classList.remove('visible');
            // 不清空 currentUid 以防快速移回
        }, 300);
    }

    // --- 事件代理：监听所有用户链接的悬停 ---
    // 匹配规则：/user/username 或 /user/123456
    const userLinkRegex = /^\/user\/([a-zA-Z0-9_]+)$/;

    document.body.addEventListener('mouseover', function(e) {
        let target = e.target;
        // 向上查找 a 标签（防止 hover 到 img 或 span）
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }

        if (!target) return;

        const href = target.getAttribute('href');
        if (!href) return;

        const match = href.match(userLinkRegex);
        if (match) {
            const uid = match[1];

            clearTimeout(hoverTimer);
            // 只有当卡片未显示或显示的不是当前用户时才延迟显示
            if (!card.classList.contains('visible') || currentUid !== uid) {
               hoverTimer = setTimeout(() => {
                   // 获取鼠标位置 (由于是 delay，使用 rect 计算)
                   const rect = target.getBoundingClientRect();
                   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                   showCard(rect.right, rect.top + scrollTop, uid);
               }, 600); // 600ms 延迟，避免划过时乱弹
            }
        }
    });

    document.body.addEventListener('mouseout', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        if (target && target.getAttribute('href') && target.getAttribute('href').match(userLinkRegex)) {
            clearTimeout(hoverTimer);
            hideCard();
        }
    });

})();