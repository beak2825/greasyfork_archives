// ==UserScript==
// @name         长江雨课堂刷视频防暂停脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动阻止网课检测页面切换并暂停视频 - 兼容Chrome、Edge
// @author       CXY_one
// @match        https://changjiang.yuketang.cn/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558621/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%A7%86%E9%A2%91%E9%98%B2%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/558621/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%88%B7%E8%A7%86%E9%A2%91%E9%98%B2%E6%9A%82%E5%81%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey: 长江雨课堂刷视频防暂停脚本 正在加载...');

    // 定义要阻止的事件类型
    const blockedEvents = ['visibilitychange', 'blur', 'focus'];

    // 1. 覆盖 addEventListener 和 removeEventListener 方法
    // 目标：阻止 visibilitychange, blur, focus 事件监听器被添加
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    // 存储被阻止的监听器，以便removeEventListener能够“移除”它们
    const blockedListenersMap = new WeakMap(); // key: target, value: Map<type, Set<listener>>

    function patchEventListener(target) {
        // 防止重复打补丁
        if (target.__tm_event_listener_patched__) return;
        target.__tm_event_listener_patched__ = true;

        Object.defineProperty(target, 'addEventListener', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function(type, listener, options) {
                if (blockedEvents.includes(type)) {
                    console.warn(`Tampermonkey: 阻止了对 ${target.constructor.name} 的 ${type} 事件监听器添加:`, listener);
                    // 存储被阻止的监听器
                    if (!blockedListenersMap.has(this)) {
                        blockedListenersMap.set(this, new Map());
                    }
                    const typeListeners = blockedListenersMap.get(this);
                    if (!typeListeners.has(type)) {
                        typeListeners.set(type, new Set());
                    }
                    typeListeners.get(type).add(listener);
                    return; // 阻止调用原始方法
                }
                originalAddEventListener.call(this, type, listener, options);
            }
        });

        Object.defineProperty(target, 'removeEventListener', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function(type, listener, options) {
                if (blockedEvents.includes(type)) {
                    // 如果监听器被我们阻止了，就假装移除成功
                    if (blockedListenersMap.has(this)) {
                        const typeListeners = blockedListenersMap.get(this);
                        if (typeListeners.has(type)) {
                            const listeners = typeListeners.get(type);
                            if (listeners.delete(listener)) {
                                console.log(`Tampermonkey: 模拟移除了 ${type} 事件监听器 (原已被阻止添加):`, listener);
                                return; // 阻止调用原始方法
                            }
                        }
                    }
                    // 如果监听器不在我们的阻止列表里，但仍然是我们要阻止的类型，就不执行原始移除
                    // 确保即使第三方脚本尝试移除一个根本没被添加的，也不会报错
                    console.log(`Tampermonkey: 阻止了对 ${target.constructor.name} 的 ${type} 事件监听器移除 (未找到或已被阻止):`, listener);
                    return;
                }
                originalRemoveEventListener.call(this, type, listener, options);
            }
        });
    }

    // 对 EventTarget.prototype, window, document 进行打补丁
    // EventTarget.prototype 的补丁会影响大多数DOM元素
    // window 和 document 直接打补丁，以防它们直接调用自身的 addEventListener 而非通过原型链
    patchEventListener(EventTarget.prototype);
    patchEventListener(window);
    patchEventListener(document);


    // 2. 覆盖 document 和 window 的相关属性
    // 即使有脚本直接检查这些属性，也会返回“可见”状态
    function applyPropertyOverrides() {
        const propsToOverride = {
            'hidden': false,
            'visibilityState': 'visible',
            'onvisibilitychange': null,
            'onblur': null, // 添加对 window/document.onblur 的处理
            'onfocus': null  // 添加对 window/document.onfocus 的处理
        };

        // 对 document 和 window 对象进行覆盖
        [document, window].forEach(obj => {
            for (const prop in propsToOverride) {
                try {
                    // 仅当属性当前存在或可配置时尝试覆盖
                    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                    if (descriptor && !descriptor.configurable) {
                        // console.warn(`Tampermonkey: 无法覆盖不可配置属性 ${obj.constructor.name}.${prop}`);
                        continue; // 如果属性不可配置，则跳过
                    }

                    Object.defineProperty(obj, prop, {
                        get: function() {
                            if (prop === 'hidden') return false;
                            if (prop === 'visibilityState') return 'visible';
                            return null; // 对 onvisibilitychange, onblur, onfocus 返回 null
                        },
                        set: function(newValue) {
                            if (prop.startsWith('on')) {
                                console.warn(`Tampermonkey: 阻止了 ${obj.constructor.name}.${prop} 的直接赋值:`, newValue);
                            } else {
                                console.log(`Tampermonkey: 伪造了 ${obj.constructor.name}.${prop} 的值为:`, propsToOverride[prop]);
                            }
                        },
                        configurable: true // 允许属性被重新定义
                    });
                    // console.log(`Tampermonkey: 成功覆盖 ${obj.constructor.name}.${prop}`);
                } catch (e) {
                    console.error(`Tampermonkey: 覆盖 ${obj.constructor.name}.${prop} 失败:`, e);
                }
            }
        });
    }

    // 3. 持续巩固补丁
    // 有些网站可能会在脚本执行后重新定义这些属性，或者在页面加载新内容时重新添加监听器。
    // 使用 setInterval 周期性地重新应用属性覆盖，确保它们保持伪造状态。
    function enforcePatches() {
        applyPropertyOverrides();
        // addEventListener 的补丁是永久性的，无需周期性重新应用
    }

    // 首次应用补丁
    enforcePatches();

    // 在 DOMContentLoaded 和 load 事件时也应用一次，以防在这些阶段有脚本运行
    window.addEventListener('DOMContentLoaded', enforcePatches, { once: true });
    window.addEventListener('load', enforcePatches, { once: true });

    // 周期性地强制应用属性覆盖，应对网站脚本的重新定义
    setInterval(enforcePatches, 1000); // 每秒钟执行一次，可根据需要调整频率

    console.log('Tampermonkey: 长江雨课堂刷视频防暂停脚本 已加载并激活。');
})();
