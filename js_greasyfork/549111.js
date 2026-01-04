// ==UserScript==
// @name         B站(bilibili)自定义快捷键禁用工具
// @name:zh-CN   B站(bilibili)自定义快捷键禁用工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自定义禁用Bilibili的特定快捷键，防止误操作（如W键投币）。默认禁用w,q,e,m,g键，可自行添加更多按键。
// @description:zh-CN  自定义禁用Bilibili的特定快捷键，防止误操作（如W键投币）。默认禁用w,q,e,m,g键，可自行添加更多按键。
// @author       DeepSeek-V3
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549111/B%E7%AB%99%28bilibili%29%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%A6%81%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549111/B%E7%AB%99%28bilibili%29%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%A6%81%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // 【配置区域】：请在这里修改你想要禁用的按键
    // 将需要禁用的按键的key值（小写）添加到下方的 blockedKeys 数组中。
    // 常见的B站快捷键Key值：
    // w: 投币
    // q: 点赞
    // e: 收藏
    // g: 关注
    // d: 弹幕输入框聚焦
    // s: 收藏
    // j: 切换上一个视频？
    // l: 切换下一个视频？
    // 空格: 播放/暂停 (谨慎禁用)
    // f: 全屏
    // m: 静音
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const blockedKeys = [
        'w', // 禁用投币
        'q',
        'e',
        'm',
        'g',
        // 'd', // 取消注释即可禁用弹幕框聚焦
        // 's', // 取消注释即可禁用收藏
        // 可以继续添加其他需要禁用的按键...
    ];
    // 主逻辑：监听键盘事件并阻止被禁用的按键的默认行为
    document.addEventListener('keydown', function(event) {
        // 获取按下的键（转换为小写以便统一判断）
        const keyPressed = event.key.toLowerCase();
        // 检查按下的键是否在禁用列表中
        if (blockedKeys.includes(keyPressed)) {
            // 阻止该按键的默认行为（如投币、弹出弹幕框等）
            event.stopImmediatePropagation();
            event.preventDefault();
            // 可选：在控制台输出提示信息（调试时可打开）
            // console.log(`[B站快捷键禁用] 已阻止按键: ${keyPressed}`);
        }
    }, true); // 使用捕获模式（capture: true），以确保尽早拦截事件
})();