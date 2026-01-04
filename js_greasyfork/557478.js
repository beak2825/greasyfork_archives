// ==UserScript==
// @license      MIT
// @name         CityU(dg) 港城莞 gcg 去除水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除页面上的 ps_watermark Canvas 和全屏平铺隐形水印背景
// @author       you
// @match        https://*.cityu-dg.edu.cn/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557478/CityU%28dg%29%20%E6%B8%AF%E5%9F%8E%E8%8E%9E%20gcg%20%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557478/CityU%28dg%29%20%E6%B8%AF%E5%9F%8E%E8%8E%9E%20gcg%20%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 一、原来的 Canvas 水印：id="ps_watermark" ***/
    function removeCanvasWatermarkInDoc(doc) {
        if (!doc) return;
        const wm = doc.getElementById('ps_watermark');
        if (wm) {
            wm.remove();
            // console.log('[GCG] ps_watermark canvas removed');
        }
    }

    /*** 二、学生事务系统那种全屏平铺 base64 背景水印 ***/
    function removeBackgroundWatermarkInDoc(doc) {
        if (!doc) return;

        // 匹配类似：
        // <div style="background-image:url(data:image/png;base64,...) ... pointer-events:none; position:fixed; width:100%; height:100vh; ...">
        const wmDivs = doc.querySelectorAll('div[style*="background-image"][style*="base64"][style*="pointer-events:none"]');
        wmDivs.forEach(div => {
            div.remove();
            // console.log('[GCG] background-image base64 watermark div removed');
        });
    }

    /*** 三、清理可能的水印相关 style（可选，稍微激进一点） ***/
    function removeWatermarkCSSInDoc(doc) {
        if (!doc) return;
        const styles = doc.querySelectorAll('style');
        styles.forEach(style => {
            const txt = style.textContent || '';
            if (
                txt.includes('watermark') ||          // 一些项目会给水印样式起这个名字
                (txt.includes('data:image/png;base64') && txt.includes('pointer-events:none'))
            ) {
                style.remove();
                // console.log('[GCG] watermark-related <style> removed');
            }
        });
    }

    /*** 四、尽量拦截 JS 动态注入水印：PUB_FUNC.setWatermarkGlobal ***/
    function patchPubFunc() {
        try {
            if (window.PUB_FUNC) {
                if (typeof window.PUB_FUNC.setWatermarkGlobal === 'function') {
                    window.PUB_FUNC.setWatermarkGlobal = function () {
                        // 直接变成空函数，阻止后续水印注入
                        console.log('[GCG] PUB_FUNC.setWatermarkGlobal blocked');
                    };
                }
            }
        } catch (e) {
            // ignore
        }
    }

    /*** 五、对单个文档做全部清理 ***/
    function cleanDoc(doc) {
        if (!doc) return;
        removeCanvasWatermarkInDoc(doc);
        removeBackgroundWatermarkInDoc(doc);
        removeWatermarkCSSInDoc(doc);
    }

    /*** 六、处理当前页面 + 所有同源 iframe ***/
    function cleanAll() {
        cleanDoc(document);

        const iframes = document.querySelectorAll('iframe');
        for (const frame of iframes) {
            try {
                if (frame.contentDocument) {
                    cleanDoc(frame.contentDocument);
                }
            } catch (e) {
                // 跨域 iframe 忽略
            }
        }
    }

    /*** 七、初始化执行一次 ***/
    function main() {
        patchPubFunc();
        cleanAll();
    }

    main();

    /*** 八、监听 DOM 变化，防止水印被重新插入 ***/
    const observer = new MutationObserver(() => {
        patchPubFunc();
        cleanAll();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });
})();
