// ==UserScript==
// @name         南京大学NJU|智汇南雍LMS增强工具箱
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提升LMS使用体验，倍速播放，批量下载课件
// @author       NJUer
// @match        https://lms.nju.edu.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562436/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6NJU%7C%E6%99%BA%E6%B1%87%E5%8D%97%E9%9B%8DLMS%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/562436/%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6NJU%7C%E6%99%BA%E6%B1%87%E5%8D%97%E9%9B%8DLMS%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 配置管理与单例检测
    // ==========================================
    const STORAGE_KEY = 'lms_v62_config';
    const PROFILES_KEY = 'lms_v62_profiles';

    const DEFAULT_CONFIG = {
        video: { speed: 1.0, autoJump: false, removeRestrictions: true },
        download: { defaultSelectAll: false, showCheckbox: true },
        appearance: { themeColor: '#007bff', opacity: 0.85, blur: 10, radius: 14 }
    };

    let Config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    const loadConfig = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Config.video = { ...Config.video, ...parsed.video };
                Config.download = { ...Config.download, ...parsed.download };
                if (parsed.appearance) Config.appearance = { ...Config.appearance, ...parsed.appearance };
            } catch(e) {}
        }
    };

    const saveConfig = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(Config));

    const ProfileManager = {
        getProfiles: () => { try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}'); } catch(e) { return {}; } },
        saveProfile: (name) => {
            const profiles = ProfileManager.getProfiles();
            profiles[name] = Config;
            localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        },
        loadProfile: (name) => {
            const profiles = ProfileManager.getProfiles();
            if(profiles[name]) {
                Config = JSON.parse(JSON.stringify(profiles[name]));
                saveConfig(); return true;
            }
            return false;
        },
        deleteProfile: (name) => {
            const profiles = ProfileManager.getProfiles();
            delete profiles[name];
            localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
        }
    };

    // ==========================================
    // 2. 动画引擎与辅助函数
    // ==========================================

    const gracefulClose = (maskElement) => {
        if (!maskElement) return;
        maskElement.classList.add('lms-closing');
        const panel = maskElement.querySelector('.lms-panel');
        if(panel) panel.classList.add('lms-closing');
        document.body.style.overflow = '';
        setTimeout(() => { maskElement.remove(); }, 280);
    };

    const toggleScrollLock = (isLocked) => {
        document.body.style.overflow = isLocked ? 'hidden' : '';
    };

    const updateThemeVariables = () => {
        const root = document.documentElement;
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 123, 255';
        };
        const rgb = hexToRgb(Config.appearance.themeColor);

        root.style.setProperty('--lms-main', Config.appearance.themeColor);
        root.style.setProperty('--lms-rgb', rgb);
        root.style.setProperty('--lms-panel-bg', `rgba(255, 255, 255, ${Config.appearance.opacity})`);
        root.style.setProperty('--lms-blur', `${Config.appearance.blur}px`);
        root.style.setProperty('--lms-radius', `${Config.appearance.radius}px`);
    };

    const updateSliderFill = (input) => {
        const val = (input.value - input.min) / (input.max - input.min) * 100;
        input.style.background = `linear-gradient(to right, var(--lms-main) ${val}%, #e5e5e5 ${val}%)`;
    };

    const injectStyles = () => {
        const css = `
            :root {
                --lms-main: #007bff;
                --lms-green: #28BD6E;
                --lms-shadow: 0 12px 40px rgba(0,0,0,0.12);
                --lms-radius: 14px;
                --lms-panel-bg: rgba(255, 255, 255, 0.85);
                --lms-blur: 10px;
                --lms-ease: cubic-bezier(0.25, 0.8, 0.25, 1);
                --lms-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
                --lms-color-trans: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
            }

            .lms-close { width: 28px; height: 28px; background: #f0f2f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #666; font-size: 18px; cursor: pointer; transition: all 0.2s var(--lms-ease); line-height: 1; }
            .lms-close:hover { background: #e4e6e9; color: #333; transform: rotate(90deg); }

            .lms-ios-checkbox {
                position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
                z-index: 2147483647; appearance: none; -webkit-appearance: none;
                width: 22px; height: 22px; border: 2px solid #ccc; border-radius: 6px;
                cursor: pointer; outline: none; transition: all 0.3s var(--lms-spring), var(--lms-color-trans);
                background: rgba(255,255,255,0.9); margin: 0; display: block !important;
            }
            .lms-ios-checkbox:checked { background: var(--lms-main); border-color: var(--lms-main); }
            .lms-ios-checkbox::after { content: ''; position: absolute; left: 6px; top: 2px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg) scale(0); transition: transform 0.2s var(--lms-ease); opacity: 0; }
            .lms-ios-checkbox:checked::after { transform: rotate(45deg) scale(1); opacity: 1; }

            .lms-ios-switch { appearance: none; -webkit-appearance: none; width: 50px; height: 30px; background: #e9e9ea; border-radius: 20px; position: relative; cursor: pointer; outline: none; transition: background 0.3s var(--lms-ease), var(--lms-color-trans); flex-shrink: 0; }
            .lms-ios-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 26px; height: 26px; border-radius: 50%; background: white; box-shadow: 0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06); transition: transform 0.3s var(--lms-spring); }
            .lms-ios-switch:checked { background: var(--lms-main); }
            .lms-ios-switch:checked::after { transform: translateX(20px); }

            .lms-ios-slider { -webkit-appearance: none; appearance: none; width: 140px; height: 6px; background: #e5e5e5; border-radius: 3px; outline: none; cursor: pointer; transition: background 0.3s ease; }
            .lms-ios-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: white; box-shadow: 0 3px 8px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.1s; margin-top: -1px; }
            .lms-ios-slider::-webkit-slider-thumb:active { transform: scale(1.15); }

            .lms-scrollable::-webkit-scrollbar { width: 5px; height: 5px; }
            .lms-scrollable::-webkit-scrollbar-track { background: transparent; }
            .lms-scrollable::-webkit-scrollbar-thumb { background: #d1d1d1; border-radius: 3px; transition: background 0.4s; }
            .lms-scrollable::-webkit-scrollbar-thumb:hover { background: var(--lms-main); }

            .lms-ball-cont-fixed { position: fixed !important; z-index: 100000 !important; }
            .lms-circle-ball { width: 50px; height: 50px; border-radius: 50%; color: white; border: none; font-weight: bold; font-size: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.4s var(--lms-spring), box-shadow 0.4s var(--lms-ease), var(--lms-color-trans); user-select: none; }
            .lms-circle-ball:hover { transform: scale(1.15); box-shadow: 0 12px 30px rgba(0,0,0,0.25); }
            .lms-circle-ball:active { transform: scale(0.9); }

            #lms-cfg-cont { bottom: 30px; left: 30px; }
            #lms-dl-ball-cont { bottom: 30px; right: 30px; }
            #lms-speed-ball-cont { top: 50%; right: 30px; transform: translateY(-50%); }

            .lms-ball-white { background: white; border: 1px solid rgba(0,0,0,0.1); color: #333; font-size: 22px; }
            .lms-ball-green { background: var(--lms-green); font-size: 20px; }
            .lms-ball-main { background: var(--lms-main); }

            .lms-mask { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.25); z-index: 200000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(var(--lms-blur)); -webkit-backdrop-filter: blur(var(--lms-blur)); animation: lmsFadeIn 0.3s var(--lms-ease) forwards; }
            .lms-mask.lms-closing { animation: lmsFadeOut 0.3s var(--lms-ease) forwards; pointer-events: none; }

            .lms-panel { background: var(--lms-panel-bg); backdrop-filter: blur(var(--lms-blur)); -webkit-backdrop-filter: blur(var(--lms-blur)); border-radius: var(--lms-radius); box-shadow: 0 20px 60px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.6); width: 500px; height: 580px; display: flex; flex-direction: column; animation: lmsZoomIn 0.4s var(--lms-spring) forwards; }
            .lms-panel.lms-closing { animation: lmsZoomOut 0.25s var(--lms-ease) forwards; }

            @keyframes lmsFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes lmsFadeOut { from { opacity: 1; } to { opacity: 0; } }
            @keyframes lmsZoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            @keyframes lmsZoomOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
            @keyframes lmsSlideInLeft { from { opacity: 0; transform: translateY(-50%) translateX(15px); } to { opacity: 1; transform: translateY(-50%) translateX(0); } }

            .lms-header { padding: 18px 24px; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.5); flex-shrink: 0; border-radius: var(--lms-radius) var(--lms-radius) 0 0; }
            .lms-header h3 { margin: 0; font-size: 18px; color: #333; font-weight: 700; letter-spacing: -0.5px; }

            .lms-tabs { display: flex; position: relative; background: rgba(0,0,0,0.02); border-bottom: 1px solid rgba(0,0,0,0.06); flex-shrink: 0; overflow: hidden; }
            .lms-tab {
                flex: 1; padding: 14px; text-align: center; cursor: pointer; font-weight: 600; color: #777; transition: color 0.4s var(--lms-ease), transform 0.3s var(--lms-spring); z-index: 1;
            }
            .lms-tab.active { color: var(--lms-main); font-weight: 800; transform: scale(1.05); }
            .lms-tab-line { position: absolute; bottom: 0; left: 0; height: 3px; width: 0; background: var(--lms-main); border-radius: 3px 3px 0 0; transition: left 0.4s var(--lms-spring), width 0.4s var(--lms-spring), background-color 0.4s ease; }

            /* 内容切换动画 */
            .lms-tab-content-anim { animation: lmsContentFadeSlide 0.35s var(--lms-ease) forwards; }
            @keyframes lmsContentFadeSlide { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

            .lms-opt-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(0,0,0,0.04); }
            .lms-opt-info { flex: 1; padding-right: 20px; }
            .lms-opt-title { font-size: 15px; font-weight: 600; color: #333; }
            .lms-opt-desc { font-size: 13px; color: #888; margin-top: 4px; line-height: 1.4; }

            .lms-footer { padding: 16px 24px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02); margin-top: auto; flex-shrink: 0; border-radius: 0 0 var(--lms-radius) var(--lms-radius); }
            .lms-btn { padding: 0 20px; height: 36px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); background: white; color: #555; cursor: pointer; font-weight: 600; font-size: 13px; transition: 0.2s; display: flex; align-items: center; justify-content: center; box-sizing: border-box; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .lms-btn:hover { background: #f9f9f9; transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
            .lms-btn-prime { background: var(--lms-main); color: white; border: none; transition: transform 0.2s, filter 0.2s, var(--lms-color-trans); }
            .lms-btn-prime:hover { background: var(--lms-main); filter: brightness(1.1); box-shadow: 0 4px 12px rgba(var(--lms-rgb), 0.3); }
            .lms-btn-danger { color: #ff4d4f; border-color: #ffccc7; }
            .lms-btn-danger:hover { background: #fff1f0; border-color: #ff4d4f; }

            .lms-speed-panel { position: absolute; right: 65px; top: 50%; transform: translateY(-50%); background: var(--lms-panel-bg); backdrop-filter: blur(var(--lms-blur)); border-radius: var(--lms-radius); border: 1px solid rgba(255,255,255,0.6); box-shadow: 0 10px 40px rgba(0,0,0,0.15); padding: 12px; display: none; flex-direction: column; width: 160px; box-sizing: border-box; }
            .lms-speed-panel::after { content: ''; position: absolute; right: -20px; top: 0; width: 20px; height: 100%; }
            #lms-speed-ball-cont:hover .lms-speed-panel { display: flex; animation: lmsSlideInLeft 0.3s var(--lms-ease); }

            .speed-item { padding: 9px 0; text-align: center; font-size: 14px; color: #444; cursor: pointer; border-radius: 8px; transition: all 0.2s var(--lms-ease); font-weight: 500; opacity: 0; animation: lmsStaggerFade 0.3s var(--lms-ease) forwards; }
            @keyframes lmsStaggerFade { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
            .speed-item:nth-child(1) { animation-delay: 0.02s; } .speed-item:nth-child(2) { animation-delay: 0.04s; }
            .speed-item:nth-child(3) { animation-delay: 0.06s; } .speed-item:nth-child(4) { animation-delay: 0.08s; }
            .speed-item:nth-child(5) { animation-delay: 0.10s; } .speed-item:nth-child(6) { animation-delay: 0.12s; }
            .speed-item:nth-child(7) { animation-delay: 0.14s; } .speed-item:nth-child(8) { animation-delay: 0.16s; }
            .custom-speed-box { opacity: 0; animation: lmsStaggerFade 0.3s var(--lms-ease) forwards; animation-delay: 0.18s; }
            .speed-item:hover { background: rgba(0,0,0,0.05); color: var(--lms-main); transform: scale(1.03); }
            .speed-item.active { background: rgba(var(--lms-rgb), 0.15); color: var(--lms-main); font-weight: 800; box-shadow: 0 2px 4px rgba(var(--lms-rgb), 0.1); transition: background 0.2s, color 0.4s ease; }

            .custom-speed-box { border-top: 1px solid rgba(0,0,0,0.1); margin-top: 10px; padding-top: 10px; }
            .custom-input-group { display: flex; align-items: stretch; gap: 8px; height: 36px; }
            .custom-input-group input { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 0 8px; font-size: 13px; text-align: center; outline: none; background: rgba(255,255,255,0.9); margin: 0; }
            .custom-input-group button { padding: 0 14px; background: var(--lms-main); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; margin: 0; transition: background 0.4s ease; }

            /* 下载列表 */
            .lms-list-container { padding: 5px 0; overflow-y: auto; flex: 1; }
            .lms-dl-item {
                position: relative; display: flex; align-items: center;
                padding: 14px 24px; padding-left: 60px;
                border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer;
                transition: background 0.25s var(--lms-ease); border-left: 4px solid transparent;
            }
            .lms-dl-item:hover { background: rgba(0,0,0,0.02); }
            .lms-dl-item.selected { box-shadow: inset 0 0 0 2000px rgba(var(--lms-rgb), 0.12) !important; border-left-color: var(--lms-main) !important; }
            .lms-dl-item.selected .lms-dl-name { font-weight: 600; color: var(--lms-main); }
            .lms-dl-item input[type="checkbox"] { display: none; }
            .lms-dl-item.no-cb { padding-left: 24px; }

            .lms-dl-name { font-size: 14px; color: #333; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.5; margin-left: 12px; }
            .lms-file-tag { font-size: 10px; font-weight: 800; color: white; padding: 3px 6px; border-radius: 6px; text-transform: uppercase; min-width: 36px; text-align: center; margin-left: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); flex-shrink: 0; }
            .tag-pdf { background: #ff4d4f; } .tag-doc { background: #40a9ff; } .tag-ppt { background: #fa8c16; } .tag-xls { background: #52c41a; } .tag-code { background: #722ed1; } .tag-file { background: #bfbfbf; }

            .color-dot { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); display: inline-block; margin-right: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
            .color-dot.selected { border-color: #333; transform: scale(1.2); }
            .lms-input-text { border: 1px solid #ddd; padding: 0 12px; border-radius: 8px; outline: none; font-size: 14px; width: 100%; height: 36px; box-sizing: border-box; background: rgba(255,255,255,0.8); transition: border 0.2s; }
            .lms-input-text:focus { border-color: var(--lms-main); background: white; }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    function getFileTag(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        let type = 'file';
        if (['pdf'].includes(ext)) type = 'pdf';
        else if (['doc', 'docx', 'wps'].includes(ext)) type = 'doc';
        else if (['ppt', 'pptx', 'dps'].includes(ext)) type = 'ppt';
        else if (['xls', 'xlsx', 'csv'].includes(ext)) type = 'xls';
        else if (['c', 'cpp', 'py', 'java', 'js', 'json'].includes(ext)) type = 'code';
        return `<span class="lms-file-tag tag-${type}">${ext.toUpperCase().substring(0,4)}</span>`;
    }

    // ==========================================
    // 3. 逻辑引擎
    // ==========================================
    const Logic = {
        init() {
            // --- 关键：单例运行检测，防止iframe中重复按钮 ---
            if (window.self !== window.top) return;
            if (document.getElementById('lms-speed-ball-cont')) return;

            loadConfig(); injectStyles(); updateThemeVariables();
            this.renderSpeedBall(); this.renderDownloadBall(); this.renderSettingEntry(); this.startMonitor();
        },

        renderSpeedBall() {
            const container = document.createElement('div');
            container.id = 'lms-speed-ball-cont';
            container.className = 'lms-ball-cont-fixed';
            container.innerHTML = `
                <div class="lms-circle-ball lms-ball-main" id="ball-speed">${Config.video.speed}x</div>
                <div class="lms-speed-panel">
                    ${[0.5, 0.75, 1, 2, 3, 5, 8, 16].map(s => `<div class="speed-item ${Config.video.speed == s ? 'active' : ''}">${s}x</div>`).join('')}
                    <div class="custom-speed-box">
                        <div class="custom-input-group">
                            <input type="number" id="lms-v-inp" step="0.1" placeholder="倍速">
                            <button id="lms-v-go">Go</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
            container.querySelectorAll('.speed-item').forEach(item => {
                item.onclick = () => this.updateSpeed(parseFloat(item.innerText));
            });
            document.getElementById('lms-v-go').onclick = () => {
                const val = parseFloat(document.getElementById('lms-v-inp').value);
                if (!isNaN(val)) this.updateSpeed(Math.min(val, 16));
            };
        },
        updateSpeed(s) {
            Config.video.speed = s;
            document.getElementById('ball-speed').innerText = `${s}x`;
            saveConfig();
            document.querySelectorAll('.speed-item').forEach(i => i.classList.toggle('active', parseFloat(i.innerText) == s));
        },

        renderDownloadBall() {
            if (!location.pathname.includes('/course/')) return;
            const container = document.createElement('div');
            container.id = 'lms-dl-ball-cont';
            container.className = 'lms-ball-cont-fixed';
            container.innerHTML = `<div class="lms-circle-ball lms-ball-green" id="ball-dl">📥</div>`;
            container.onclick = () => this.fetchResources();
            document.body.appendChild(container);
        },
        async fetchResources() {
            const courseId = location.pathname.match(/\/course\/(\d+)/)?.[1];
            if (!courseId) return;
            const b = document.getElementById('ball-dl'); b.innerText = '⏳';
            try {
                const res = await fetch(`/api/courses/${courseId}/activities?sub_course_id=0`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                const data = await res.json();
                const files = [];
                data.activities?.forEach(act => act.uploads?.forEach(u => files.push({ name: u.name, url: `/api/uploads/${u.id}/blob` })));
                if (!files.length) return;
                this.showDownloadModal(files);
            } catch (e) {}
            b.innerText = '📥';
        },
        showDownloadModal(files) {
            toggleScrollLock(true);
            const mask = document.createElement('div');
            mask.className = 'lms-mask';

            const checkboxHtml = (i) => Config.download.showCheckbox ?
                `<input type="checkbox" class="lms-ios-checkbox" id="f-${i}" ${Config.download.defaultSelectAll ? 'checked' : ''}>` :
                `<input type="checkbox" id="f-${i}" ${Config.download.defaultSelectAll ? 'checked' : ''} style="display:none">`;

            mask.innerHTML = `
                <div class="lms-panel">
                    <div class="lms-header"><h3>课件下载 (${files.length})</h3><div class="lms-close" id="lms-dl-close">×</div></div>
                    <div class="lms-list-container lms-scrollable">
                        ${files.map((f, i) => `
                            <div class="lms-dl-item ${Config.download.showCheckbox?'':'no-cb'}" data-idx="${i}">
                                ${checkboxHtml(i)}
                                ${getFileTag(f.name)}
                                <label class="lms-dl-name">${f.name}</label>
                            </div>
                        `).join('')}
                    </div>
                    <div class="lms-footer">
                        <div style="display:flex; gap:10px;">
                            <button class="lms-btn" id="lms-all">全选</button>
                            <button class="lms-btn" id="lms-inv">反选</button>
                        </div>
                        <button class="lms-btn lms-btn-prime" id="lms-do">下载所选</button>
                    </div>
                </div>
            `;
            document.body.appendChild(mask);

            const updateRowStyle = () => {
                mask.querySelectorAll('.lms-dl-item').forEach(row => {
                    const cb = row.querySelector('input');
                    if (cb.checked) row.classList.add('selected');
                    else row.classList.remove('selected');
                });
            };
            if(Config.download.defaultSelectAll) updateRowStyle();

            mask.querySelectorAll('.lms-dl-item').forEach(row => {
                row.onclick = (e) => {
                    if (e.target.tagName !== 'INPUT') {
                        const cb = row.querySelector('input');
                        cb.checked = !cb.checked;
                    }
                    updateRowStyle();
                };
            });

            mask.querySelector('#lms-dl-close').onclick = () => gracefulClose(mask);
            mask.querySelector('#lms-all').onclick = () => {
                mask.querySelectorAll('input[type=checkbox]').forEach(c => c.checked = true);
                updateRowStyle();
            };
            mask.querySelector('#lms-inv').onclick = () => {
                mask.querySelectorAll('input[type=checkbox]').forEach(c => c.checked = !c.checked);
                updateRowStyle();
            };
            mask.querySelector('#lms-do').onclick = async () => {
                const selected = Array.from(mask.querySelectorAll('input:checked'));
                gracefulClose(mask);
                for (let cb of selected) {
                    const idx = cb.id.split('-')[1];
                    const a = document.createElement('a'); a.href = files[idx].url + '?preview=true'; a.download = files[idx].name; a.click();
                    await new Promise(r => setTimeout(r, 1000));
                }
            };
            mask.onclick = (e) => { if(e.target === mask) gracefulClose(mask); };
        },

        renderSettingEntry() {
            const container = document.createElement('div');
            container.id = 'lms-cfg-cont';
            container.className = 'lms-ball-cont-fixed';
            container.innerHTML = `<div class="lms-circle-ball lms-ball-white">⚙️</div>`;
            container.onclick = () => this.showSettings();
            document.body.appendChild(container);
        },
        showSettings() {
            toggleScrollLock(true);
            const mask = document.createElement('div');
            mask.className = 'lms-mask';
            mask.innerHTML = `
                <div class="lms-panel">
                    <div class="lms-header"><h3>设置中心</h3><div class="lms-close" id="lms-cfg-close">×</div></div>
                    <div class="lms-tabs">
                        <div class="lms-tab active" data-tab="dl">下载</div>
                        <div class="lms-tab" data-tab="video">视频</div>
                        <div class="lms-tab" data-tab="theme">个性化</div>
                        <div class="lms-tab" data-tab="other">其他</div>
                        <div class="lms-tab-line"></div>
                    </div>
                    <div class="lms-body-scroll lms-scrollable" id="lms-tab-content" style="padding:0"></div>
                    <div class="lms-footer" style="justify-content:flex-end"><button class="lms-btn lms-btn-prime" id="lms-save-only" style="width:120px">保存配置</button></div>
                </div>
            `;
            document.body.appendChild(mask);

            const updateLine = (activeTab) => {
                const line = mask.querySelector('.lms-tab-line');
                if (activeTab && line) {
                    line.style.width = `${activeTab.offsetWidth}px`;
                    line.style.left = `${activeTab.offsetLeft}px`;
                }
            };

            const renderTab = (tab) => {
                const container = document.getElementById('lms-tab-content');
                let html = '';
                if(tab === 'dl') {
                    html = `
                        <div class="lms-opt-row"><div class="lms-opt-info"><div class="lms-opt-title">下载默认全选</div><div class="lms-opt-desc">开启后，列表默认勾选所有文件</div></div><input type="checkbox" class="lms-ios-switch" id="set-dl-all" ${Config.download.defaultSelectAll ? 'checked' : ''}></div>
                        <div class="lms-opt-row"><div class="lms-opt-info"><div class="lms-opt-title">显示复选框</div><div class="lms-opt-desc">是否显示文件左侧的选择框</div></div><input type="checkbox" class="lms-ios-switch" id="set-dl-cb" ${Config.download.showCheckbox ? 'checked' : ''}></div>
                    `;
                } else if(tab === 'video') {
                    html = `
                        <div class="lms-opt-row"><div class="lms-opt-info"><div class="lms-opt-title">解除视频限制</div><div class="lms-opt-desc">允许拖动进度条、解除右键限制</div></div><input type="checkbox" class="lms-ios-switch" id="set-restrict" ${Config.video.removeRestrictions ? 'checked' : ''}></div>
                        <div class="lms-opt-row"><div class="lms-opt-info"><div class="lms-opt-title">自动连播</div><div class="lms-opt-desc">视频播放结束自动跳转下一集</div></div><input type="checkbox" class="lms-ios-switch" id="set-jump" ${Config.video.autoJump ? 'checked' : ''}></div>
                    `;
                } else if(tab === 'theme') {
                    const colors = ['#007bff', '#28BD6E', '#6a005f', '#ff9800', '#607d8b'];
                    const colorHtml = colors.map(c => `<div class="color-dot ${Config.appearance.themeColor === c ? 'selected' : ''}" style="background:${c}" data-color="${c}"></div>`).join('');
                    html = `
                        <div class="lms-opt-row">
                            <div class="lms-opt-info"><div class="lms-opt-title">主题颜色</div><div class="lms-opt-desc">流体色彩切换</div></div>
                            <div style="display:flex;align-items:center">${colorHtml}<input type="color" id="custom-color" value="${Config.appearance.themeColor}" style="border:none;background:none;width:24px;height:24px;cursor:pointer;margin-left:8px"></div>
                        </div>
                        <div class="lms-opt-row">
                            <div class="lms-opt-info"><div class="lms-opt-title">背景透明度</div><div class="lms-opt-desc">毛玻璃通透感</div></div>
                            <input type="range" class="lms-ios-slider" id="theme-opacity" min="0.1" max="1" step="any" value="${Config.appearance.opacity}">
                        </div>
                        <div class="lms-opt-row">
                            <div class="lms-opt-info"><div class="lms-opt-title">背景模糊 (Blur)</div><div class="lms-opt-desc">调节虚化强度</div></div>
                            <input type="range" class="lms-ios-slider" id="theme-blur" min="0" max="20" step="any" value="${Config.appearance.blur}">
                        </div>
                    `;
                } else if(tab === 'other') {
                    const profiles = ProfileManager.getProfiles();
                    const profileList = Object.keys(profiles).map(name =>
                        `<div style="display:flex;justify-content:space-between;margin-top:8px;align-items:center;background:rgba(0,0,0,0.03);padding:8px 12px;border-radius:8px;">
                            <span style="font-size:13px;font-weight:bold">${name}</span>
                            <div style="display:flex;gap:5px;">
                                <button class="lms-btn lms-load-pf" data-name="${name}" style="padding:0 10px;height:28px;font-size:12px;">读取</button>
                                <button class="lms-btn lms-del-pf" data-name="${name}" style="padding:0 10px;height:28px;font-size:12px;color:#ff4d4f;border-color:#ffdcdc;">删除</button>
                            </div>
                        </div>`
                    ).join('');

                    html = `
                        <div class="lms-opt-row">
                            <div class="lms-opt-info"><div class="lms-opt-title">重置所有设置</div><div class="lms-opt-desc">初始化脚本</div></div>
                            <button class="lms-btn lms-btn-danger" id="lms-reset">恢复默认</button>
                        </div>
                        <div class="lms-opt-row" style="align-items:flex-start;flex-direction:column;gap:10px">
                            <div class="lms-opt-title">配置存档 (Profiles)</div>
                            <div style="display:flex;width:100%;gap:10px;align-items:stretch;">
                                <input type="text" id="lms-pf-name" class="lms-input-text" placeholder="存档名称" style="flex:1">
                                <button class="lms-btn lms-btn-prime" id="lms-save-pf" style="flex-shrink:0;">保存</button>
                            </div>
                            <div style="width:100%;max-height:150px;overflow-y:auto">${profileList || '<div style="font-size:12px;color:#999;text-align:center;padding:10px">暂无存档</div>'}</div>
                        </div>
                    `;
                }

                container.innerHTML = `<div class="lms-tab-content-anim">${html}</div>`;

                if(tab === 'theme') {
                    const sliders = container.querySelectorAll('.lms-ios-slider');
                    sliders.forEach(updateSliderFill);
                    container.querySelectorAll('.color-dot').forEach(dot => {
                        dot.onclick = () => { Config.appearance.themeColor = dot.dataset.color; updateThemeVariables(); renderTab('theme'); }
                    });
                    document.getElementById('custom-color').oninput = (e) => { Config.appearance.themeColor = e.target.value; updateThemeVariables(); };
                    ['opacity', 'blur'].forEach(key => {
                        const slider = document.getElementById(`theme-${key}`);
                        slider.oninput = (e) => {
                            requestAnimationFrame(() => {
                                Config.appearance[key] = parseFloat(e.target.value); updateThemeVariables(); updateSliderFill(slider);
                            });
                        };
                    });
                } else if(tab === 'other') {
                    document.getElementById('lms-reset').onclick = () => {
                        if(confirm('重置设置？')) { Config = JSON.parse(JSON.stringify(DEFAULT_CONFIG)); saveConfig(); updateThemeVariables(); renderTab('other'); }
                    };
                    document.getElementById('lms-save-pf').onclick = () => {
                        const name = document.getElementById('lms-pf-name').value.trim();
                        if(!name) return;
                        const dlAll = document.getElementById('set-dl-all'); if(dlAll) Config.download.defaultSelectAll = dlAll.checked;
                        const dlCb = document.getElementById('set-dl-cb'); if(dlCb) Config.download.showCheckbox = dlCb.checked;
                        ProfileManager.saveProfile(name); renderTab('other');
                    };
                    container.querySelectorAll('.lms-load-pf').forEach(btn => {
                        btn.onclick = () => { if(ProfileManager.loadProfile(btn.dataset.name)) { updateThemeVariables(); gracefulClose(mask); } };
                    });
                    container.querySelectorAll('.lms-del-pf').forEach(btn => {
                        btn.onclick = () => { if(confirm(`删除存档 "${btn.dataset.name}"?`)) { ProfileManager.deleteProfile(btn.dataset.name); renderTab('other'); } };
                    });
                }
            };

            renderTab('dl');
            setTimeout(() => updateLine(mask.querySelector('.lms-tab.active')), 50);

            mask.querySelectorAll('.lms-tab').forEach(t => {
                t.onclick = () => {
                    mask.querySelectorAll('.lms-tab').forEach(x => x.classList.remove('active'));
                    t.classList.add('active'); updateLine(t); renderTab(t.dataset.tab);
                };
            });
            document.getElementById('lms-save-only').onclick = () => {
                const dlAll = document.getElementById('set-dl-all'); if(dlAll) Config.download.defaultSelectAll = dlAll.checked;
                const dlCb = document.getElementById('set-dl-cb'); if(dlCb) Config.download.showCheckbox = dlCb.checked;
                const re = document.getElementById('set-restrict'); if(re) Config.video.removeRestrictions = re.checked;
                const jp = document.getElementById('set-jump'); if(jp) Config.video.autoJump = jp.checked;
                saveConfig(); gracefulClose(mask);
            };
            mask.querySelector('#lms-cfg-close').onclick = () => gracefulClose(mask);
            mask.onclick = (e) => { if(e.target === mask) gracefulClose(mask); };
        },

        startMonitor() {
            setInterval(() => {
                const v = document.querySelector('video');
                if (v) {
                    if (v.playbackRate !== Config.video.speed) v.playbackRate = Config.video.speed;
                    if (Config.video.removeRestrictions) { v.controls = true; v.oncontextmenu = null; }
                }
            }, 2000);
        }
    };

    Logic.init();
})();