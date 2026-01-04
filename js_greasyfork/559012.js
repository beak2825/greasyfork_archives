// ==UserScript==
// @name         Iwara Like/View Ratio Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  智能处理 K/M 单位，当 (点赞数/观看数) 低于指定百分比时添加遮罩。
// @author       Gemini
// @match        https://www.iwara.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559012/Iwara%20LikeView%20Ratio%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/559012/Iwara%20LikeView%20Ratio%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置 ===
    const SETTING_KEY = 'iwara_ratio_threshold';
    // 默认阈值 3.0% (例如：观看 6.0K，点赞需要至少 60 个)
    let minRatioPercent = GM_getValue(SETTING_KEY, 3.0);

    // === 样式注入 ===
    GM_addStyle(`
        .iwara-ratio-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8); /* 稍微加深一点背景，更明显 */
            z-index: 10;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #ffdddd;
            font-size: 14px;
            font-weight: bold;
            border-radius: 4px;
            opacity: 1;
            transition: opacity 0.2s ease-in-out;
            pointer-events: none; /* 核心：鼠标事件穿透 */
            backdrop-filter: blur(2px); /* 加一点毛玻璃效果看起来更高级 */
        }
        /* 鼠标悬停在视频卡片上时，遮罩消失 */
        .videoTeaser:hover .iwara-ratio-mask {
            opacity: 0;
        }
        .iwara-ratio-info {
            background: rgba(0,0,0,0.6);
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 4px;
        }
        .iwara-ratio-details {
            font-size: 10px;
            color: #aaa;
        }
    `);

    // === 核心逻辑：智能数值解析 ===

    /**
     * 将包含 K, M 或纯数字的字符串转换为真实整数
     * 处理逻辑：
     * 1. 移除多余空格
     * 2. 识别 K (x1000), M (x1000000)
     * 3. 移除除了数字和小数点以外的字符
     * 4. 计算最终值
     *
     * 示例：
     * "6.0K" -> 6000
     * "401"  -> 401
     * "1.2M" -> 1200000
     */
    function parseSmartNumber(str) {
        if (!str) return 0;

        // 转大写，处理 k/K 大小写问题
        let raw = str.trim().toUpperCase();

        let multiplier = 1;

        if (raw.includes('K')) {
            multiplier = 1000;
        } else if (raw.includes('M')) {
            multiplier = 1000000;
        } else if (raw.includes('B')) {
            multiplier = 1000000000;
        }

        // 提取纯数字部分 (支持小数，例如 6.0)
        // 匹配数字和小数点
        const match = raw.match(/[\d\.]+/);
        if (!match) return 0;

        const numberPart = parseFloat(match[0]);

        // 最终计算
        return numberPart * multiplier;
    }

    /**
     * 处理单个视频节点
     */
    function processVideoItem(teaserElement) {
        if (teaserElement.dataset.ratioProcessed) return;

        // 获取元素
        const viewNode = teaserElement.querySelector('.views');
        const likeNode = teaserElement.querySelector('.likes');

        if (!viewNode || !likeNode) return;

        // === 解析数值 ===
        // .textContent 会获取到包含图标的所有文本，但我们的正则足够强壮，能提取出数字
        const viewText = viewNode.textContent.trim();
        const likeText = likeNode.textContent.trim();

        const views = parseSmartNumber(viewText);
        const likes = parseSmartNumber(likeText);

        // 防御性编程：如果观看数为0，跳过（防止除以0）
        if (views === 0) return;

        // === 计算比例 ===
        const ratio = (likes / views) * 100;

        // 标记已处理
        teaserElement.dataset.ratioProcessed = "true";

        // === 判定与遮罩 ===
        if (ratio < minRatioPercent) {

            // 调试日志：如果你觉得某些视频判断不对，按F12在Console里可以看到具体的计算过程
            // console.log(`Title: ${teaserElement.querySelector('.videoTeaser__title')?.textContent.trim()}`);
            // console.log(`Raw: ${viewText} / ${likeText} | Parsed: ${views} / ${likes} | Ratio: ${ratio.toFixed(3)}%`);

            const mask = document.createElement('div');
            mask.className = 'iwara-ratio-mask';

            // 第一行：显示比例
            const infoDiv = document.createElement('div');
            infoDiv.className = 'iwara-ratio-info';
            infoDiv.innerText = `低评分: ${ratio.toFixed(2)}%`;

            // 第二行：显示原始数据对比（可选，让你一眼看出为什么低）
            const detailDiv = document.createElement('div');
            detailDiv.className = 'iwara-ratio-details';
            // 为了美观，把长数字缩短显示
            const formatNum = (n) => n >= 1000 ? (n/1000).toFixed(1)+'k' : n;
            detailDiv.innerText = `👍${formatNum(likes)} / 👀${formatNum(views)}`;

            mask.appendChild(infoDiv);
            mask.appendChild(detailDiv);

            // 寻找封面图片容器添加遮罩
            const thumbnailLink = teaserElement.querySelector('.videoTeaser__thumbnail');

            if (thumbnailLink) {
                // 强制 relative 定位确保遮罩不跑偏
                const originalPosition = getComputedStyle(thumbnailLink).position;
                if (originalPosition === 'static') {
                    thumbnailLink.style.position = 'relative';
                }
                thumbnailLink.appendChild(mask);
            } else {
                teaserElement.appendChild(mask);
            }
        }
    }

    /**
     * 主循环
     */
    function runFilter() {
        const teasers = document.querySelectorAll('.videoTeaser');
        teasers.forEach(processVideoItem);
    }

    // === 菜单命令 ===
    GM_registerMenuCommand(`修改过滤阈值 (当前: ${minRatioPercent}%)`, () => {
        const input = prompt("请输入最低 点赞/观看 比例 (%)\n例如：\n1.0 = 1% (100播放需1赞)\n0.5 = 0.5% (200播放需1赞)", minRatioPercent);
        if (input !== null) {
            const val = parseFloat(input);
            if (!isNaN(val) && val >= 0) {
                minRatioPercent = val;
                GM_setValue(SETTING_KEY, val);
                // 重置所有状态
                document.querySelectorAll('.videoTeaser').forEach(el => {
                    delete el.dataset.ratioProcessed;
                    const mask = el.querySelector('.iwara-ratio-mask');
                    if (mask) mask.remove();
                });
                runFilter();
            }
        }
    });

    // === 启动 ===
    runFilter();

    // 监听动态加载（翻页/滚动）
    const observer = new MutationObserver((mutations) => {
        runFilter();
    });

    // 监听特定容器会比监听 body 更节省性能，但监听 body 更稳妥
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();