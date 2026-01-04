// ==UserScript==
// @name         知乎原图提取器 (Zhihu HD Image Extractor)
// @namespace    https://github.com/mayooot/zhihu-hd-image-extractor
// @version      1.0.0
// @description  自动展开知乎回答，模拟滚动加载，智能抓取高清大图链接，支持一键批量复制下载。
// @author       mayooot
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @license      Apache-2.0
// @supportURL   https://github.com/mayooot/zhihu-hd-image-extractor/issues
// @homepageURL  https://github.com/mayooot/zhihu-hd-image-extractor
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560910/%E7%9F%A5%E4%B9%8E%E5%8E%9F%E5%9B%BE%E6%8F%90%E5%8F%96%E5%99%A8%20%28Zhihu%20HD%20Image%20Extractor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560910/%E7%9F%A5%E4%B9%8E%E5%8E%9F%E5%9B%BE%E6%8F%90%E5%8F%96%E5%99%A8%20%28Zhihu%20HD%20Image%20Extractor%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 样式注入 ---
    const style = document.createElement('style');
    style.innerHTML = `
        #zh-helper-btn {
            position: fixed; bottom: 80px; right: 20px; z-index: 9999;
            width: 60px; height: 60px; background-color: #0084ff; color: white;
            border-radius: 50%; border: none; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            cursor: pointer; font-size: 13px; text-align: center; line-height: 1.2;
            transition: all 0.2s; font-weight: bold;
        }
        #zh-helper-btn:hover { transform: scale(1.1); background-color: #0077e6; }
        #zh-helper-btn:disabled { background-color: #ccc; cursor: not-allowed; }
        
        #zh-result-modal {
            display: none; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; background: rgba(0,0,0,0.85);
            z-index: 10000; align-items: center; justify-content: center;
        }
        #zh-result-box {
            background: white; width: 80%; max-width: 800px; height: 85%;
            border-radius: 12px; display: flex; flex-direction: column; padding: 25px;
        }
        #zh-result-text {
            flex: 1; width: 100%; padding: 15px; border: 1px solid #ddd;
            border-radius: 8px; resize: none; font-family: monospace; font-size: 12px;
            margin: 15px 0; background: #f9f9f9;
        }
        .zh-control-btn {
            padding: 10px 20px; border: none; border-radius: 6px;
            cursor: pointer; font-weight: bold; margin-left: 10px;
        }
        .bg-blue { background: #0084ff; color: white; }
        .bg-gray { background: #f4f4f4; color: #666; }
    `;
    document.head.appendChild(style);

    // --- 2. 创建UI ---
    const btn = document.createElement('button');
    btn.id = 'zh-helper-btn';
    btn.innerHTML = '开始<br>抓取';
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'zh-result-modal';
    modal.innerHTML = `
        <div id="zh-result-box">
            <h3 id="zh-status-title">抓取结果</h3>
            <div style="font-size:12px; color:#666;">提示：全选复制后，推荐使用 IDM 或 迅雷 进行批量下载。</div>
            <textarea id="zh-result-text"></textarea>
            <div style="text-align: right;">
                <button class="zh-control-btn bg-gray" id="zh-btn-close">关闭</button>
                <button class="zh-control-btn bg-blue" id="zh-btn-copy">复制全部链接</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // --- 3. 核心功能函数 ---

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 自动展开函数
    function expandContent() {
        // 根据您提供的HTML，未展开的容器有 class "RichContent is-collapsed"
        // 按钮 class 是 "ContentItem-more"
        const expandButtons = document.querySelectorAll('.RichContent.is-collapsed .ContentItem-more');
        let clickedCount = 0;
        
        expandButtons.forEach(btn => {
            btn.click();
            clickedCount++;
        });
        return clickedCount;
    }

    // 主流程：滚动 -> 展开 -> 滚动
    async function startScraping() {
        btn.disabled = true;
        
        let lastHeight = 0;
        let noChangeCount = 0;
        const maxNoChange = 4; // 连续多少次高度不变视为到底

        while (noChangeCount < maxNoChange) {
            // 1. 记录当前高度
            lastHeight = document.body.scrollHeight;

            // 2. 尝试展开当前屏幕内的折叠内容
            let count = expandContent();
            btn.innerHTML = count > 0 ? `展开<br>${count}个` : '下滑<br>中...';

            // 3. 滚动到底部
            window.scrollTo(0, document.body.scrollHeight);

            // 4. 等待加载 (展开内容和加载新内容都需要时间)
            await sleep(1500);

            // 5. 检查高度变化
            let newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                noChangeCount++;
                btn.innerHTML = `等待<br>${noChangeCount}`;
            } else {
                noChangeCount = 0; // 高度变了，重置计数器
            }
        }

        btn.innerHTML = '整理<br>链接';
        extractImages();
        
        // 恢复按钮状态
        btn.disabled = false;
        btn.innerHTML = '开始<br>抓取';
    }

    // 提取链接
    function extractImages() {
        // 查找所有图片
        const images = document.querySelectorAll('img');
        const urlSet = new Set();

        images.forEach(img => {
            // 1. 优先找 data-original (高清)
            if (img.dataset.original) {
                urlSet.add(img.dataset.original);
            } 
            // 2. 其次找 data-actualsrc (知乎有时候用这个存动态加载图)
            else if (img.dataset.actualsrc) {
                urlSet.add(img.dataset.actualsrc);
            }
            // 3. 如果是已展开的大图，src 往往也是我们要的，但为了保险，主要依赖上面两个属性
        });

        if (urlSet.size === 0) {
            alert('未找到高清图片链接，请确认页面已加载。');
            return;
        }

        const linkArr = Array.from(urlSet);
        document.getElementById('zh-status-title').innerText = `抓取完成：共 ${linkArr.length} 张高清图`;
        document.getElementById('zh-result-text').value = linkArr.join('\n');
        document.getElementById('zh-result-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // --- 4. 事件绑定 ---
    btn.onclick = startScraping;

    document.getElementById('zh-btn-close').onclick = () => {
        document.getElementById('zh-result-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    document.getElementById('zh-btn-copy').onclick = function() {
        document.getElementById('zh-result-text').select();
        document.execCommand('copy');
        this.innerText = '复制成功!';
        setTimeout(() => { this.innerText = '复制全部链接'; }, 1000);
    };

})();