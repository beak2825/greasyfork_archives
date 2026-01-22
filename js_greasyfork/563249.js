// ==UserScript==
// @name         DMM Download Helper (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download your dmm video easily - Enhanced Hooking Version
// @author       Ian Ho
// @match        https://*.dmm.co.jp/*
// @match        https://*.dmm.com/*
// @grant        GM_setClipboard
// @license      CC-BY-NC-SA-4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563249/DMM%20Download%20Helper%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563249/DMM%20Download%20Helper%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sessions = [];
    let isCollapsed = false;

    console.log('%c[DMM Helper] Script Initialized', 'color: white; background: #007aff; padding: 4px; border-radius: 4px;');

    // --- 工具函数 ---
    const base64ToHex = (str) => {
        try {
            const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            const raw = atob(base64);
            return Array.from(raw).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').toLowerCase();
        } catch(e) { return ""; }
    };

    const formatRawTo0x = (data) => {
        const buffer = new Uint8Array(data);
        let result = "[\n  ";
        for (let i = 0; i < buffer.length; i++) {
            result += "0x" + buffer[i].toString(16).padStart(2, '0') + ", ";
            if ((i + 1) % 16 === 0) result += "\n  ";
        }
        result += "\n]";
        return result;
    };

    const generateNameByDate = () => {
        const now = new Date();
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    }

    const getTime = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

    const getVideoQuality = () => {
        try {
            const activeItem = document.querySelector('#quality-menu-expanded .submenu[role="menu"] div[role="menuitemradio"][aria-checked="true"] .menuitem-label');
            return activeItem ? activeItem.textContent.trim() : "Unknown";
        } catch (e) {
            log.debug('[DMM Helper - Injected] Could not get quality:', e);
            return "Unknown";
        }
    };

    // --- 核心逻辑：处理捕获到的数据 ---
    function processMPD(url) {
        if (!url || typeof url !== 'string') return;
        // 增加对 manifest 关键词的匹配，应对 DMM 复杂的参数
        if (url.includes('.mpd') || url.includes('manifest')) {
            const cleanUrl = url.split('?')[0];
            // 防止重复记录相同的完整 URL
            // if (sessions.some(s => s.fullMpd === url)) return;

            let target = sessions.find(s => s.mpd === null);
            if (target) {
                target.mpd = cleanUrl;
                target.fullMpd = url;
            } else {
                sessions.unshift({
                    id: sessions.length + 1,
                    time: getTime(),
                    quality: getVideoQuality(),
                    mpd: cleanUrl,
                    fullMpd: url,
                    keys: [],
                    raw0x: null
                });
            }
            updateUI();
        }
    }

    function processKey(data) {
        try {
            const json = JSON.parse(new TextDecoder().decode(data));
            if (json.keys) {
                const parsedKeys = json.keys.map(kObj => ({
                    kid: base64ToHex(kObj.kid),
                    k: base64ToHex(kObj.k),
                    k32: base64ToHex(kObj.k).substring(0, 32)
                }));
                let target = sessions.find(s => s.keys.length === 0);
                if (target) {
                    target.keys = parsedKeys;
                    target.raw0x = formatRawTo0x(data);
                } else {
                    sessions.unshift({
                        id: sessions.length + 1,
                        time: getTime(),
                        quality: getVideoQuality(),
                        mpd: null,
                        fullMpd: null,
                        keys: parsedKeys,
                        raw0x: formatRawTo0x(data)
                    });
                }
                updateUI();
            }
        } catch (e) {}
    }

    // --- 强力拦截器 ---
    function injectHooks() {
        // 劫持 Fetch
        if (!window.fetch.isHooked) {
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = (typeof args[0] === 'string') ? args[0] : (args[0]?.url || "");
                processMPD(url);
                return originalFetch.apply(this, args);
            };
            window.fetch.isHooked = true;
        }

        // 劫持 XHR
        if (!XMLHttpRequest.prototype.open.isHooked) {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(m, url) {
                processMPD(url);
                return originalOpen.apply(this, arguments);
            };
            XMLHttpRequest.prototype.open.isHooked = true;
        }

        // 劫持 EME (解密密钥)
        if (!MediaKeySession.prototype.update.isHooked) {
            const originalUpdate = MediaKeySession.prototype.update;
            MediaKeySession.prototype.update = function(data) {
                processKey(data);
                return originalUpdate.apply(this, arguments);
            };
            MediaKeySession.prototype.update.isHooked = true;
        }
    }

    // 1. 立即注入
    injectHooks();

    // 2. 持续注入 (防止 DMM 动态重置环境)
    setInterval(injectHooks, 2000);

    // 3. 浏览器底层监控 (保底机制)
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name.includes('.mpd') || entry.name.includes('manifest')) {
                processMPD(entry.name);
            }
        });
    });
    observer.observe({ entryTypes: ['resource'] });

    // --- UI 渲染逻辑 (与原版一致) ---
    function updateUI() {
        let container = document.getElementById('apple-refined-v18');
        if (!container) {
            container = document.createElement('div');
            container.id = 'apple-refined-v18';
            container.style = `
                position:fixed; top:20px; right:20px; width:480px; height:calc(100vh - 100px);
                background:rgba(255, 255, 255, 0.75); backdrop-filter:blur(50px) saturate(200%);
                -webkit-backdrop-filter:blur(50px) saturate(200%);
                color:#1d1d1f; z-index:999999; font-family:-apple-system, "SF Pro", "PingFang SC", sans-serif;
                border:1px solid rgba(255, 255, 255, 0.5); border-radius:32px;
                box-shadow:0 30px 60px rgba(0,0,0,0.12); overflow:hidden; display:flex; flex-direction:column;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            document.body.appendChild(container);

            container.innerHTML = `
                <div id="apple-header" style="padding:22px 28px; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.1); border-bottom:0.5px solid rgba(0,0,0,0.06); transition: inherit;">
                    <div id="apple-title-box" style="display:flex; flex-direction:column;">
                        <span style="font-weight:700; font-size:18px; letter-spacing:-0.4px;">DMM Download Helper</span>
                        <span id="apple-ver" style="font-size:10px; color:#86868b; text-transform:uppercase; letter-spacing:1px; margin-top:2px;">v1.0</span>
                    </div>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <button id="apple-fold" style="border:none; background:rgba(0,122,255,0.06); color:#007aff; padding:8px 16px; border-radius:14px; font-size:12px; font-weight:600; cursor:pointer; min-width:80px; transition: all 0.2s;">Fold</button>
                    </div>
                </div>
                <div id="apple-content" style="flex:1; overflow-y:auto; padding:24px; scrollbar-width:none;"></div>
            `;

            document.getElementById('apple-fold').onclick = () => {
                isCollapsed = !isCollapsed;
                const titleBox = document.getElementById('apple-title-box');
                const header = document.getElementById('apple-header');
                if (isCollapsed) {
                    container.style.height = '42px';
                    container.style.width = '100px';
                    container.style.borderRadius = '22px';
                    header.style.padding = '6px 10px';
                    titleBox.style.display = 'none';
                    document.getElementById('apple-fold').innerText = 'Unfold';
                } else {
                    container.style.height = 'calc(100vh - 100px)';
                    container.style.width = '480px';
                    container.style.borderRadius = '32px';
                    header.style.padding = '22px 28px';
                    titleBox.style.display = 'flex';
                    document.getElementById('apple-fold').innerText = 'Fold';
                }
            };
        }

        const list = document.getElementById('apple-content');
        list.innerHTML = sessions.map(s => {
            const keyArgs = s.keys.map(k => `--key ${k.kid}:${k.k32}`).join(' ');
            const copyAllContent = s.mpd && s.keys.length > 0 ? `.\\N_m3u8DL-RE.exe "${s.fullMpd}" ${keyArgs} --save-name ${generateNameByDate()} --decryption-engine SHAKA_PACKAGER` : '';
            const encodedCmd = btoa(unescape(encodeURIComponent(copyAllContent)));
            return `
                <div style="background:rgba(255,255,255,0.4); border-radius:28px; padding:24px; margin-bottom:24px; border:1px solid rgba(255,255,255,0.7); box-shadow:0 10px 30px rgba(0,0,0,0.02);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:18px; align-items:center;">
                        <div style="background:rgba(0,0,0,0.06); color:#1d1d1f; padding:5px 12px; border-radius:10px; font-size:11px; font-weight:700;">#${s.id} ${s.quality}</div>
                        <div style="display:flex; gap:8px; align-items:center;">
                            ${copyAllContent
                                ? `<button
                                    data-cmd="${encodedCmd}"
                                    onclick="const btn=this; navigator.clipboard.writeText(decodeURIComponent(escape(atob(this.dataset.cmd)))); btn.innerText='Copied'; btn.style.transform='scale(0.95)'; setTimeout(()=>btn.style.transform='scale(1)', 200); setTimeout(()=>btn.innerText='Copy N_m3u8DL-RE Command', 2500);" style="border:none; background:#007aff; color:white; padding:6px 14px; border-radius:12px; font-size:11px; font-weight:600; cursor:pointer; transition: transform 0.2s ease-out, background 0.2s;">Copy N_m3u8DL-RE Command</button>`
                                : ''}
                            <span style="font-size:12px; color:#aeaeb2; font-weight:500;">${s.time}</span>
                        </div>
                    </div>

                    <div style="margin-bottom:20px;">
                        <div style="font-size:14px; font-weight:700; margin-bottom:10px; color:#007aff; display:flex; align-items:center; gap:8px;">🌐 MPD Manifest</div>
                        <div style="background:rgba(255,255,255,0.7); padding:14px; border-radius:16px; font-size:12px; word-break:break-all; color:#007aff; border:0.5px solid rgba(0,122,255,0.1); line-height:1.5;">
                            ${s.mpd ? s.mpd : '<span style="color:#aeaeb2; font-style:italic;">Searching for manifest...</span>'}
                        </div>
                        ${s.mpd ? `<button onclick="const btn=this; navigator.clipboard.writeText('${s.fullMpd}'); btn.innerText='Copied'; btn.style.transform='scale(0.95)'; setTimeout(()=>btn.style.transform='scale(1)', 200); setTimeout(()=>btn.innerText='Copy MPD Link', 2500);" style="margin-top:10px; width:100%; border:none; background:#007aff; color:white; padding:11px; border-radius:14px; font-size:13px; font-weight:600; cursor:pointer; transition: transform 0.2s ease-out, background 0.2s;">Copy MPD Link</button>` : ''}
                    </div>

                    <div style="border-top:0.5px solid rgba(0,0,0,0.06); padding-top:20px;">
                        <div style="font-size:14px; font-weight:700; margin-bottom:12px; color:#34c759; display:flex; align-items:center; gap:8px;">🔑 ClearKey Update</div>
                        ${s.keys.length > 0 ? `
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                ${s.keys.map((k, idx) => `
                                    <div style="background:rgba(255,255,255,0.7); padding:12px; border-radius:14px; border:0.5px solid rgba(0,0,0,0.04); font-size:12px;">
                                        <div style="font-weight:700; color:#86868b; font-size:10px; text-transform:uppercase; margin-bottom:4px;">Unit #${idx+1}</div>
                                        <div style="color:#1d1d1f;"><span style="color:#86868b; font-weight:600; font-family:sans-serif;">KID:</span> ${k.kid}</div>
                                        <div style="color:#1d1d1f;"><span style="color:#86868b; font-weight:600; font-family:sans-serif;">KEY:</span> ${k.k32}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="margin-top:15px;">
                                <div style="width:100%; background:rgba(255,255,255,0.7); border:none; border-radius:16px; padding:12px; font-size:12px; color:#34c759; resize:none; box-sizing:border-box; line-height:1.4; overflow-wrap: break-word;">${keyArgs}</div>
                                <button onclick="const btn=this; navigator.clipboard.writeText('${keyArgs}'); btn.innerText='Copied'; btn.style.transform='scale(0.95)'; setTimeout(()=>btn.style.transform='scale(1)', 200); setTimeout(()=>btn.innerText='Copy All Keys', 2500);" style="margin-top:10px; width:100%; border:none; background:#34c759; color:#fff; padding:11px; border-radius:14px; font-size:13px; font-weight:600; cursor:pointer; transition: transform 0.2s ease-out, background 0.2s;">Copy All Keys</button>
                            </div>
                            <details style="margin-top:15px;">
                                <summary style="font-size:12px; color:#ff375f; font-weight:600; cursor:pointer; list-style:none;">▶ View Raw Binary (0x)</summary>
                                <pre style="margin-top:10px; background:rgba(255,255,255,0.7); color:#ff375f; padding:15px; border-radius:18px; font-size:11px; white-space:pre-wrap; font-family:ui-monospace, monospace; max-height:150px; overflow-y:auto; line-height:1.4; border:0.5px solid rgba(255,55,95,0.1);">${s.raw0x}</pre>
                            </details>
                        ` : `
                            <div style="background:rgba(0,0,0,0.02); padding:18px; border-radius:16px; border:1px dashed rgba(0,0,0,0.1); text-align:center; color:#aeaeb2; font-size:12px; font-style:italic;">Waiting for License...</div>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }
})();