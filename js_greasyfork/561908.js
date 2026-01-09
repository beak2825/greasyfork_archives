// ==UserScript==
// @name         Mikan Project 复制磁链（修复版：稳定挂载 + OR/多组 + UI 美化）
// @namespace    https://mikanani.me/
// @version      1.21
// @description  兼容不同 DOM 布局的稳定版：OR 多组 AND、勾选优先、橙色 UI、MutationObserver 动态挂载
// @match        http*://mikanani.me/Home/*
// @match        http*://mikanime.tv/Home/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561908/Mikan%20Project%20%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%9A%E7%A8%B3%E5%AE%9A%E6%8C%82%E8%BD%BD%20%2B%20OR%E5%A4%9A%E7%BB%84%20%2B%20UI%20%E7%BE%8E%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561908/Mikan%20Project%20%E5%A4%8D%E5%88%B6%E7%A3%81%E9%93%BE%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%9A%E7%A8%B3%E5%AE%9A%E6%8C%82%E8%BD%BD%20%2B%20OR%E5%A4%9A%E7%BB%84%20%2B%20UI%20%E7%BE%8E%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 样式（橙色主题） ---------- */
    const style = `
    .mikan-toolbox { margin-bottom:6px; display:flex; gap:6px; align-items:center; justify-content:flex-start; }
    .mikan-btn {
        padding:4px 8px;
        border-radius:4px;
        background:#ff9100;
        color:#fff!important;
        cursor:pointer;
        font-size:12px;
        border:none;
    }
    .mikan-btn:hover { background:#ff7a00; }
    .mikan-input {
        padding:4px 6px;
        border:1px solid #ccc;
        border-radius:4px;
        font-size:12px;
        width: 260px;
    }
    .mikan-mode-toggle {
        padding:4px 6px;
        background:#ffcc80;
        color:#333;
        border-radius:4px;
        cursor:pointer;
        font-size:12px;
    }
    .mikan-mode-toggle:hover{ background:#ffb74d; }
    `;
    const css = document.createElement('style');
    css.textContent = style;


    const toastStyle = `
    .mikan-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,145,0,0.95);
        color: #fff;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    `;
    css.textContent += toastStyle;


    document.head.appendChild(css);

    /* ---------- 关键词解析（OR + 多组 AND） ---------- */
    // 输入示例： "1080 HEVC | HDR 4K" -> [ ["1080","HEVC"], ["HDR","4K"] ]
    function parseKeywordGroups(input) {
        if (!input || !input.trim()) return [];
        return input
            .split('|')
            .map(g => g.trim())
            .filter(g => g)
            .map(g => g.split(/\s+/).filter(Boolean));
    }

    function matchAndGroup(title, group) {
        return group.every(w => title.includes(w));
    }

    function matchOrGroups(title, groups) {
        if (!groups || groups.length === 0) return true;
        return groups.some(group => matchAndGroup(title, group));
    }

    /* ---------- 复制逻辑（更健壮） ---------- */
    // 自动勾选匹配到的行
    function selectMatched(container) {
        const input = container.querySelector('.mikan-input');
        const keywordText = input.value.trim();
        const groups = parseKeywordGroups(keywordText);

        // 找表格
        const table = container.parentElement.querySelector('.table');
        if (!table) {
            showToast("未找到表格结构！");
            return;
        }

        const rows = table.querySelectorAll('tr');

        rows.forEach(tr => {
            const checkbox = tr.querySelector('.js-episode-select');
            const titleA = tr.querySelector('a[target="_blank"]');
            if (!checkbox || !titleA) return;

            const title = titleA.textContent.trim();

            // 先全部清除
            checkbox.checked = false;

            // 无关键词 → 全选
            if (groups.length === 0) {
                checkbox.checked = true;
                return;
            }

            // 有关键词 → OR 模式 + 每组 AND
            if (matchOrGroups(title, groups)) {
                checkbox.checked = true;
            }
        });

        showToast("已自动勾选匹配到的行");
    }


    function copyLinks(toolbox) {
        // toolbox is the inserted UI element; find its parent episode-table
        const episodeDiv = toolbox.closest('.episode-table');
        if (!episodeDiv) return showToast('未找到该字幕组容器，复制失败');

        const input = toolbox.querySelector('.mikan-input');
        const keywordText = input ? input.value.trim() : '';
        const groups = parseKeywordGroups(keywordText);

        // find the table INSIDE this episodeDiv
        const table = episodeDiv.querySelector('table.table') || episodeDiv.querySelector('table');
        if (!table) return showToast('未找到该字幕组的磁链表格');

        // tbody tr rows
        const rows = table.querySelectorAll('tbody tr');
        let results = [];

        rows.forEach(tr => {
            const checkbox = tr.querySelector('input.js-episode-select') || tr.querySelector('input[type="checkbox"]');
            // magnet link element (备用)
            const link = tr.querySelector('a.js-magnet') || tr.querySelector('a[data-clipboard-text]');
            // title anchor (第一个 target="_blank" 的 a 通常是标题)
            const titleA = tr.querySelector('a[target="_blank"]') || tr.querySelector('.magnet-link-wrap') || tr.querySelector('a');

            if (!titleA) return; // 没标题就不处理

            const titleText = titleA.textContent.trim();

            // 如果有勾选：只取勾选项（优先）
            if (checkbox && checkbox.checked) {
                // 先尝试从 checkbox 的 data-magnet（有的页面写在这里）
                const magFromCheckbox = checkbox.getAttribute('data-magnet') || checkbox.dataset.magnet;
                if (magFromCheckbox) {
                    results.push(magFromCheckbox);
                } else if (link) {
                    const mag = link.getAttribute('data-clipboard-text') || link.dataset.clipboardText;
                    if (mag) results.push(mag);
                }
                return;
            }

            // 没有勾选：按关键词过滤（若无关键词则全收）
            if (groups.length > 0 && !matchOrGroups(titleText, groups)) return;

            // 取磁链（优先 checkbox.data-magnet，其次 js-magnet 的 data-clipboard-text）
            let magnet = null;
            if (checkbox) magnet = checkbox.getAttribute('data-magnet') || checkbox.dataset.magnet;
            if (!magnet && link) magnet = link.getAttribute('data-clipboard-text') || link.dataset.clipboardText;
            if (magnet) results.push(magnet);
        });

        GM_setClipboard(results.join('\n'));
        // 友好提示：先用非阻塞的 DOM 提示而不是 alert（更流畅）
        showToast(`已复制 ${results.length} 条磁链`);
    }

    /* ---------- 简单 Toast 提示 ---------- */
    function showToast(msg) {
        const div = document.createElement("div");
        div.className = "mikan-toast";
        div.textContent = msg;
        document.body.appendChild(div);

        // 渐入
        requestAnimationFrame(() => {
            div.style.opacity = "1";
        });

        // 2 秒后淡出并删除
        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 300);
        }, 2000);
    }



    /* ---------- 安装 UI（对 .episode-table 更稳健） ---------- */
    function installUIForEpisode(episodeDiv) {
        if (!episodeDiv || episodeDiv.dataset.mikanUiReady) return;
        episodeDiv.dataset.mikanUiReady = '1';

        const toolbox = document.createElement('div');
        toolbox.className = 'mikan-toolbox';

        toolbox.innerHTML = `
            <span class="mikan-mode-toggle">模式：OR（多组 AND）</span>
            <input class="mikan-input" type="text" placeholder="示例：1080 HEVC | HDR 4K">
            <button class="mikan-btn mikan-select">选择</button>
            <button class="mikan-btn mikan-copy">复制</button>
        `;


        // 添加事件
        const copyBtn = toolbox.querySelector('.mikan-copy');
        copyBtn.addEventListener('click', () => copyLinks(toolbox));

        const selectBtn = toolbox.querySelector('.mikan-select');
        selectBtn.addEventListener('click', () => selectMatched(toolbox));


        // 如果 copy-info-row 存在，把 toolbox 插到 copy-info-row 之前以显眼（右上）
        const copyInfo = episodeDiv.querySelector('.copy-info-row');
        if (copyInfo && copyInfo.parentNode) {
            copyInfo.parentNode.insertBefore(toolbox, copyInfo);
        } else {
            // 否则放到 episodeDiv 的最前面
            episodeDiv.prepend(toolbox);
        }
    }

    function installUI() {
        // 选择所有 episode-table（确保覆盖不同结构）
        const episodes = document.querySelectorAll('.episode-table');
        if (!episodes || episodes.length === 0) return;
        episodes.forEach(div => installUIForEpisode(div));
    }

    /* ---------- 初始化 & 观察新增节点 ---------- */
    function init() {
        installUI();
        // 展开所有（如需要）
        document.querySelectorAll('a.js-expand-episode').forEach(btn => { try { btn.click(); } catch (e) {} });
        // 观察 body 的新增节点，挂载新出现的 episode-table
        const mo = new MutationObserver(muts => {
            for (const m of muts) {
                if (!m.addedNodes) continue;
                m.addedNodes.forEach(node => {
                    if (!(node instanceof Element)) return;
                    // 如果添加的是 episode-table 自身
                    if (node.matches && node.matches('.episode-table')) {
                        installUIForEpisode(node);
                    } else {
                        // 或者在子孙节点里包含 episode-table
                        node.querySelectorAll && node.querySelectorAll('.episode-table').forEach(d => installUIForEpisode(d));
                    }
                });
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    init();

    // 作为兼容：也 hook XHR loadend 以防某些内容通过 XHR 加载后未触发 MutationObserver（备用）
    (function () {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('loadend', function () {
                try { installUI(); } catch (e) { /* ignore */ }
            });
            return origOpen.apply(this, arguments);
        };
    })();

})();
