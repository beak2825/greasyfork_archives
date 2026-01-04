// ==UserScript==
// @name         B站视频播放速度记忆
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description  自动设置B站视频播放速度为上次选择的速度，并添加更多倍速选项
// @author       CunShao (modified by Claude)
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558976/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/558976/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从localStorage获取保存的播放速度
    function getSavedSpeed() {
        return localStorage.getItem('biliPreferredPlaybackSpeed') || '1.75';
    }

    // 保存播放速度到localStorage
    function saveSpeed(speed) {
        localStorage.setItem('biliPreferredPlaybackSpeed', speed);
    }

    // 创建并添加倍速选项的函数
    function addSpeedOption(speedValue) {
        var newListItem = document.createElement('li');
        newListItem.className = 'bpx-player-ctrl-playbackrate-menu-item';
        newListItem.dataset.value = speedValue.toString();
        newListItem.textContent = speedValue + 'x';
        return newListItem;
    }

    // 定期检查播放倍速菜单是否存在
    const checkPlaybackRateMenu = setInterval(() => {
        const multiple = document.querySelector('ul.bpx-player-ctrl-playbackrate-menu');
        if (multiple) {
            // 获取保存的速度
            const savedSpeed = getSavedSpeed();

            // 获取现有的倍速选项
            const existingOptions = Array.from(multiple.querySelectorAll('li'));
            const newOptions = [
                addSpeedOption(1.7),
                addSpeedOption(1.75),
                addSpeedOption(1.8),
                addSpeedOption(1.85),
                addSpeedOption(1.9),
                addSpeedOption(2.5),
                addSpeedOption(3.0)
            ];

            // 合并并排序所有倍速选项
            const allOptions = existingOptions.concat(newOptions);
            allOptions.sort((a, b) => parseFloat(a.dataset.value) - parseFloat(b.dataset.value));

            // 清空并重新填充菜单
            multiple.innerHTML = '';
            allOptions.forEach(option => multiple.appendChild(option));

            // 选择保存的倍速
            const savedSpeedOption = multiple.querySelector(`li[data-value="${savedSpeed}"]`);
            if (savedSpeedOption) {
                savedSpeedOption.click();
            }

            // 添加点击事件监听器来保存选择的速度
            multiple.addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    saveSpeed(event.target.dataset.value);
                }
            });

            // 成功后停止检查
            clearInterval(checkPlaybackRateMenu);
        }
    }, 1000); // 每1秒检查一次，直到找到倍速菜单
})();