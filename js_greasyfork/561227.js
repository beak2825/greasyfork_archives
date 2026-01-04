// ==UserScript==
// @name         小红书视频下载助手 v3.1 (纯原生+Blob破解版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  解决 blob 链接无法下载问题。无外部依赖，纯原生 JS 写法。暴力从网页源码和 Meta 信息中提取无水印原画地址。
// @author       Gemini & User
// @match        https://www.xiaohongshu.com/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561227/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20v31%20%28%E7%BA%AF%E5%8E%9F%E7%94%9F%2BBlob%E7%A0%B4%E8%A7%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561227/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20v31%20%28%E7%BA%AF%E5%8E%9F%E7%94%9F%2BBlob%E7%A0%B4%E8%A7%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLES = `
        #xhs-dl-btn {
            position: fixed;
            top: 15%;
            left: 20px;
            z-index: 2147483647;
            background-color: #ff2442;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-size: 14px;
            transition: all 0.3s;
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 120px;
            user-select: none;
        }
        #xhs-dl-btn:hover {
            transform: scale(1.05);
            background-color: #e01b36;
        }
        #xhs-dl-btn.disabled {
            background-color: #555;
            cursor: not-allowed;
            opacity: 0.9;
        }
        #xhs-dl-btn.downloading {
            background-color: #ff9800;
            cursor: wait;
        }
        .xhs-debug-info {
            font-size: 10px;
            margin-left: 5px;
            opacity: 0.8;
            font-weight: normal;
        }
    `;

    // 注入样式
    const styleSheet = document.createElement("style");
    styleSheet.innerText = STYLES;
    document.head.appendChild(styleSheet);

    let foundVideoUrl = null;
    let noteTitle = "";
    let extractionSource = ""; 

    function init() {
        console.log('[XHS-DL] 纯原生 v3.1 已启动');
        createButton();
        // 激进模式：每 800ms 扫描一次
        setInterval(detectVideoForce, 800);
    }

    function createButton() {
        if (document.getElementById('xhs-dl-btn')) return;

        let btn = document.createElement('div');
        btn.id = 'xhs-dl-btn';
        btn.className = 'disabled';
        btn.innerHTML = '<span>正在扫描...</span>';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) {
                alert('暂未提取到有效地址。\n请尝试刷新页面，或者点击视频播放几秒钟。');
                return;
            }
            startDownload();
        });
    }

    // === 核心：多重手段暴力提取 (原生 JS 实现) ===
    function detectVideoForce() {
        let urlCandidate = null;
        let source = "";

        // 获取标题 (兼容多种页面结构)
        let titleEl = document.querySelector('.title') || document.getElementById('detail-title');
        let rawTitle = titleEl ? titleEl.innerText : document.title;
        noteTitle = rawTitle.trim().replace(/[\\/:*?"<>|]/g, '_').substring(0, 60);

        // --- 方案 1: Meta 标签提取 ---
        if (!urlCandidate) {
            let metaOg = document.querySelector('meta[name="og:video"]') || document.querySelector('meta[property="og:video"]');
            if (metaOg && metaOg.content) {
                urlCandidate = metaOg.content;
                source = "Meta标签";
            }
        }

        // --- 方案 2: 全局状态提取 (官方数据源) ---
        if (!urlCandidate) {
            try {
                const state = unsafeWindow.__INITIAL_STATE__;
                if (state && state.note && state.note.noteDetailMap) {
                    let keys = Object.keys(state.note.noteDetailMap);
                    for (let k of keys) {
                        let note = state.note.noteDetailMap[k];
                        if (note.type === 'video' && note.video && note.video.media && note.video.media.stream) {
                            let h264 = note.video.media.stream.h264;
                            if (h264 && h264.length > 0 && h264[0].masterUrl) {
                                urlCandidate = h264[0].masterUrl;
                                source = "State数据";
                                break;
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        // --- 方案 3: 正则暴力扫描 (兜底神器) ---
        if (!urlCandidate) {
            let html = document.body.innerHTML;
            let match = html.match(/"masterUrl":"(http[^"]+)"/);
            if (match && match[1]) {
                let rawUrl = match[1];
                try {
                    urlCandidate = JSON.parse(`"${rawUrl}"`);
                    source = "正则扫描";
                } catch(e) {
                    urlCandidate = rawUrl;
                }
            }
        }
        
        // --- 方案 4: 备用正则扫描 (backupUrl) ---
        if (!urlCandidate) {
            let html = document.body.innerHTML;
            let match = html.match(/"backupUrl":"(http[^"]+)"/);
            if (match && match[1]) {
                 try {
                    urlCandidate = JSON.parse(`"${match[1]}"`); 
                    source = "备用链接";
                } catch(e) {}
            }
        }

        // === 更新 UI (原生 DOM 操作) ===
        let btn = document.getElementById('xhs-dl-btn');
        if (!btn) return;

        if (urlCandidate) {
            // 过滤掉 blob
            if (urlCandidate.startsWith('blob:')) return;

            foundVideoUrl = urlCandidate;
            extractionSource = source;

            if (btn.classList.contains('disabled')) {
                btn.classList.remove('disabled');
                btn.innerHTML = `<span>下载视频</span><span class="xhs-debug-info">(${source})</span>`;
                console.log(`[XHS-DL] 提取成功 [${source}]: ${foundVideoUrl}`);
            }
        } else {
            if (!foundVideoUrl) {
                let span = btn.querySelector('span');
                if (document.querySelector('video')) {
                     if(span) span.innerText = '解析中...';
                } else {
                     if(span) span.innerText = '未检测到视频';
                }
            }
        }
    }

    function startDownload() {
        if (!foundVideoUrl) return;

        let btn = document.getElementById('xhs-dl-btn');
        let finalUrl = foundVideoUrl;
        
        if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;
        finalUrl = finalUrl.replace(/\\u002F/g, "/");

        let fileName = (noteTitle || '小红书视频') + '.mp4';

        btn.classList.add('downloading');
        btn.innerHTML = '<span>下载中...</span>';

        GM_download({
            url: finalUrl,
            name: fileName,
            saveAs: true,
            onload: () => {
                btn.classList.remove('downloading');
                btn.innerHTML = `<span>下载完成</span><span class="xhs-debug-info">(${extractionSource})</span>`;
                setTimeout(() => {
                    btn.innerHTML = `<span>下载视频</span><span class="xhs-debug-info">(${extractionSource})</span>`;
                }, 3000);
            },
            onerror: (err) => {
                console.error(err);
                btn.classList.remove('downloading');
                btn.innerHTML = '<span>下载失败</span>';
                alert(`下载失败。已将真实链接复制到剪贴板，请尝试手动下载。\n链接: ${finalUrl}`);
                GM_setClipboard(finalUrl);
                setTimeout(() => {
                     btn.innerHTML = `<span>下载视频</span><span class="xhs-debug-info">(${extractionSource})</span>`;
                }, 3000);
            }
        });
    }

    // 延迟启动
    setTimeout(init, 1000);

})();