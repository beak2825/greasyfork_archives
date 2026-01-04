// ==UserScript==
// @name         网页内容编辑开关（可隐藏）
// @namespace    https://t.me/Flymirai
// @version      2025-11-21
// @license      MIT
// @description  在右下角添加一个按钮，点击可切换网页编辑模式，关闭时按钮可隐藏并通过点击热区重新显示
// @author       TG@Flymirai
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556477/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E7%BC%96%E8%BE%91%E5%BC%80%E5%85%B3%EF%BC%88%E5%8F%AF%E9%9A%90%E8%97%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556477/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E7%BC%96%E8%BE%91%E5%BC%80%E5%85%B3%EF%BC%88%E5%8F%AF%E9%9A%90%E8%97%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.innerText = '编辑模式: 关';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '8px 12px';
    btn.style.backgroundColor = '#0078d7';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    document.body.appendChild(btn);

    // 创建热区（透明点击区域）
    const hotspot = document.createElement('div');
    hotspot.style.position = 'fixed';
    hotspot.style.bottom = '20px';
    hotspot.style.right = '20px';
    hotspot.style.width = '80px';
    hotspot.style.height = '40px';
    hotspot.style.zIndex = '9998';
    hotspot.style.cursor = 'pointer';
    hotspot.style.backgroundColor = 'transparent';
    document.body.appendChild(hotspot);

    // 初始状态
    let editing = false;

    // 点击按钮切换编辑模式
    btn.addEventListener('click', () => {
        editing = !editing;
        document.designMode = editing ? 'on' : 'off';
        btn.innerText = `编辑模式: ${editing ? '开' : '关'}`;
        btn.style.backgroundColor = editing ? '#28a745' : '#0078d7';

        // 如果关闭编辑模式 → 隐藏按钮
        if (!editing) {
            btn.style.display = 'none';
        }
    });

    // 点击热区重新显示按钮
    hotspot.addEventListener('click', () => {
        if (btn.style.display === 'none') {
            btn.style.display = 'block';
        }
    });
})();