// ==UserScript==
// @name         虎牙自动最高码率 (免登录), 屏蔽 PCDN
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  将默认码率调到最高码率 (可突破扫码专享, 实测最高到蓝光 20M), 并屏蔽 PCDN, 防止偷跑上传
// @author       浩劫者12345
// @match        https://*.huya.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549548/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%A0%81%E7%8E%87%20%28%E5%85%8D%E7%99%BB%E5%BD%95%29%2C%20%E5%B1%8F%E8%94%BD%20PCDN.user.js
// @updateURL https://update.greasyfork.org/scripts/549548/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%A0%81%E7%8E%87%20%28%E5%85%8D%E7%99%BB%E5%BD%95%29%2C%20%E5%B1%8F%E8%94%BD%20PCDN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 屏蔽 PCDN (禁用 WebRTC)
    if (window.RTCPeerConnection) {
        const log = console.log
        const origRTCPeerConnection = window.RTCPeerConnection

        class HookedRTCPeerConnection {
            constructor(config) {
                log('Blocking WebRTC connection:', JSON.stringify(config))
                throw new Error('WebRTC is disabled by userscript')
                return new origRTCPeerConnection(config)
            }
        }

        window.RTCPeerConnection = HookedRTCPeerConnection
        window.webkitRTCPeerConnection = window.RTCPeerConnection
        window.mozRTCPeerConnection = window.RTCPeerConnection
    }


    // 设置 cookie 中上次使用的码率
    document.cookie = 'videoBitRate=99999; domain=.huya.com'
    console.log('Set last used bitrate to 99999')

    // 伪装登录状态
    if (!document.cookie.includes('yyuid=')) {
        document.cookie = 'yyuid=1; domain=.huya.com'
        console.log('Set logged in status')
    }

    // 拦截页面内 JS 对 hyPlayerConfig 的赋值, 修改 iWebDefaultBitRate (默认码率)
    let _hyPlayerConfig = {};

    Object.defineProperty(window, 'hyPlayerConfig', {
        get() {
            return _hyPlayerConfig
        },
        set(newValue) {
            Object.assign(_hyPlayerConfig, newValue)

            if (_hyPlayerConfig.stream) {
                _hyPlayerConfig.stream.iWebDefaultBitRate = 99999
                console.log('Hook set `hyPlayerConfig.stream.iWebDefaultBitRate` to', window.hyPlayerConfig.stream.iWebDefaultBitRate)
            }
        }
    })
})();
