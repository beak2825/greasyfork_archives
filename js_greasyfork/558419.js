// ==UserScript==
// @name         抖音视频页侧边栏批量复制视频URL
// @namespace    https://nssc.cc/
// @version      0.7.1
// @description  在抖音视频页右侧列表给每个视频加勾选框。修复全选在短剧/合集模式下的失效问题。修复URL重复拼接域名的问题。
// @author       xiaozhong
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/video
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558419/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E9%A1%B5%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91URL.user.js
// @updateURL https://update.greasyfork.org/scripts/558419/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E9%A1%B5%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局 Set，用于去重
    const processedVideoIds = new Set();

    // ========== 工具函数：复制文本 ==========
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return Promise.resolve();
        }
    }

    // ========== 创建右下角工具栏 ==========
    function createToolbar() {
        if (document.getElementById('dy-copy-toolbar')) return;

        const bar = document.createElement('div');
        bar.id = 'dy-copy-toolbar';
        bar.innerHTML = `
            <button id="dy-select-all-btn" style="background:#333;margin-right:8px;border:1px solid #555;">全选本页</button>
            <button id="dy-copy-selected-btn">复制选中URL</button>
            <span id="dy-copy-status" style="margin-left:8px;font-size:12px;color:#fff;opacity:0.9;"></span>
        `;

        Object.assign(bar.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            background: 'rgba(0, 0, 0, 0.85)',
            padding: '10px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#fff',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });

        const btnStyle = {
            border: 'none',
            outline: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#fff',
            transition: 'all 0.2s'
        };

        const copyBtn = bar.querySelector('#dy-copy-selected-btn');
        Object.assign(copyBtn.style, btnStyle);
        copyBtn.style.background = '#fe2c55'; // 抖音红

        const selectAllBtn = bar.querySelector('#dy-select-all-btn');
        Object.assign(selectAllBtn.style, btnStyle);

        // ------------------ 全选功能逻辑 ------------------
        selectAllBtn.addEventListener('click', () => {
            const recHeader = getRecommendationHeader();
            let recHeaderTop = null;

            if (recHeader) {
                recHeaderTop = recHeader.getBoundingClientRect().top;
            }

            const checkboxes = document.querySelectorAll('.dy-copy-checkbox');
            let targetCheckboxes = [];

            checkboxes.forEach(cb => {
                if (recHeaderTop === null) {
                    targetCheckboxes.push(cb);
                } else {
                    const cbTop = cb.getBoundingClientRect().top;
                    // 只有在分界线 上方 的才选中 (留10px容错)
                    if (cbTop < recHeaderTop - 10) {
                        targetCheckboxes.push(cb);
                    }
                }
            });

            if (targetCheckboxes.length === 0) {
                 document.getElementById('dy-copy-status').textContent = '未找到可全选的视频';
                 return;
            }

            const isAllChecked = targetCheckboxes.every(cb => cb.checked);
            const newState = !isAllChecked;

            targetCheckboxes.forEach(cb => {
                cb.checked = newState;
            });

            const statusEl = document.getElementById('dy-copy-status');
            statusEl.textContent = newState
                ? `已自动勾选 ${targetCheckboxes.length} 个`
                : '已取消全选';
        });

        // ------------------ 复制功能逻辑 ------------------
        copyBtn.addEventListener('click', async () => {
            const checkboxes = document.querySelectorAll('.dy-copy-checkbox:checked');
            const uniqueUrls = new Set(
                Array.from(checkboxes).map(cb => cb.dataset.url).filter(Boolean)
            );
            const urls = Array.from(uniqueUrls);
            const statusEl = document.getElementById('dy-copy-status');

            if (!urls.length) {
                statusEl.textContent = '请先勾选视频';
                return;
            }

            try {
                await copyToClipboard(urls.join('\n'));
                statusEl.textContent = `成功复制 ${urls.length} 行`;
                setTimeout(() => statusEl.textContent = '', 3000);
            } catch (e) {
                statusEl.textContent = '复制失败';
            }
        });

        document.body.appendChild(bar);
    }

    // ========== 提取视频 ID ==========
    function getVideoId(url) {
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    }

    // ========== 查找“推荐视频”的分界线 ==========
    function getRecommendationHeader() {
        const headers = document.querySelectorAll('[data-e2e="cover-age-title-container"]');
        for (let h of headers) {
            if (h.innerText.includes('推荐') || h.innerText.includes('Similar') || h.innerText.includes('猜你')) {
                return h;
            }
        }
        return null;
    }

    // ========== 核心逻辑：给卡片加勾选框 ==========
    function enhanceVideoCards() {
        const allLinks = document.querySelectorAll('a[href*="/video/"]');

        allLinks.forEach(a => {
            // ============ 【修复重点】 ============
            // 直接使用 a.href 属性，浏览器会自动解析出完整的 URL（http://...）
            // 不需要再手动拼接 location.origin
            let fullUrl = a.href;
            if (!fullUrl) return;

            // 清理 URL 参数，保留纯净链接
            fullUrl = fullUrl.split('?')[0];

            // 过滤非视频链接
            if (!/\/video\/\d+/.test(fullUrl)) return;

            const vid = getVideoId(fullUrl);
            if (!vid) return;

            // 去重
            if (document.querySelector(`.dy-copy-checkbox[data-vid="${vid}"]`)) return;

            // 图片检测
            const hasImage = a.querySelector('img') ||
                           a.querySelector('video') ||
                           (window.getComputedStyle(a).backgroundImage !== 'none') ||
                           (a.querySelector('.video-card-cover'));

            // 跳过纯文本标题
            if (!hasImage && a.innerText.trim().length > 5) return;

            let card = a.closest('div');
            if (!card) card = a.closest('li');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            if (rect.width > 600 && rect.height > 300) return;
            if (rect.width < 50 || rect.height < 50) return;

            if (card.querySelector('.dy-copy-checkbox')) return;

            const computedStyle = window.getComputedStyle(card);
            if (computedStyle.position === 'static') {
                card.style.position = 'relative';
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'dy-copy-checkbox';
            checkbox.dataset.url = fullUrl;
            checkbox.dataset.vid = vid;

            Object.assign(checkbox.style, {
                position: 'absolute',
                top: '4px',
                left: '4px',
                zIndex: '999',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
                accentColor: '#fe2c55',
                boxShadow: '0 0 2px rgba(0,0,0,0.5)'
            });

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            card.appendChild(checkbox);
            processedVideoIds.add(vid);
        });
    }

    // ========== 启动 ==========
    function init() {
        createToolbar();
        enhanceVideoCards();

        const observer = new MutationObserver(() => enhanceVideoCards());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => setTimeout(init, 1500));
    setTimeout(init, 1500);

})();