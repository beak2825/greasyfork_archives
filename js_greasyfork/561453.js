// ==UserScript==
// @name         EEV3音乐下载助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在EEV3网站添加一键下载按钮，方便下载歌曲（音频+歌词）
// @author       Andy
// @match        https://www.eev3.com/mp3/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      www.eev3.com
// @connect      *.kuwo.cn
// @connect      er-sycdn.kuwo.cn
// @connect      *.kuwo.cn
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎵</text></svg>
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/1556186-tonc
// @downloadURL https://update.greasyfork.org/scripts/561453/EEV3%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561453/EEV3%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：清理文件名
    function buildSafeBaseName(rawTitle) {
        if (!rawTitle) return `eev3_${Date.now()}`;
        let base = String(rawTitle).replace('[Mp3_Lrc]', '').trim();
        // Windows 文件名非法字符替换为下划线
        base = base.replace(/[\\/:*?"<>|]/g, '_');
        // 去掉多余空格
        base = base.replace(/\s+/g, ' ').trim();
        // 防止空字符串
        if (!base) base = `eev3_${Date.now()}`;
        return base;
    }

    // 工具函数：从 DOM 提取标题
    function extractTitleFromDOM() {
        // 优先页面主体标题
        const h1 = document.querySelector('.djname h1') || document.querySelector('h1');
        let text = h1 ? (h1.textContent || '').trim() : '';
        if (!text) {
            // 退回 document.title（页面 <title>），去掉站点后缀
            text = (document.title || '').trim();
            // 去掉站点描述性文字，保留前半段
            const sep = text.indexOf('FLAC');
            if (sep > 0) text = text.slice(0, sep);
            const hy = text.indexOf('-');
            if (hy > 0) text = text.slice(0, hy);
            text = text.trim();
        }
        // 去掉 [Mp3_Lrc] 与页面中"刷新"等附加文案
        text = text.replace('[Mp3_Lrc]', '');
        text = text.replace(/刷新/g, '');
        // 合理清理空白
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    }

    // 显示提示信息
    function showToast(message, type = 'info') {
        let box = document.getElementById('eev3-toast-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'eev3-toast-box';
            box.style.position = 'fixed';
            box.style.right = '16px';
            box.style.bottom = '16px';
            box.style.zIndex = '999999';
            box.style.maxWidth = '420px';
            box.style.fontSize = '14px';
            box.style.lineHeight = '1.4';
            box.style.color = '#fff';
            box.style.background = 'rgba(0,0,0,0.8)';
            box.style.borderRadius = '6px';
            box.style.padding = '10px 12px';
            box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            document.body.appendChild(box);
        }
        box.textContent = message;
        box.style.background = type === 'error' ? 'rgba(200, 30, 30, 0.9)' : 'rgba(0,0,0,0.8)';
        box.style.display = 'block';
        clearTimeout(box._t);
        box._t = setTimeout(() => { box.style.display = 'none'; }, 6000);
    }

    // 创建下载按钮
    function createButton(songId) {
        if (document.getElementById('eev3-download-btn')) return null;

        const btn = document.createElement('button');
        btn.id = 'eev3-download-btn';
        btn.textContent = '一键下载（音频+歌词）';
        btn.className = 'eev3-download-button';
        btn.addEventListener('click', () => downloadSong(songId, btn));
        return btn;
    }

    // 注入按钮到页面
    function injectButton(songId) {
        const target = document.querySelector('.player-container')
            || document.querySelector('.song-info')
            || document.querySelector('#player')
            || document.querySelector('h1');
        const btn = createButton(songId);
        if (!btn) return true;

        if (target && target.parentNode) {
            target.parentNode.insertBefore(btn, target.nextSibling);
        } else {
            document.body.insertBefore(btn, document.body.firstChild);
        }

        // 从 DOM 设置歌曲名
        const domTitle = extractTitleFromDOM();
        if (domTitle) {
            btn.textContent = `一键下载（音频+歌词） - ${domTitle}`;
            btn.dataset.rawTitle = domTitle;
        }

        return true;
    }

    // 获取 302 重定向真实地址
    function fetchRedirect(downloadUrl, referer) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: downloadUrl + (downloadUrl.includes('?') ? '&' : '?') + '_r=' + Math.random().toString().slice(2),
                headers: {
                    'Referer': referer,
                    'User-Agent': navigator.userAgent,
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Cookie': 'down_mima=ok;'
                },
                anonymous: false,
                onload: function(response) {
                    console.log('重定向检查:', downloadUrl, '→', response.finalUrl);

                    // 检查是否重定向
                    if (response.finalUrl && response.finalUrl !== downloadUrl && !response.finalUrl.includes('plug/down.php')) {
                        resolve(response.finalUrl);
                        return;
                    }

                    // responseHeaders 可能是对象或数组，需要兼容处理
                    let locationHeader = null;
                    if (Array.isArray(response.responseHeaders)) {
                        locationHeader = response.responseHeaders.find(h => h.name.toLowerCase() === 'location');
                    } else if (typeof response.responseHeaders === 'object') {
                        // 如果是对象，尝试查找 Location 字段
                        locationHeader = response.responseHeaders['Location'] || response.responseHeaders['location'];
                    }

                    if (locationHeader && typeof locationHeader === 'string' && !locationHeader.includes('plug/down.php')) {
                        console.log('从 Location 头获取:', locationHeader);
                        resolve(locationHeader);
                        return;
                    }

                    // 没有重定向，返回原 URL
                    resolve('');
                },
                onerror: function(error) {
                    console.error('重定向检查失败:', error);
                    resolve('');
                }
            });
        });
    }

    // 下载文件
    function downloadFile(url, filename) {
        console.log('--- 准备调用 GM_download ---');
        console.log('URL:', url);
        console.log('文件名:', filename);

        return new Promise((resolve, reject) => {
            try {
                GM_download({
                    url: url,
                    name: filename,
                    saveAs: false,
                    onerror: function(error) {
                        console.error('GM_download 出错:', error);
                        console.error('错误详情:', JSON.stringify(error));
                        reject(error);
                    },
                    onload: function() {
                        console.log('GM_download 完成:', filename);
                        resolve();
                    },
                    onprogress: function(progress) {
                        console.log('下载进度:', filename, progress);
                    }
                });
                console.log('GM_download 已调用');
            } catch (e) {
                console.error('GM_download 调用异常:', e);
                reject(e);
            }
        });
    }

    // 获取歌词内容并清理水印（返回文本）
    function fetchCleanLrcContent(lrcUrl, referer) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: lrcUrl + (lrcUrl.includes('?') ? '&' : '?') + '_r=' + Math.random().toString().slice(2),
                headers: {
                    'Referer': referer,
                    'User-Agent': navigator.userAgent,
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Cookie': 'down_mima=ok;'
                },
                onload: function(response) {
                    console.log('歌词请求状态:', response.status, response.statusText);

                    // 获取 Content-Type 响应头
                    let contentType = '';
                    if (Array.isArray(response.responseHeaders)) {
                        const ctHeader = response.responseHeaders.find(h => h.name.toLowerCase() === 'content-type');
                        contentType = ctHeader ? ctHeader.value : '';
                    } else if (typeof response.responseHeaders === 'object') {
                        contentType = response.responseHeaders['Content-Type'] || response.responseHeaders['content-type'] || '';
                    }
                    console.log('响应类型:', contentType);

                    let text = response.responseText;

                    // 检查是否返回了错误提示
                    if (!text || text.trim().length === 0) {
                        console.warn('歌词内容完全为空');
                        reject(new Error('歌词内容为空'));
                        return;
                    }

                    // 检查是否是错误页面
                    if (text.includes('您的下载次数已用完') || text.includes('下载次数不足') || text.includes('系统繁忙')) {
                        console.warn('服务器返回限制提示，内容:', text.substring(0, 200));
                        reject(new Error('下载次数不足'));
                        return;
                    }

                    // 检查是否是HTML页面（错误）
                    if (text.includes('<html') || text.includes('<!DOCTYPE')) {
                        console.warn('返回的是HTML页面而不是歌词，前200字符:', text.substring(0, 200));
                        reject(new Error('返回了错误页面'));
                        return;
                    }

                    // 清理水印
                    const patterns = [
                        /欢迎来访易听音乐网\s*www\.eev3\.com/gi,
                        /欢迎来访易听音乐网/gi,
                        /www\.eev3\.com/gi
                    ];
                    for (const re of patterns) {
                        text = text.replace(re, '');
                    }
                    text = text.replace(/\n{3,}/g, '\n\n');

                    console.log('清理后歌词长度:', text.length);
                    console.log('歌词前150字符:', text.substring(0, 150));

                    // 返回清理后的文本内容
                    resolve(text);
                },
                onerror: function(error) {
                    console.error('歌词请求失败:', error);
                    reject(error);
                }
            });
        });
    }

    // 下载歌词文件
    async function downloadLrc(lrcUrl, filename, referer) {
        try {
            console.log('========== 开始下载歌词 ==========');
            console.log('文件名:', filename);
            console.log('原始链接:', lrcUrl);
            console.log('Referer:', referer);

            // 先尝试获取重定向地址
            const lrcRedirect = await fetchRedirect(lrcUrl, referer);
            console.log('重定向结果:', lrcRedirect || '无重定向');

            // 使用重定向后的 URL 或原始 URL
            const finalUrl = lrcRedirect || lrcUrl;

            // 直接使用 GM_xmlhttpRequest 获取歌词内容
            const lrcContent = await fetchCleanLrcContent(finalUrl, referer);

            console.log('歌词内容长度:', lrcContent.length);
            console.log('前100字符:', lrcContent.substring(0, 100));

            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(lrcContent);
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            console.log('歌词下载成功:', filename);
            console.log('========== 歌词下载完成 ==========');

        } catch (e) {
            console.error('========== 歌词下载失败 ==========');
            console.error('错误详情:', e);
            console.error('错误堆栈:', e.stack);

            // 降级：直接使用 GM_download 下载原始链接
            try {
                console.log('尝试降级下载...');
                await downloadFile(lrcUrl, filename);
                console.log('降级下载成功:', filename);
            } catch (e2) {
                console.error('降级下载也失败:', e2);
                throw e; // 抛出原始错误
            }
        }
    }

    // 主下载函数
    async function downloadSong(songId, btn) {
        console.log('========== 开始下载流程 ==========');
        console.log('歌曲ID:', songId);

        // 更新按钮状态
        btn.textContent = '下载中（音频+歌词）...';
        btn.disabled = true;

        try {
            const title = btn.dataset?.rawTitle || extractTitleFromDOM() || '';
            console.log('歌曲标题:', title);
            const baseName = buildSafeBaseName(title);
            console.log('基础文件名:', baseName);

            // 音频下载链接
            const musicDownUrl = `https://www.eev3.com/plug/down.php?ac=music&id=${songId}&k=320`;
            const musicReferer = `https://www.eev3.com/down.php?ac=music&id=${songId}`;
            console.log('音频下载链接:', musicDownUrl);

            // 歌词下载链接
            const lrcDownUrl = `https://www.eev3.com/plug/down.php?ac=music&lk=lrc&id=${songId}`;
            const lrcReferer = `https://www.eev3.com/down.php?ac=music&id=${songId}`;
            console.log('歌词下载链接:', lrcDownUrl);

            console.log('--- 开始获取音频重定向 ---');
            // 获取音频真实地址（302 重定向）
            const musicRedirect = await fetchRedirect(musicDownUrl, musicReferer);
            const musicUrl = musicRedirect || musicDownUrl;
            console.log('音频最终URL:', musicUrl);

            // 推断音频扩展名
            let musicExt = 'mp3';
            try {
                const url = new URL(musicUrl);
                const last = url.pathname.split('/').pop() || '';
                const dot = last.lastIndexOf('.');
                if (dot > 0) {
                    const ext = last.slice(dot + 1).split('?')[0].toLowerCase();
                    if (ext !== 'php') musicExt = ext;
                }
            } catch (_) {}

            const musicFile = `${baseName}.${musicExt}`;
            const lrcFile = `${baseName}.lrc`;
            console.log('音频文件名:', musicFile);
            console.log('歌词文件名:', lrcFile);

            console.log('--- 开始获取歌词重定向 ---');
            // 获取歌词真实地址（302 重定向）
            const lrcRedirect = await fetchRedirect(lrcDownUrl, lrcReferer);
            const lrcUrl = lrcRedirect || lrcDownUrl;
            console.log('歌词最终URL:', lrcUrl);

            console.log('--- 开始并行下载 ---');
            // 并行下载音频和歌词
            await Promise.all([
                downloadFile(musicUrl, musicFile),
                downloadLrc(lrcUrl, lrcFile, lrcReferer)
            ]);

            console.log('========== 下载流程完成 ==========');
            showToast('任务已提交：音频与歌词正在下载...', 'info');
            btn.textContent = '下载成功';
            setTimeout(() => {
                btn.textContent = `一键下载（音频+歌词） - ${title || ''}`;
                btn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('========== 下载失败 ==========');
            console.error('错误类型:', error.constructor.name);
            console.error('错误信息:', error.message);
            console.error('错误堆栈:', error.stack);
            showToast(`下载失败：${error.message || '未知错误'}`, 'error');
            btn.textContent = '下载失败';
            setTimeout(() => {
                const title = btn.dataset?.rawTitle || extractTitleFromDOM() || '';
                btn.textContent = `一键下载（音频+歌词） - ${title || ''}`;
                btn.disabled = false;
            }, 3000);
        }
    }

    // 初始化
    function init() {
        const isSongPage = /https:\/\/www\.eev3\.com\/mp3\/[a-zA-Z0-9]+\.html/.test(window.location.href);
        if (!isSongPage) return;

        const songId = window.location.pathname.split('/').pop().replace('.html', '');
        injectButton(songId);

        // 观察 DOM 变化，页面异步渲染时也注入
        const observer = new MutationObserver(() => {
            if (!document.getElementById('eev3-download-btn')) {
                injectButton(songId);
            }
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .eev3-download-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 10px 2px;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s;
        }

        .eev3-download-button:hover {
            background-color: #45a049;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .eev3-download-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

})();
