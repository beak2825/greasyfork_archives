// ==UserScript==
// @name         GeoGuessr Chinese Maps
// @name:zh-CN   GeoGuessr 中文地图
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Force GeoGuessr to use Chinese Google Maps
// @description:zh-CN  强制 GeoGuessr 使用中文地图
// @author       Your Name
// @match        https://*.geoguessr.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551141/GeoGuessr%20Chinese%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/551141/GeoGuessr%20Chinese%20Maps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetLanguage = 'zh-CN';
    let intercepted = false;

    console.log('[GeoGuessr Chinese Maps] Script started');

    // ============ 核心拦截：劫持 src setter ============
    const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');

    Object.defineProperty(HTMLScriptElement.prototype, 'src', {
        get() {
            return originalSrcDescriptor.get.call(this);
        },
        set(value) {
            if (typeof value === 'string' && value.includes('maps.googleapis.com/maps/api/js')) {
                try {
                    const url = new URL(value);
                    const currentLang = url.searchParams.get('language');

                    if (currentLang !== targetLanguage) {
                        url.searchParams.set('language', targetLanguage);
                        console.log(`[GeoGuessr Chinese Maps] ✓ Intercepted at src setter: ${currentLang || 'none'} → ${targetLanguage}`);
                        console.log(`[GeoGuessr Chinese Maps] Original URL: ${value}`);
                        console.log(`[GeoGuessr Chinese Maps] Modified URL: ${url.toString()}`);
                        intercepted = true;
                        originalSrcDescriptor.set.call(this, url.toString());
                        return;
                    } else if (currentLang === targetLanguage) {
                        console.log(`[GeoGuessr Chinese Maps] ✓ Already Chinese, no modification needed`);
                        intercepted = true;
                    }
                } catch (e) {
                    console.error('[GeoGuessr Chinese Maps] Error:', e);
                }
            }
            originalSrcDescriptor.set.call(this, value);
        },
        configurable: true
    });

    // ============ 后备方案：MutationObserver ============
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('maps.googleapis.com/maps/api/js')) {
                    console.log('[GeoGuessr Chinese Maps] MutationObserver detected script:', node.src);

                    try {
                        const url = new URL(node.src);
                        const currentLang = url.searchParams.get('language');

                        if (currentLang !== targetLanguage) {
                            console.log('[GeoGuessr Chinese Maps] ⚠️ Fallback: Script was not intercepted by setter!');
                            console.log('[GeoGuessr Chinese Maps] Current language:', currentLang);

                            // 阻止原脚本加载
                            node.src = '';
                            node.remove();

                            // 创建新脚本
                            url.searchParams.set('language', targetLanguage);
                            const newScript = document.createElement('script');

                            // 复制所有属性（除了 src）
                            for (let i = 0; i < node.attributes.length; i++) {
                                const attr = node.attributes[i];
                                if (attr.name !== 'src') {
                                    newScript.setAttribute(attr.name, attr.value);
                                }
                            }

                            // 最后设置 src（触发加载）
                            newScript.src = url.toString();

                            // 插入到相同位置
                            (mutation.target || document.head || document.documentElement).appendChild(newScript);

                            console.log('[GeoGuessr Chinese Maps] ✓ Replaced with Chinese version:', newScript.src);
                            intercepted = true;
                        }
                    } catch (e) {
                        console.error('[GeoGuessr Chinese Maps] Observer error:', e);
                    }

                    // 找到目标后停止观察
                    observer.disconnect();
                    return;
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // ============ 验证拦截结果 ============
    window.addEventListener('load', () => {
        setTimeout(() => {
            console.log('[GeoGuessr Chinese Maps] Checking interception status...');

            const scripts = Array.from(document.querySelectorAll('script[src*="maps.googleapis.com"]'));
            console.log(`[GeoGuessr Chinese Maps] Found ${scripts.length} Google Maps script(s)`);

            scripts.forEach((script, index) => {
                try {
                    const url = new URL(script.src);
                    const lang = url.searchParams.get('language');
                    console.log(`[GeoGuessr Chinese Maps] Script ${index + 1} language:`, lang || 'none');

                    if (lang !== targetLanguage) {
                        console.error('[GeoGuessr Chinese Maps] ❌ FAILED: Script is not Chinese!');
                        console.error('[GeoGuessr Chinese Maps] Script URL:', script.src);
                    } else {
                        console.log('[GeoGuessr Chinese Maps] ✓ SUCCESS: Chinese map loaded!');
                    }
                } catch (e) {
                    console.error('[GeoGuessr Chinese Maps] Validation error:', e);
                }
            });

            if (!intercepted && scripts.length > 0) {
                console.error('[GeoGuessr Chinese Maps] ❌ WARNING: Scripts were loaded but not intercepted!');
            }
        }, 2000);
    });

    console.log('[GeoGuessr Chinese Maps] v4.2 initialized');
})();