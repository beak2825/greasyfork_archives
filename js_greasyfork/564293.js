// ==UserScript==
// @name         视频默认静音-缓冲自动恢复播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GPL-3.0
// @description  默认静音播放
// @author       蟑螂恶霸
// @match        https://www.sqgj.gov.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564293/%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3-%E7%BC%93%E5%86%B2%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/564293/%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3-%E7%BC%93%E5%86%B2%E8%87%AA%E5%8A%A8%E6%81%A2%E5%A4%8D%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.videoMuteListenerInjected) return;
    window.videoMuteListenerInjected = true;

    let isVideoOperating = false;
    let isPageInteracted = false;
    let retryPlayTimer = null;
    const TIP_ID = 'video-buffer-tip';

    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        };
    }

    function createInteractTip() {
        if (document.getElementById(TIP_ID)) return;
        const tip = document.createElement('div');
        tip.id = TIP_ID;
        tip.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #2196F3; color: #fff; padding: 10px 20px; border-radius: 8px;
            font-size: 14px; font-weight: 500; z-index: 99999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer; transition: opacity 0.3s;
        `;
        tip.innerText = '检测到视频缓冲，已静音自动恢复播放（点击页面可取消静音）';
        tip.onclick = handlePageFirstInteract;
        document.body.appendChild(tip);
        return tip;
    }

    function removeInteractTip() {
        const tip = document.getElementById(TIP_ID);
        tip && tip.remove();
        if (retryPlayTimer) clearTimeout(retryPlayTimer);
    }

    function handlePageFirstInteract() {
        if (isPageInteracted) return;
        isPageInteracted = true;
        removeInteractTip();
        window.originalConsole.log('%c【授权】用户已交互，播放授权成功', 'color: #4CAF50; font-weight: bold;');

        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (video.paused) {
                video.play().then(() => {
                    window.originalConsole.log('%c【重试】交互后播放视频成功', 'color: #4CAF50;');
                }).catch(err => {
                    window.originalConsole.error('%c【重试】播放失败：', 'color: #f44336;', err.message);
                });
            }
        });

        document.removeEventListener('click', handlePageFirstInteract);
        document.removeEventListener('touchstart', handlePageFirstInteract);
    }

    function setVideoMute() {
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            video.muted = true;
             window.originalConsole.log('%c【视频静音成功】视频已静音', 'color: #4CAF50; font-weight: bold;');
        });
    }

    setVideoMute();
    document.addEventListener('DOMContentLoaded', setVideoMute);
    document.addEventListener('click', setVideoMute);
    document.addEventListener('touchstart', setVideoMute);
    const observer = new MutationObserver(setVideoMute);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', handlePageFirstInteract, { once: true });
    document.addEventListener('touchstart', handlePageFirstInteract, { once: true });

    function handleVideoBuffer() {
        if (isVideoOperating) return;
        isVideoOperating = true;

        const videoElements = document.querySelectorAll('video');
        if (videoElements.length === 0) {
            window.originalConsole.log('%c【视频】页面无视频元素', 'color: #f44336; font-weight: bold;');
            isVideoOperating = false;
            return;
        }

        let hasPausedVideo = false;
        videoElements.forEach(video => {
            if (!video.paused) {
                video.pause();
                hasPausedVideo = true;
                window.originalConsole.log('%c【视频】检测缓冲，执行暂停', 'color: #ff9800; font-weight: bold;');
            }
        });
        if (!hasPausedVideo) {
            isVideoOperating = false;
            return;
        }

        setTimeout(() => {
            if (isPageInteracted) {
                videoElements.forEach(video => {
                    if (video.paused) {
                        video.play().then(() => {
                            window.originalConsole.log('%c【视频】200ms间隔后，播放视频（已授权）', 'color: #4CAF50; font-weight: bold;');
                        }).catch(err => {
                            window.originalConsole.error('%c【播放】授权后播放失败：', 'color: #f44336;', err.message);
                        });
                    }
                });
            } else {
                videoElements.forEach(video => {
                    if (video.paused) {
                        video.play().then(() => {
                            window.originalConsole.log('%c【视频】未交互，自动播放成功（浏览器允许）', 'color: #4CAF50; font-weight: bold;');
                            removeInteractTip();
                        }).catch(err => {
                            window.originalConsole.log('%c【提示】未交互播放被限制，引导用户点击', 'color: #ff9800; font-weight: bold;');
                            createInteractTip();
                        });
                    }
                });
            }
            isVideoOperating = false;
        }, 200);
    }

    const debouncedHandleVideoBuffer = debounce(handleVideoBuffer, 500);

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
        Object.keys(window.originalConsole).forEach(method => {
            console[method] = window.originalConsole[method];
        });
        window.originalConsole = null;
        window.videoMuteListenerInjected = false;
        removeInteractTip();
        window.originalConsole?.log("%c【监听】已恢复原生控制台", "color: #f44336; font-weight: bold;");
    };

    listenConsole((method, args) => {
        window.originalConsole.log(
            `%c[${method}]`,
            "color: #9c27b0; font-weight: bold; background: #f3e5f5; padding: 2px 6px; border-radius: 3px;",
            ...args
        );

        const logContent = args.map(item => {
            return typeof item === 'object' ? JSON.stringify(item) : String(item);
        }).join(' ');
        if (logContent.includes('缓冲中')) {
            window.originalConsole.log('%c【匹配】捕获到缓冲中日志，500ms防抖后处理视频', 'color: #2196F3; font-weight: bold;');
            debouncedHandleVideoBuffer();
        }
    });

    window.restoreConsole = restoreConsole;
    window.originalConsole.log("%c【监听】视频默认静音+缓冲监控已启动，执行 restoreConsole() 可取消", "color: #9c27b0; font-weight: bold;");
})();