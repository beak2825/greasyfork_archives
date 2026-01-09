// ==UserScript==
// @name         自动移除水印工具（搞定设计、创客贴、比格设计、爱设计、易企秀、标小智、标智客等）
// @namespace    https://example.com
// @version      2.0.2
// @description  自动移除在线设计平台的水印，
// @author       chatxxsc_t
// @match        *://*.gaoding.com/*
// @match        *://*.818ps.com/*
// @match        *://*.tusij.com/*
// @match        *://*.ibaotu.com/*
// @match        *://*.58pic.com/*
// @match        *://*.chuangkit.com/*
// @match        *://bigesj.com/*
// @match        *://*.molishe.com/*
// @match        *://*.51miz.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553619/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%B7%A5%E5%85%B7%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553619/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0%E5%B7%A5%E5%85%B7%EF%BC%88%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E3%80%81%E5%88%9B%E5%AE%A2%E8%B4%B4%E3%80%81%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E3%80%81%E7%88%B1%E8%AE%BE%E8%AE%A1%E3%80%81%E6%98%93%E4%BC%81%E7%A7%80%E3%80%81%E6%A0%87%E5%B0%8F%E6%99%BA%E3%80%81%E6%A0%87%E6%99%BA%E5%AE%A2%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 按钮样式
    const buttonStyle = `
        position: fixed; top: 10px; left: 50%; transform: translateX(40%);
        width: 80px; height: 40px; background: linear-gradient(90deg, rgb(255 102 68), rgb(255 102 68));
        border-radius: 5px; color: #7a4806; font-size: 14px; font-weight: 500;
        text-align: center; cursor: pointer; z-index: 99999;
        box-shadow: 0 0 4px rgba(0,0,0,0.15); border: none; outline: none;
    `;

    // 添加去水印按钮
    function addButton() {
        const button = document.createElement('button');
        button.textContent = '去水印';
        button.style.cssText = buttonStyle;
        button.addEventListener('click', removeWatermark);
        document.body.appendChild(button);
    }

    // 拦截 SVG 水印
    function interceptSvgWatermark(prototype, svgBase64) {
        const originalSetSrc = Object.getOwnPropertyDescriptor(prototype, 'src').set;
        Object.defineProperty(prototype, 'src', {
            set(value) {
                if (value.startsWith(svgBase64)) {
                    console.log('Intercepted SVG:', value);
                    return;
                }
                originalSetSrc.call(this, value);
            }
        });
    }

    // 去除水印逻辑
    function removeWatermark() {
        const host = window.location.hostname;

        // 千图网、包图网、图司机
        if (host.includes('58pic') || host.includes('ibaotu') || host.includes('tusij')) {
            document.querySelectorAll('.image-watermark').forEach(element => element.remove());
        }
        // 稿定设计
        else if (host.includes('gaoding.com')) {
            interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ');
            const originalCreateObjectURL = URL.createObjectURL;
                URL.createObjectURL = function(blob) {
                    if (blob && blob.type === 'image/svg+xml') {
                        console.log('Blocked SVG blob:', blob);
                        return ''; // 返回空字符串，阻止加载
                    }
                    return originalCreateObjectURL.call(this, blob);
                };
        }
        // 图怪兽
        else if (host.includes('818ps.com')) {
            interceptSvgWatermark(HTMLImageElement.prototype, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy');
        }
        // 创客贴
        else if (host.includes('chuangkit')) {
            document.querySelector('.remove-cktTemplate-watermark')?.remove();
            const canvasSlotItem = document.querySelector('.canvas-slot-item');
            if (canvasSlotItem) {
                canvasSlotItem.style.zIndex = '99999';
                canvasSlotItem.style.position = 'absolute';
            }
        }
        // 比格设计
        else if (host.includes('bigesj')) {
            document.querySelectorAll('.water, .water-tip').forEach(element => element.remove());
        }
        // 魔力设
        else if (host.includes('molishe')) {
            // sc-cSiAOC gFbDaS  .fyzzoy
            const elements = document.querySelectorAll('div.sc-cSiAOC');
            elements.forEach(element => {
                element.remove(); // 移除元素
            });
        }
        // 觅知网  注：觅知网iframe不是同源情况，引用的魔力设源，所以最后处理是魔力设处理。
        else if (host.includes('51miz')) {
            // 获取 iframe 元素
            const iframe = document.getElementById('editor-online');
            if (iframe) {
                // 获取 iframe 的 src 属性
                const iframeSrc = iframe.src;
                // 当前页面打开，魔力设处理，
                window.open(iframeSrc, '_self');
            } else {
                console.warn('未找到 id 为 editor-online 的 iframe');
            }
        }
        
    }

    if (window.location.href.includes('gaoding.com') || window.location.href.includes('818ps.com')) {
        removeWatermark();
    } else {
        window.addEventListener('load', addButton);
    }
})();