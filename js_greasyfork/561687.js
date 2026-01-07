// ==UserScript==
// @name         智慧教育资源下载助手
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  自动检测 PDF、MP3 等资源，弹出下载交互框
// @author       Martin
// @match        *://basic.smartedu.cn/*
// @run-at       document-start
// @allFrames    true
// @unwrap       true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561687/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561687/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 核心：注入到页面原生上下文拦截日志
function injectToPageContext() {
    const injectScript = document.createElement('script');
    injectScript.textContent = `
        window._pdfDownloadInfo = null;
        window._audioUrls = new Map();
        window._currentAudioResolve = null;
        window._currentAudioIndex = null;
        const _originalConsoleLog = console.log;

        // 拦截console.log
        Object.defineProperty(console, 'log', {
            value: function(...args) {
                // 匹配PDF日志
                if (args.length >= 2 && args[1] === 'PdfPlayerFirefox' && args[0].url && args[0].headers) {
                    window._pdfDownloadInfo = args[0];
                    console.log('[资源下载助手] 捕获PDF：', args[0].url.slice(0,50));
                }
                // 匹配音频日志 - 全局事件通知
                if (args.length >= 2 && args[0] === 'audioUrl' && args[1].startsWith('http')) {
                    const audioUrl = args[1];
                    window._audioUrls.set(window._currentAudioIndex, {
                        ...(window._audioUrls.get(window._currentAudioIndex) || {}),
                        url: audioUrl
                    });
                    console.log('[资源下载助手] 捕获音频URL：', audioUrl.slice(0,50), '索引：', window._currentAudioIndex);
                    // 全局事件
                    window.dispatchEvent(new CustomEvent('audioUrlCaptured', {
                        detail: { index: window._currentAudioIndex, url: audioUrl }
                    }));
                    // 兼容原有resolve逻辑
                    if (window._currentAudioResolve) {
                        window._currentAudioResolve(audioUrl);
                        window._currentAudioResolve = null;
                    }
                }
                return _originalConsoleLog.apply(console, args);
            },
            writable: false,
            configurable: false
        });

        // 防篡改
        setInterval(() => {
            if (console.log !== Object.getOwnPropertyDescriptor(console, 'log').value) {
                Object.defineProperty(console, 'log', {value: Object.getOwnPropertyDescriptor(console, 'log').value});
            }
        }, 500);

        console.log('[资源下载助手] 原生日志拦截生效');
    `;
    document.documentElement.appendChild(injectScript);
    injectScript.remove();
}

// 立即注入（所有frame都需要日志拦截）
injectToPageContext();

// 纯原生逻辑（仅顶层窗口执行UI相关逻辑）
(function() {
    'use strict';
    // 仅顶层窗口执行以下逻辑
    if (window.top !== window.self) {
        console.log('[资源下载助手] 子窗口/iframe，跳过UI创建');
        return;
    }

    let pdfDownloadInfo = null;
    let audioUrlCache = new Map();

    // MP3批量下载全局状态
    let mp3DownloadState = {
        isCanceled: false,
        currentIndex: 0,
        totalCount: 0,
        successCount: 0,
        failCount: 0,
        failList: [],
        audioList: [],
        currentXhr: null,
        resolveCurrent: null,
        isDownloading: false
    };

    // -------------------------- 面板创建 --------------------------
    function createPanel() {
        const oldPanel = document.getElementById('resource-download-panel');
        if (oldPanel) oldPanel.remove();

        // 1. 创建PDF进度条面板
        createPdfProgressPanel();
        // 2. 创建MP3进度条面板
        createMp3ProgressPanel();
        // 3. 创建主功能面板
        const panel = document.createElement('div');
        panel.id = 'resource-download-panel';
        panel.setAttribute('style', `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 180px !important;
            background: #fff !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
            padding: 20px !important;
            z-index: 999999 !important;
            display: block !important;
            box-sizing: border-box !important;
            font-family: Arial, sans-serif !important;
        `);
        panel.innerHTML = `
            <div style="font-size:16px;font-weight:bold;margin-bottom:15px;color:#333;">资源下载助手</div>
            <button id="download-pdf" style="width:100%;height:40px;margin:8px 0;border:none;border-radius:6px;background:#2563eb;color:white;font-size:14px;cursor:pointer;">下载PDF</button>
            <button id="download-mp3" style="width:100%;height:40px;margin:8px 0;border:none;border-radius:6px;background:#2563eb;color:white;font-size:14px;cursor:pointer;">批量下载MP3</button>
            <div style="font-size:11px;color:#999;margin-top:10px;">仅供个人学习使用</div>
        `;
        document.documentElement.appendChild(panel);

        // 绑定事件
        const pdfBtn = document.getElementById('download-pdf');
        pdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePdfDownload();
        });

        const mp3Btn = document.getElementById('download-mp3');
        mp3Btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            batchDownloadMP3();
        });

        console.log('[资源下载助手] 悬浮面板创建完成');
    }

    // -------------------------- PDF进度条面板（取消不拷贝链接） --------------------------
    function createPdfProgressPanel() {
        const oldProgress = document.getElementById('pdf-download-progress');
        if (oldProgress) oldProgress.remove();

        const progressPanel = document.createElement('div');
        progressPanel.id = 'pdf-download-progress';
        progressPanel.setAttribute('style', `
            position: fixed !important;
            top: 40% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 500px !important;
            max-width: 90vw !important;
            background: #fff !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
            padding: 20px !important;
            z-index: 9999999 !important;
            display: none !important;
            box-sizing: border-box !important;
        `);
        progressPanel.innerHTML = `
            <div style="font-size:16px;font-weight:bold;margin-bottom:15px;color:#333;text-align:center;">PDF下载进度</div>
            <div style="width:100%;height:20px;background:#f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:10px;">
                <div id="pdf-progress-bar" style="width:0%;height:100%;background:#2563eb;transition:width 0.3s ease;"></div>
            </div>
            <div style="font-size:14px;color:#666;text-align:center;" id="pdf-progress-text">0% (0 MB / 0 MB)</div>
            <button id="cancel-pdf-download" style="width:100%;height:36px;margin-top:15px;border:none;border-radius:6px;background:#ef4444;color:white;font-size:14px;cursor:pointer;">取消下载</button>
        `;
        document.documentElement.appendChild(progressPanel);

        // 绑定取消按钮事件
        document.getElementById('cancel-pdf-download').addEventListener('click', () => {
            if (window.currentPdfXhr) {
                window.currentPdfXhr.abort();
                hidePdfProgressPanel();
                alert('已取消PDF下载！');
            }
        });
    }

    function showPdfProgressPanel() {
        const panel = document.getElementById('pdf-download-progress');
        if (panel) panel.style.display = 'block';
    }

    function hidePdfProgressPanel() {
        const panel = document.getElementById('pdf-download-progress');
        if (panel) {
            panel.style.display = 'none';
            document.getElementById('pdf-progress-bar').style.width = '0%';
            document.getElementById('pdf-progress-text').textContent = '0% (0 MB / 0 MB)';
        }
    }

    function updatePdfProgress(loaded, total) {
        const percent = total > 0 ? Math.floor((loaded / total) * 100) : 0;
        const loadedMB = (loaded / 1024 / 1024).toFixed(2);
        const totalMB = (total / 1024 / 1024).toFixed(2);

        document.getElementById('pdf-progress-bar').style.width = `${percent}%`;
        document.getElementById('pdf-progress-text').textContent = `${percent}% (${loadedMB} MB / ${totalMB} MB)`;
    }

    // -------------------------- MP3进度条面板（终极修复取消） --------------------------
    function createMp3ProgressPanel() {
        const oldProgress = document.getElementById('mp3-download-progress');
        if (oldProgress) oldProgress.remove();

        const progressPanel = document.createElement('div');
        progressPanel.id = 'mp3-download-progress';
        progressPanel.setAttribute('style', `
            position: fixed !important;
            top: 60% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 500px !important;
            max-width: 90vw !important;
            background: #fff !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
            padding: 20px !important;
            z-index: 9999999 !important;
            display: none !important;
            box-sizing: border-box !important;
        `);
        progressPanel.innerHTML = `
            <div style="font-size:16px;font-weight:bold;margin-bottom:15px;color:#333;text-align:center;">MP3批量下载进度</div>
            <div style="width:100%;height:20px;background:#f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:10px;">
                <div id="mp3-progress-bar" style="width:0%;height:100%;background:#10b981;transition:width 0.3s ease;"></div>
            </div>
            <div style="font-size:14px;color:#666;text-align:center;" id="mp3-progress-text">0 / 0 (成功: 0, 失败: 0)</div>
            <button id="cancel-mp3-download" style="width:100%;height:36px;margin-top:15px;border:none;border-radius:6px;background:#ef4444;color:white;font-size:14px;cursor:pointer;">取消全部下载</button>
        `;
        document.documentElement.appendChild(progressPanel);

        // 终极修复：取消按钮逻辑
        document.getElementById('cancel-mp3-download').addEventListener('click', () => {
            // 1. 立即标记为取消状态
            mp3DownloadState.isCanceled = true;
            mp3DownloadState.isDownloading = false;

            // 2. 强制中断当前正在下载的音频XHR
            if (mp3DownloadState.currentXhr) {
                mp3DownloadState.currentXhr.abort();
                mp3DownloadState.currentXhr = null;
            }

            // 3. 强制中断当前正在执行的Promise
            if (mp3DownloadState.resolveCurrent) {
                mp3DownloadState.resolveCurrent(new Error('用户取消下载'));
                mp3DownloadState.resolveCurrent = null;
            }

            // 4. 强制将当前索引置为总数，让循环立即结束
            mp3DownloadState.currentIndex = mp3DownloadState.totalCount;

            // 5. 强制清空音频列表，阻止后续任何模拟点击
            mp3DownloadState.audioList = [];

            // 6. 隐藏进度条
            hideMp3ProgressPanel();

            // 7. 恢复主按钮状态
            const mp3Btn = document.getElementById('download-mp3');
            if (mp3Btn) {
                mp3Btn.textContent = '批量下载MP3';
                mp3Btn.disabled = false;
            }

            // 8. 仅弹出取消成功提示，无其他统计
            alert('✅ 已成功取消全部MP3下载！');

            // 注意：这里不重置状态，留到finally块中处理，确保判断准确
        });
    }

    function showMp3ProgressPanel() {
        const panel = document.getElementById('mp3-download-progress');
        if (panel) panel.style.display = 'block';
    }

    function hideMp3ProgressPanel() {
        const panel = document.getElementById('mp3-download-progress');
        if (panel) panel.style.display = 'none';
    }

    function updateMp3Progress() {
        const { currentIndex, totalCount, successCount, failCount } = mp3DownloadState;
        const percent = totalCount > 0 ? Math.floor((currentIndex / totalCount) * 100) : 0;

        document.getElementById('mp3-progress-bar').style.width = `${percent}%`;
        document.getElementById('mp3-progress-text').textContent = `${currentIndex} / ${totalCount} (成功: ${successCount}, 失败: ${failCount})`;
    }

    function resetMp3DownloadState() {
        mp3DownloadState = {
            isCanceled: false,
            currentIndex: 0,
            totalCount: 0,
            successCount: 0,
            failCount: 0,
            failList: [],
            audioList: [],
            currentXhr: null,
            resolveCurrent: null,
            isDownloading: false
        };
        audioUrlCache.clear();
    }

    // -------------------------- 核心工具函数 --------------------------
    function forceDownloadFile(url, fileName) {
        return new Promise((resolve, reject) => {
            if (!mp3DownloadState.isDownloading || mp3DownloadState.isCanceled) {
                reject(new Error('下载已取消'));
                return;
            }

            const xhr = new XMLHttpRequest();
            mp3DownloadState.currentXhr = xhr;

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                mp3DownloadState.currentXhr = null;
                if (xhr.status === 200) {
                    try {
                        const blobUrl = URL.createObjectURL(xhr.response);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = fileName;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(() => {
                            document.body.removeChild(a);
                            URL.revokeObjectURL(blobUrl);
                            resolve(true);
                        }, 500);
                    } catch (e) {
                        reject(new Error(`创建下载链接失败：${e.message}`));
                    }
                } else {
                    reject(new Error(`获取资源失败：HTTP ${xhr.status}`));
                }
            };

            xhr.onerror = function() {
                mp3DownloadState.currentXhr = null;
                reject(new Error('网络错误，无法获取资源'));
            };

            xhr.onabort = function() {
                mp3DownloadState.currentXhr = null;
                reject(new Error('下载被用户取消'));
            };

            xhr.send();
        });
    }

    function downloadPdfWithProgress(pdfData, fileName) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            window.currentPdfXhr = xhr;
            xhr.open('GET', pdfData.url, true);

            if (pdfData.headers && typeof pdfData.headers === 'object') {
                Object.keys(pdfData.headers).forEach(key => {
                    try {
                        xhr.setRequestHeader(key, pdfData.headers[key]);
                    } catch (e) {
                        console.warn('[资源下载助手] 无法设置请求头', key, e);
                    }
                });
            }

            xhr.responseType = 'blob';

            xhr.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    updatePdfProgress(e.loaded, e.total);
                }
            });

            xhr.onload = function() {
                window.currentPdfXhr = null;
                if (xhr.status === 200) {
                    const blobUrl = URL.createObjectURL(xhr.response);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = fileName;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                        hidePdfProgressPanel();
                        resolve(true);
                    }, 1000);
                } else {
                    hidePdfProgressPanel();
                    reject(new Error(`PDF请求失败：HTTP ${xhr.status}`));
                }
            };

            xhr.onerror = function() {
                window.currentPdfXhr = null;
                hidePdfProgressPanel();
                reject(new Error('PDF下载网络错误'));
            };

            xhr.onabort = function() {
                window.currentPdfXhr = null;
                hidePdfProgressPanel();
                reject(new Error('用户取消下载'));
            };

            showPdfProgressPanel();
            xhr.send();
        });
    }

    // -------------------------- 业务逻辑 --------------------------
    async function handlePdfDownload() {
        pdfDownloadInfo = window._pdfDownloadInfo || pdfDownloadInfo;

        if (!pdfDownloadInfo) {
            alert('❌ 未捕获到PDF资源！\n请先加载PDF内容后重试。');
            return;
        }

        const fileName = `${document.title.replace(/[\/:*?"<>|]/g, '_')}.pdf`;

        try {
            await downloadPdfWithProgress(pdfDownloadInfo, fileName);
            alert(`✅ PDF下载成功！\n文件名：${fileName}`);
        } catch (e) {
            console.error('[资源下载助手] PDF下载失败', e);
            // 只有非取消错误，才尝试拷贝链接
            if (e.message !== '用户取消下载') {
                try {
                    await navigator.clipboard.writeText(pdfDownloadInfo.url);
                    alert(`⚠️ PDF下载失败（原因：${e.message}）\n已将PDF链接复制到剪贴板，可手动下载。`);
                } catch (clipboardErr) {
                    alert(`❌ PDF下载失败！\n请手动复制以下链接下载：\n${pdfDownloadInfo.url}`);
                }
            }
        }
    }

    // MP3批量下载（最终彻底修复：取消后绝对不弹统计提示）
    async function batchDownloadMP3() {
        // 重置状态
        resetMp3DownloadState();

        const audioItems = document.querySelectorAll('div.audioList-module_audio-item_GGkA9');

        if (audioItems.length === 0) {
            alert('❌ 未找到音频列表！');
            return;
        }

        // 初始化音频列表
        const audioList = [];
        audioItems.forEach((item, idx) => {
            const nameEl = item.querySelector('div.audioList-module_center_MjbID');
            const name = nameEl ? nameEl.textContent.trim().replace(/[\/:*?"<>|]/g, '_') : `音频${idx+1}`;
            audioList.push({
                index: idx,
                element: item,
                name: name
            });
        });

        // 更新全局状态
        mp3DownloadState.audioList = audioList;
        mp3DownloadState.totalCount = audioList.length;
        mp3DownloadState.isDownloading = true;

        const mp3Btn = document.getElementById('download-mp3');
        mp3Btn.textContent = '下载中...';
        mp3Btn.disabled = true;

        // 显示进度条
        showMp3ProgressPanel();
        updateMp3Progress();

        // 监听全局音频捕获事件
        const audioUrlCapturedHandler = (e) => {
            const { index, url } = e.detail;
            audioUrlCache.set(index, url);
        };
        window.addEventListener('audioUrlCaptured', audioUrlCapturedHandler);

        // 关键：定义一个变量，专门用于标记是否取消，防止状态被重置
        let isBatchCanceled = false;

        try {
            // 开始逐个下载
            await startMp3DownloadLoop();
        } catch (e) {
            // 捕获任何错误
            console.error('[资源下载助手] MP3批量下载错误', e);
        } finally {
            // 关键1：先记录取消状态，再重置状态
            isBatchCanceled = mp3DownloadState.isCanceled;

            // 清理资源
            window.removeEventListener('audioUrlCaptured', audioUrlCapturedHandler);
            hideMp3ProgressPanel();

            // 恢复按钮状态
            mp3Btn.textContent = '批量下载MP3';
            mp3Btn.disabled = false;

            // 关键2：只有正常下载完成（未取消），才弹出统计提示
            // 这里使用独立的标记变量，绝对不会出错
            if (!isBatchCanceled) {
                const { successCount, failCount, failList } = mp3DownloadState;
                let tipMsg = `📥 MP3批量下载完成！\n✅ 成功：${successCount}个\n❌ 失败：${failCount}个`;
                if (failList.length > 0) {
                    tipMsg += `\n\n失败列表：\n${failList.join('\n')}`;
                }
                alert(tipMsg);
            }

            // 最后：重置状态
            resetMp3DownloadState();
        }
    }

    // MP3下载循环（终极修复取消）
    async function startMp3DownloadLoop() {
        const { audioList } = mp3DownloadState;

        for (mp3DownloadState.currentIndex = 0; mp3DownloadState.currentIndex < audioList.length; mp3DownloadState.currentIndex++) {
            // 第一层检查：取消状态，立即跳出
            if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) {
                console.log('[资源下载助手] 检测到取消，立即停止MP3下载循环');
                break;
            }

            const i = mp3DownloadState.currentIndex;
            const audio = audioList[i];
            // 第二层检查：音频列表已清空，立即跳出
            if (!audio) {
                console.log('[资源下载助手] 音频列表已清空，停止MP3下载循环');
                break;
            }

            window._currentAudioIndex = audio.index;
            audioUrlCache.delete(audio.index);

            try {
                // 第三层检查：下载前再次确认
                if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) break;

                // 下载前检查音频元素是否存在
                if (!audio.element || mp3DownloadState.isCanceled) break;

                // 模拟点击触发audioUrl
                audio.element.click();
                await new Promise(resolve => setTimeout(resolve, 100));

                // 获取音频URL（带取消检查）
                const audioUrl = await new Promise((resolve, reject) => {
                    // 第四层检查：Promise内部立即检查
                    if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) {
                        reject(new Error('用户取消下载'));
                        return;
                    }

                    mp3DownloadState.resolveCurrent = resolve;

                    if (audioUrlCache.has(audio.index)) {
                        resolve(audioUrlCache.get(audio.index));
                        return;
                    }

                    const timer = setTimeout(() => {
                        if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) {
                            reject(new Error('用户取消下载'));
                            return;
                        }
                        if (audioUrlCache.has(audio.index)) {
                            resolve(audioUrlCache.get(audio.index));
                        } else {
                            reject(new Error('超时2秒，缓存中无URL'));
                        }
                    }, 2000);

                    const checkCache = () => {
                        if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) {
                            clearTimeout(timer);
                            reject(new Error('用户取消下载'));
                            window.removeEventListener('audioUrlCaptured', checkCache);
                            return;
                        }
                        if (audioUrlCache.has(audio.index)) {
                            clearTimeout(timer);
                            resolve(audioUrlCache.get(audio.index));
                            window.removeEventListener('audioUrlCaptured', checkCache);
                        }
                    };
                    window.addEventListener('audioUrlCaptured', checkCache);
                });

                // 第五层检查：下载前最后确认
                if (mp3DownloadState.isCanceled || !mp3DownloadState.isDownloading) break;

                // 强制下载
                await forceDownloadFile(audioUrl, `${audio.name}.mp3`);
                mp3DownloadState.successCount++;

            } catch (e) {
                // 取消错误直接跳出循环
                if (e.message.includes('用户取消下载') || e.message.includes('下载已取消')) {
                    console.log('[资源下载助手] 捕获取消错误，终止下载');
                    break;
                }

                // 其他错误统计失败
                mp3DownloadState.failCount++;
                mp3DownloadState.failList.push(`${i+1}. ${audio.name}（${e.message}）`);
            } finally {
                // 清理资源
                window._currentAudioIndex = null;
                window._currentAudioResolve = null;
                mp3DownloadState.resolveCurrent = null;
                // 更新进度条
                updateMp3Progress();
            }
        }
    }

    // -------------------------- 初始化 --------------------------
    setTimeout(createPanel, 0);

    window.addEventListener('load', () => {
        if (!document.getElementById('resource-download-panel')) createPanel();
        if (!document.getElementById('pdf-download-progress')) createPdfProgressPanel();
        if (!document.getElementById('mp3-download-progress')) createMp3ProgressPanel();
    });

    console.log('[资源下载助手] 最终彻底修复版初始化完成（修复iframe多进度条问题）');
})();