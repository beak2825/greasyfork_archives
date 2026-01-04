// ==UserScript==
// @name         长按删除网页元素（v1.4 修复菜单闪退）
// @namespace    custom-longpress-delete
// @version      1.4
// @description  安卓浏览器长按弹菜单：删除/取消，带高亮，点击外部关闭，修复菜单闪一下就消失的问题。
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550159/%E9%95%BF%E6%8C%89%E5%88%A0%E9%99%A4%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%EF%BC%88v14%20%E4%BF%AE%E5%A4%8D%E8%8F%9C%E5%8D%95%E9%97%AA%E9%80%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550159/%E9%95%BF%E6%8C%89%E5%88%A0%E9%99%A4%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%EF%BC%88v14%20%E4%BF%AE%E5%A4%8D%E8%8F%9C%E5%8D%95%E9%97%AA%E9%80%80%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LONGPRESS_DELAY = 600;
    const MAX_Z = 2147483647;

    let longPressTimer = null;
    let pressedElement = null;
    let originalStyles = new WeakMap();
    let menuVisible = false;
    let touchActive = false;

    // ===== 菜单 =====
    const menu = document.createElement('div');
    Object.assign(menu.style, {
        position: 'fixed',
        display: 'none',
        padding: '10px 14px',
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.88)',
        color: '#fff',
        fontSize: '16px',
        zIndex: String(MAX_Z),
        userSelect: 'none',
        boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        minWidth: '130px',
        textAlign: 'center',
        transform: 'translate(-50%, -120%)'
    });

    const delBtn = document.createElement('div');
    delBtn.innerText = '删除元素';
    delBtn.style.padding = '8px 0';
    delBtn.style.cursor = 'pointer';
    delBtn.onclick = e => {
        e.stopPropagation();
        if (pressedElement) pressedElement.remove();
        hideMenu();
    };

    const cancelBtn = document.createElement('div');
    cancelBtn.innerText = '取消';
    cancelBtn.style.padding = '8px 0';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.marginTop = '6px';
    cancelBtn.style.borderTop = '1px solid rgba(255,255,255,0.15)';
    cancelBtn.onclick = e => {
        e.stopPropagation();
        hideMenu();
    };

    menu.appendChild(delBtn);
    menu.appendChild(cancelBtn);
    document.body.appendChild(menu);

    // ===== 显示 / 隐藏 =====
    function showMenuAt(x, y) {
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.display = 'block';
        menuVisible = true;
    }

    function hideMenu() {
        if (pressedElement && originalStyles.has(pressedElement)) {
            const orig = originalStyles.get(pressedElement);
            pressedElement.style.outline = orig.outline || '';
            pressedElement.style.outlineOffset = orig.outlineOffset || '';
            originalStyles.delete(pressedElement);
        }
        pressedElement = null;
        menu.style.display = 'none';
        menuVisible = false;
    }

    // ===== 事件绑定 =====
    document.addEventListener('touchstart', e => {
        if (e.target.closest('#longpress-menu')) return;
        touchActive = true;
        pressedElement = e.target;

        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;

        longPressTimer = setTimeout(() => {
            if (!pressedElement) return;

            // 保存并高亮
            originalStyles.set(pressedElement, {
                outline: pressedElement.style.outline || '',
                outlineOffset: pressedElement.style.outlineOffset || ''
            });
            pressedElement.style.outline = '3px solid rgba(255,0,0,0.6)';
            pressedElement.style.outlineOffset = '-3px';

            showMenuAt(x, y);
            e.preventDefault(); // 阻止原生长按菜单
        }, LONGPRESS_DELAY);
    }, { passive: false });

    document.addEventListener('touchmove', e => {
        // 移动时只取消未触发的长按
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }, { passive: true });

    document.addEventListener('touchend', e => {
        touchActive = false;
        clearTimeout(longPressTimer);
        longPressTimer = null;

        if (menuVisible) {
            // 如果点击在菜单外部，就关闭
            if (!e.target.closest('#longpress-menu')) {
                hideMenu();
            }
        } else {
            pressedElement = null;
        }
    }, { passive: true });

    document.addEventListener('touchcancel', () => {
        touchActive = false;
        clearTimeout(longPressTimer);
        longPressTimer = null;
        hideMenu();
    });

    // 滚动时收起菜单
    window.addEventListener('scroll', () => {
        if (menuVisible) hideMenu();
    }, { passive: true });

    // 拦截 contextmenu
    document.addEventListener('contextmenu', e => {
        if (menuVisible) e.preventDefault();
    }, true);
})();