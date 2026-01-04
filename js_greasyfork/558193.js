// ==UserScript==
// @name         打开网页：新标签页2 (v3.6 URL归一化版)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  引入URL归一化引擎，强制将所有链接转换为绝对HTTPS路径，修复GitHub等网站在Helium/非Chrome环境下路径解析错误的问题。
// @author       HAZE
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558193/%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%EF%BC%9A%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B52%20%28v36%20URL%E5%BD%92%E4%B8%80%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558193/%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%EF%BC%9A%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B52%20%28v36%20URL%E5%BD%92%E4%B8%80%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === UI 配置 ===
    const AUTO_CLOSE_TIMEOUT = 3500;
    
    // === 内部状态 ===
    let isBypassing = false;

    // === 状态管理 ===
    const state = {
        get mode() { return GM_getValue('openMode', 'popup'); },
        set mode(v) { GM_setValue('openMode', v); },
        get background() { return GM_getValue('backgroundMode', false); },
        set background(v) { GM_setValue('backgroundMode', v); },
        get indicator() { return GM_getValue('showIndicator', true); },
        set indicator(v) { GM_setValue('showIndicator', v); },
        get theme() { return GM_getValue('theme', 'auto'); },
        set theme(v) { GM_setValue('theme', v); },
        get excluded() { return GM_getValue('excludedSites', []); },
        set excluded(v) { GM_setValue('excludedSites', v); }
    };

    // === URL 归一化工具 (v3.6 核心) ===
    const getAbsoluteUrl = (url) => {
        try {
            // 使用当前页面作为 Base URL 进行解析
            return new URL(url, window.location.href).href;
        } catch (e) {
            return url; // 如果解析失败，返回原值
        }
    };

    // === CSS 注入 ===
    const injectStyle = () => {
        if (document.getElementById('haze-style')) return;
        const s = document.createElement('style');
        s.id = 'haze-style';
        s.textContent = `
            :root { --haze-bg: rgba(255,255,255,0.95); --haze-text: #333; --haze-text-sub: #666; --haze-border: rgba(0,0,0,0.1); --haze-primary: #007AFF; --haze-ind-popup: #af52de; --haze-ind-newtab: #34c759; --haze-hover: rgba(0,0,0,0.05); }
            [data-haze-theme="dark"] { --haze-bg: rgba(30,30,30,0.9); --haze-text: #f0f0f0; --haze-text-sub: #aaa; --haze-border: rgba(255,255,255,0.15); --haze-primary: #0A84FF; --haze-ind-popup: #bf5af2; --haze-ind-newtab: #32d74b; --haze-hover: rgba(255,255,255,0.1); }
            
            a[data-haze-status="text"] { position: relative; } 
            a[data-haze-status="text"]::after { content: ""; display: inline-block; width: 5px; height: 5px; margin-left: 3px; border-radius: 50%; vertical-align: middle; opacity: 0.6; pointer-events: none; transition: transform 0.2s; }
            a[data-haze-status="text"]:hover::after { transform: scale(1.6); opacity: 1; }
            .haze-ind-popup::after { background: var(--haze-ind-popup); box-shadow: 0 0 5px var(--haze-ind-popup); }
            .haze-ind-newtab::after { background: var(--haze-ind-newtab); box-shadow: 0 0 5px var(--haze-ind-newtab); }

            #haze-popup { position: fixed; display: flex; gap: 6px; padding: 6px; z-index: 2147483647; background: var(--haze-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 12px; border: 1px solid var(--haze-border); box-shadow: 0 8px 30px rgba(0,0,0,0.2); transform: translate(-65%, -50%); animation: haze-pop 0.1s ease-out forwards; }
            @keyframes haze-pop { from { opacity: 0; transform: translate(-65%, -45%) scale(0.95); } to { opacity: 1; transform: translate(-65%, -50%) scale(1); } }
            .haze-popup-btn { padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--haze-text); transition: background 0.1s; white-space: nowrap; }
            .haze-popup-btn:hover { background: var(--haze-hover); }
            .haze-popup-btn.primary { color: var(--haze-primary); background: rgba(0,122,255,0.1); font-weight: 600; min-width: 70px; }
            .haze-popup-btn.primary:hover { opacity: 0.8; }

            #haze-settings-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 2147483647; background: rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
            #haze-settings-panel { width: 400px; height: 500px; background: var(--haze-bg); border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); color: var(--haze-text); font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--haze-border); }
            .haze-header { padding: 20px 24px 0; flex-shrink: 0; }
            .haze-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
            .haze-title { font-weight: 700; font-size: 18px; }
            .haze-close { cursor: pointer; opacity: 0.6; font-size: 20px; transition: 0.2s; } .haze-close:hover { opacity: 1; }
            .haze-tabs { display: flex; border-bottom: 1px solid var(--haze-border); gap: 20px; }
            .haze-tab-item { padding: 10px 0; font-size: 14px; color: var(--haze-text-sub); cursor: pointer; position: relative; transition: 0.2s; }
            .haze-tab-item.active { color: var(--haze-text); font-weight: 600; }
            .haze-tab-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--haze-primary); border-radius: 2px; }
            .haze-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
            .haze-tab-content { display: none; animation: haze-fade 0.2s; }
            .haze-tab-content.active { display: block; }
            @keyframes haze-fade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .haze-section { margin-bottom: 25px; }
            .haze-label { font-size: 13px; color: var(--haze-text-sub); margin-bottom: 8px; font-weight: 600; }
            .haze-capsule { display: flex; background: var(--haze-hover); padding: 4px; border-radius: 10px; }
            .haze-capsule-btn { flex: 1; text-align: center; padding: 8px; font-size: 13px; border-radius: 8px; cursor: pointer; color: var(--haze-text-sub); transition: 0.2s; }
            .haze-capsule-btn.active { background: var(--haze-bg); color: var(--haze-primary); font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .haze-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--haze-border); }
            .haze-row:last-child { border-bottom: none; }
            .haze-switch { position: relative; width: 44px; height: 24px; }
            .haze-switch input { opacity: 0; width: 0; height: 0; }
            .haze-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--haze-border); transition: .3s; border-radius: 34px; }
            .haze-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
            input:checked + .haze-slider { background-color: var(--haze-primary); }
            input:checked + .haze-slider:before { transform: translateX(20px); }
            .haze-list-container { background: var(--haze-hover); border-radius: 10px; overflow: hidden; max-height: 250px; overflow-y: auto; margin-bottom: 10px; }
            .haze-list-item { display: flex; justify-content: space-between; padding: 12px 15px; font-size: 13px; border-bottom: 1px solid var(--haze-border); align-items: center; }
            .haze-list-item:last-child { border-bottom: none; }
            .haze-del-btn { color: #ff3b30; cursor: pointer; font-size: 12px; padding: 2px 6px; border-radius: 4px; }
            .haze-del-btn:hover { background: rgba(255, 59, 48, 0.1); }
            .haze-input-group { display: flex; gap: 8px; }
            .haze-input { flex: 1; background: var(--haze-hover); border: 1px solid var(--haze-border); border-radius: 8px; padding: 8px 12px; color: var(--haze-text); font-size: 13px; outline: none; }
            .haze-btn-add { padding: 0 16px; background: var(--haze-primary); color: white; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; }
            .haze-tip { font-size: 12px; color: var(--haze-text-sub); background: var(--haze-hover); padding: 10px; border-radius: 8px; line-height: 1.5; margin-top: 5px; }
            .haze-footer { text-align: center; padding: 15px; font-size: 12px; color: var(--haze-text-sub); border-top: 1px solid var(--haze-border); opacity: 0.7; }
        `;
        (document.head || document.documentElement).appendChild(s);
    };

    const applyTheme = () => {
        const theme = state.theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : state.theme;
        document.documentElement.setAttribute('data-haze-global-theme', theme);
        const els = document.querySelectorAll('#haze-popup, #haze-settings-overlay');
        els.forEach(el => el.setAttribute('data-haze-theme', theme));
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--haze-ind-popup', '#bf5af2');
            document.documentElement.style.setProperty('--haze-ind-newtab', '#32d74b');
        } else {
            document.documentElement.style.setProperty('--haze-ind-popup', '#af52de');
            document.documentElement.style.setProperty('--haze-ind-newtab', '#34c759');
        }
    };

    // === 逻辑函数 ===
    const isRichMediaLink = (link) => {
        if (link.querySelector('img, svg, picture, video, canvas, div, section, article')) return true;
        const cls = (link.className || '').toLowerCase();
        if (/thumb|img|pic|cover|card|banner|poster|photo/.test(cls)) return true;
        if (link.textContent.trim() === '') return true;
        return false;
    };

    const isFunctionalLink = (link, isForceMode) => {
        if (isForceMode) return false;
        const rawHref = link.getAttribute('href');
        if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:')) return true;
        if (link.target === '_self' || link.target === '_iframe') return true;
        if (link.getAttribute('class')?.includes('script-link')) return false;
        if (link.closest('h1, h2, h3, h4, h5, h6')) return false;
        if (isRichMediaLink(link)) return false; 
        try {
            if (rawHref.startsWith('#')) return true;
            const urlObj = new URL(link.href);
            if (urlObj.pathname === window.location.pathname && urlObj.hash !== '') return true;
        } catch(e) {}
        const attrs = ['onclick', 'data-toggle', 'data-target', 'aria-controls', 'aria-expanded', 'ng-click', '@click', 'v-on:click'];
        for (const attr of attrs) if (link.hasAttribute(attr)) return true;
        const text = link.textContent.trim();
        if (/^\d+$/.test(text)) return true;
        const checkStr = (link.className + ' ' + link.id + ' ' + text).toLowerCase();
        const keywords = ['login', 'logout', 'sign', 'cart', 'buy', 'like', 'fav', 'share', 'comment', 'play', '登录', '注册', '注销', '购物车', '购买', '点赞', '收藏', '评论', '播放', '展开', '收起'];
        const isKeywordMatch = keywords.some(kw => {
            if (/[\u4e00-\u9fa5]/.test(kw)) return checkStr.includes(kw);
            return new RegExp(`\\b${kw}\\b`).test(checkStr);
        });
        if (text.length <= 5 && isKeywordMatch) return true;
        if (isKeywordMatch) return true;
        return false;
    };

    const updateLinkIndicators = () => {
        document.querySelectorAll('a[data-haze-status]').forEach(el => {
            el.removeAttribute('data-haze-status');
            el.className = el.className.replace(/haze-ind-\w+/g, '').trim();
        });
        if (!state.indicator || state.excluded.includes(location.hostname) || state.mode === 'default') return;
        const cls = state.mode === 'popup' ? 'haze-ind-popup' : 'haze-ind-newtab';
        document.querySelectorAll('a').forEach(link => {
            if (isRichMediaLink(link)) return;
            if (isFunctionalLink(link, false)) return;
            link.setAttribute('data-haze-status', 'text');
            link.classList.add(cls);
        });
        applyTheme();
    };

    const handleLinkClick = (event) => {
        if (isBypassing) return;
        let link = event.target.closest('a');
        if (link && (!link.getAttribute('href') || link.getAttribute('href') === '#')) {
             const parentLink = link.parentElement ? link.parentElement.closest('a') : null;
             if (parentLink) link = parentLink;
        }
        if (!link) return;
        const rawHref = link.getAttribute('href');
        if (!rawHref) return;
        if (state.excluded.includes(location.hostname)) return;
        if (event.ctrlKey || event.metaKey || event.shiftKey) return;
        const isForceMode = event.altKey;
        if (isFunctionalLink(link, isForceMode)) return;
        
        // 核心修改：将相对路径转为绝对路径
        const absUrl = getAbsoluteUrl(rawHref);

        const mode = state.mode;
        if (mode === 'popup') {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); 
            createPopup(event, link, absUrl); // 传递绝对路径
        } else if (mode === 'newtab') {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
            if (state.background) GM_openInTab(absUrl, { active: false, insert: true, setParent: true });
            else window.open(absUrl, '_blank');
        }
    };

    const createPopup = (e, link, url) => {
        const old = document.getElementById('haze-popup'); if (old) old.remove();
        injectStyle();
        const popup = document.createElement('div');
        popup.id = 'haze-popup';
        Object.assign(popup.style, { top: `${e.clientY}px`, left: `${e.clientX}px` });
        const btn1 = document.createElement('div'); btn1.className = 'haze-popup-btn'; btn1.textContent = '🏠 当前';
        btn1.onclick = (ev) => { 
            popup.remove(); isBypassing = true; link.click(); setTimeout(() => isBypassing = false, 50); 
        };
        const btn2 = document.createElement('div'); btn2.className = 'haze-popup-btn primary'; 
        btn2.textContent = state.background ? '🚀 后台' : '↗ 新标签';
        btn2.onclick = (ev) => {
            ev.stopPropagation();
            if (state.background) GM_openInTab(url, { active: false, insert: true, setParent: true });
            else window.open(url, '_blank');
            popup.remove();
        };
        popup.append(btn1, btn2); document.body.appendChild(popup); applyTheme();
        let closeTimer = setTimeout(() => popup.remove(), AUTO_CLOSE_TIMEOUT);
        let leaveTimer;
        popup.onmouseenter = () => { clearTimeout(closeTimer); clearTimeout(leaveTimer); };
        popup.onmouseleave = () => leaveTimer = setTimeout(() => popup.remove(), 800);
    };

    const createSettingsPanel = () => {
        if (document.getElementById('haze-settings-overlay')) return;
        injectStyle();
        const overlay = document.createElement('div');
        overlay.id = 'haze-settings-overlay';
        const domain = location.hostname;

        overlay.innerHTML = `
            <div id="haze-settings-panel">
                <div class="haze-header">
                    <div class="haze-title-row">
                        <div class="haze-title">✨ Link Master</div>
                        <div class="haze-close">✕</div>
                    </div>
                    <div class="haze-tabs">
                        <div class="haze-tab-item active" data-tab="basic">基础设置</div>
                        <div class="haze-tab-item" data-tab="advanced">高级功能</div>
                        <div class="haze-tab-item" data-tab="excluded">排除列表</div>
                    </div>
                </div>
                
                <div class="haze-body">
                    <div class="haze-tab-content active" id="tab-basic">
                        <div class="haze-section">
                            <div class="haze-label">默认打开模式</div>
                            <div class="haze-capsule">
                                <div class="haze-capsule-btn ${state.mode==='popup'?'active':''}" data-k="mode" data-v="popup">选择框</div>
                                <div class="haze-capsule-btn ${state.mode==='newtab'?'active':''}" data-k="mode" data-v="newtab">新标签</div>
                                <div class="haze-capsule-btn ${state.mode==='default'?'active':''}" data-k="mode" data-v="default">禁用</div>
                            </div>
                        </div>
                        <div class="haze-section">
                            <div class="haze-label">界面主题</div>
                            <div class="haze-capsule">
                                <div class="haze-capsule-btn ${state.theme==='auto'?'active':''}" data-k="theme" data-v="auto">🔮 自动</div>
                                <div class="haze-capsule-btn ${state.theme==='light'?'active':''}" data-k="theme" data-v="light">☀️ 浅色</div>
                                <div class="haze-capsule-btn ${state.theme==='dark'?'active':''}" data-k="theme" data-v="dark">🌑 深色</div>
                            </div>
                        </div>
                    </div>

                    <div class="haze-tab-content" id="tab-advanced">
                        <div class="haze-section">
                            <div class="haze-row">
                                <div>后台静默打开</div>
                                <label class="haze-switch"><input type="checkbox" id="sw-bg" ${state.background?'checked':''}><span class="haze-slider"></span></label>
                            </div>
                            <div class="haze-row">
                                <div>视觉指示器 (仅文本)</div>
                                <label class="haze-switch"><input type="checkbox" id="sw-ind" ${state.indicator?'checked':''}><span class="haze-slider"></span></label>
                            </div>
                        </div>
                        <div class="haze-section">
                            <div class="haze-label">使用技巧 (v3.4 新特性)</div>
                            <div class="haze-tip">
                                1. <b>强制召唤</b>：按住 <code>Alt</code> (Win) 或 <code>Option</code> (Mac) 键点击链接，可强制弹出选择框。<br><br>
                                2. <b>原生模拟</b>：如果脚本误拦截了按钮，点击选择框中的 <code>🏠 当前</code>，会执行一次原生点击。<br><br>
                                3. <b>Helium兼容</b>：已内置URL归一化引擎，修复非Chrome环境下的路径解析问题。
                            </div>
                        </div>
                    </div>

                    <div class="haze-tab-content" id="tab-excluded">
                        <div class="haze-section">
                            <div class="haze-label">当前网站</div>
                            <div class="haze-capsule" style="margin-bottom:15px;">
                                <div class="haze-capsule-btn ${state.excluded.includes(domain)?'':'active'}" id="btn-toggle-site">
                                    ${state.excluded.includes(domain) ? '🚫 已排除 (点击恢复)' : '✅ 正在运行 (点击排除)'}
                                </div>
                            </div>
                            <div class="haze-label">黑名单管理</div>
                            <div class="haze-list-container" id="haze-blacklist"></div>
                            <div class="haze-input-group">
                                <input type="text" class="haze-input" id="input-domain" placeholder="输入域名">
                                <button class="haze-btn-add" id="btn-add-domain">添加</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="haze-footer">Link Master v3.6 · Designed by HAZE</div>
            </div>`;
        
        const panel = overlay.querySelector('#haze-settings-panel');
        const close = () => { overlay.remove(); updateLinkIndicators(); };
        overlay.querySelector('.haze-close').onclick = close;
        overlay.onclick = (e) => { if(e.target===overlay) close(); };

        panel.querySelectorAll('.haze-tab-item').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.haze-tab-item').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.haze-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`#tab-${tab.dataset.tab}`).classList.add('active');
            };
        });

        panel.querySelectorAll('[data-k]').forEach(btn => btn.onclick = () => {
            state[btn.dataset.k] = btn.dataset.v;
            btn.parentNode.querySelectorAll('.active').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            if(btn.dataset.k === 'theme') applyTheme();
        });

        panel.querySelector('#sw-bg').onchange = (e) => state.background = e.target.checked;
        panel.querySelector('#sw-ind').onchange = (e) => { state.indicator = e.target.checked; updateLinkIndicators(); };

        const renderBlacklist = () => {
            const listEl = panel.querySelector('#haze-blacklist');
            if (state.excluded.length === 0) {
                listEl.innerHTML = '<div style="padding:15px;text-align:center;color:#999;font-size:12px;">暂无排除网站</div>';
                return;
            }
            listEl.innerHTML = '';
            state.excluded.forEach(site => {
                const item = document.createElement('div');
                item.className = 'haze-list-item';
                item.innerHTML = `<span>${site}</span><span class="haze-del-btn">移除</span>`;
                item.querySelector('.haze-del-btn').onclick = () => {
                    state.excluded = state.excluded.filter(s => s !== site);
                    renderBlacklist();
                    updateToggleBtn();
                };
                listEl.appendChild(item);
            });
        };

        const updateToggleBtn = () => {
            const btn = panel.querySelector('#btn-toggle-site');
            const isEx = state.excluded.includes(domain);
            btn.textContent = isEx ? '🚫 已排除 (点击恢复)' : '✅ 正在运行 (点击排除)';
            btn.className = `haze-capsule-btn ${isEx ? '' : 'active'}`;
        };

        panel.querySelector('#btn-toggle-site').onclick = () => {
            if (state.excluded.includes(domain)) state.excluded = state.excluded.filter(d => d !== domain);
            else state.excluded = [...state.excluded, domain];
            renderBlacklist();
            updateToggleBtn();
        };

        panel.querySelector('#btn-add-domain').onclick = () => {
            const input = panel.querySelector('#input-domain');
            const val = input.value.trim().toLowerCase();
            if (val && !state.excluded.includes(val)) {
                state.excluded = [...state.excluded, val];
                input.value = '';
                renderBlacklist();
                updateToggleBtn();
            }
        };

        renderBlacklist();
        document.body.appendChild(overlay);
        applyTheme();
    };

    const main = () => {
        injectStyle(); applyTheme(); updateLinkIndicators();
        GM_registerMenuCommand('⚙️ 脚本设置中心', createSettingsPanel);
        document.addEventListener('click', handleLinkClick, true);
        const observer = new MutationObserver((mutations) => { if (mutations.some(m => m.addedNodes.length)) setTimeout(updateLinkIndicators, 500); });
        observer.observe(document.body, { childList: true, subtree: true });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.theme === 'auto') applyTheme(); });
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main); else main();
})();
