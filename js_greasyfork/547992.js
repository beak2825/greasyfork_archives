// ==UserScript==
// @name         腾讯会议字幕导出
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  修改流程，读取字幕后直接选择格式导出，无需确认，并可重复导出不同格式。
// @match        https://meeting.tencent.com/cw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547992/%E8%85%BE%E8%AE%AF%E4%BC%9A%E8%AE%AE%E5%AD%97%E5%B9%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/547992/%E8%85%BE%E8%AE%AF%E4%BC%9A%E8%AE%AE%E5%AD%97%E5%B9%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 填入字幕列表容器的 CSS 选择器
    const YOUR_SELECTOR = '.minutes-module-list';

    let subtitlesData = []; // 用于存储读取后的字幕数据
    let uiInjected = false;
    let appContext = null;
    const ui = {};

    // 重置UI到初始状态
    function resetUI() {
        if (!ui.readButton) return;
        ui.readButton.style.display = 'block';
        ui.readButton.disabled = false;
        ui.readButton.textContent = '读取字幕';

        ui.exportSrtButton.style.display = 'none';
        ui.exportTxtButton.style.display = 'none';
        ui.progressBarContainer.style.display = 'none';

        subtitlesData = [];
    }

    // 注入导出控件
    function initializeUI(doc) {
        appContext = doc;
        const controlsContainer = doc.createElement('div');
        controlsContainer.id = 'srt-exporter-container';
        Object.assign(controlsContainer.style, {
            position: 'fixed', top: '120px', right: '20px', zIndex: '99999',
            backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px',
            padding: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            fontFamily: 'sans-serif', width: '160px', textAlign: 'center'
        });

        // 读取/重新读取字幕按钮
        ui.readButton = doc.createElement('button');
        ui.readButton.textContent = '读取字幕';
        Object.assign(ui.readButton.style, {
            display: 'block', width: '100%', padding: '10px',
            backgroundColor: '#007bff', color: 'white',
            borderRadius: '5px', cursor: 'pointer', fontSize: '14px', border: 'none',
            marginBottom: '8px'
        });
        ui.readButton.onclick = startReadingSubtitles;

        // 导出SRT按钮
        ui.exportSrtButton = doc.createElement('button');
        ui.exportSrtButton.textContent = '导出SRT字幕';
        Object.assign(ui.exportSrtButton.style, {
            display: 'none', width: '100%', padding: '10px', // Initially hidden
            backgroundColor: '#007bff', color: 'white',
            borderRadius: '5px', cursor: 'pointer', fontSize: '14px', border: 'none',
            marginBottom: '8px'
        });
        ui.exportSrtButton.onclick = () => exportAndDownload('srt');

        // 导出TXT按钮
        ui.exportTxtButton = doc.createElement('button');
        ui.exportTxtButton.textContent = '导出TXT文本';
        Object.assign(ui.exportTxtButton.style, {
            display: 'none', width: '100%', padding: '10px', // Initially hidden
            backgroundColor: '#17a2b8', color: 'white',
            borderRadius: '5px', cursor: 'pointer', fontSize: '14px', border: 'none'
        });
        ui.exportTxtButton.onclick = () => exportAndDownload('txt');

        // 进度条
        ui.progressBarContainer = doc.createElement('div');
        ui.progressBarContainer.style.display = 'none';
        ui.progressBarContainer.style.marginTop = '10px';
        const progressBar = doc.createElement('div');
        Object.assign(progressBar.style, {
            width: '100%', height: '8px', backgroundColor: '#e9ecef',
            borderRadius: '4px', overflow: 'hidden'
        });
        ui.progressFill = doc.createElement('div');
        Object.assign(ui.progressFill.style, {
            width: '0%', height: '100%', backgroundColor: '#4caf50',
            transition: 'width 0.2s ease-in-out'
        });
        ui.progressText = doc.createElement('div');
        ui.progressText.textContent = '加载中...';
        Object.assign(ui.progressText.style, {
            fontSize: '12px', color: '#6c757d', marginTop: '5px'
        });
        progressBar.appendChild(ui.progressFill);
        ui.progressBarContainer.appendChild(ui.progressText);
        ui.progressBarContainer.appendChild(progressBar);

        controlsContainer.appendChild(ui.readButton);
        controlsContainer.appendChild(ui.exportSrtButton);
        controlsContainer.appendChild(ui.exportTxtButton);
        controlsContainer.appendChild(ui.progressBarContainer);
        doc.body.appendChild(controlsContainer);
        console.log('字幕导出控件已注入');
    }

    // 毫秒 → SRT 时间格式
    function formatSRTTime(ms) {
        const date = new Date(ms);
        return `${date.getUTCHours().toString().padStart(2, '0')}:` +
               `${date.getUTCMinutes().toString().padStart(2, '0')}:` +
               `${date.getUTCSeconds().toString().padStart(2, '0')},` +
               `${date.getUTCMilliseconds().toString().padStart(3, '0')}`;
    }

    // 解析字幕时间段
    function parseTimeOffset(timeOffset) {
        const [startMs, endMs] = timeOffset.split('-').map(t => parseInt(t));
        return { start: formatSRTTime(startMs), end: formatSRTTime(endMs) };
    }

    // 生成内容并直接触发下载
    function exportAndDownload(format) {
        if (subtitlesData.length === 0) {
            alert('没有已读取的字幕数据，请先读取字幕。');
            return;
        }

        let generatedContent = '';
        if (format === 'srt') {
            let seq = 1;
            subtitlesData.forEach(s => {
                if (s.timeOffset && s.text.trim()) {
                    try {
                        const { start, end } = parseTimeOffset(s.timeOffset);
                        generatedContent += `${seq++}\n${start} --> ${end}\n${s.text.trim()}\n\n`;
                    } catch (e) {
                        console.warn(`解析时间失败: ${s.timeOffset}`, e);
                    }
                }
            });
        } else if (format === 'txt') {
             subtitlesData.forEach(s => {
                if (s.text.trim()) {
                   generatedContent += `${s.text.trim()}\n`;
                }
            });
        }

        if (!generatedContent.trim()) {
            alert('未能生成任何内容，请检查字幕数据');
            return;
        }
        
        downloadFile(format, generatedContent);
    }

    // 开始读取字幕 (主函数)
    function startReadingSubtitles() {
        if (!appContext) return alert('脚本上下文丢失，请刷新页面！');

        subtitlesData = []; // 清空旧数据
        ui.readButton.disabled = true;
        ui.readButton.textContent = '正在读取...';
        ui.progressBarContainer.style.display = 'block';
        ui.exportSrtButton.style.display = 'none';
        ui.exportTxtButton.style.display = 'none';
        ui.progressFill.style.width = '0%';
        ui.progressText.textContent = '加载进度: 0% (已读取 0 条)';

        const container = appContext.querySelector(YOUR_SELECTOR);
        if (!container) {
            alert('错误：未找到字幕容器');
            resetUI();
            return;
        }

        let scriptIsActive = true;
        let maxScrollTop = 0;
        const scrollGuard = () => {
            if (!scriptIsActive) return;
            if (container.scrollTop > maxScrollTop) {
                maxScrollTop = container.scrollTop;
            } else if (container.scrollTop < maxScrollTop) {
                container.scrollTop = maxScrollTop;
            }
        };
        container.addEventListener('scroll', scrollGuard);

        const allSubtitles = new Map();
        let lastScrollTop = -1;

        const processAndFinalize = () => {
            scriptIsActive = false;
            container.removeEventListener('scroll', scrollGuard);

            subtitlesData = Array.from(allSubtitles.values())
                .sort((a, b) => a.pid - b.pid || a.sid - b.sid);

            if (subtitlesData.length === 0) {
                alert('未能读取到任何字幕内容');
                resetUI();
                return;
            }

            // 读取完成，显示导出选项，并允许重新读取
            ui.progressBarContainer.style.display = 'none';
            ui.exportSrtButton.style.display = 'block';
            ui.exportTxtButton.style.display = 'block';
            ui.readButton.textContent = '重新读取字幕';
            ui.readButton.disabled = false;
            ui.readButton.style.display = 'block';
        };

        const loadContent = () => {
            const totalHeight = container.scrollHeight;
            const viewportHeight = container.clientHeight;

            appContext.querySelectorAll('[data-pid]').forEach(paragraph => {
                const pid = paragraph.getAttribute('data-pid');
                if (!pid) return;
                paragraph.querySelectorAll('[data-sid]').forEach(sentence => {
                    const sid = sentence.getAttribute('data-sid');
                    const timeOffset = sentence.getAttribute('data-time-offset');
                    if (sid && timeOffset) {
                        const words = sentence.querySelectorAll('[class*="word-module_word"]');
                        const text = Array.from(words).map(w => w.textContent.trim()).join('');
                        if (text) {
                            const key = `${pid}-${sid}`;
                            if (!allSubtitles.has(key)) {
                                allSubtitles.set(key, { pid: +pid, sid: +sid, text, timeOffset });
                            }
                        }
                    }
                });
            });

            const progress = Math.min(((container.scrollTop + viewportHeight) / totalHeight) * 100, 100);
            ui.progressFill.style.width = `${progress.toFixed(1)}%`;
            ui.progressText.textContent = `加载进度: ${progress.toFixed(1)}% (已读取 ${allSubtitles.size} 条)`;

            if ((container.scrollTop + viewportHeight + 5) >= totalHeight || container.scrollTop === lastScrollTop) {
                console.log('滚动完成。');
                processAndFinalize();
            } else {
                lastScrollTop = container.scrollTop;
                container.scrollTop += viewportHeight;
                setTimeout(loadContent, 800);
            }
        };

        console.log('正在重置滚动条到顶部...');
        container.scrollTop = 0;
        maxScrollTop = 0;
        setTimeout(() => {
            console.log(`滚动条已重置, 当前位置: ${container.scrollTop}px. 开始加载字幕.`);
            maxScrollTop = container.scrollTop;
            loadContent();
        }, 500);
    }

    // 下载字幕文件 (不再重置UI)
    function downloadFile(format, content) {
        if (!content) return alert('没有可下载的内容');
        const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = appContext.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        a.download = `腾讯会议字幕_${timestamp}.${format}`;
        appContext.body.appendChild(a);
        a.click();
        appContext.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`${format.toUpperCase()} 文件已导出。`);
    }

    // 检测字幕容器并注入UI
    function findTargetAndInject() {
        if (uiInjected || !YOUR_SELECTOR) return;
        let targetDoc = null;
        if (document.querySelector(YOUR_SELECTOR)) {
            targetDoc = document;
        } else {
            for (const iframe of document.querySelectorAll('iframe')) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc && iframeDoc.querySelector(YOUR_SELECTOR)) {
                        targetDoc = iframeDoc;
                        break;
                    }
                } catch (e) { /* 忽略跨域iframe错误 */ }
            }
        }
        if (targetDoc) {
            uiInjected = true;
            observer.disconnect();
            initializeUI(targetDoc);
        }
    }

    const observer = new MutationObserver(findTargetAndInject);
    observer.observe(document.body, { childList: true, subtree: true });
    findTargetAndInject();
})();