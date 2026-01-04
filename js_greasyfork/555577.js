// ==UserScript==
// @name         Gitlab - 一键转入UAT
// @namespace    http://tampermonkey.net/
// @version      2025-11-12.007
// @description  Gitlab - 一键添加UAT标签评论并提交
// @author       无锡疏创信息科技有限公司
// @match        https://gitlab.scsoi.com:*/*
// @match        http://gitlab.scsoi.com:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555577/Gitlab%20-%20%E4%B8%80%E9%94%AE%E8%BD%AC%E5%85%A5UAT.user.js
// @updateURL https://update.greasyfork.org/scripts/555577/Gitlab%20-%20%E4%B8%80%E9%94%AE%E8%BD%AC%E5%85%A5UAT.meta.js
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
 * 作者:无锡疏创信息科技有限公司
 * 许可证:GPL-3.0
 * 允许自由使用、修改和分发,但必须保持相同许可证
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

    // 工具函数:等待元素
    const waitFor = (selector, cb, maxAttempts = 10) => {
        let n = 0;
        const i = setInterval(() => {
            const el = document.querySelector(selector);
            if (el || n++ > maxAttempts) clearInterval(i), el && cb(el);
        }, 500);
    };

    // 工具函数:等待页面加载
    const whenReady = cb => (document.readyState === 'complete' || document.readyState === 'interactive')
        ? setTimeout(cb, 500) : addEventListener('DOMContentLoaded', () => setTimeout(cb, 500));

    // 等待页面加载完成后执行
    whenReady(() => {
        // 在标题区域添加"一键转入UAT"按钮
        waitFor('.title-container .title.qa-title', title => {
            // 创建按钮
            const uatBtn = document.createElement('button');
            uatBtn.textContent = '🚀 一键转UAT';
            uatBtn.style.cssText = `
                margin-left:10px;cursor:pointer;background:linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                color:white;border:none;padding:8px 24px;border-radius:8px;font-size:14px;font-weight:500;
                box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.3s;white-space:nowrap;min-width:140px;
            `;
            uatBtn.onmouseenter = () => {
                uatBtn.style.transform = 'translateY(-2px)';
                uatBtn.style.boxShadow = '0 4px 12px rgba(250,112,154,0.4)';
            };
            uatBtn.onmouseleave = () => {
                uatBtn.style.transform = 'translateY(0)';
                uatBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            };

            // 点击事件:填充评论并提交
            uatBtn.onclick = () => {
                // 查找评论输入框
                const commentTextarea = document.querySelector('#note-body, .js-main-target-form textarea, textarea[name="note[note]"]');
                if (!commentTextarea) {
                    alert('未找到评论输入框');
                    return;
                }

                // 填充评论内容
                commentTextarea.value = '/label ~"S::UAT"';
                commentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                commentTextarea.dispatchEvent(new Event('change', { bubbles: true }));

                // 查找提交按钮并点击
                setTimeout(() => {
                    const submitBtn = document.querySelector('.js-comment-submit-button, button[type="submit"].btn-success, .js-comment-button');
                    if (submitBtn) {
                        submitBtn.click();

                        // 显示成功提示
                        const toast = document.createElement('div');
                        toast.textContent = '✓ 已转入UAT';
                        toast.style.cssText = `
                            position:fixed;top:20px;right:20px;background:#4caf50;color:white;
                            padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;
                            box-shadow:0 4px 12px rgba(76,175,80,0.4);z-index:10000;animation:slideIn 0.3s;
                        `;
                        document.body.appendChild(toast);

                        setTimeout(() => {
                            toast.style.animation = 'slideOut 0.3s';
                            setTimeout(() => toast.remove(), 300);
                        }, 2000);
                    } else {
                        alert('未找到提交按钮');
                    }
                }, 100);
            };

            // 插入按钮到标题旁边
            title.parentNode.insertBefore(uatBtn, title.nextSibling);
        });
    });
})();
