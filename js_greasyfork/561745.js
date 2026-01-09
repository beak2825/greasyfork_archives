// ==UserScript==
// @name         虎牙自动最高画质 (高效版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  利用 MutationObserver 技术，高效、低资源地自动切换虎牙直播最高画质（蓝光/20M/10M）
// @author       Gemini Thought Partner
// @match        *://www.huya.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561745/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%28%E9%AB%98%E6%95%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561745/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%20%28%E9%AB%98%E6%95%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '[虎牙高效画质] ';
    let hasSwitched = false; // 标记是否已经切换过，防止重复操作
    let lastUrl = location.href; // 记录当前URL，用于检测直播间切换

    // 核心切换逻辑
    function trySwitchQuality() {
        // 获取画质列表容器
        const qualityList = document.querySelector('.player-videotype-list');
        if (!qualityList) return;

        // 获取当前选中的画质
        const currentOption = qualityList.querySelector('li.on');
        
        // 获取所有选项（虎牙通常将最高画质放在第一个 li）
        const allOptions = qualityList.querySelectorAll('li');
        if (!allOptions || allOptions.length === 0) return;

        const bestOption = allOptions[0];
        const bestText = bestOption.innerText.trim();

        // 如果当前已经是最高画质（即第一个选项有 'on' 类名），则停止操作
        if (bestOption === currentOption) {
            // 只有当之前没标记切换成功时，才打印日志，避免刷屏
            if (!hasSwitched) {
                console.log(LOG_PREFIX + '当前已是最高画质: ' + bestText);
                hasSwitched = true; 
            }
            return;
        }

        // 执行切换
        console.log(LOG_PREFIX + '检测到更高画质，切换至: ' + bestText);
        bestOption.click();
        hasSwitched = true;

        // 试图关闭菜单（模拟鼠标移出）
        if(qualityList.parentElement) {
            qualityList.parentElement.dispatchEvent(new MouseEvent('mouseleave'));
        }
    }

    // 初始化观察者
    function initObserver() {
        console.log(LOG_PREFIX + '监控启动 (低资源模式)');

        // 1. 寻找播放器核心区域 (通常是 #player-wrap 或 #player-ctrl-wrap)
        // 我们不监控 body，因为弹幕刷新会触发 body 变动，消耗资源。
        // 我们只监控播放器容器。
        const targetNode = document.getElementById('player-wrap') || document.body;

        const config = { childList: true, subtree: true };

        // 创建观察者实例
        const observer = new MutationObserver((mutationsList) => {
            // 简单防抖：如果页面URL变了（切换了直播间），重置状态
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                hasSwitched = false;
                console.log(LOG_PREFIX + '检测到直播间切换，重置状态');
            }

            // 只有当变动的节点包含画质菜单相关的类名时，才执行检查
            // 这样可以过滤掉 99% 的无关变动（如播放器时间跳动、UI微调等）
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检查添加的节点是否可能包含画质列表
                    // 或者直接检查画质列表是否存在 (DOM操作开销很小，可以直接查)
                    if (document.querySelector('.player-videotype-list')) {
                         trySwitchQuality();
                         break; // 只要检测到一次，本次由于变动触发的循环就结束
                    }
                }
            }
        });

        // 开始观察
        observer.observe(targetNode, config);
        
        // 兜底策略：页面刚加载时，如果观察者还没生效，先手动查一次
        setTimeout(trySwitchQuality, 2000);
        setTimeout(trySwitchQuality, 5000);
    }

    // 等待页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }

})();