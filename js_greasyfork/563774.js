// ==UserScript==
// @name        B站评论显示状态
// @namespace   https://github.com/ZBpine/bili-danmaku-adapt/
// @description 评论显示状态，以便知道是否被阿瓦隆。
// @version     1.0.0
// @author      ZBpine
// @icon        https://www.bilibili.com/favicon.ico
// @match       https://www.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://space.bilibili.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/563774/B%E7%AB%99%E8%AF%84%E8%AE%BA%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/563774/B%E7%AB%99%E8%AF%84%E8%AE%BA%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
const settings = {
    showIP: GM_getValue('showIP', true),
    showState: GM_getValue('showState', true),
    showAttr: GM_getValue('showAttr', true)
};

function registerMenu(key, label) {
    GM_registerMenuCommand(`${settings[key] ? '✅' : '❌'} ${label}`, () => {
        settings[key] = !settings[key];
        GM_setValue(key, settings[key]);
        // location.reload(); // 刷新页面使设置生效
    });
}
registerMenu('showIP', '显示 IP 属地');
registerMenu('showState', '显示 状态');
registerMenu('showAttr', '显示 属性位');
GM_registerMenuCommand('菜单不会立即刷新', () => { });

function parseAttr(attr) {
    if (!attr) return "0";
    let val = Number(attr);
    let bits = [];
    for (let i = 0; i < 32; i++) {
        // 检查第 i 位是否为 1
        if ((val >> i) & 1) {
            bits.push(i);
        }
    }
    return bits.length > 0 ? bits.join('|') : "0";
}

const deepQuery = (root, selector) => {
    let el = root.querySelector(selector);
    if (el) return el;
    const subs = root.querySelectorAll('*');
    for (let s of subs) {
        if (s.shadowRoot) {
            el = deepQuery(s.shadowRoot, selector);
            if (el) return el;
        }
    }
    return null;
};

/**
 * 核心注入逻辑
 * @param {HTMLElement} ctx - 组件实例 (this)
 */
function performInjection(ctx) {
    const data = ctx.__data;
    if (!data) return;

    // 2. 在 shadowRoot 中寻找 UI 节点
    // 使用深度选择器，因为 #pubdate 可能在更深层的 action-buttons 组件里
    const shadow = ctx.shadowRoot;
    if (!shadow) return;

    // 这是一个通用的深度查找函数

    const pubdate = deepQuery(shadow, '#pubdate');
    if (!pubdate) return;

    // 3. 准备信息
    const ip = data.reply_control?.location || "";
    const state = data.state;
    const attr = data.attr;

    if (settings.showIP) {
        // 4. 插入显示信息 (兼容性处理)
        let ipSpan = pubdate.querySelector('.ip-location');
        if (!ipSpan && ip) {
            ipSpan = document.createElement('span');
            ipSpan.className = 'ip-location';
            ipSpan.style.marginLeft = '15px';
            ipSpan.textContent = ip;
            pubdate.appendChild(ipSpan);
        }
    }

    let text = "";
    if (settings.showState && state > 0) text += `状态：${state} `;
    if (settings.showAttr && attr > 0) text += `属性：${parseAttr(attr)} `;
    if (text) {
        let extra = pubdate.querySelector('.custom-hook-info');
        if (!extra) {
            extra = document.createElement('span');
            extra.className = 'custom-hook-info';
            extra.style.marginLeft = '15px';
            pubdate.appendChild(extra);
        }
        extra.textContent = text;
    }
}

/**
 * 专门针对菜单组件的注入函数
 * @param {HTMLElement} menuInstance - bili-comment-menu 的实例
 */
function injectToMenu(menuInstance) {
    const options = menuInstance.shadowRoot.querySelector('#options');
    if (!options || options.querySelector('.custom-update-btn')) return;

    // 溯源找到持有数据的父组件
    // 菜单 -> action-buttons -> renderer (通过 shadow host 向上找)
    let host = menuInstance.getRootNode()?.host;
    while (host && !host.__data) {
        host = host.getRootNode()?.host;
    }

    if (host && host.__data) {
        const li = document.createElement('li');
        li.className = 'custom-update-btn';
        li.textContent = '更新状态';
        li.onclick = (e) => {
            console.log('更新状态', host.__data);
            e.stopPropagation();
            // 重新执行父组件的注入逻辑
            performInjection(host);
            // 模拟点击关闭菜单
            document.body.click();
        };
        options.appendChild(li);
    }
}

/**
 * Hook customElements.define
 * 这是最底层的拦截，当 B站注册评论组件时，我们直接修改组件类
 */
const targets = [
    'bili-comment-renderer',        // 主楼容器
    'bili-comment-reply-renderer',  // 回复容器
    'bili-comment-menu',            // 菜单容器
];
const originalDefine = customElements.define;
customElements.define = function (name, constructor) {
    if (targets.includes(name)) {
        // 获取 Lit 组件的原型
        const proto = constructor.prototype;

        // 拦截 updated 生命周期方法
        // Lit 在 DOM 更新完成后会自动调用 updated(changedProperties)
        const originalUpdated = proto.updated;
        proto.updated = function (changedProperties) {
            // 先执行原有的渲染逻辑
            if (originalUpdated) {
                originalUpdated.call(this, changedProperties);
            }

            // 执行我们的注入逻辑
            // 放到 microtask 确保渲染彻底完成
            if (name === 'bili-comment-menu') {
                injectToMenu(this);
            } else {
                Promise.resolve().then(() => performInjection(this));
            }
        };
    }

    return originalDefine.call(this, name, constructor);
};
/******/ })()
;