// ==UserScript==
// @name         Grok Imagine 视频自动绕过 Content Moderated v3.3（纯箭头终极版）
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  完全保留你风格 + 完美支持无文字纯向上箭头按钮
// @author       You + Grok
// @match        https://grok.x.ai/*
// @match        https://x.com/i/grok*
// @match        https://grok.com/imagine*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557969/Grok%20Imagine%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BB%95%E8%BF%87%20Content%20Moderated%20v33%EF%BC%88%E7%BA%AF%E7%AE%AD%E5%A4%B4%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557969/Grok%20Imagine%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BB%95%E8%BF%87%20Content%20Moderated%20v33%EF%BC%88%E7%BA%AF%E7%AE%AD%E5%A4%B4%E7%BB%88%E6%9E%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区（你原来的） ====================
    let customPrompt = localStorage.getItem('grokAutoRetry_prompt') || "A peaceful mountain lake at sunset, cinematic lighting, highly detailed, 4K";
    let enabled = localStorage.getItem('grokAutoRetry_enabled') !== 'false';
    let regenerateText = localStorage.getItem('grokAutoRetry_regenerateText') || ""; // 现在允许留空！
    // =================================================================

    // 控制面板（和你原来一模一样，只是提示更清楚）
    const panel = document.createElement('div');
    panel.style.cssText = `position:fixed;top:10px;right:10px;width:280px;background:#1e1e1e;border:1px solid #444;border-radius:12px;padding:12px;z-index:99999;font-family:system-ui;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.6);`;
    panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:8px;">Grok 视频自动重试 v3.3</div>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" id="toggle" ${enabled?'checked':''}> <span>自动替换并重试</span>
        </label>
        <div style="margin:10px 0 6px;font-size:13px;color:#aaa;">备用提示词：</div>
        <textarea id="promptInput" style="width:100%;height:40px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;padding:8px;font-size:13px;">${customPrompt}</textarea>
        <div style="margin:10px 0 6px;font-size:13px;color:#aaa;">按钮文本（可留空自动识别箭头）：</div>
        <input type="text" id="regenerateInput" value="${regenerateText}" placeholder="留空 = 自动点击纯箭头" style="width:100%;padding:8px;background:#333;color:#fff;border:1px solid #555;border-radius:8px;font-size:13px;">
        <button id="saveBtn" style="width:100%;margin-top:10px;padding:10px;background:#00a2ff;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">保存所有设置</button>
    `;
    document.body.appendChild(panel);

    // 保存设置（不变）
    document.getElementById('saveBtn').addEventListener('click', () => {
        customPrompt = document.getElementById('promptInput').value.trim() || customPrompt;
        regenerateText = document.getElementById('regenerateInput').value.trim(); // 允许为空
        localStorage.setItem('grokAutoRetry_prompt', customPrompt);
        localStorage.setItem('grokAutoRetry_regenerateText', regenerateText);
        localStorage.setItem('grokAutoRetry_enabled', enabled);
        alert('所有设置已保存！\n留空按钮文本 = 自动识别纯箭头');
    });

    document.getElementById('toggle').addEventListener('change', e => {
        enabled = e.target.checked;
        localStorage.setItem('grokAutoRetry_enabled', enabled);
    });

    // ==================== 填输入框（你原来的 + 增强） ====================
    function fillInput(text) {
        const input = document.querySelector('textarea.w-full.px-3.pe-16') ||
                      document.querySelector('textarea[placeholder*="Describe" i]') ||
                      document.querySelector('textarea') ||
                      document.querySelector('div[contenteditable="true"]'); // 新增支持 div

        if (!input) return false;

        input.focus();
        if (input.isContentEditable) {
            input.innerText = text;
            ['input', 'keydown', 'keyup', 'change'].forEach(ev =>
                input.dispatchEvent(new Event(ev, {bubbles: true}))
            );
        } else {
            const lastValue = input.value;
            input.value = text;
            const tracker = input._valueTracker;
            if (tracker) tracker.setValue(lastValue);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return true;
    }

    // ==================== 核心升级：点击重新生成按钮（支持纯箭头） ====================
    function clickRegenerate() {
        // 方案1：用户填写了按钮文本 → 按文本点击（你原来的逻辑）
        if (regenerateText) {
            const btn = Array.from(document.querySelectorAll('button, [role="button"]'))
                .find(b => b.textContent.trim() === regenerateText ||
                          b.textContent.trim().toLowerCase().includes(regenerateText.toLowerCase()));
            if (btn) {
                btn.click();
                console.log('Grok AutoRetry: 已按文本点击 →', btn.textContent.trim());
                return true;
            }
        }

        // 方案2：留空或没匹配到 → 自动识别最新版“纯向上箭头”按钮（2025.12 实测精准）
        const arrowPath = document.querySelector('svg path[d="M5 11L12 4M12 4L19 11M12 4V21"]') ||
                          document.querySelector('svg path[d*="M5 11L12 4"]');
        if (arrowPath) {
            const btn = arrowPath.closest('button') ||
                        arrowPath.closest('div[role="button"]') ||
                        arrowPath.closest('div[tabindex="0"]');
            if (btn && getComputedStyle(btn).cursor === 'pointer') {
                btn.click();
                console.log('Grok AutoRetry: 已成功点击纯向上箭头按钮');
                return true;
            }
        }

        // 方案3：终极兜底（错误提示附近第一个可点击元素）
        const errorDiv = Array.from(document.querySelectorAll('div'))
            .find(d => /Content Moderated|内容已屏蔽|Try a different idea/.test(d.textContent));
        if (errorDiv) {
            const btn = errorDiv.querySelector('button, [role="button"], svg');
            if (btn) { btn.click(); return true; }
        }

        return false;
    }

    // ==================== 主检测循环（你原来的节奏） ====================
    setInterval(() => {
        if (!enabled || window._running) return;

        const hasModerated = /Content Moderated|内容已屏蔽|Try a different idea/.test(document.body.textContent);
        if (hasModerated && !window._hasRetried) {
            window._running = true;
            window._hasRetried = true;
            console.log('Grok AutoRetry v3.3: 检测到被拒 → 自动替换提示词 + 点击重试');

            setTimeout(() => {
                if (fillInput(customPrompt)) {
                    setTimeout(clickRegenerate, 500);
                }
                setTimeout(() => {
                    window._hasRetried = false;
                    window._running = false;
                }, 10000);
            }, 800);
        }
    }, 1000);

    console.log('Grok 视频自动重试 v3.3 已加载（完美支持纯向上箭头！）');
})();