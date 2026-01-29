// ==UserScript==
// @name         Gaze.run Video.js Add 3x & 4x Speed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Video.js 播放器菜单添加 3x 和 4x 倍速选项
// @author       AidenLu
// @match        https://gaze.run/*
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564357/Gazerun%20Videojs%20Add%203x%20%204x%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/564357/Gazerun%20Videojs%20Add%203x%20%204x%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止重复添加的标记
    let isMenuModified = false;

    function addSpeedOptions() {
        // 1. 寻找菜单容器 (根据你提供的 HTML，类名是 vjs-menu-content)
        const menuContent = document.querySelector('.vjs-menu-content');

        // 如果找不到菜单，或者已经修改过，或者菜单里还没有子元素，就退出
        if (!menuContent || isMenuModified || menuContent.children.length === 0) return;

        // 检查是否已经存在 3x (防止重复添加)
        const existingItems = Array.from(menuContent.querySelectorAll('.vjs-menu-item-text'));
        if (existingItems.some(span => span.textContent.trim() === '3x')) {
            isMenuModified = true;
            return;
        }

        // 2. 获取参考节点（通常列表里的第一项是最大的倍速，比如 2x）
        // 我们要插在它前面
        const referenceItem = menuContent.children[0];

        // 3. 定义一个创建新选项的函数
        function createSpeedItem(speedStr, speedValue) {
            // 克隆参考节点（这样可以完美保留类名、样式、ARIA属性等）
            const newItem = referenceItem.cloneNode(true);

            // --- 清理克隆过来的状态 ---
            // 移除 "选中" 样式 (vjs-selected)
            newItem.classList.remove('vjs-selected');
            // 设置 aria-checked 为 false
            newItem.setAttribute('aria-checked', 'false');

            // --- 修改文本 ---
            // 修改显示的文字 (vjs-menu-item-text)
            const textSpan = newItem.querySelector('.vjs-menu-item-text');
            if (textSpan) textSpan.textContent = speedStr;

            // 清理辅助阅读文字 (vjs-control-text)，去掉可能的 ", 选择" 字样
            const controlText = newItem.querySelector('.vjs-control-text');
            if (controlText) controlText.textContent = '';

            // --- 添加点击事件 ---
            newItem.addEventListener('click', function(e) {
                // 阻止默认事件，防止 Video.js 原生逻辑干扰（视情况而定，加上比较保险）
                e.stopPropagation();

                // A. 改变视频速度
                const video = document.querySelector('video');
                if (video) {
                    video.playbackRate = speedValue;
                    console.log(`Speed set to ${speedStr}`);
                }

                // B. 更新 UI 显示状态 (高亮当前选项，取消其他选项的高亮)
                const allItems = menuContent.querySelectorAll('.vjs-menu-item');
                allItems.forEach(item => {
                    item.classList.remove('vjs-selected');
                    item.setAttribute('aria-checked', 'false');
                });
                // 高亮自己
                newItem.classList.add('vjs-selected');
                newItem.setAttribute('aria-checked', 'true');

                // (可选) 关闭菜单 - 模拟点击行为通常会自动关闭，如果不行可以手动隐藏
                // menuContent.parentElement.blur();
            });

            return newItem;
        }

        // 4. 创建 4x 和 3x 按钮
        const item4x = createSpeedItem('4x', 4.0);
        const item3x = createSpeedItem('3x', 3.0);

        // 5. 插入到列表最前面
        // 顺序：先插 4x，再插 3x，最终顺序就是 [4x, 3x, 2x, ...]
        // insertBefore(newNode, referenceNode)
        menuContent.insertBefore(item4x, referenceItem); // 列表变 [4x, 2x...]
        menuContent.insertBefore(item3x, referenceItem); // 列表变 [4x, 3x, 2x...]

        console.log('Video.js custom speed options (3x, 4x) added.');
        isMenuModified = true;
    }

    // 6. 启动轮询
    // Video.js 的菜单可能是动态生成的，所以需要轮询检测
    const observer = setInterval(() => {
        addSpeedOptions();
        // 如果成功添加了，可以在这里 clearInterval 停止轮询
        // 但为了应对网页无刷新切集（SPA），保留轮询或配合 URL 变化检测会更稳妥
        // 这里为了简单，如果检测到已修改标记就不重复执行逻辑，但保持定时器运行
    }, 1000);

})();