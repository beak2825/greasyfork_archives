// ==UserScript==
// @name         91Porny Ultimate Player + AES Decrypt Downloader
// @namespace    http://tampermonkey.net/
// @version      4.0.2
// @description  ArtPlayer + AdBlock + AES-128 m3u8 Decrypt & Download (GF + JSHint clean)
// @author       Antigravity
// @license      MIT
// @match        https://91porny.com/*
// @match        https://www.91porny.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @connect      91porny.com
// @connect      cdn.jsdelivr.net
// jshint        esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/560165/91Porny%20Ultimate%20Player%20%2B%20AES%20Decrypt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560165/91Porny%20Ultimate%20Player%20%2B%20AES%20Decrypt%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= 动态加载外部库 ================= */
    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function ensureLibs() {
        if (!window.Hls) {
            await loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js');
        }
        if (!window.Artplayer) {
            await loadScript('https://cdn.jsdelivr.net/npm/artplayer@5.1.2/dist/artplayer.js');
        }
    }

    /* ================= 样式 / 去广告 ================= */
    GM_addStyle(
        '.modal,[class*="ad-"],[id*="ad"],iframe[src*="ads"],marquee{display:none!important}' +
        '#artplayer-container{background:#000}' +
        '.dlbtn{position:fixed;bottom:20px;left:20px;z-index:99999;padding:12px 18px;' +
        'background:#222;color:#eee;border:1px solid #444;border-radius:8px;cursor:pointer}' +
        '.dlbox{position:fixed;bottom:70px;left:20px;width:300px;background:#111;' +
        'border:1px solid #444;border-radius:10px;padding:14px;color:#ccc;' +
        'display:none;z-index:99999}' +
        '.dlbox.show{display:block}' +
        '.barbg{height:8px;background:#333;border-radius:4px;overflow:hidden}' +
        '.bar{height:100%;width:0;background:#777}' +
        '.stat{font-size:12px;margin-top:8px;display:flex;justify-content:space-between}' +
        '.status{text-align:center;margin-top:6px;font-size:12px}'
    );

    /* ================= AES 解密工具 ================= */
    function importAESKey(buf) {
        return crypto.subtle.importKey(
            'raw',
            buf,
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        );
    }

    function decryptAES(data, key, iv) {
        return crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            data
        );
    }

    /* ================= 解密下载器 ================= */
    function M3U8DecryptDownloader(url, name) {
        this.url = url;
        this.name = name || 'video.ts';
        this.segs = [];
        this.key = null;
        this.iv = null;
        this.concurrent = Math.min(10, navigator.hardwareConcurrency || 6);
    }

    M3U8DecryptDownloader.prototype.start = async function (onProgress, onStatus) {
        var text, base, lines, i, idx, done, out, self;

        try {
            onStatus('解析 m3u8...');
            text = await this.fetchText(this.url);
            base = this.url.slice(0, this.url.lastIndexOf('/') + 1);
            lines = text.split('\n');

            for (i = 0; i < lines.length; i += 1) {
                var line = lines[i];

                if (line.indexOf('#EXT-X-KEY') === 0) {
                    var km = line.match(/URI="([^"]+)"/);
                    var ivm = line.match(/IV=([^,]+)/);
                    var keyUrl = km[1].indexOf('http') === 0 ? km[1] : base + km[1];
                    var keyBuf = await this.fetchBin(keyUrl);

                    this.key = await importAESKey(keyBuf);

                    if (ivm) {
                        this.iv = new Uint8Array(
                            ivm[1]
                                .replace('0x', '')
                                .match(/.{2}/g)
                                .map(function (h) {
                                    return parseInt(h, 16);
                                })
                        );
                    } else {
                        this.iv = new Uint8Array(16);
                    }
                } else if (line && line.charAt(0) !== '#') {
                    this.segs.push(line.indexOf('http') === 0 ? line : base + line);
                }
            }

            idx = 0;
            done = 0;
            out = new Array(this.segs.length);
            self = this;

            await Promise.all(
                Array(this.concurrent).fill(0).map(function () {
                    return (async function () {
                        while (idx < self.segs.length) {
                            var cur = idx;
                            idx += 1;

                            var enc = await self.fetchBin(self.segs[cur]);
                            var dec;

                            if (self.key) {
                                dec = await decryptAES(enc, self.key, self.iv);
                            } else {
                                dec = enc;
                            }

                            out[cur] = new Uint8Array(dec);
                            done += 1;
                            onProgress(
                                Math.round((done / self.segs.length) * 100),
                                done,
                                self.segs.length
                            );
                        }
                    }());
                })
            );

            onStatus('合并导出...');
            var size = out.reduce(function (s, b) {
                return s + b.byteLength;
            }, 0);

            var buf = new Uint8Array(size);
            var off = 0;

            out.forEach(function (b) {
                buf.set(b, off);
                off += b.byteLength;
            });

            var a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([buf], { type: 'video/mp2t' }));
            a.download = this.name;
            a.click();

            onStatus('下载完成（已解密）');
        } catch (e) {
            onStatus('失败：' + e.message);
        }
    };

    M3U8DecryptDownloader.prototype.fetchText = function (u) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: u,
                onload: function (r) {
                    resolve(r.responseText);
                },
                onerror: reject
            });
        });
    };

    M3U8DecryptDownloader.prototype.fetchBin = function (u) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: u,
                responseType: 'arraybuffer',
                onload: function (r) {
                    resolve(r.response);
                },
                onerror: reject
            });
        });
    };

    /* ================= UI ================= */
    function createUI(m3u8, title) {
        if (document.querySelector('.dlbtn')) {
            return;
        }

        var btn = document.createElement('button');
        btn.className = 'dlbtn';
        btn.textContent = '⬇ 解密下载';

        var box = document.createElement('div');
        box.className = 'dlbox';
        box.innerHTML =
            '<div class="barbg"><div class="bar"></div></div>' +
            '<div class="stat"><span>0/0</span><span>0%</span></div>' +
            '<div class="status">就绪</div>';

        document.body.appendChild(btn);
        document.body.appendChild(box);

        btn.onclick = function () {
            btn.disabled = true;
            box.classList.add('show');

            var dl = new M3U8DecryptDownloader(m3u8, title + '.ts');
            dl.start(
                function (p, c, t) {
                    box.querySelector('.bar').style.width = p + '%';
                    box.querySelector('.stat').children[0].textContent = c + '/' + t;
                    box.querySelector('.stat').children[1].textContent = p + '%';
                },
                function (s) {
                    box.querySelector('.status').textContent = s;
                    if (/完成|失败/.test(s)) {
                        btn.disabled = false;
                    }
                }
            );
        };
    }

    /* ================= 播放器注入 ================= */
    var vidMatch = location.pathname.match(/\/view[^/]*\/([a-zA-Z0-9]+)/);
    if (!vidMatch) {
        return;
    }

    var vid = vidMatch[1];

    var observer = new MutationObserver(async function () {
        var el = document.querySelector('#video-play');
        if (!el) {
            return;
        }

        observer.disconnect();
        await ensureLibs();

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://91porny.com/video/embed/' + vid,
            onload: function (r) {
                var m = r.responseText.match(/data-src="(https:\/\/[^"]+index\.m3u8[^"]*)"/);
                if (!m) {
                    return;
                }

                var m3u8 = m[1].replace(/&amp;/g, '&');
                el.parentElement.innerHTML = '<div id="artplayer-container"></div>';

                var art = new Artplayer({
                    container: '#artplayer-container',
                    url: m3u8,
                    type: 'm3u8',
                    autoplay: true,
                    fullscreen: true,
                    customType: {
                        m3u8: function (video, url) {
                            var hls = new Hls();
                            hls.loadSource(url);
                            hls.attachMedia(video);
                        }
                    }
                });

                art.on('ready', function () {
                    var title = document.querySelector('h1');
                    var name = title ? title.textContent.trim() : 'video';
                    setTimeout(function () {
                        createUI(m3u8, name);
                    }, 1000);
                });
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

}());
