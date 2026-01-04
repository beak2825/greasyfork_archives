// ==UserScript==
// @name         Gitlab - 复制issue标题和评论
// @namespace    http://tampermonkey.net/
// @version      2025-11-12.008
// @description  复制issue标题和评论内容到剪贴板
// @author       无锡疏创信息科技有限公司
// @match        https://gitlab.scsoi.com:*/*
// @match        http://gitlab.scsoi.com:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555480/Gitlab%20-%20%E5%A4%8D%E5%88%B6issue%E6%A0%87%E9%A2%98%E5%92%8C%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/555480/Gitlab%20-%20%E5%A4%8D%E5%88%B6issue%E6%A0%87%E9%A2%98%E5%92%8C%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * 作者：无锡疏创信息科技有限公司
 * 许可证：GPL-3.0
 * 允许自由使用、修改和分发，但必须保持相同许可证
 * 禁止商业用途闭源使用
 */

(() => {
    'use strict';

    // 检查当前页面URL是否包含gitlab关键字（不区分大小写）
    if (!window.location.href.toLowerCase().includes('gitlab')) {
        console.log('当前页面不包含gitlab关键字，脚本退出');
        return;
    }

    // 添加动画样式
    document.head.appendChild(Object.assign(document.createElement('style'), {
        textContent: '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}'
    }));

    // 工具函数：等待元素
    const waitFor = (selector, cb, maxAttempts = 10) => {
        let n = 0;
        const i = setInterval(() => {
            const el = document.querySelector(selector);
            if (el || n++ > maxAttempts) clearInterval(i), el && cb(el);
        }, 500);
    };

    // 工具函数：等待页面加载
    const whenReady = cb => (document.readyState === 'complete' || document.readyState === 'interactive')
        ? setTimeout(cb, 500) : addEventListener('DOMContentLoaded', () => setTimeout(cb, 500));

    // 等待页面加载完成后执行
    whenReady(() => {
        const issueNumber = location.pathname.split('/').pop();

        // 标题复制按钮
        waitFor('.title-container .title.qa-title', title => {
            const titleText = title.textContent.trim();
            const fullText = `#${issueNumber} ${titleText}`;
            const urlText = `${fullText}\n\n${location.href}\n\n此票已完成，请核收。`;

            // 创建按钮的通用函数
            const createButton = (text, gradient, minWidth) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.cssText = `
                    margin-left:10px;cursor:pointer;background:${gradient};color:white;border:none;
                    padding:8px 24px;border-radius:8px;font-size:14px;font-weight:500;
                    box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.3s;white-space:nowrap;min-width:${minWidth}px;
                `;
                btn.onmouseenter = () => btn.style.transform = 'translateY(-2px)';
                btn.onmouseleave = () => btn.style.transform = 'translateY(0)';
                return btn;
            };

            // 带URL按钮
            const btn1 = createButton('📋 验收(含链接)', 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 160);
            btn1.onclick = () => {
                navigator.clipboard.writeText(urlText).then(() => {
                    const t = btn1.textContent;
                    btn1.textContent = '✓ 已复制';
                    btn1.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
                    setTimeout(() => (btn1.textContent = t, btn1.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'), 2000);
                });
            };

            // 仅标题按钮
            const btn2 = createButton('📋 提交', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 100);
            btn2.onclick = () => {
                navigator.clipboard.writeText(fullText).then(() => {
                    const t = btn2.textContent;
                    btn2.textContent = '✓ 已复制';
                    btn2.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
                    setTimeout(() => (btn2.textContent = t, btn2.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'), 2000);
                });
            };

            title.parentNode.insertBefore(btn1, title.nextSibling);
            title.parentNode.insertBefore(btn2, btn1.nextSibling);
        });

        // 评论复制功能
        const addCopyButtons = () => {
            document.querySelectorAll('.note-wrapper.is-editable').forEach(note => {
                if (note.querySelector('.copy-comment-button')) return;

                const noteText = note.querySelector('.note-text');
                const noteUrl = note.querySelector('.js-btn-copy-note-link')?.getAttribute('data-clipboard-text');
                if (!noteText || !noteUrl) return;

                const temp = document.createElement('div');
                temp.innerHTML = noteText.innerHTML;
                const text = temp.textContent || temp.innerText || '';
                const issueTitle = document.querySelector('.title-container .title.qa-title')?.textContent.trim() || '';
                const copyText = `#${issueNumber} ${issueTitle}\n\n${noteUrl}\n\n${text}`;

                const btn = document.createElement('button');
                btn.className = 'copy-comment-button note-action-button btn btn-transparent';
                btn.title = '复制评论内容';
                btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                btn.style.cssText = `
                    margin-left:5px;border:none;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
                    padding:6px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;
                    width:32px;height:32px;box-shadow:0 3px 10px rgba(102,126,234,0.3);transition:all 0.3s;
                `;

                // 交互效果
                btn.onmouseenter = () => {
                    btn.style.background = 'linear-gradient(135deg,#5a6fd8 0%,#6a4190 100%)';
                    btn.style.transform = 'translateY(-2px) scale(1.05)';
                    btn.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
                };
                btn.onmouseleave = () => {
                    btn.style.background = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';
                    btn.style.transform = 'translateY(0) scale(1)';
                    btn.style.boxShadow = '0 3px 10px rgba(102,126,234,0.3)';
                };
                btn.onmousedown = () => btn.style.transform = 'translateY(0) scale(0.92)';
                btn.onmouseup = () => btn.style.transform = 'translateY(-2px) scale(1.05)';

                // 复制功能
                btn.onclick = () => {
                    navigator.clipboard.writeText(copyText).then(() => {
                        const origBg = btn.style.background, origShadow = btn.style.boxShadow, origTrans = btn.style.transform, origHtml = btn.innerHTML;
                        btn.style.background = 'linear-gradient(135deg,#11998e 0%,#38ef7d 100%)';
                        btn.style.boxShadow = '0 6px 20px rgba(56,239,125,0.5)';
                        btn.style.transform = 'translateY(-2px) scale(1.1)';
                        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

                        // 提示
                        const r = btn.getBoundingClientRect();
                        const toast = document.createElement('div');
                        toast.textContent = '✓ 已复制';
                        toast.style.cssText = `
                            position:fixed;left:${r.left}px;top:${r.bottom + 8}px;background:#4caf50;color:white;
                            padding:8px 14px;border-radius:6px;font-size:13px;font-weight:600;
                            box-shadow:0 4px 12px rgba(76,175,80,0.4);z-index:10000;animation:slideIn 0.3s;white-space:nowrap;
                        `;
                        document.body.appendChild(toast);

                        setTimeout(() => {
                            btn.style.background = origBg; btn.style.boxShadow = origShadow; btn.style.transform = origTrans; btn.innerHTML = origHtml;
                            toast.style.animation = 'slideOut 0.3s'; setTimeout(() => toast.remove(), 300);
                        }, 1500);
                    });
                };

                // 插入按钮
                const actions = note.querySelector('.note-actions');
                if (!actions) return;
                const more = actions.querySelector('.more-actions'), edit = actions.querySelector('.js-note-edit');
                if (more) more.parentNode.insertBefore(btn, more);
                else if (edit) edit.parentNode.insertBefore(btn, edit.nextSibling);
                else actions.appendChild(btn);
            });
        };

        // 初始和监听
        addCopyButtons();
        setTimeout(() => {
            const list = document.getElementById('notes-list');
            if (list) new MutationObserver(m => m.forEach(x => x.addedNodes.length > 0 && addCopyButtons())).observe(list, {childList: true, subtree: true});
        }, 1000);
    });
})();
