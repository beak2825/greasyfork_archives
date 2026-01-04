// ==UserScript==
// @name         爱给网音效下载
// @namespace    原作者blue
// @version      2025.09.25.04
// @description  免登录下载音效，优化性能和日志,兼容stay
// @author       karteous
// @match        https://www.aigei.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550579/%E7%88%B1%E7%BB%99%E7%BD%91%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/550579/%E7%88%B1%E7%BB%99%E7%BD%91%E9%9F%B3%E6%95%88%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待依赖加载
    function waitForDependencies(callback, maxAttempts = 20, interval = 500) {
        let attempts = 0;
        const check = setInterval(() => {
            if (window.$ && window.AudioPlayerManager && window.AudioPlayerStatus) {
                clearInterval(check);
                console.log('依赖加载成功：jQuery, AudioPlayerManager, AudioPlayerStatus');
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(check);
                console.error('依赖未加载：', {
                    jQuery: !!window.$,
                    AudioPlayerManager: !!window.AudioPlayerManager,
                    AudioPlayerStatus: !!window.AudioPlayerStatus,
                    fileGet: !!window.fileGet
                });
                alert('脚本无法运行，网站可能已更新，请检查开发者工具控制台。');
            }
            attempts++;
        }, interval);
    }

    // 下载文件函数
    const downloadFile = (url, fileName) => {
        if (!url || !url.startsWith('http')) {
            console.error('无效的下载 URL:', url);
            alert('无法获取有效下载链接，请先播放音频或检查控制台。');
            return;
        }
        console.log('尝试下载:', { url, fileName });
        fetch(url, {
            method: 'GET',
            headers: {
                'Referer': window.location.href,
                'User-Agent': navigator.userAgent,
                'Accept': 'audio/mpeg, */*'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`);
                }
                console.log('Fetch 成功:', response);
                return response.blob();
            })
            .then(blob => {
                const link = document.createElement('a');
                const blobUrl = URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = fileName || 'audio.mp3';
                link.click();
                link.remove();
                URL.revokeObjectURL(blobUrl);
                console.log('下载触发:', fileName);
            })
            .catch(error => {
                console.error('Fetch 下载失败:', error);
                console.log('尝试使用 <audio> 元素下载...');
                const audio = document.createElement('audio');
                audio.src = url;
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || 'audio.mp3';
                link.click();
                link.remove();
                console.log('Audio 元素下载触发:', fileName);
            });
    };

    // 处理单个音频项
    const processItem = (item) => {
        if (!item || !item.containerEl || !item.id) {
            console.warn('无效的音频项:', item);
            return;
        }
        const $container = window.$(item.containerEl).find('.audio-download-box');
        if ($container.find(`#freedown_${item.id}`).length > 0) {
            // console.debug('按钮已存在，跳过:', item.id); // 改为 debug 或注释掉以减少日志
            return;
        }

        console.log('处理音频项:', item.id, item.itemName);
        window.$(`<a id="freedown_${item.id}" class="audio-down-btn btn btn-default" style="color: #3ba36f;" title="点击免费下载"><i class="gei-icon-font-download"></i>免费下载</a>`)
            .click(() => {
                const itemName = item?.itemName?.replace(/<[^>]+>/g, "") || 'unknown';
                const url = item?.audioSound?.sound?.url;
                console.log('点击下载按钮:', item.id, 'URL:', url);

                if (!url) {
                    if (!window.fileGet) {
                        console.error('fileGet 函数不可用');
                        alert('未获取到链接，请先播放一次音频。');
                        return;
                    }
                    console.log('URL 不可用，尝试触发播放获取 URL');
                    const $elem = window.$('#itemInfoToken_audio_mp3_' + item.id);
                    if (!$elem.length) {
                        console.error('未找到音频元素:', '#itemInfoToken_audio_mp3_' + item.id);
                        alert('未找到音频元素，请检查页面结构。');
                        return;
                    }
                    const ocbk = $elem.attr('cbk');
                    $elem.attr('cbk', 'callBackAudioFile_Custom');
                    window.fileGet.call(window.AudioPlayerManager, $elem.get(0), 'play', null, null, null, null, item.containerEl);
                    $elem.attr('cbk', ocbk);
                    return;
                }
                downloadFile(url, `${itemName}.mp3`);
            })
            .appendTo($container);
    };

    // 自定义回调函数
    window.callBackAudioFile_Custom = (id, url, unk, obj) => {
        console.log('callBackAudioFile_Custom 调用:', { id, url, obj });
        const item = window.AudioPlayerManager.getByEl(obj.customData);
        if (!item) {
            console.error('无法获取音频项:', id);
            alert('无法获取音频项，请检查控制台。');
            return;
        }
        const itemName = item?.itemName?.replace(/<[^>]+>/g, "") || 'unknown';
        item.audioSound.init(item.containerEl, url);
        item.urlRequestStatus = window.AudioPlayerStatus.UrlRequestStatus.succ;
        downloadFile(url, `${itemName}.mp3`);
    };

    // 去抖函数
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 主逻辑
    waitForDependencies(() => {
        console.log('开始初始化脚本');
        const NATIVE_create = window.AudioPlayerManager.create.bind(window.AudioPlayerManager);
        const NATIVE_getByEl = window.AudioPlayerManager.getByEl.bind(window.AudioPlayerManager);

        // 覆盖 create 方法
        window.AudioPlayerManager.create = (elem) => {
            NATIVE_create(elem);
            const item = NATIVE_getByEl(elem);
            processItem(item);
        };

        // 处理现有音频项
        window.AudioPlayerManager.each(item => {
            processItem(item);
        });

        // 监听动态加载的元素（添加去抖）
        const debouncedProcess = debounce(() => {
            console.log('检测到 DOM 变化，重新处理音频项');
            window.AudioPlayerManager.each(item => {
                processItem(item);
            });
        }, 500);

        const observer = new MutationObserver(debouncedProcess);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();