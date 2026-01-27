// ==UserScript==
// @name         淘宝/天猫评论双模式下载 (全部/单张)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  提供两个按钮：1. 自动打包本页所有图/视频；2. 仅下载当前屏幕正中央正在查看的大图或视频。
// @author       Gemini
// @match        *://item.taobao.com/item.htm*
// @match        *://detail.tmall.com/item.htm*
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564062/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%84%E8%AE%BA%E5%8F%8C%E6%A8%A1%E5%BC%8F%E4%B8%8B%E8%BD%BD%20%28%E5%85%A8%E9%83%A8%E5%8D%95%E5%BC%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564062/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%AF%84%E8%AE%BA%E5%8F%8C%E6%A8%A1%E5%BC%8F%E4%B8%8B%E8%BD%BD%20%28%E5%85%A8%E9%83%A8%E5%8D%95%E5%BC%A0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 样式设置 (双按钮布局) ---
    const style = document.createElement('style');
    style.innerHTML = `
        #tb-panel-container {
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 2147483647; /* 保证最顶层 */
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .tb-btn {
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.2s;
            text-align: center;
            white-space: nowrap;
        }
        /* 按钮1：全部打包 */
        #btn-batch {
            background: linear-gradient(135deg, #ff9000, #ff5000);
        }
        #btn-batch:hover { transform: translateY(-2px); filter: brightness(1.1); }
        
        /* 按钮2：下载当前 */
        #btn-single {
            background: linear-gradient(135deg, #2196F3, #21CBF3);
        }
        #btn-single:hover { transform: translateY(-2px); filter: brightness(1.1); }

        .tb-btn.disabled {
            background: #bdc3c7 !important;
            cursor: not-allowed;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);

    // 创建容器
    const container = document.createElement('div');
    container.id = 'tb-panel-container';

    // 按钮1: 全部下载
    const btnBatch = document.createElement('div');
    btnBatch.className = 'tb-btn';
    btnBatch.id = 'btn-batch';
    btnBatch.innerHTML = '📦 打包全部<br><span style="font-size:10px;font-weight:normal">本页所有资源</span>';
    
    // 按钮2: 单张下载
    const btnSingle = document.createElement('div');
    btnSingle.className = 'tb-btn';
    btnSingle.id = 'btn-single';
    btnSingle.innerHTML = '👁️ 仅下当前<br><span style="font-size:10px;font-weight:normal">正在看这张</span>';

    container.appendChild(btnBatch);
    container.appendChild(btnSingle);
    document.body.appendChild(container);


    // --- 2. 公共工具函数 ---

    function cleanUrl(url) {
        if (!url) return null;
        if (url.startsWith('blob:')) return null;
        if (url.startsWith('//')) url = 'https:' + url;
        
        // 视频直接返回
        if (url.includes('.mp4')) return url;

        // 图片去后缀获取原图
        return url.replace(/_\d+x\d+.*$/, '')
                  .replace(/\.webp$/, '')
                  .replace(/_\.webp$/, '')
                  .replace(/\?.*$/, '');
    }

    function isGarbage(img) {
        // 过滤掉极小的图标，除非它是原图链接
        if (img.naturalWidth > 0 && img.naturalWidth < 100) {
            if (!img.src.includes('bao/uploaded')) return true;
        }
        return false;
    }

    // 下载单个文件的核心函数 (不打包)
    function downloadOneFile(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        // 尝试触发点击，如果是跨域图片，则使用 GM_download
        if (url.includes('alicdn') || url.includes('taobao')) {
             GM_download({
                 url: url,
                 name: filename,
                 onerror: (err) => alert('下载失败: ' + err.error)
             });
        } else {
            link.click();
        }
    }

    // --- 3. 功能A：下载当前视图 (单张/单视频) ---
    // 原理：寻找屏幕视口中面积最大、层级最高的图片或视频
    
    function getBestVisibleMedia() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let bestCandidate = null;
        let maxScore = 0; // 评分 = 面积 * 可见性

        // 1. 优先找 Video
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            // 必须在视口内
            if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
                const area = rect.width * rect.height;
                // 如果面积够大（说明是全屏播放），直接选中
                if (area > 50000) {
                     bestCandidate = { type: 'video', url: video.currentSrc || video.src };
                     maxScore = 999999999; // 视频优先级最高
                }
            }
        });

        if (bestCandidate) return bestCandidate;

        // 2. 找 Image
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (isGarbage(img)) return;

            const rect = img.getBoundingClientRect();
            
            // 计算在视口内的可见面积
            // 简单的判定：中心点是否在屏幕中心区域
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const isCentered = Math.abs(centerX - viewportWidth/2) < viewportWidth * 0.3 && 
                               Math.abs(centerY - viewportHeight/2) < viewportHeight * 0.3;

            if (isCentered && rect.width > 200) { // 必须足够大且居中
                const score = rect.width * rect.height;
                if (score > maxScore) {
                    maxScore = score;
                    bestCandidate = { type: 'image', url: img.src };
                }
            }
        });

        return bestCandidate;
    }

    btnSingle.addEventListener('click', () => {
        const media = getBestVisibleMedia();
        if (!media) {
            alert('未检测到大图或视频！\n请先点开一张图片进入“查看大图”模式，或者让视频开始播放。');
            return;
        }

        const hdUrl = cleanUrl(media.url);
        if (!hdUrl) return;

        const ext = media.type === 'video' ? 'mp4' : 'jpg';
        const timestamp = new Date().getTime();
        
        btnSingle.innerText = '下载中...';
        
        // 使用 GM_download 直接下载文件
        GM_download({
            url: hdUrl,
            name: `taobao_${media.type}_${timestamp}.${ext}`,
            onload: () => {
                 btnSingle.innerHTML = '👁️ 仅下当前<br><span style="font-size:10px;font-weight:normal">正在看这张</span>';
            },
            onerror: () => {
                 alert('下载失败，请重试');
                 btnSingle.innerHTML = '👁️ 仅下当前<br><span style="font-size:10px;font-weight:normal">正在看这张</span>';
            }
        });
    });


    // --- 4. 功能B：批量下载 (原有逻辑) ---
    
    async function batchDownload() {
        const resources = new Map();

        // 扫描视频
        document.querySelectorAll('video').forEach(v => {
            if(v.src && v.src.startsWith('http')) resources.set(v.src, 'video');
        });
        document.querySelectorAll('[data-video-url]').forEach(el => {
             const v = el.getAttribute('data-video-url');
             if(v && v.includes('.mp4')) resources.set(v.startsWith('//')?'https:'+v:v, 'video');
        });

        // 扫描图片
        document.querySelectorAll('img').forEach(img => {
            if (isGarbage(img)) return;
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && (src.includes('bao/uploaded') || src.includes('O1CN01'))) {
                const hd = cleanUrl(src);
                if (hd && !resources.has(hd)) resources.set(hd, 'image');
            }
        });

        if (resources.size === 0) {
            alert('未找到资源，请先滚动页面加载图片！');
            return;
        }

        if(!confirm(`共找到 ${resources.size} 个资源，确定打包下载吗？`)) return;

        btnBatch.classList.add('disabled');
        btnBatch.innerText = '正在下载...';

        const zip = new JSZip();
        const folder = zip.folder("taobao_batch");
        const urls = Array.from(resources.entries());
        
        for (let i = 0; i < urls.length; i++) {
            const [url, type] = urls[i];
            const ext = type === 'video' ? 'mp4' : 'jpg';
            try {
                const blob = await fetch(url).then(r => r.blob());
                if(blob.size > 1000) {
                     folder.file(`${type}_${i+1}.${ext}`, blob);
                }
            } catch(e) {}
        }

        zip.generateAsync({type:"blob"}).then(content => {
            saveAs(content, `淘宝资源打包_${new Date().getTime()}.zip`);
            btnBatch.classList.remove('disabled');
            btnBatch.innerHTML = '📦 打包全部<br><span style="font-size:10px;font-weight:normal">本页所有资源</span>';
        });
    }

    btnBatch.addEventListener('click', () => {
        if(btnBatch.classList.contains('disabled')) return;
        batchDownload();
    });

})();