// ==UserScript==
// @name         小红书用户链接提取器（自动滚动提取链接）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动滚动提取小红书用户链接，去重后自动删除前2条结果
// @author       木木三大师
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549662/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%94%A8%E6%88%B7%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549662/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%94%A8%E6%88%B7%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    GM_addStyle(`
        #xhsLinkControlPanel {
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            background: white; border-radius: 8px; box-shadow: 0 3px 15px rgba(0,0,0,0.15);
            padding: 12px; width: 280px;
        }
        #xhsControlHeader {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
        }
        #xhsControlHeader h3 {
            margin: 0; color: #333; font-size: 16px; display: flex; align-items: center; gap: 6px;
        }
        #xhsClosePanel {
            background: transparent; border: none; font-size: 18px; cursor: pointer; color: #666;
        }
        .xhsControlBtn {
            width: 100%; padding: 8px 0; border: none; border-radius: 4px;
            font-size: 14px; font-weight: 500; cursor: pointer; margin-bottom: 8px;
            transition: all 0.2s;
        }
        #xhsStartExtract { background: #ff2442; color: white; }
        #xhsStartExtract:hover { background: #e01f3a; }
        #xhsStartExtract.running { background: #86909C; cursor: wait; }
        #xhsCopyResults { background: #165DFF; color: white; }
        #xhsCopyResults:hover { background: #0E4BDB; }
        #xhsCopyResults:disabled { background: #ccc; cursor: not-allowed; }
        .xhsStatus { margin-top: 10px; font-size: 13px; color: #666; line-height: 1.5; }
        #xhsProgress {
            height: 4px; background: #f0f0f0; border-radius: 2px; margin: 8px 0; overflow: hidden;
        }
        #xhsProgressBar {
            height: 100%; background: #ff2442; width: 0%; transition: width 0.3s ease;
        }
        #xhsToggleBtn {
            position: fixed; top: 20px; right: 20px; z-index: 99998;
            width: 40px; height: 40px; border-radius: 50%;
            background: #ff2442; color: white; border: none; font-size: 16px; cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
    `);

    let extractedLinks = new Set(); // 去重存储
    let isExtracting = false;

    // 创建控制面板
    const controlPanel = document.createElement('div');
    controlPanel.id = 'xhsLinkControlPanel';
    controlPanel.innerHTML = `
        <div id="xhsControlHeader">
            <h3>🍠 小红书用户提取（删前2条）</h3>
            <button id="xhsClosePanel">×</button>
        </div>
        <button class="xhsControlBtn" id="xhsStartExtract">开始提取（自动滚动）</button>
        <button class="xhsControlBtn" id="xhsCopyResults" disabled>复制结果（0条）</button>
        <div id="xhsProgress">
            <div id="xhsProgressBar"></div>
        </div>
        <div class="xhsStatus" id="xhsStatusText">准备就绪，点击"开始提取"按钮</div>
    `;
    document.body.appendChild(controlPanel);

    // 关闭/显示面板
    document.getElementById('xhsClosePanel').addEventListener('click', () => {
        controlPanel.style.display = 'none';
        if (!document.getElementById('xhsToggleBtn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'xhsToggleBtn';
            toggleBtn.innerHTML = '🍠';
            document.body.appendChild(toggleBtn);
            toggleBtn.addEventListener('click', () => {
                controlPanel.style.display = 'block';
                toggleBtn.remove();
            });
        }
    });

    // 核心：提取链接（去重）
    function extractLinks() {
        const xhsUserPattern = /https?:\/\/(www\.)?xiaohongshu\.com\/user\/profile\/[^\/\s]+/i;
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.href.trim();
            if (xhsUserPattern.test(href)) {
                const pureLink = href.split('?')[0]; // 统一链接格式（去参数）
                if (!extractedLinks.has(pureLink)) {
                    extractedLinks.add(pureLink);
                    updateStatus();
                }
            }
        });
    }

    // 核心：自动删除前2条链接
    function deleteFirstTwoLinks() {
        if (extractedLinks.size >= 2) {
            const linkArray = Array.from(extractedLinks); // Set转数组（保持提取顺序）
            const newLinks = linkArray.slice(2); // 截取第3条及以后的链接
            extractedLinks = new Set(newLinks); // 重新转为Set（保持去重）
            document.getElementById('xhsStatusText').textContent =
                `已自动删除前2条，剩余 ${extractedLinks.size} 条有效链接`;
        } else if (extractedLinks.size === 1) {
            extractedLinks.clear(); // 不足2条时清空，避免残留1条无效数据
            document.getElementById('xhsStatusText').textContent =
                `提取仅1条，已清空（需删除前2条）`;
        } else {
            document.getElementById('xhsStatusText').textContent =
                `未提取到链接，无需删除`;
        }
        updateStatus(); // 同步更新按钮和计数
    }

    // 状态更新（计数、按钮状态）
    function updateStatus() {
        const count = extractedLinks.size;
        document.getElementById('xhsCopyResults').textContent = `复制结果（${count}条）`;
        document.getElementById('xhsCopyResults').disabled = count === 0;
        if (isExtracting) { // 提取中时显示滚动状态
            document.getElementById('xhsStatusText').textContent =
                `已提取 ${count} 条链接（重复已过滤），继续滚动中...`;
        }
    }

    // 自动滚动逻辑
    function autoScroll() {
        return new Promise((resolve) => {
            let lastScrollTop = 0;
            let noScrollAttempts = 0;
            const scrollTimer = setInterval(() => {
                extractLinks(); // 滚动后提取
                window.scrollBy(0, 500);

                // 计算滚动进度
                const scrollTop = window.pageYOffset;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;
                const progress = Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100);
                document.getElementById('xhsProgressBar').style.width = `${progress}%`;

                // 判断停止滚动条件（到底部或连续10次不滚动）
                if (scrollTop + clientHeight >= scrollHeight - 100 || noScrollAttempts >= 10) {
                    clearInterval(scrollTimer);
                    extractLinks(); // 最后一次提取
                    resolve();
                } else if (scrollTop === lastScrollTop) {
                    noScrollAttempts++;
                } else {
                    noScrollAttempts = 0;
                    lastScrollTop = scrollTop;
                }
            }, 800);
        });
    }

    // 开始提取按钮事件（提取完自动删前2条）
    document.getElementById('xhsStartExtract').addEventListener('click', async () => {
        if (isExtracting) return;
        isExtracting = true;
        extractedLinks.clear(); // 重置历史数据
        const startBtn = document.getElementById('xhsStartExtract');
        startBtn.textContent = '提取中...';
        startBtn.classList.add('running');
        document.getElementById('xhsProgressBar').style.width = '0%';
        document.getElementById('xhsStatusText').textContent = '开始提取并滚动页面...';
        document.getElementById('xhsCopyResults').disabled = true;

        extractLinks(); // 提取当前可见区域
        await autoScroll(); // 自动滚动提取

        // 提取完成后，自动执行删除前2条
        deleteFirstTwoLinks();

        // 恢复按钮状态
        isExtracting = false;
        startBtn.textContent = '重新提取（自动滚动）';
        startBtn.classList.remove('running');
        document.getElementById('xhsProgressBar').style.width = '100%';
    });

    // 复制结果按钮事件
    document.getElementById('xhsCopyResults').addEventListener('click', () => {
        const linksText = Array.from(extractedLinks).join('\n');
        GM_setClipboard(linksText);
        const copyBtn = document.getElementById('xhsCopyResults');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 已复制';
        setTimeout(() => copyBtn.textContent = originalText, 2000);
    });

})();