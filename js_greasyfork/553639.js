// ==UserScript==
// @name         Bilibili 直播P2P禁用补丁
// @namespace    https://github.com/KDH-KDHKDH
// @version      1.0.1
// @description  于document-start阶段禁用WebRTC P2P功能，通过锁定API防止B站直播产生巨额的后台上传流量。
// @author       KDH-KDHKDH
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553639/Bilibili%20%E7%9B%B4%E6%92%ADP2P%E7%A6%81%E7%94%A8%E8%A1%A5%E4%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/553639/Bilibili%20%E7%9B%B4%E6%92%ADP2P%E7%A6%81%E7%94%A8%E8%A1%A5%E4%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('%c[P2P禁用补丁]：正在于 document-start 阶段执行...', 'color:red; font-weight:bold;');

    try {
        const WEBRTC_APIS = [
            'RTCPeerConnection',
            'webkitRTCPeerConnection',
            'mozRTCPeerConnection'
        ];

        const defineProperty = Object.defineProperty;

        WEBRTC_APIS.forEach(function(api) {
            try {
                delete window[api];
                window[api] = null;
            } catch (e) {
                // 忽略错误，继续执行
            }

            try {
                defineProperty(window, api, {
                    get: function() {
                        return null;
                    },

                    set: function() {
                        console.warn(`[P2P禁用补丁]：检测到对 ${api} 的重写尝试，已阻止。`);
                    },

                    configurable: false
                });

            } catch (e2) {
                console.warn(`[P2P禁用补丁]：无法锁定 ${api}。`, e2);
            }
        });

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                defineProperty(navigator.mediaDevices, 'getUserMedia', {
                    get: function() {
                        return function() {
                            console.warn('[P2P禁用补丁]：已阻止 getUserMedia 调用。');
                            return Promise.reject(new Error('[P2P禁用补丁] getUserMedia 已被用户脚本禁用。'));
                        }
                    },
                    set: function() {
                        console.warn('[P2P禁用补丁]：检测到对 getUserMedia 的重写尝试，已阻止。');
                    },
                    configurable: false
                });
            } catch (e) {
                 console.warn('[P2P禁用补丁]：无法锁定 getUserMedia。', e);
            }
        }

        console.log('%c[P2P禁用补丁]：WebRTC P2P API 已永久锁定！', 'color:red; font-weight:bold;');

    } catch (error) {
        console.error('[P2P禁用补丁]：早期锁定失败:', error);
    }
})();
