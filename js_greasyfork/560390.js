// ==UserScript==
// @name         Bilibili预加载脚本-解决b站卡顿问题
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  预加载Bilibili视频，避免播放顿卡，支持持续预加载
// @author       oldfather
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560390/Bilibili%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC-%E8%A7%A3%E5%86%B3b%E7%AB%99%E5%8D%A1%E9%A1%BF%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/560390/Bilibili%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC-%E8%A7%A3%E5%86%B3b%E7%AB%99%E5%8D%A1%E9%A1%BF%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const config = {
        preloadSeconds: 60, // 默认预加载60秒
        maxTotalPreload: 300, // 最大总预加载时间（300秒）
        checkInterval: 2000, // 检查间隔
        debug: false // 调试模式
    };

    // 视频流信息
    let videoSource = null;
    let videoSegmentUrls = [];
    let preloadedSegments = new Set();

    // 状态变量
    let player = null;
    let preloadTimer = null;
    let isPreloading = false;
    let lastCheckedTime = 0;
    let isUserSeeking = false; // 标记用户是否正在拖动进度条
    let seekStart = 0; // 记录拖动开始时间
    let seekEnd = 0; // 记录拖动结束时间

    // 日志函数
    const log = (message, type = 'info') => {
        if (config.debug) {
            const colors = {
                info: '#0078D7',
                warning: '#FFA200',
                error: '#E81123',
                success: '#107C10'
            };
            console.log(`%c[B站预加载] ${message}`, `color: ${colors[type] || colors.info};`);
        }
    };

    // 检测播放器
    const detectPlayer = () => {
        const videoElements = document.querySelectorAll('video');
        for (let video of videoElements) {
            if (video.src || video.parentElement.className.includes('bpx-player-video-wrap')) {
                player = video;
                log('找到播放器元素', 'success');
                
                // 监听视频源变化
                if (video.src) {
                    videoSource = video.src;
                    log(`获取视频源地址: ${videoSource}`, 'info');
                }
                
                return true;
            }
        }
        return false;
    };

    // 预加载视频片段
    const preloadVideoSegment = async (url) => {
        if (preloadedSegments.has(url)) {
            return; // 已预加载过
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'force-cache'
            });
            
            if (response.ok) {
                preloadedSegments.add(url);
                log(`成功预加载视频片段: ${url.split('/').pop()}`, 'success');
            }
        } catch (error) {
            log(`预加载失败: ${error.message}`, 'error');
        }
    };

    // 分析视频URL并提取预加载URL
const extractPreloadUrls = (baseUrl, startSegment, endSegment) => {
    // 处理不同类型的视频URL（HLS/DASH）
    const urls = [];
    
    if (baseUrl.includes('.m3u8')) {
        // HLS格式，需要解析m3u8文件获取片段列表
        log('检测到HLS格式视频，跳过直接预加载', 'warning');
        return urls;
    } else if (baseUrl.includes('.mp4')) {
        // MP4格式，可以直接预加载特定范围
        urls.push(baseUrl);
    } else if (baseUrl.includes('/upgcxcode/')) {
        // Bilibili分段视频格式
        const segmentRegex = /(\d+)_\d+_(\d+)\.(\w+)$/;
        const match = baseUrl.match(segmentRegex);
        if (match) {
            const prefix = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
            const quality = match[1];
            const fileType = match[3];
            
            for (let i = startSegment; i <= endSegment; i++) {
                const segmentUrl = `${prefix}${quality}_0_${i}.${fileType}`;
                urls.push(segmentUrl);
            }
        }
    }
    
    return urls;
};

// 使用fetch API预加载视频片段
const preloadWithFetch = async (url) => {
    if (preloadedSegments.has(url)) {
        return; // 已预加载过
    }
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Range': 'bytes=0-', // 预加载整个片段
                'Accept': '*/*',
                'Referer': window.location.href,
                'User-Agent': navigator.userAgent
            },
            cache: 'force-cache'
        });
        
        if (response.ok) {
            // 读取响应内容以确保完全缓存
            const buffer = await response.arrayBuffer();
            preloadedSegments.add(url);
            log(`成功预加载视频片段: ${url.split('/').pop()} (${(buffer.byteLength / 1024).toFixed(2)}KB)`, 'success');
        }
    } catch (error) {
        log(`预加载失败: ${error.message}`, 'error');
    }
};

// 持续预加载逻辑
const continuousPreload = () => {
    if (!player || player.paused || isPreloading) return;
    
    const currentTime = player.currentTime;
    const buffered = player.buffered;
    if (!buffered || buffered.length === 0) return;
    
    const bufferedEnd = buffered.end(buffered.length - 1);
    const totalBuffered = bufferedEnd;
    const remainingCache = Math.min(config.maxTotalPreload - (bufferedEnd - currentTime), config.preloadSeconds);
    
    // 检查是否需要继续预加载
    if (totalBuffered < player.duration && remainingCache > 0) {
        log(`当前已缓存至: ${totalBuffered.toFixed(2)}s, 开始预加载下一段`, 'info');
        
        isPreloading = true;
        
        // 使用fetch API直接预加载，避免修改currentTime
        const preloadTarget = Math.min(totalBuffered + remainingCache, player.duration);
        
        // 获取视频源URL
        const mediaSource = player.src || (player.currentSrc ? player.currentSrc : '');
        
        if (mediaSource) {
            // 根据视频URL类型采用不同的预加载策略
            if (mediaSource.includes('.m3u8')) {
                // HLS格式 - 使用间接方式预加载
                // 这种方式可能仍然会有轻微的时间跳转，但比之前更优化
                const wasPlaying = !player.paused;
                const originalTime = currentTime;
                
                // 使用更小的时间增量，减少视觉影响
                player.currentTime = Math.min(originalTime + 0.1, player.duration);
                
                requestAnimationFrame(() => {
                    player.currentTime = originalTime;
                    if (wasPlaying && player.paused) {
                        player.play().catch(e => log(`恢复播放失败: ${e.message}`, 'error'));
                    }
                    isPreloading = false;
                });
            } else {
                // 其他格式 - 尝试提取片段URL直接预加载
                const urls = extractPreloadUrls(mediaSource, Math.floor(totalBuffered / 10), Math.floor(preloadTarget / 10));
                
                if (urls.length > 0) {
                    // 并发预加载最多5个片段
                    const batchUrls = urls.slice(0, 5);
                    Promise.all(batchUrls.map(url => preloadWithFetch(url)))
                        .finally(() => {
                            isPreloading = false;
                        });
                } else {
                    // 回退到间接预加载方式，但优化时间处理
                    const wasPlaying = !player.paused;
                    const originalTime = currentTime;
                    
                    // 使用AudioContext创建一个不可见的音频元素来预加载
                    const audio = new Audio(mediaSource);
                    audio.volume = 0;
                    audio.currentTime = preloadTarget - 0.1;
                    audio.addEventListener('loadedmetadata', () => {
                        audio.currentTime = preloadTarget;
                        audio.addEventListener('canplaythrough', () => {
                            audio.pause();
                            audio.src = '';
                            isPreloading = false;
                        }, { once: true });
                    });
                }
            }
        } else {
            isPreloading = false;
        }
    }
};

    // 预加载长度直接使用配置值
    const getPreloadLength = () => {
        return config.preloadSeconds;
    };

    // 检查并执行预加载
    const checkAndPreload = () => {
        if (!player || player.paused) return;

        const currentTime = player.currentTime;
        const buffered = player.buffered;
        if (!buffered || buffered.length === 0) return;

        // 避免在视频刚开始播放时执行预加载（< 3秒）
        if (currentTime < 3) return;
        
        // 避免在用户正在拖动进度条时执行预加载
        if (isUserSeeking) {
            log('用户正在拖动进度条，跳过预加载检查', 'info');
            return;
        }
        
        // 避免在用户刚拖动完进度条后立即执行预加载（等待1秒）
        if (seekEnd > 0 && (Date.now() - seekEnd) < 1000) {
            log('用户刚完成拖动操作，等待后再预加载', 'info');
            return;
        }

        const bufferedEnd = buffered.end(buffered.length - 1);
        const bufferNeeded = config.preloadSeconds;
        
        log(`当前播放时间: ${currentTime.toFixed(2)}s, 已缓存至: ${bufferedEnd.toFixed(2)}s, 已缓存时长: ${(bufferedEnd - currentTime).toFixed(2)}s`, 'info');

        // 计算已缓存的总时长（从当前播放位置到缓存结束）
        const currentBuffered = bufferedEnd - currentTime;
        const totalBuffered = bufferedEnd;
        
        // 如果已缓存的内容不足，或者需要继续预加载以达到最大预加载限制
        if (currentBuffered < bufferNeeded * 0.8 && (totalBuffered - currentTime) < config.maxTotalPreload) {
            continuousPreload();
        }
    };

    // 初始化脚本
    const initScript = () => {
        log('初始化Bilibili智能预加载脚本', 'info');
        
        // 等待播放器加载
        const playerCheckInterval = setInterval(() => {
            if (detectPlayer()) {
                clearInterval(playerCheckInterval);
                
                
                
                // 视频开始播放后，延迟2秒再开始预加载检查
                setTimeout(() => {
                    preloadTimer = setInterval(() => {
                        checkAndPreload();
                    }, config.checkInterval);
                }, 2000);
                
                // 添加事件监听器
                player.addEventListener('playing', () => {
                    log('视频开始播放', 'info');
                });
                
                // 监听视频源变化
                player.addEventListener('loadstart', () => {
                    if (player.src) {
                        videoSource = player.src;
                        log(`视频源地址更新: ${videoSource}`, 'info');
                        preloadedSegments.clear(); // 清空已预加载记录
                    }
                });
                
                player.addEventListener('pause', () => {
                    log('视频暂停', 'info');
                });
                
                // 监听用户拖动进度条
                player.addEventListener('seeking', () => {
                    if (!isUserSeeking) {
                        isUserSeeking = true;
                        seekStart = Date.now();
                        log('用户开始拖动进度条', 'info');
                    }
                });
                
                player.addEventListener('seeked', () => {
                    isUserSeeking = false;
                    seekEnd = Date.now();
                    log('用户完成拖动进度条，耗时: ' + (seekEnd - seekStart) + 'ms', 'info');
                    
                    // 用户拖动后，重置预加载检查延迟
                    clearInterval(preloadTimer);
                    setTimeout(() => {
                        preloadTimer = setInterval(() => {
                            checkAndPreload();
                        }, config.checkInterval);
                    }, 2000);
                });
                
                // 添加用户控制面板
                addControlPanel();
            }
        }, 1000);
    };

    // 添加用户控制面板
    const addControlPanel = () => {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 12px;
            max-width: 200px;
        `;
        
        panel.innerHTML = `
            <div style="margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                <strong>B站预加载控制</strong>
                <button id="hidePanel" style="padding: 2px 5px; font-size: 10px; background: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;">×</button>
            </div>
            <div style="margin-bottom: 5px;">
                预加载长度: <input type="number" id="preloadSeconds" value="${config.preloadSeconds}" min="5" max="${config.maxTotalPreload}" style="width: 50px;">
                秒
            </div>
            <div style="margin-bottom: 5px;">
                <label><input type="checkbox" id="debugMode" ${config.debug ? 'checked' : ''}> 调试模式</label>
            </div>
            <div>
                <button id="applySettings" style="width: 100%; padding: 5px;">应用设置</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 添加事件监听器
        document.getElementById('applySettings').addEventListener('click', () => {
            const newSeconds = parseInt(document.getElementById('preloadSeconds').value);
            config.preloadSeconds = Math.max(5, Math.min(newSeconds, config.maxTotalPreload));
            config.debug = document.getElementById('debugMode').checked;
            log(`已更新设置: 预加载${config.preloadSeconds}秒, 调试模式${config.debug ? '开启' : '关闭'}`, 'success');
        });
        
        // 隐藏面板按钮事件
        document.getElementById('hidePanel').addEventListener('click', () => {
            panel.style.display = 'none';
            log('控制面板已隐藏，刷新页面将重新显示', 'info');
        });
    };

    // 导出到全局，方便手动控制
    window.bilibiliPreload = {
        config: config,
        manualPreload: (seconds) => {
            if (player && !isPreloading) {
                const originalPreload = config.preloadSeconds;
                config.preloadSeconds = seconds;
                checkAndPreload();
                setTimeout(() => {
                    config.preloadSeconds = originalPreload;
                }, 500);
            }
        },
        toggleDebug: () => {
            config.debug = !config.debug;
            log(`调试模式已${config.debug ? '开启' : '关闭'}`, 'info');
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }

})();