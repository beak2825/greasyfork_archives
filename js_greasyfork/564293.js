// ==UserScript==
// @name         解决陕西干部学院单视频播放，不计入时长问题。
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license      GPL-3.0
// @description  本脚本实现默认静音 + 缓冲自动恢复播放的功能，全程无需用户手动交互。无数据修改，0%封号
// @author       蟑螂恶霸
// @match        https://www.sqgj.gov.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564293/%E8%A7%A3%E5%86%B3%E9%99%95%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%8D%95%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%EF%BC%8C%E4%B8%8D%E8%AE%A1%E5%85%A5%E6%97%B6%E9%95%BF%E9%97%AE%E9%A2%98%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/564293/%E8%A7%A3%E5%86%B3%E9%99%95%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E5%8D%95%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%EF%BC%8C%E4%B8%8D%E8%AE%A1%E5%85%A5%E6%97%B6%E9%95%BF%E9%97%AE%E9%A2%98%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.videoMuteListenerInjected) return;
    window.videoMuteListenerInjected = true;

    let isVideoOperating = false;
    const TIP_ID = 'video-buffer-tip';
    const OBSERVER_CONFIG = { childList: true, subtree: true };
    let lastBufferPercent = -1;

    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            timer && clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function removeInteractTip() {
        const tip = document.getElementById(TIP_ID);
        tip && tip.remove();
    }

    function getVideo() {
        return document.querySelector('video');
    }

    function setVideoMute() {
        const video = getVideo();
        video && (video.muted = true);
    }

    setVideoMute();
    document.addEventListener('DOMContentLoaded', setVideoMute);
    new MutationObserver(setVideoMute).observe(document.body, OBSERVER_CONFIG);

    function waitVideoBuffered(video) {
        return new Promise(resolve => {
            const checkBuffer = () => {
                if (!video.duration || isNaN(video.duration) || video.duration === 0) {
                    requestAnimationFrame(checkBuffer);
                    return;
                }
                const bufferedEnd = video.buffered.length > 0 ? video.buffered.end(0) : 0;
                const bufferPercent = Math.floor((bufferedEnd / video.duration) * 100);
                if (bufferPercent !== lastBufferPercent) {
                    lastBufferPercent = bufferPercent;
                    window.originalConsole.log('%c【缓冲进度】' + bufferPercent + '%', 'color: #ffa500; font-weight: bold;');
                }
                const hasEnoughBuffer = bufferedEnd > video.currentTime + 1;
                if (hasEnoughBuffer) {
                    lastBufferPercent = -1;
                    resolve();
                } else {
                    requestAnimationFrame(checkBuffer);
                }
            };
            checkBuffer();
        });
    }

    async function handleVideoBuffer() {
        if (isVideoOperating) return;
        isVideoOperating = true;
        removeInteractTip();
        window.originalConsole.log('%c【匹配】捕获到缓冲中日志，正在处理', 'color: #2196F3; font-weight: bold;');

        const video = getVideo();
        if (!video) {
            window.originalConsole.log('%c【视频】页面无视频元素', 'color: #f44336; font-weight: bold;');
            isVideoOperating = false;
            removeInteractTip();
            return;
        }

        let isPausedByBuffer = false;
        if (!video.paused) {
            video.pause();
            isPausedByBuffer = true;
            window.originalConsole.log('%c【视频】检测缓冲，执行暂停', 'color: #ff9800; font-weight: bold;');
        }

        if (!isPausedByBuffer) {
            const tipText = document.getElementById(TIP_ID);
            tipText && (tipText.innerText = '视频已暂停，3秒后尝试自动播放...');
            window.originalConsole.log('%c【视频】视频已暂停，无需处理，3秒后尝试播放', 'color: #9c27b0; font-weight: bold;');
            setTimeout(() => {
                video.play().then(() => {
                    window.originalConsole.log('%c【视频】3秒延迟后，静音自动播放成功', 'color: #4CAF50; font-weight: bold;');
                }).catch(err => {
                    window.originalConsole.error('%c【视频】3秒延迟后播放失败：' + err.message, 'color: #f44336; font-weight: bold;');
                }).finally(() => {
                    isVideoOperating = false;
                    removeInteractTip();
                });
            }, 3000);
            return;
        }

        try {
            window.originalConsole.log('%c【缓冲】开始监听视频缓冲状态...', 'color: #2196F3; font-weight: bold;');
            await waitVideoBuffered(video);
            window.originalConsole.log('%c【缓冲】视频缓冲成功，即将1秒后播放', 'color: #4CAF50; font-weight: bold;');

            setTimeout(() => {
                video.play().then(() => {
                    window.originalConsole.log('%c【视频】延迟1秒后，静音自动播放成功', 'color: #4CAF50; font-weight: bold;');
                }).catch(err => {
                    window.originalConsole.error('%c【播放】静音播放失败：' + err.message, 'color: #f44336; font-weight: bold;');
                }).finally(() => {
                    isVideoOperating = false;
                    removeInteractTip();
                });
            }, 1000);
        } catch (err) {
            window.originalConsole.error('%c【缓冲】监听缓冲失败：' + err.message, 'color: #f44336; font-weight: bold;');
            isVideoOperating = false;
            removeInteractTip();
            lastBufferPercent = -1;
        }
    }

    const debouncedHandleVideoBuffer = debounce(handleVideoBuffer, 1000);

    const listenConsole = (callback) => {
        const methods = ["log", "info", "warn", "error", "debug"];
        window.originalConsole = {};
        methods.forEach(method => {
            window.originalConsole[method] = console[method];
            console[method] = function (...args) {
                callback && callback(method, args);
                window.originalConsole[method].apply(console, args);
            };
        });
    };

    const restoreConsole = () => {
        if (!window.originalConsole) return;
        Object.keys(window.originalConsole).forEach(method => console[method] = window.originalConsole[method]);
        window.originalConsole = null;
        window.videoMuteListenerInjected = false;
        removeInteractTip();
        lastBufferPercent = -1;
        window.originalConsole?.log("%c【监听】已恢复原生控制台", "color: #f44336; font-weight: bold;");
    };

    listenConsole((method, args) => {
        const logContent = args.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(' ');
        if (logContent.includes('缓冲中')) {
            debouncedHandleVideoBuffer();
        }
    });

    window.restoreConsole = restoreConsole;
    window.originalConsole.log('%c【监听】视频默认静音+缓冲监控已启动，执行 restoreConsole() 可取消', 'color: #9c27b0; font-weight: bold;');
})();