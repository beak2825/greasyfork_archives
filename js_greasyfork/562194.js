// ==UserScript==
// @name         🎧📹 MediaSniffer Pro - 常驻媒体探测器
// @namespace    https://greasyfork.org/users/huojian1888888
// @version      1.17
// @description  常驻按钮，点击探测当前页面所有音频、视频及m3u8资源（支持跨iframe嵌入媒体检测），支持自动复制（成功率极高）+失败时手动fallback、下载（直链+自动带Referer+以页面title命名）、m3u8合并命令复制、音频/视频/m3u8自动图标区分、暗色模式、搜索、拖动面板、按发现顺序排序
// @author       huojian1888888
// @match        *://*/*
// @grant        GM_download
// @run-at       document-start
// @license      MIT
// @icon         https://i.imgs.ovh/2026/01/10/yjBcxF.jpeg
// @downloadURL https://update.greasyfork.org/scripts/562194/%F0%9F%8E%A7%F0%9F%93%B9%20MediaSniffer%20Pro%20-%20%E5%B8%B8%E9%A9%BB%E5%AA%92%E4%BD%93%E6%8E%A2%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562194/%F0%9F%8E%A7%F0%9F%93%B9%20MediaSniffer%20Pro%20-%20%E5%B8%B8%E9%A9%BB%E5%AA%92%E4%BD%93%E6%8E%A2%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 只在主页面运行核心逻辑
    const isTop = window === window.top;
    if (!isTop) {
        // 子帧只负责提取并发送URL
        const MEDIA_EXTENSIONS = /\.(mp3|m4a|aac|wav|ogg|flac|mp4|webm|ogv|mkv|mov|avi|flv|wmv|m4v|ts|m3u8|m3u)(\?|#| )/i;

        function extractLocalMediaUrls() {
            const urls = new Set();
            document.querySelectorAll('audio, video, source').forEach(el => {
                const src = el.src || el.getAttribute('src');
                if (src && MEDIA_EXTENSIONS.test(src)) {
                    try { urls.add(new URL(src, document.baseURI).href); } catch { urls.add(src); }
                }
            });
            try {
                performance.getEntriesByType('resource')
                    .filter(entry => MEDIA_EXTENSIONS.test(entry.name) || entry.initiatorType === 'video' || entry.initiatorType === 'audio')
                    .forEach(entry => urls.add(entry.name));
            } catch (e) {}
            document.querySelectorAll('a[href]').forEach(a => {
                if (MEDIA_EXTENSIONS.test(a.href)) urls.add(a.href);
            });
            return urls;
        }

        function sendUrlsToParent() {
            if (window.parent && window !== window.parent) {
                const localUrls = extractLocalMediaUrls();
                try {
                    window.parent.postMessage({ type: 'MEDIASNIFFER_URLS', urls: Array.from(localUrls) }, '*');
                } catch (e) {}
            }
        }

        const observer = new MutationObserver(sendUrlsToParent);
        observer.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
        document.addEventListener('DOMContentLoaded', sendUrlsToParent);
        window.addEventListener('load', sendUrlsToParent);
        return;
    }

    // ==================== 主页面逻辑 ====================
    const MEDIA_EXTENSIONS = /\.(mp3|m4a|aac|wav|ogg|flac|mp4|webm|ogv|mkv|mov|avi|flv|wmv|m4v|ts|m3u8|m3u)(\?|#| )/i;
    const AUDIO_EXTS = ['mp3', 'm4a', 'aac', 'wav', 'ogg', 'flac'];
    const VIDEO_EXTS = ['mp4', 'webm', 'ogv', 'mkv', 'mov', 'avi', 'flv', 'wmv', 'm4v', 'ts'];
    const HLS_EXTS = ['m3u8', 'm3u'];

    // 使用数组保持发现顺序（先发现的排在前面）
    const allMediaUrls = [];
    let darkMode = false;
    let mediaPanel = null;
    let toggleBtn = null;
    let currentUrls = [];

    function getMediaType(url) {
        const extMatch = url.match(/\.(mp3|m4a|aac|wav|ogg|flac|mp4|webm|ogv|mkv|mov|avi|flv|wmv|m4v|ts|m3u8|m3u)/i);
        if (!extMatch) return 'unknown';
        const ext = extMatch[1].toLowerCase();
        if (AUDIO_EXTS.includes(ext)) return 'audio';
        if (VIDEO_EXTS.includes(ext)) return 'video';
        if (HLS_EXTS.includes(ext)) return 'hls';
        return 'unknown';
    }

    function getIcon(type) {
        if (type === 'audio') return '🎧';
        if (type === 'video') return '📹';
        if (type === 'hls') return '🎞️';
        return '📌';
    }

    function extractLocalMediaUrls() {
        const urls = new Set();
        document.querySelectorAll('audio, video, source').forEach(el => {
            const src = el.src || el.getAttribute('src');
            if (src && MEDIA_EXTENSIONS.test(src)) {
                try { urls.add(new URL(src, document.baseURI).href); } catch { urls.add(src); }
            }
        });
        try {
            performance.getEntriesByType('resource')
                .filter(entry => MEDIA_EXTENSIONS.test(entry.name) || entry.initiatorType === 'video' || entry.initiatorType === 'audio')
                .forEach(entry => urls.add(entry.name));
        } catch (e) {}
        document.querySelectorAll('a[href]').forEach(a => {
            if (MEDIA_EXTENSIONS.test(a.href)) urls.add(a.href);
        });
        return urls;
    }

    // 新增：安全清理标题作为文件名
    function sanitizeFilename(str) {
        return str.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').substring(0, 150);
    }

    function downloadFile(url) {
        const extMatch = url.match(MEDIA_EXTENSIONS);
        const ext = extMatch ? extMatch[1].toLowerCase() : 'unknown';

        // 以当前页面标题命名（常用于听书章节）
        let filename = document.title ? sanitizeFilename(document.title) : 'media';
        if (!/\.\w+$/.test(filename)) {
            filename += '.' + ext;
        }

        if (typeof GM_download === 'function') {
            GM_download({
                url: url,
                name: filename,
                headers: {
                    'Referer': location.href  // 自动带Referer，提高直链下载成功率
                },
                onerror: (details) => {
                    alert('下载失败（可能需要手动）：' + details.error);
                }
            });
        } else {
            // fallback（不支持headers）
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
        }
    }

    function copyToClipboard(text, successMessage = '✅ 已成功复制到剪贴板！') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}
        textarea.parentNode.removeChild(textarea);
        if (success) {
            alert(successMessage);
        } else {
            showManualCopy(text);
        }
    }

    function showManualCopy(text, title = '自动复制失败，请手动复制以下内容') {
        if (!mediaPanel) return;
        let copyArea = mediaPanel.querySelector('#ms-copyarea');
        if (!copyArea) {
            copyArea = document.createElement('div');
            copyArea.id = 'ms-copyarea';
            copyArea.style.cssText = 'display:none; padding:12px; background:#fffbe6; border-top:1px solid #ddd; flex-shrink:0;';
            copyArea.innerHTML = `
                <strong>${title}</strong><br>
                已自动选中文本 → Ctrl+C（电脑） 或 长按（手机）<br>
                <button id="ms-hidecopy" style="margin-top:8px;padding:2px 6px;font-size:12px;">隐藏</button>
                <textarea id="ms-copytext" style="width:100%;height:80px;margin-top:8px;"></textarea>
            `;
            mediaPanel.appendChild(copyArea);
            copyArea.querySelector('#ms-hidecopy').onclick = () => copyArea.style.display = 'none';
        }
        copyArea.querySelector('strong').textContent = title;
        copyArea.style.display = 'block';
        const ta = copyArea.querySelector('#ms-copytext');
        ta.value = text;
        ta.focus();
        ta.select();
        copyArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function makeDraggable(element, handle) {
        handle.style.cursor = 'move';
        handle.onmousedown = function (e) {
            if (e.button !== 0) return;
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const rect = element.getBoundingClientRect();
            const startRight = window.innerWidth - rect.right;
            const startTop = rect.top;
            const move = (e) => {
                element.style.right = `${startRight - (e.clientX - startX)}px`;
                element.style.top = `${startTop + (e.clientY - startY)}px`;
            };
            const up = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        };
    }

    function toggleDarkMode() {
        darkMode = !darkMode;
        if (darkMode) {
            mediaPanel.classList.add('dark');
        } else {
            mediaPanel.classList.remove('dark');
        }
        const btn = mediaPanel.querySelector('#ms-dark');
        if (btn) btn.textContent = darkMode ? '☀️ 亮色' : '🌙 暗色';
    }

    function updatePanel() {
        if (!mediaPanel) return;
        // 保持发现顺序，不排序
        currentUrls = allMediaUrls.slice();

        mediaPanel.querySelector('.ms-title').textContent = `🎧📹 MediaSniffer (${currentUrls.length} 个媒体)`;

        const listEl = mediaPanel.querySelector('#ms-list');
        listEl.innerHTML = '';

        if (currentUrls.length === 0) {
            const div = document.createElement('div');
            div.textContent = '未发现媒体资源（播放后自动检测，或点击刷新）';
            div.style.padding = '8px';
            div.style.color = '#888';
            div.style.fontSize = '13px';
            listEl.appendChild(div);
        } else {
            currentUrls.forEach((url, i) => {
                const type = getMediaType(url);
                const icon = getIcon(type);
                const container = document.createElement('div');
                container.style.cssText = 'display:flex; align-items:center; flex-wrap:wrap; padding:5px 8px; margin:3px 0; background:#f9f9f9; border-radius:4px; font-size:13px; gap:6px;';

                const num = document.createElement('span');
                num.textContent = `${i + 1}. ${icon}`;

                const urlSpan = document.createElement('span');
                urlSpan.textContent = url;
                urlSpan.style.cssText = 'flex:1; word-break:break-all; min-width:0; font-size:12px;';

                const copyBtn = document.createElement('button');
                copyBtn.textContent = '复制';
                copyBtn.style.cssText = 'padding:3px 8px; font-size:11px; border:none; border-radius:4px; background:#4CAF50; color:white; cursor:pointer; transition:0.2s;';
                copyBtn.onclick = () => {
                    copyToClipboard(url);
                    copyBtn.style.background = '#388E3C';
                    setTimeout(() => copyBtn.style.background = '#4CAF50', 300);
                };

                const actionBtn = document.createElement('button');
                if (type === 'hls') {
                    actionBtn.textContent = 'ffmpeg命令';
                    actionBtn.style.cssText = 'padding:3px 8px; font-size:11px; border:none; border-radius:4px; background:#FF5722; color:white; cursor:pointer; transition:0.2s;';
                    actionBtn.onclick = () => {
                        const cmd = `ffmpeg -i "${url}" -c copy -bsf:a aac_adtstoasc output.mp4`;
                        copyToClipboard(cmd, '✅ 已成功复制 m3u8 合并命令！');
                        actionBtn.style.background = '#E64A19';
                        setTimeout(() => actionBtn.style.background = '#FF5722', 300);
                    };
                } else {
                    actionBtn.textContent = '下载';
                    actionBtn.style.cssText = 'padding:3px 8px; font-size:11px; border:none; border-radius:4px; background:#2196F3; color:white; cursor:pointer; transition:0.2s;';
                    actionBtn.onclick = () => {
                        downloadFile(url);
                        actionBtn.style.background = '#1976D2';
                        setTimeout(() => actionBtn.style.background = '#2196F3', 300);
                    };
                }

                container.append(num, urlSpan, copyBtn, actionBtn);
                listEl.appendChild(container);
            });
        }

        const searchInput = mediaPanel.querySelector('#ms-search');
        if (searchInput && searchInput.value) searchInput.dispatchEvent(new Event('input'));
    }

    function createOrRecreatePanel() {
        if (mediaPanel && mediaPanel.parentNode) {
            mediaPanel.parentNode.removeChild(mediaPanel);
        }
        mediaPanel = document.createElement('div');
        mediaPanel.id = 'mediasniffer-panel';
        mediaPanel.style.cssText = 'position:fixed; top:80px; right:20px; width:420px; max-height:80vh; background:white; border:1px solid #ddd; border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.4); z-index:2147483647 !important; font-family:-apple-system,BlinkMacSystemFont,sans-serif; display:flex; flex-direction:column; overflow:hidden; transition: background 0.3s, color 0.3s;';

        mediaPanel.innerHTML = `
            <div id="ms-header" style="padding:8px 12px; background:#4a6cf7; color:white; border-radius:10px 10px 0 0; display:flex; align-items:center; gap:8px; cursor:move;">
                <span class="ms-title" style="flex:1; font-weight:bold;">🎧📹 MediaSniffer (0 个媒体)</span>
                <button id="ms-dark" style="background:none; border:none; color:white; font-size:14px; cursor:pointer;">🌙 暗色</button>
                <button id="ms-copyall" style="background:none; border:none; color:white; font-size:14px; cursor:pointer;">复制全部</button>
                <button id="ms-refresh" style="background:none; border:none; color:white; font-size:14px; cursor:pointer;">刷新</button>
                <button id="ms-close" style="background:none; border:none; color:white; font-size:16px; cursor:pointer;">×</button>
            </div>
            <input id="ms-search" type="text" placeholder="搜索媒体URL..." style="padding:8px; border:none; border-bottom:1px solid #eee; outline:none;">
            <div id="ms-list" style="flex:1; overflow-y:auto; padding:8px;"></div>
        `;

        (document.body || document.documentElement).appendChild(mediaPanel);

        // 绑定事件
        mediaPanel.querySelector('#ms-close').onclick = () => mediaPanel.style.display = 'none';
        mediaPanel.querySelector('#ms-refresh').onclick = () => {
            // 重新提取本地媒体
            const local = extractLocalMediaUrls();
            local.forEach(url => {
                if (!allMediaUrls.includes(url)) allMediaUrls.push(url);
            });
            updatePanel();
        };
        mediaPanel.querySelector('#ms-copyall').onclick = () => {
            if (currentUrls.length > 0) copyToClipboard(currentUrls.join('\n'), '✅ 已成功复制所有链接！');
        };
        mediaPanel.querySelector('#ms-dark').onclick = toggleDarkMode;

        const searchInput = mediaPanel.querySelector('#ms-search');
        searchInput.oninput = function () {
            const term = this.value.toLowerCase();
            const items = mediaPanel.querySelectorAll('#ms-list > div');
            items.forEach(item => {
                const urlText = item.querySelector('span:nth-of-type(2)')?.textContent.toLowerCase() || '';
                item.style.display = urlText.includes(term) ? 'flex' : 'none';
            });
        };

        makeDraggable(mediaPanel, mediaPanel.querySelector('#ms-header'));
        updatePanel();
    }

    function togglePanel() {
        if (!mediaPanel || mediaPanel.style.display === 'none' || !mediaPanel.parentNode) {
            createOrRecreatePanel();
            mediaPanel.style.display = 'flex';
        } else {
            mediaPanel.style.display = 'none';
        }
    }

    function createToggleButton() {
        if (toggleBtn) return;
        toggleBtn = document.createElement('div');
        toggleBtn.style.cssText = 'position:fixed; top:20px; right:20px; width:50px; height:50px; background:#4a6cf7; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; z-index:2147483647 !important; box-shadow:0 4px 12px rgba(0,0,0,0.3); user-select:none; overflow:hidden;';
        toggleBtn.title = 'MediaSniffer - 点击打开/关闭媒体面板';
        toggleBtn.onclick = togglePanel;

        const img = document.createElement('img');
        img.src = 'https://i.imgs.ovh/2026/01/10/yjBcxF.jpeg';
        img.style.cssText = 'width:100%; height:100%; border-radius:50%; object-fit:cover;';
        img.onerror = function () {
            this.onerror = null;
            toggleBtn.innerHTML = '🎵';
            toggleBtn.style.fontSize = '32px';
        };
        toggleBtn.appendChild(img);
        (document.body || document.documentElement).appendChild(toggleBtn);
    }

    // 接收子帧消息
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'MEDIASNIFFER_URLS' && Array.isArray(e.data.urls)) {
            e.data.urls.forEach(url => {
                if (!allMediaUrls.includes(url)) allMediaUrls.push(url);
            });
            if (mediaPanel && mediaPanel.style.display !== 'none') updatePanel();
        }
    });

    // 主帧初始提取
    const local = extractLocalMediaUrls();
    local.forEach(url => {
        if (!allMediaUrls.includes(url)) allMediaUrls.push(url);
    });

    // 观察器（主帧变化）
    const observer = new MutationObserver(() => {
        const local = extractLocalMediaUrls();
        let changed = false;
        local.forEach(url => {
            if (!allMediaUrls.includes(url)) {
                allMediaUrls.push(url);
                changed = true;
            }
        });
        if (changed && mediaPanel && mediaPanel.style.display !== 'none') updatePanel();
    });
    observer.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

    // 按钮注入
    const initButton = () => {
        if (document.body || document.documentElement) createToggleButton();
    };
    const domObs = new MutationObserver(initButton);
    domObs.observe(document.documentElement || document, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', initButton);
    window.addEventListener('load', initButton);
    setInterval(initButton, 3000);
})();