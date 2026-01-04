// ==UserScript==
// @name         页面编辑功能
// @namespace    www.leizingyiu.net
// @author       leizingyiu
// @include      *://*/*
// @license      GNU AGPLv3
// @version      20250812
// @grant        none
// @description  alt + z : 编辑文本 ； alt + x : 结束编辑文本 ； alt + c : 编辑块 ； alt + z : 结束编辑块
// @downloadURL https://update.greasyfork.org/scripts/552221/%E9%A1%B5%E9%9D%A2%E7%BC%96%E8%BE%91%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/552221/%E9%A1%B5%E9%9D%A2%E7%BC%96%E8%BE%91%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const show = hint;
    const print = console.log;

    const config = {
        "z": editTrue,
        "x": editFalse,

        "c": editDomStart,
        "v": editDomEnd,
    };

    function editTrue() {
        document.querySelectorAll("*").forEach(el => {
            el.setAttribute("contenteditable", true);
        });
        show("✅ 页面已设置为可编辑");
    }

    function editFalse() {
        document.querySelectorAll("*").forEach(el => {
            el.setAttribute("contenteditable", false);
        });
        show("✅ 页面已设置为不可编辑");
    }

    function editDomStart() {
        let selected = null;
        let styleTag = document.createElement('style');
        styleTag.id = 'dom-selection-style';
        styleTag.innerHTML = `
      .selected {
        outline: 2px solid rgba(0, 123, 255, 0.7)!important;
        box-shadow: 0 0 8px 2px rgba(0, 123, 255, 0.7);
        cursor: pointer;
      }
    `;
        document.head.appendChild(styleTag);

        const selectElement = (el) => {
            if (!el) return;
            if (selected) selected.classList.remove('selected');
            selected = el;
            selected.classList.add('selected');
            //selected.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const onMouseEnter = (e) => {
            if (e.target === document.body || e.target === document.documentElement) return;
            if (selected) selected.classList.remove('selected');
            selected = e.target;
            selected.classList.add('selected');
        };

        const onMouseOut = (e) => {
            if (e.target === selected) {
                selected.classList.remove('selected');
                selected = null;
            }
        };

        const onKeyDown = (e) => {
            if (!selected) return;

            let newSelected = null;
            switch (e.key) {
                case 'w':
                    if (selected.parentElement && selected.parentElement !== document.body && selected.parentElement !== document.documentElement) {
                        newSelected = selected.parentElement;
                    }
                    break;
                case 's':
                    if (selected.children && selected.children.length > 0) {
                        newSelected = selected.children[0];
                    }
                    break;
                case 'a':
                    if (selected.previousElementSibling) {
                        newSelected = selected.previousElementSibling;
                    }
                    break;
                case 'd':
                    if (selected.nextElementSibling) {
                        newSelected = selected.nextElementSibling;
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selected && selected.parentNode) {
                        const clone = selected.cloneNode(true);
                        selected.parentNode.insertBefore(clone, selected.nextSibling);
                    }
                    break;
                case 'Backspace':
                    e.preventDefault();
                    if (selected && selected.parentNode) {
                        let toRemove = selected;
                        let newFocus = selected.nextElementSibling || selected.previousElementSibling || selected.parentElement;
                        toRemove.parentNode.removeChild(toRemove);
                        selected = null;
                        if (newFocus && newFocus !== document.body && newFocus !== document.documentElement) {
                            selectElement(newFocus);
                        }
                    }
                    break;
            }

            if (newSelected) {
                e.preventDefault();
                selectElement(newSelected);
            }
        };

        document.body.addEventListener('mouseenter', onMouseEnter, true);
        document.body.addEventListener('mouseout', onMouseOut, true);
        document.addEventListener('keydown', onKeyDown);

        // 给 stop 函数用来解绑事件和清理
        window.__domSelectorStop = () => {
            document.body.removeEventListener('mouseenter', onMouseEnter, true);
            document.body.removeEventListener('mouseout', onMouseOut, true);
            document.removeEventListener('keydown', onKeyDown);
            if (selected) {
                selected.classList.remove('selected');
                selected = null;
            }
            styleTag.remove();
            window.__domSelectorStop = null;
        };

        show("✅ 已进入页面部件编辑状态，现在可以对高亮部分操作，按 enter 复制，按 backspace 移除");
    }

    function editDomEnd() {
        if (typeof window.__domSelectorStop === 'function') {
            window.__domSelectorStop();
            show("✅ 已结束页面部件编辑状态");

        }
    }

    window.addEventListener("keydown", (e) => {
        print(e);
        if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {

            if (e.code.startsWith("Key")) {
                const keyChar = e.code.slice(3).toLowerCase();
                if (config[keyChar]) {
                    e.preventDefault();
                    config[keyChar]();
                }
            }
        }
    });

    function hint(content, duration = 1000) {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.textContent = content;

        // 设置样式
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: 9999,
            opacity: '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none', // 不阻挡鼠标事件
        });

        // 添加到页面
        document.body.appendChild(toast);

        // 触发显示动画
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 定时关闭
        setTimeout(() => {
            toast.style.opacity = '0';
            // 动画结束后移除元素
            toast.addEventListener('transitionend', () => {
                toast.remove();
            }, { once: true });
        }, duration);
    }
})();