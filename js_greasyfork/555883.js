// ==UserScript==
// @name              海角社区金币贴、钻石贴免费看
// @icon              https://haijiao.com/images/common/project/favicon.ico
// @charset           UTF-8
// @antifeature       payment
// @license           MIT
// @version           1.0
// @description       海角金币贴、钻石贴免费看
// @author            不知名的小伙子~
// @match             *://haijiao.com/*
// @match             *://*.haijiao.com/*
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @run-at            document-start
// @namespace https://greasyfork.org/users/1486552
// @downloadURL https://update.greasyfork.org/scripts/555883/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E9%87%91%E5%B8%81%E8%B4%B4%E3%80%81%E9%92%BB%E7%9F%B3%E8%B4%B4%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555883/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E9%87%91%E5%B8%81%E8%B4%B4%E3%80%81%E9%92%BB%E7%9F%B3%E8%B4%B4%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

 

    let videoObj = {
        pid: 0,
        url: "",
        duration: 0,
        fullM3U8Url: ""
    };
    const ec = {
        b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
        
        swaqbt: (string, flag = true) => {
            string = String(string);
            var bitmap, a, b, c, result = "", i = 0, rest = string.length % 3;
            for (; i < string.length;) {
                if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) {
                    return "Failed to execute swaqbt"
                }
                bitmap = (a << 16) | (b << 8) | c;
                result += ec.b64.charAt(bitmap >> 18 & 63) + ec.b64.charAt(bitmap >> 12 & 63) + ec.b64.charAt(bitmap >> 6 & 63) + ec.b64.charAt(bitmap & 63);
            }
            if (flag) return ec.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result, false)
            else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
        },

        sfweccat: (string, flag = true) => {
            string = String(string).replace(/[\t\n\f\r ]+/g, "");
            if (!ec.b64re.test(string)) {
                return 'Failed to execute sfweccat'
            }
            string += "==".slice(2 - (string.length & 3));
            var bitmap, result = "", r1, r2, i = 0;
            for (; i < string.length;) {
                bitmap = ec.b64.indexOf(string.charAt(i++)) << 18 | ec.b64.indexOf(string.charAt(i++)) << 12 |
                    (r1 = ec.b64.indexOf(string.charAt(i++))) << 6 | (r2 = ec.b64.indexOf(string.charAt(i++)));
                result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
                    r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                    String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
            }
            if (flag) return ec.sfweccat(result, false)
            else return result
        },

        cskuecede: (s) => {
            if (s.startsWith('JSXL')) s = s.replace('JSXL', '');
            s = s.substring(ec.sfweccat('TVE9PQ=='));
            const n = s.substring(s.length - 2, s.length - 1);
            const d = s.substring(s.length - 1);
            const l = s.substring(0, s.length - 2).split('');
            for (let i = 0; i < l.length; i++) {
                if (i == (Number(n) + 1)) {
                    l[i] = '';
                    l[i + 1] = '';
                    break;
                }
            }
            for (let i = 0; i < Number(d); i++) {
                l.push('=')
            }
            return JSON.parse(decodeURIComponent((ec.sfweccat(l.join(''), false))))
        }
    }
    const serializeVideo = async (str) => {
        if (!str) return '';
        try {
 
            const item = ec.cskuecede(str.replace('9JSXL', ''));
            if (typeof(item) != 'object') {
 
                return '';
            }
            let duration = '1.250000';
            const countNum = item.std.split('-')[1] - item.std.split('-')[0];
            
            if (item.du && item.du > 40) {
                duration = (item.du / (countNum + 1)).toFixed(6);
                if (duration > 11 || duration < 0.5) {
                    duration = '1.250000';
                }
            }
            let m3u8Content = '#EXTM3U\r\n';
            m3u8Content += '#EXT-X-VERSION:3\r\n';
            m3u8Content += '#EXT-X-TARGETDURATION:11\r\n';
            m3u8Content += '#EXT-X-MEDIA-SEQUENCE:0\r\n';
            m3u8Content += '#EXT-X-KEY:METHOD=AES-128,URI="' + item.ke + '",IV=' + item.iv + '\r\n';

            for (let i = Number(item.std.split('-')[0]); i <= countNum; i++) {
                m3u8Content += '#EXTINF:' + duration + ',\r\n';
                m3u8Content += item.st + i + '.ts\r\n';
            }
            m3u8Content += '#EXT-X-ENDLIST';
            const file = new Blob([m3u8Content], { type: 'text/plain' });
            return URL.createObjectURL(file);
        } catch (e) {

            return ''
        }
    }
    const OriginalXHR = unsafeWindow?.XMLHttpRequest || window.XMLHttpRequest;
    const originalOpen = OriginalXHR.prototype.open;
    const originalSend = OriginalXHR.prototype.send;

    OriginalXHR.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };
    OriginalXHR.prototype.send = function(data) {
        const self = this;
        const originalOnReadyStateChange = this.onreadystatechange;

        this.onreadystatechange = function() {
            if (self.readyState === 4) {
                if (self._url && self._url.includes('/api/')) {
 
                }

                if (self.status === 200) {
                    try {
                        if (self._url && self._url.includes('checkVideoInfo')) {
 
                            const res = JSON.parse(self.responseText);
                            if ((res.errCode === 0 || res.code === 0) && res.data) {
 
                                serializeVideo(res.data.replace(res.data.substring(res.data.length - 5), '')).then(m3u8Url => {
                                    if (m3u8Url) {
                                        videoObj.fullM3U8Url = m3u8Url;
                                    }
                                });
                            }
                        }
                        if (/\/api\/topic\/\d+/.test(self._url)) {
 
                            let response = JSON.parse(self.responseText);
                            let body = response.data;

                            if (body && typeof body === 'string') {
                                try {
                                    let decoded = decodeURIComponent(escape(atob(atob(atob(body)))));
                                    body = JSON.parse(decoded);
 
                                } catch (e) {
 
                                    body = response.data;
                                }
                            }
                            if (body && body.attachments) {
                                body.attachments.forEach(item => {
                                    if (item.category === "video") {
                                        videoObj.pid = body.topicId;
                                        videoObj.url = item.remoteUrl;
                                        videoObj.duration = item.video_time_length;
 
                                        item.vip = 0;
                                        item.amount = 0;
                                        item.money_type = 0;
                                        item.type = 1;
                                    }
                                });
                            }
                            if (body && typeof body === 'object') {
                                let newJsonStr = JSON.stringify(body);
                                response.data = btoa(btoa(btoa(encodeURIComponent(newJsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                                    return String.fromCharCode(parseInt(p1, 16));
                                }))));
                            }

                            Object.defineProperty(self, 'responseText', {
                                value: JSON.stringify(response),
                                writable: false,
                                configurable: true
                            });
                        }
                        if (/\/api\/video\/checkVideoCanPlay/.test(self._url)) {
                            let response = JSON.parse(self.responseText);
                            if (response.data) {
                                response.data.type = 1;
                                response.data.amount = 0;
                                response.data.money_type = 0;
                                response.data.vip = 0;
                            }
                            Object.defineProperty(self, 'responseText', {
                                value: JSON.stringify(response),
                                writable: false,
                                configurable: true
                            });
                        }
                        if (/\/api\/banner\/banner_list/.test(self._url)) {
 
                            Object.defineProperty(self, 'responseText', {
                                value: JSON.stringify({ data: [] }),
                                writable: false,
                                configurable: true
                            });
                        }
                    } catch (error) {
                        console.error('❌ 错误:', error);
                    }
                }
            }

            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };

        return originalSend.apply(this, arguments);
    };
    const generateFullM3U8FromURL = async () => {
        if (!videoObj.url || !videoObj.url.includes('.m3u8')) {
 
            return;
        }

 
        try {
            const response = await fetch(videoObj.url);
            const m3u8Content = await response.text();
            const lines = m3u8Content.split('\n');
            let keyInfo = '';
            let tsList = [];
            let sampleTsName = '';
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('#EXT-X-KEY')) {
                    keyInfo = line;
 
                } else if (line.endsWith('.ts')) {
                    tsList.push(line);
                    if (!sampleTsName) sampleTsName = line;
                }
            }
            const baseUrl = videoObj.url.substring(0, videoObj.url.lastIndexOf('/') + 1);
            const tsPerSecond = 1 / 1.25; 
            const estimatedTsCount = Math.ceil(videoObj.duration * tsPerSecond);
            let fullM3U8 = '#EXTM3U\n';
            fullM3U8 += '#EXT-X-VERSION:3\n';
            fullM3U8 += '#EXT-X-TARGETDURATION:11\n';
            fullM3U8 += '#EXT-X-MEDIA-SEQUENCE:0\n';
            if (keyInfo) {
                const uriMatch = keyInfo.match(/URI="([^"]+)"/);
                if (uriMatch && uriMatch[1]) {
                    let keyUri = uriMatch[1];
                    if (!/^https?:/i.test(keyUri)) {
                        keyUri = baseUrl + keyUri;
                    }
                    const fixedKeyLine = keyInfo.replace(/URI="([^"]+)"/, 'URI="' + keyUri + '"');
                    fullM3U8 += fixedKeyLine + '\n';
                } else {
                    fullM3U8 += keyInfo + '\n';
                }
            }
            const tsNamePattern = sampleTsName.match(/(\d+)$/);
            const tsPrefix = sampleTsName.substring(0, sampleTsName.lastIndexOf(tsNamePattern ? tsNamePattern[1] : '0'));        
            for (let i = 0; i < estimatedTsCount; i++) {
                fullM3U8 += '#EXTINF:1.250000,\n';
                fullM3U8 += baseUrl + tsPrefix + i + '.ts\n';
            }
            fullM3U8 += '#EXT-X-ENDLIST';
            videoObj.m3u8Content = fullM3U8;
            const blob = new Blob([fullM3U8], { type: 'application/vnd.apple.mpegurl' });
            const blobUrl = URL.createObjectURL(blob);
            videoObj.fullM3U8Url = blobUrl;
        } catch (e) {
 
        }
    };
    const autoCallCheckVideoInfo = () => {
        if (!videoObj.pid) {
 
            return;
        }
        const randomH = Math.floor(Math.random() * 5) + 1;
        const currentDomain = window.location.origin;
        const apiUrl = currentDomain + '/api/h' + randomH + '00/checkVideoInfo';
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 15000;
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const res = JSON.parse(xhr.responseText);
 
                    if ((res.errCode === 0 || res.code === 0) && res.data) {
 
                        serializeVideo(res.data.replace(res.data.substring(res.data.length - 5), '')).then(m3u8Url => {
                            if (m3u8Url) {
                                videoObj.fullM3U8Url = m3u8Url;
                            }
                        });
                    } else {
 
                    }
                } catch (e) {
 
                }
            } else {
 
            }
        };

        xhr.onerror = () => console.log('checkVideoInfo网络错误');
        xhr.ontimeout = () => console.log('checkVideoInfo超时');
        const params = {
            sign: ec.knxkbxen ? ec.knxkbxen(videoObj.pid) : videoObj.pid,
            origin: 2,
            timestamp: ec.knxkbxen ? ec.knxkbxen(Date.now()) : Date.now(),
            version: '1.2.7'
        };
        xhr.send(JSON.stringify(params));
    };
    const createButtonUI = () => {
        const container = document.createElement('div');
        container.id = 'haijiao-button-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            gap: 10px;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
        `;
        const playBtn = document.createElement('button');
        playBtn.textContent = '在线播放';
        playBtn.style.cssText = `
            padding: 10px 15px;
            background: #E91E63;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s;
        `;
        playBtn.onmouseover = () => playBtn.style.background = '#c2185b';
        playBtn.onmouseout = () => playBtn.style.background = '#E91E63';
        playBtn.onclick = async () => {
            if (!videoObj.fullM3U8Url) {
 
                await generateFullM3U8FromURL();
            }
            if (!videoObj.fullM3U8Url) {
                alert('失败');
                return;
            }
            let inlineContainer = document.querySelector('.video-div.dplayer');
            const video = document.createElement('video');
            video.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                background: #000;
            `;
            video.controls = true;
            video.autoplay = true;
            const loadHLSLibrary = () => {
                return new Promise((resolve) => {
                    if (unsafeWindow.Hls) {
                        resolve();
                        return;
                    }
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js';
                    script.onload = () => {
 
                        resolve();
                    };
                    script.onerror = () => {
 
                        resolve();
                    };
                    document.head.appendChild(script);
                });
            };
            loadHLSLibrary().then(() => {
                if (unsafeWindow.Hls) {
                    try {
                        const hls = new unsafeWindow.Hls();
                        hls.loadSource(videoObj.fullM3U8Url);
                        hls.attachMedia(video);
 
                    } catch (e) {
 
                        alert('播放失败');
                    }
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoObj.fullM3U8Url;
 
                } else {
                    alert('浏览器不支持HLS播放，且HLS.js加载失败');
                }
            });

            if (inlineContainer) {
                inlineContainer.innerHTML = '';
                inlineContainer.style.background = '#000';
                inlineContainer.appendChild(video);
 
            } else {
                const playerContainer = document.createElement('div');
                playerContainer.id = 'haijiao-player-container';
                playerContainer.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 99999;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✖';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: #ff0000;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 100000;
                `;
                closeBtn.onclick = () => {
                    playerContainer.remove();
                };

                const videoContainer = document.createElement('div');
                videoContainer.style.cssText = `
                    width: 90%;
                    height: 90%;
                    background: #000;
                `;
                videoContainer.appendChild(video);
                playerContainer.appendChild(closeBtn);
                playerContainer.appendChild(videoContainer);
                document.body.appendChild(playerContainer);

 
            }
        };
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '收起';
        toggleBtn.style.cssText = `
            padding: 6px 10px;
            background: #374151;
            color: #E5E7EB;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = '#4B5563';
        toggleBtn.onmouseout = () => toggleBtn.style.background = '#374151';

        let isCollapsed = false;
        const applyPanelState = () => {
            if (isCollapsed) {
                playBtn.style.display = 'none';
                container.style.padding = '6px 4px';
                container.style.right = '0';
                container.style.borderRadius = '8px 0 0 8px';
                container.style.background = 'rgba(17, 24, 39, 0.85)';
                toggleBtn.textContent = '展开';
            } else {
                playBtn.style.display = 'block';
                container.style.padding = '12px';
                container.style.right = '20px';
                container.style.borderRadius = '8px 0 0 8px';
                container.style.background = '#111827';
                toggleBtn.textContent = '收起';
            }
        };

        toggleBtn.onclick = () => {
            isCollapsed = !isCollapsed;
            applyPanelState();
        };

        container.appendChild(playBtn);
        container.appendChild(toggleBtn);
        document.body.appendChild(container);
        
 
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButtonUI);
    } else {
        createButtonUI();
    }
})();
