// ==UserScript==
// @name         搜索引擎工具栏(改)
// @namespace    https://github.com/examplecode/useful-user-scripts
// @homepageURL  https://scriptcat.org/zh-CN/users/157252
// @author       examplecode && Aloazny && Gemini
// @version      3.3
// @description  二改@examplecode的搜索脚本，感谢@examplecode，添加MD3配色+高斯模糊+编辑/添加搜索引擎功能+搜索栏切换顶部底部+搜索框，保留原本的X浏览器搜索引擎读取，排序等功能。
// @match        *://*/*
// @icon          data:image/png;base64,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
// @license       MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_EX_getSearchEngines
// @downloadURL https://update.greasyfork.org/scripts/562506/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%B7%A5%E5%85%B7%E6%A0%8F%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562506/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%B7%A5%E5%85%B7%E6%A0%8F%28%E6%94%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'quick_search_bar_final';
    const THEME_KEY = 'quick_search_theme_v2';
    const LAYOUT_KEY = 'quick_search_layout_v1';
    const queryParams = ["q", "s", "p", "wd", "word", "keyword", "text", "query", "key", "result" ];

    const defaultTheme = { primary: '#6750a4', opacity: 0.7, blur: 18, themeStyle: 'MIUIX' };
    const defaultLayout = { pos: 'bottom', offset: 24, autoHide: false, showInput: false, inputStyle: 1, shrinkMode: false };
    const defaultEngines = [
        { name: '必应', host: 'bing.com', url: 'https://www.bing.com/search?q=%s' },
        { name: 'Yandex', host: 'yandex', url: 'https://yandex.com/search/touch/?text=%s' },
        { name: 'Google', host: 'google', url: 'https://www.google.com/search?q=%s' },
        { name: '百度', host: 'baidu.com', url: 'https://www.baidu.com/s?word=%s' },
        { name: 'ScriptCat', host: 'scriptcat.org', url: 'https://scriptcat.org/zh-CN/search?keyword=%s' },
        { name: '4Khd', host: '/(4khd|xxtt|ssuu|uuss)\\.(com|ink|uk)/', url: 'https://www.4khd.com/search/%s' },
        { name: '纳米AI', host: 'n.cn', url: 'https://www.n.cn/search/?q=%s&src=ec_vivo_1001' }
    ];

    const storage = {
        save: (engines, deletedIds) => {
            const data = {
                custom: engines.filter(e => 
                    !defaultEngines.some(d => storage.getStableId(d.name, d.host) === e.id) &&
                    !xEngines.some(x => storage.getStableId(x.name, x.host) === e.id)
                ),
                order: engines.map(e => e.id),
                hidden: engines.filter(e => !e.visible).map(e => e.id),
                deleted: deletedIds || [],
                cache: engines.map(e => ({ name: e.name, host: e.host, url: e.url, id: e.id, visible: e.visible }))
            };
            if (typeof GM_setValue !== 'undefined') GM_setValue(STORAGE_KEY, data);
            else localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        },
        load: () => {
            let data;
            if (typeof GM_getValue !== 'undefined') data = GM_getValue(STORAGE_KEY);
            else { try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) {} }
            return data || { custom: [], order: [], hidden: [], deleted: [], cache: null };
        },
        themeSave: (val) => {
            if (typeof GM_setValue !== 'undefined') GM_setValue(THEME_KEY, val);
            else localStorage.setItem(THEME_KEY, JSON.stringify(val));
            applyTheme();
        },
        themeLoad: () => {
            let data;
            if (typeof GM_getValue !== 'undefined') data = GM_getValue(THEME_KEY);
            else { try { data = JSON.parse(localStorage.getItem(THEME_KEY)); } catch(e) {} }
            return data || defaultTheme;
        },
        layoutSave: (val) => {
            if (typeof GM_setValue !== 'undefined') GM_setValue(LAYOUT_KEY, val);
            else localStorage.setItem(LAYOUT_KEY, JSON.stringify(val));
        },
        layoutLoad: () => {
            let data;
            if (typeof GM_getValue !== 'undefined') data = GM_getValue(LAYOUT_KEY);
            else { try { data = JSON.parse(localStorage.getItem(LAYOUT_KEY)); } catch(e) {} }
            return data || defaultLayout;
        },
        getStableId: (name, host) => {
            let str = (name || '') + '|' + (host || '');
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
            }
            return 'se_' + Math.abs(hash).toString(36);
        }
    };

    let theme = storage.themeLoad();
    let layout = storage.layoutLoad();

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        let r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const contrastColor = brightness > 150 ? '#000000' : '#ffffff';
        return { rgb: `${r}, ${g}, ${b}`, contrast: contrastColor };
    }
    
    function applyTheme() {
        const styleId = 'qs-static-styles';
        let el = document.getElementById(styleId) || document.createElement('style');
        el.id = styleId;
        const themeData = hexToRgb(theme.primary);
 
        const isMIUI = theme.themeStyle === 'MIUIX';
        const config = isMIUI ? { radius: '100px', btnRadius: '100px', cardRadius: '32px', border: '0.5px solid rgba(255,255,255,0.4)', saturate: '210%', shadow: '0 8px 32px rgba(0,0,0,0.1)' } : { radius: '16px', btnRadius: '12px', cardRadius: '24px', border: '1px solid rgba(0,0,0,0.1)', saturate: '150%', shadow: '0 4px 12px rgba(0,0,0,0.1)' };
        
        el.innerHTML = `
            :root {
                --qs-pri: ${theme.primary};
                --qs-pri-rgb: ${themeData.rgb};
                --qs-on-pri: ${themeData.contrast}; 
                --qs-bg: rgba(255, 255, 255, ${theme.opacity});
                --qs-blur: ${theme.blur}px;
                --qs-radius: ${config.radius};
                --qs-btn-radius: ${config.btnRadius};
                --qs-card-radius: ${config.cardRadius};
                --qs-border: ${config.border};
                --qs-saturate: ${config.saturate};
                --qs-shadow: ${config.shadow};
            }
            #qs-manager-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:2147483647;display:flex;justify-content:center;align-items:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif; }
            .qs-card { background:rgba(255,255,255,0.85);backdrop-filter:saturate(var(--qs-saturate)) blur(25px);-webkit-backdrop-filter:saturate(var(--qs-saturate)) blur(25px);width:92%;max-width:440px;max-height:80vh;border-radius:var(--qs-card-radius);box-shadow:0 20px 50px rgba(0,0,0,0.15);display:flex;flex-direction:column;overflow:hidden;border:var(--qs-border);color:#1c1b1f;transition: border-radius 0.3s ease;box-sizing:border-box; }
            .qs-bar { position:fixed; left:50%; transform:translateX(-50%); z-index:2147483646; background:var(--qs-bg); backdrop-filter:saturate(var(--qs-saturate)) blur(var(--qs-blur)); -webkit-backdrop-filter:saturate(var(--qs-saturate)) blur(var(--qs-blur)); display:flex; overflow-x:auto; padding:10px 14px; gap:8px; border-radius:var(--qs-radius); box-shadow:var(--qs-shadow); border:var(--qs-border); max-width:92vw; scrollbar-width:none; align-items:center; transition:transform 0.3s, opacity 0.3s, border-radius 0.3s; scroll-behavior:smooth; box-sizing:border-box; }
            .qs-bar::-webkit-scrollbar { display:none; }
            .qs-btn { padding:10px 18px; border-radius:var(--qs-btn-radius); text-decoration:none; font-size:14px; white-space:nowrap; font-weight:600; flex-shrink:0; transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-sizing:border-box; }
            .qs-btn:active { transform: scale(0.92); }
            .qs-btn-active { background:var(--qs-pri); color:var(--qs-on-pri); }
            .qs-btn-flat { background:rgba(0,0,0,0.04); color:#1d1b20; }
            .qs-main-input { border:none; outline:none; font-size:13px; font-weight:500; transition: width 0.3s, background 0.3s; box-sizing:border-box; }
            .se-item-container { margin-bottom: 10px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.03); background: rgba(255,255,255,0.6); box-sizing:border-box; }
            .se-item { display: flex; align-items: center; padding: 14px 16px; cursor: pointer; box-sizing:border-box; }
            .btn-icon { width: 36px; height: 36px; border-radius: 12px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #49454f; font-size:18px; box-sizing:border-box; }
            .toggle-box { width: 44px; height: 24px; background: #e7e0ec; border-radius: 20px; position: relative; transition: 0.3s; margin-right: 12px; flex-shrink:0; }
            .toggle-box.active { background: var(--qs-pri); }
            .toggle-circle { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: 0.3s; }
            .toggle-box.active .toggle-circle { left: 23px; }
            .edit-form { max-height: 0; opacity: 0; padding: 0 16px; overflow:hidden; transition: all 0.3s ease; box-sizing:border-box; }
            .edit-form.open { max-height: 400px; opacity: 1; padding: 10px 16px 20px; }
            .qs-input-field { width:100% !important; display:block !important; padding:14px; border-radius:12px; border:1px solid rgba(0,0,0,0.1) !important; background:#ffffff !important; color:#000000 !important; outline:none; font-size:14px; box-sizing:border-box !important; }
            .qs-input-field::placeholder { color: #888 !important; }
            #m-list::-webkit-scrollbar { display:none; }
        `;
        if (!el.parentNode) document.head.appendChild(el);
    }

    function normalizeUrl(url) {
        return url ? url.replace(/%keywords%/g, '%s').trim() : '';
    }

    let xEngines = [];
    if (typeof GM_EX_getSearchEngines === 'function') {
        try {
            const list = JSON.parse(GM_EX_getSearchEngines());
            if (Array.isArray(list)) {
                xEngines = list.map(e => ({ name: e.name || '未知', host: e.host || '', url: normalizeUrl(e.url || '') }));
            }
        } catch (e) {}
    }

    let saved = storage.load();

    function initEngines() {
        if (saved.cache && saved.cache.length > 0) {
            return saved.cache;
        }
        
        let pool = [...(saved.custom || []), ...defaultEngines, ...xEngines];
        let map = new Map();
        const seenUrls = new Set(), seenRegs = new Set();

        pool.forEach(e => {
            const urlKey = (e.url || '').toLowerCase();
            const host = (e.host || '').trim();
            const isRegExp = host.startsWith('/') && host.endsWith('/');
            
            let shouldAdd = false;
            if (isRegExp) {
                if (!seenRegs.has(host)) {
                    seenRegs.add(host);
                    shouldAdd = true;
                }
            } else if (urlKey && !seenUrls.has(urlKey)) {
                seenUrls.add(urlKey);
                shouldAdd = true;
            }

            if (shouldAdd) {
                let id = e.id || storage.getStableId(e.name, e.host);
                let finalId = id, suffix = 1;
                while (map.has(finalId)) {
                    finalId = id + '_' + (suffix++);
                }
                map.set(finalId, { ...e, id: finalId, visible: !(saved.hidden || []).includes(finalId) });
            }
        });

        let list = Array.from(map.values()).filter(e => !(saved.deleted || []).includes(e.id));
        if (saved.order && saved.order.length > 0) {
            const orderMap = new Map(saved.order.map((id, i) => [id, i]));
            list.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
        }
        storage.save(list, saved.deleted);
        return list;
    }

    let allEngines = initEngines().map(e => { const h = (e.host || '').trim(); if (h.startsWith('/') && h.endsWith('/')) { try { const p = h.slice(1, -1); e._matchFn = s => new RegExp(p, 'i').test(s); } catch(err) { e._matchFn = s => s.toLowerCase().includes(h.toLowerCase()); } } else { e._matchFn = s => s.toLowerCase().includes(h.toLowerCase()); } return e; });

    function showManager() {
        if (document.getElementById('qs-manager-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'qs-manager-overlay';
        const card = document.createElement('div');
        card.className = 'qs-card';
        card.innerHTML = `
            <div style="padding:28px 24px 20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:24px;font-weight:600;letter-spacing:-0.5px;">搜索设置</div>
                        <div style="font-size:14px;color:#49454f;margin-top:6px;opacity:0.8;">管理排序与引擎列表</div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <div id="m-ocd-btn" style="cursor:pointer;font-size:20px;padding:8px;background:rgba(var(--qs-pri-rgb),0.1);border-radius:12px;color:var(--qs-pri);">🧩</div>
                        <div id="m-theme-btn" style="cursor:pointer;font-size:20px;padding:8px;background:rgba(var(--qs-pri-rgb),0.1);border-radius:12px;color:var(--qs-pri);">🎨</div>
                    </div>
                </div>
                <div id="m-theme-panel" style="display:none;margin-top:16px;padding:16px;background:rgba(var(--qs-pri-rgb),0.05);border-radius:20px;border:1px solid rgba(var(--qs-pri-rgb),0.1);">
                   <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;justify-content:center;">${['#6750a4', '#1d1b20', '#0061a4', '#006d39', '#ba1a1a', '#ffb400'].map(c => `<div class="theme-dot" data-color="${c}" style="width:30px;height:30px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${theme.primary.toLowerCase()===c?'#fff':'transparent'};box-shadow:0 2px 5px rgba(0,0,0,0.1);"></div>`).join('')}</div>
                 <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;background:rgba(255,255,255,0.5);padding:8px;border-radius:12px;border:1px solid rgba(0,0,0,0.05);">
                     <div style="position:relative;width:36px;height:36px;overflow:hidden;border-radius:8px;border:1px solid rgba(0,0,0,0.1);"> <input type="color" id="t-custom-color" value="${theme.primary}" style="position:absolute;top:-5px;left:-5px;width:50px;height:50px;padding:0;border:none;cursor:pointer;background:none;"></div>
                     <input type="text" id="t-hex-input" value="${theme.primary}" placeholder="#HEX" style="flex:1;background:transparent;border:none;outline:none;font-size:14px;font-family:monospace;color:var(--qs-pri);font-weight:600;">
                     <span style="font-size:11px;opacity:0.5;font-weight:600;">HEX</span>
                 </div>
                 <div id="t-style-switch" style="cursor:pointer;margin-bottom:16px;padding:12px;background:var(--qs-pri);color:var(--qs-on-pri);border-radius:14px;text-align:center;font-weight:600;font-size:13px;box-shadow:0 4px 12px rgba(var(--qs-pri-rgb),0.2);">✨ 当前风格: ${theme.themeStyle || 'MIUIX'}</div>
                   <div style="font-size:12px;opacity:0.7;margin-bottom:4px;display:flex;justify-content:space-between;"> <span>透明度</span><span id="v-opacity">${Math.round(theme.opacity*100)}%</span> </div>
                    <input type="range" id="t-opacity" min="10" max="100" value="${theme.opacity*100}" style="width:100%;accent-color:var(--qs-pri);margin-bottom:12px;">
                      <div style="font-size:12px;opacity:0.7;margin-bottom:4px;display:flex;justify-content:space-between;"> <span>高斯模糊</span><span id="v-blur">${theme.blur}px</span> </div>
                    <input type="range" id="t-blur" min="0" max="50" value="${theme.blur}" style="width:100%;accent-color:var(--qs-pri);">   
                  <button id="t-reset" style="width:100%;margin-top:12px;padding:8px;border:none;background:none;color:var(--qs-pri);font-weight:600;font-size:12px;cursor:pointer;opacity:0.8;">恢复默认配色</button>
                </div>
                <div id="m-ocd-panel" style="display:none;margin-top:16px;padding:16px;background:rgba(var(--qs-pri-rgb),0.05);border-radius:20px;border:1px solid rgba(var(--qs-pri-rgb),0.1);font-size:13px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <span>布局位置</span>
                          <button id="l-pos-toggle" style="padding:6px 16px;border-radius:10px;border:none;background:var(--qs-pri);color:var(--qs-on-pri);font-weight:600;cursor:pointer;font-size:12px;min-width:60px;">
                            ${layout.pos === 'top' ? '↑靠上' : '靠下↓'}
                          </button>
                    </div>
                    <div style="margin-bottom:12px;">
                        <div style="display:flex;justify-content:space-between;opacity:0.7;margin-bottom:4px;">
                            <span>边距 (px)</span><span id="l-offset-val">${layout.offset}</span>
                        </div>
                        <input type="range" id="l-offset" min="0" max="200" value="${layout.offset}" style="width:100%;accent-color:var(--qs-pri);">
                    </div>
                    <div style="display:flex;gap:10px;margin-bottom:12px;">
                        <button id="l-hide" style="flex:1;padding:10px;border-radius:12px;border:none;background:${layout.autoHide?'var(--qs-pri)':'rgba(0,0,0,0.05)'};color:${layout.autoHide?'var(--qs-on-pri)':'#49454f'};font-weight:600;cursor:pointer;font-size:12px;">${layout.autoHide?'✅':'🚫'} 滑动隐藏</button>
                        <button id="l-input" style="flex:1;padding:10px;border-radius:12px;border:none;background:${layout.showInput?'var(--qs-pri)':'rgba(0,0,0,0.05)'};color:${layout.showInput?'var(--qs-on-pri)':'#49454f'};font-weight:600;cursor:pointer;font-size:12px;">${layout.showInput?'✅':'🚫'} 搜索框</button>
                    </div>
                    <button id="l-shrink" style="width:100%;margin-bottom:12px;padding:10px;border-radius:12px;border:none;background:${layout.shrinkMode?'var(--qs-pri)':'rgba(0,0,0,0.05)'};color:${layout.shrinkMode?'var(--qs-on-pri)':'#49454f'};font-weight:600;cursor:pointer;font-size:12px;">${layout.shrinkMode?'✅':'🚫'} 贴边收缩模式</button>
                    <div id="m-style-cycle" style="cursor:pointer;font-size:12px;padding:10px;background:var(--qs-pri);color:var(--qs-on-pri);border-radius:12px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(var(--qs-pri-rgb),0.2);">🔍搜索框样式 ${layout.inputStyle || 1}</div>
                </div>
            </div>
            <div id="m-list" style="flex:1;overflow-y:auto;padding:0 16px 12px;scrollbar-width:none;"></div>
            <div id="m-add-form" style="display:none;padding:24px;background:rgba(var(--qs-pri-rgb),0.06);margin:0 16px 16px;border-radius:24px;border:1px solid rgba(var(--qs-pri-rgb),0.1);">
                <input id="in-name" class="qs-input-field" placeholder="名称" style="margin-bottom:12px;">
                <input id="in-host" class="qs-input-field" placeholder="匹配域名 (bilibili.com)" style="margin-bottom:12px;">
                <input id="in-url" class="qs-input-field" placeholder="链接 (含 %s)" style="margin-bottom:16px;">
                <div style="display:flex;gap:12px;">
                    <button id="in-confirm" class="qs-btn qs-btn-active" style="flex:1;border-radius:12px;">添加</button>
                    <button id="in-cancel" class="qs-btn qs-btn-flat" style="flex:1;border-radius:12px;">取消</button>
                </div>
            </div>
            <div style="padding:16px 20px 24px;display:flex;gap:10px;align-items:center;border-top:1px solid rgba(0,0,0,0.05);">
                <button id="m-add-btn" class="qs-btn" style="height:48px;padding:0 20px;background:rgba(var(--qs-pri-rgb),0.35);color:var(--qs-on-pri);border-radius:16px;">+ 新增</button>
                <button id="m-reset-btn" class="qs-btn" style="height:48px;padding:0 16px;background:transparent;color:var(--qs-pri);border-radius:16px;">还原默认</button>
                <button id="m-close" class="qs-btn qs-btn-active" style="height:48px;margin-left:auto;padding:0 28px;border-radius:16px;">完成</button>
            </div>
        `;
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        const themeBtn = card.querySelector('#m-theme-btn'), themePanel = card.querySelector('#m-theme-panel');
        const ocdBtn = card.querySelector('#m-ocd-btn'), ocdPanel = card.querySelector('#m-ocd-panel');
        const hexInput = card.querySelector('#t-hex-input'), colorPicker = card.querySelector('#t-custom-color');
        const opacitySlider = card.querySelector('#t-opacity'), blurSlider = card.querySelector('#t-blur');
        const styleCycleBtn = card.querySelector('#m-style-cycle');
        const styleSwitch = card.querySelector('#t-style-switch');
        const updateAll = () => { storage.themeSave(theme); applyTheme(); };

        hexInput.oninput = (e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) { theme.primary = e.target.value; colorPicker.value = e.target.value; updateAll(); } };
        hexInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); hexInput.blur(); updateAll(); } };
        colorPicker.oninput = (e) => { theme.primary = e.target.value; hexInput.value = e.target.value; updateAll(); };
        opacitySlider.oninput = (e) => { theme.opacity = e.target.value / 100; card.querySelector('#v-opacity').innerText = e.target.value + '%'; updateAll(); };
        blurSlider.oninput = (e) => { theme.blur = e.target.value; card.querySelector('#v-blur').innerText = e.target.value + 'px'; updateAll(); };
        themeBtn.onclick = () => { themePanel.style.display = themePanel.style.display === 'none' ? 'block' : 'none'; ocdPanel.style.display = 'none'; };
        ocdBtn.onclick = () => { ocdPanel.style.display = ocdPanel.style.display === 'none' ? 'block' : 'none'; themePanel.style.display = 'none'; };
        styleCycleBtn.onclick = () => { layout.inputStyle = ((parseInt(layout.inputStyle) || 1) % 3) + 1; storage.layoutSave(layout); styleCycleBtn.innerText = `🔍搜索框样式 ${layout.inputStyle}`; styleCycleBtn.style.transform = 'scale(0.95)'; styleCycleBtn.style.transition = 'transform 0.1s'; setTimeout(() => { styleCycleBtn.style.transform = 'scale(1)'; }, 100); };
        styleSwitch.onclick = () => { theme.themeStyle = (theme.themeStyle === 'MIUIX' ? 'MD3' : 'MIUIX'); styleSwitch.innerText = `✨ 当前风格: ${theme.themeStyle}`; updateAll(); applyTheme(); styleSwitch.style.transform = 'scale(0.95)'; styleSwitch.style.transition = 'transform 0.2s'; setTimeout(() => styleSwitch.style.transform = 'scale(1)', 150); };

        card.querySelectorAll('.theme-dot').forEach(dot => { dot.onclick = () => { theme.primary = dot.dataset.color; hexInput.value = theme.primary; colorPicker.value = theme.primary; updateAll(); overlay.remove(); showManager(); }; });
        card.querySelector('#t-reset').onclick = () => { theme = {...defaultTheme}; updateAll(); overlay.remove(); showManager(); };
        card.querySelector('#l-pos-toggle').onclick = (e) => { layout.pos = layout.pos === 'top' ? 'bottom' : 'top'; storage.layoutSave(layout); e.target.innerText = layout.pos === 'top' ? '↑靠上' : '靠下↓'; };
        card.querySelector('#l-offset').oninput = (e) => { layout.offset = e.target.value; card.querySelector('#l-offset-val').innerText = layout.offset; storage.layoutSave(layout); };
        

        const updateLayoutBtn = (id, active, text) => {
            const btn = card.querySelector(id);
            btn.innerText = (active ? '✅' : '🚫') + text;
            btn.style.background = active ? 'var(--qs-pri)' : 'rgba(0,0,0,0.05)';
            btn.style.color = active ? 'var(--qs-on-pri)' : '#49454f';
        };
        card.querySelector('#l-input').onclick = () => { layout.showInput = !layout.showInput; storage.layoutSave(layout); updateLayoutBtn('#l-input', layout.showInput, ' 搜索框'); };
        card.querySelector('#l-hide').onclick = () => { layout.autoHide = !layout.autoHide; if (layout.autoHide) layout.shrinkMode = false; storage.layoutSave(layout); updateLayoutBtn('#l-hide', layout.autoHide, ' 滑动隐藏'); updateLayoutBtn('#l-shrink', layout.shrinkMode, ' 贴边收缩模式'); };
        card.querySelector('#l-shrink').onclick = () => { layout.shrinkMode = !layout.shrinkMode; if (layout.shrinkMode) layout.autoHide = false; storage.layoutSave(layout); updateLayoutBtn('#l-shrink', layout.shrinkMode, ' 贴边收缩模式'); updateLayoutBtn('#l-hide', layout.autoHide, ' 滑动隐藏'); };
     
        const render = () => {
            const list = card.querySelector('#m-list');
            list.innerHTML = '';
            allEngines.forEach((e, i) => {
                const container = document.createElement('div');
                container.className = 'se-item-container';
                container.innerHTML = `
                    <div class="se-item">
                        <div class="toggle-box ${e.visible ? 'active' : ''}"><div class="toggle-circle"></div></div>
                        <div style="flex:1;overflow:hidden;">
                            <div style="font-size:15px;font-weight:600;">${e.name}</div>
                            <div style="font-size:11px;opacity:0.6;">${e.host}</div>
                        </div>
                        <div style="display:flex;gap:2px;">
                            <button class="up btn-icon">↑</button>
                            <button class="down btn-icon">↓</button>
                            <button class="del btn-icon" style="color:#ba1a1a;">✕</button>
                        </div>
                    </div>
                    <div class="edit-form">
                        <input class="ed-name qs-input-field" value="${e.name}" style="padding:8px;margin-bottom:8px;border-radius:8px;">
                        <input class="ed-host qs-input-field" value="${e.host}" style="padding:8px;margin-bottom:8px;border-radius:8px;">
                        <input class="ed-url qs-input-field" value="${e.url}" style="padding:8px;margin-bottom:8px;border-radius:8px;">
                        <button class="ed-save qs-btn qs-btn-active" style="width:100%;padding:10px;border-radius:8px;">保存修改</button>
                    </div>
                `;
                container.querySelector('.se-item').onclick = (ev) => { if (!ev.target.closest('.btn-icon') && !ev.target.closest('.toggle-box')) container.querySelector('.edit-form').classList.toggle('open'); };
                container.querySelector('.toggle-box').onclick = () => { e.visible = !e.visible; storage.save(allEngines, saved.deleted); render(); };
                container.querySelector('.up').onclick = () => { if (i > 0) { [allEngines[i], allEngines[i - 1]] = [allEngines[i - 1], allEngines[i]]; storage.save(allEngines, saved.deleted); render(); } };
                container.querySelector('.down').onclick = () => { if (i < allEngines.length - 1) { [allEngines[i], allEngines[i + 1]] = [allEngines[i + 1], allEngines[i]]; storage.save(allEngines, saved.deleted); render(); } };
                container.querySelector('.del').onclick = () => { saved.deleted.push(e.id); allEngines.splice(i, 1); storage.save(allEngines, saved.deleted); render(); };
                container.querySelector('.ed-save').onclick = () => { const n = container.querySelector('.ed-name').value.trim(); const h = container.querySelector('.ed-host').value.trim(); const u = normalizeUrl(container.querySelector('.ed-url').value.trim()); if (n && h && u.includes('%s')) { const newId = (n === e.name && h === e.host) ? e.id : storage.getStableId(n, h); Object.assign(e, { name: n, host: h, url: u, id: newId }); storage.save(allEngines, saved.deleted); render(); } else { alert('请检查输入'); }};
                list.appendChild(container);
            });
        };

        const addForm = card.querySelector('#m-add-form'), inName = card.querySelector('#in-name'), inHost = card.querySelector('#in-host'), inUrl = card.querySelector('#in-url');
        inUrl.oninput = () => { try { const u = inUrl.value.trim(); if (!u) return; const d = new URL(u.startsWith('http') ? u : 'https://' + u).hostname.replace('www.', ''); const p = d.split('.'); if (!inHost.value) inHost.value = p.slice(-2).join('.'); if (!inName.value) { const r = p[0]; inName.value = r.charAt(0).toUpperCase() + r.slice(1); } } catch(e){} };
        card.querySelector('#m-add-btn').onclick = () => { addForm.style.display = 'block'; inName.value = inHost.value = inUrl.value = ''; };
        card.querySelector('#in-cancel').onclick = () => addForm.style.display = 'none';
        card.querySelector('#in-confirm').onclick=()=>{const u=normalizeUrl(inUrl.value);let n=inName.value.trim(),h=inHost.value.trim();if(!u.includes('%s'))return alert('URL必须包含%s');if(allEngines.some(e=>e.host===h&&e.name===n))return alert('已存在');const ne={name:n,host:h,url:u,id:storage.getStableId(n,h),visible:true};if(h.startsWith('/')&&h.endsWith('/')){try{const p=h.slice(1,-1);ne._matchFn=s=>new RegExp(p,'i').test(s)}catch(e){ne._matchFn=s=>s.toLowerCase().includes(h.toLowerCase())}}else{ne._matchFn=s=>s.toLowerCase().includes(h.toLowerCase())}allEngines.push(ne);saved.cache=null;storage.save(allEngines,saved.deleted);addForm.style.display='none';render()};
        card.querySelector('#m-reset-btn').onclick=()=>{if(confirm('确定还原？')){saved={custom:[],order:[],hidden:[],deleted:[]};allEngines=initEngines();storage.save(allEngines,[]);render()}};render();
        card.querySelector('#m-close').onclick=()=>{location.reload()};
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    const currentEngine = allEngines.filter(e => e.visible).find(e => e.host && e._matchFn(location.host.toLowerCase()));
    const isMatchedHost = !!currentEngine;

    const query = (() => {
        if (!isMatchedHost) return null;
        try {
            if (location.pathname === '/' && !location.search && !location.hash) return null;
            const url = new URL(location.href);
            // 1. 参数提取逻辑，读取自queryParams
            for (const p of queryParams) {
                const reg = new RegExp(`[?&]${p}=([^&]+)`, 'i');
                const match = (location.search + location.hash).match(reg);
                if (match && match[1]) {
                    return decodeURIComponent(match[1].replace(/\+/g, ' ')).trim();
                }
            }
            // 2. 路径提取逻辑 (分级过滤)
            // 长信号：可以稍微宽泛一点（允许结尾匹配）
            const longSignals = ['search', 'category', 'find', 'query', 'result', 'tags', 'tag'];
            // 短信号：必须严格匹配（必须前后都有斜杠，如 /s/ 或 /k/）
            const strictSignals = ['s', 'k', 'p'];
            const pathLower = url.pathname.toLowerCase();
            // 判定逻辑：
            // a. 包含任意长信号的层级（如 /search/ 或 /tag ）
            // b. 或者【严格匹配】短信号（必须是 /s/ 这种独立层级）
            const hasSearchSignal = 
                longSignals.some(sig => pathLower.includes('/' + sig + '/') || pathLower.endsWith('/' + sig)) ||
                strictSignals.some(sig => pathLower.includes('/' + sig + '/'));
            if (hasSearchSignal) {
                const pathParts = url.pathname.split('/').filter(p => p.length > 0);
                if (pathParts.length > 0) {
                    // 兼容处理：如果路径中包含信号词，优先取信号词后的第一段，否则取最后一段
                    const allSignals = [...longSignals, ...strictSignals];
                    const sigIdx = pathParts.findIndex(p => allSignals.includes(p.toLowerCase()));
                    let targetPart = (sigIdx !== -1 && pathParts[sigIdx + 1]) ? pathParts[sigIdx + 1] : pathParts[pathParts.length - 1];
                    // 提取最后一段并解码
                    let lastPart = decodeURIComponent(targetPart).trim();
                    // 核心修正：针对类似 /search/-keyword------------.html 的特殊路径进行清洗
                    // 移除末尾.html等后缀，并去掉首尾多余的横杠
                    lastPart = lastPart.replace(/\.(html|php|jsp|asp|htm)$/i, '').replace(/^-+|-+$/g, '');
                    if (lastPart.length >= 1 && 
                        !allSignals.includes(lastPart.toLowerCase()) && 
                        !/^\d+$/.test(lastPart) && 
                        !lastPart.includes('.')) {
                        return lastPart;
                    }
                }
            }
        } catch (e) {
            console.warn("关键词提取错误:", e);
        }
        return null;
    })();

    if (query && isMatchedHost) {
        applyTheme();
        requestAnimationFrame(() => {
            const bar = document.createElement('div');
            bar.className = 'qs-bar';
            bar.style[layout.pos === 'top' ? 'top' : 'bottom'] = `${layout.offset}px`;
            const getBestMatched = () => allEngines.filter(e => e.visible && e.host && e._matchFn(location.host.toLowerCase())).map(e => { let s = (e.host === location.host.toLowerCase() ? 1000 : (!e.host.includes('/') ? 500 : 0)), u; try { u = new URL(e.url); s += (u.pathname !== '/' && location.pathname.toLowerCase().includes(u.pathname.toLowerCase()) ? 200 : 0); u.searchParams.forEach(v => { const f = v.replace(/%s|%keywords%/g, '').trim().toLowerCase(); if (f) s += decodeURIComponent(location.href.toLowerCase()).includes(f) ? 600 : -800; }); } catch(e) {} return { e, s: s + (allEngines.length - allEngines.indexOf(e)) }; }).sort((a, b) => b.s - a.s)[0]?.e;
            const bestMatched = getBestMatched();
            const syncInputs = (val) => { bar.querySelectorAll('.qs-main-input').forEach(el => { if (el.value !== val) el.value = val; });};
            const doSearch = (targetEngine, keyword) => { let targetUrl = targetEngine.url; const isCur = targetEngine.host && targetEngine._matchFn(location.host.toLowerCase()); if (isCur) { try { const uObj = new URL(targetEngine.url); targetUrl = location.origin + uObj.pathname + uObj.search; } catch {} } location.href = targetUrl.replace(/%s/g, encodeURIComponent(keyword)).replace(/%keywords%/g, encodeURIComponent(keyword));};
            const curStyle = layout.inputStyle || 1;

            if (curStyle === 3 && layout.showInput) {
                const input = document.createElement('input');
                input.className = 'qs-main-input';
                input.value = query;
                input.placeholder = "搜索...";
                input.style.cssText = `width:80px;padding:8px 14px;border-radius:100px;background:rgba(var(--qs-pri-rgb),0.08);color:#1d1b20;flex-shrink:0;`;
                input.onfocus = () => { input.style.width = '130px'; input.style.background = 'rgba(var(--qs-pri-rgb),0.15)'; };
                input.onblur = () => { input.style.width = '80px'; input.style.background = 'rgba(var(--qs-pri-rgb),0.08)'; };
                input.oninput = (ev) => syncInputs(ev.target.value);
                input.onkeydown = (e) => {e.stopPropagation();if (e.key === 'Enter') doSearch(bestMatched || allEngines[0], input.value);};
                bar.appendChild(input);
            }

            allEngines.filter(e => e.visible).forEach(e => {
                const isBest = bestMatched && e.id === bestMatched.id;
                if (isBest && layout.showInput) {
                    if (curStyle === 1) {
                        const wrapper = document.createElement('div');
                        wrapper.style.cssText = `display:flex;align-items:center;background:var(--qs-pri);border-radius:100px;padding:3px;gap:4px;flex-shrink:0;`;
                        wrapper.setAttribute('data-active', 'true');
                        const input = document.createElement('input');
                        input.className = 'qs-main-input';
                        input.value = query;
                        input.style.cssText = `width:90px;padding:7px 12px;border-radius:100px;background:rgba(255,255,255,0.2);color:var(--qs-on-pri);`;
                        input.oninput = (ev) => syncInputs(ev.target.value);
                        input.onfocus = () => input.style.width = '140px';
                        input.onblur = () => input.style.width = '90px';
                        input.onkeydown = (ev) => {ev.stopPropagation(); if (ev.key === 'Enter') doSearch(e, input.value);};
                        const label = document.createElement('span');
                        label.textContent = e.name;
                        label.style.cssText = `padding:0 14px 0 8px;color:var(--qs-on-pri);font-size:14px;font-weight:600;white-space:nowrap;`;
                        wrapper.append(input, label);
                        bar.appendChild(wrapper);
                        return;
                    } else if (curStyle === 2) {
                        const input = document.createElement('input');
                        input.className = 'qs-main-input';
                        input.value = query;
                        input.style.cssText = `width:80px;padding:8px 14px;border-radius:100px;border:1.5px solid var(--qs-pri);background:rgba(var(--qs-pri-rgb),0.1);color:#1d1b20;flex-shrink:0;margin-right:2px;`;
                        input.oninput = (ev) => syncInputs(ev.target.value);
                        input.onfocus = () => input.style.width = '130px';
                        input.onblur = () => input.style.width = '80px';
                        input.onkeydown = (ev) => { ev.stopPropagation(); if (ev.key === 'Enter') doSearch(e, input.value);};
                        bar.appendChild(input);
                    }
                }

                const btn = document.createElement('a');
                btn.className = `qs-btn ${isBest ? 'qs-btn-active' : 'qs-btn-flat'}`;
                btn.textContent = e.name;
                btn.href = 'javascript:void(0);';
                if (isBest) btn.setAttribute('data-active', 'true');
                btn.onclick = (ev) => {
                    ev.preventDefault();
                    const currentVal = bar.querySelector('.qs-main-input')?.value || query;
                    doSearch(e, currentVal);
                };
                bar.appendChild(btn);
            });

            const setBtn = document.createElement('div');
            setBtn.innerHTML = '⚙️';
            setBtn.style.cssText = 'width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(0,0,0,0.04);border-radius:50%;flex-shrink:0;margin-left:4px;';
            setBtn.onclick = showManager;
            bar.append(setBtn);
            document.body.appendChild(bar);
 
            setTimeout(() => {
                const activeEl = bar.querySelector('[data-active="true"]');
                if (activeEl) bar.scrollLeft = activeEl.offsetLeft - (bar.offsetWidth / 2) + (activeEl.offsetWidth / 2);
            }, 100);

            if (layout.autoHide || layout.shrinkMode) {
                let lastY = window.scrollY, isShrunk = false;
                const applyState = (s) => { isShrunk = s; if (layout.shrinkMode) {
                    bar.style.cssText += `transition:all .4s cubic-bezier(0.4,0,0.2,1);max-width:${s?'120px':'92vw'};padding-right:${s?'12px':'8px'};transform:translateX(calc(-50% + ${s?'200px':'0px'}));border-radius:${s?'30px 0 0 30px':'var(--qs-radius)'};`;
                    Array.from(bar.children).forEach(item => { const isCore = item.classList.contains('qs-main-input') || item.classList.contains('qs-btn-active') || item.getAttribute('data-active') === 'true';
                        item.style.display = s ? (isCore ? '' : 'none') : (item.innerText === '⚙️' ? 'flex' : '');
                        if (item.classList.contains('qs-main-input') || item.tagName === 'INPUT') item.style.width = item.style.minWidth = s ? '70px' : ''; });
                    if (s) bar.scrollLeft = 0; else setTimeout(() => { const a = bar.querySelector('[data-active="true"]'); if (a) bar.scrollTo({left: a.offsetLeft - bar.offsetWidth/2 + a.offsetWidth/2, behavior: 'smooth'}); }, 400);
                } else { bar.style.transform = s ? `translateX(-50%) translateY(${layout.pos === 'bottom' ? '180%' : '-180%'})` : 'translateX(-50%) translateY(0)'; bar.style.opacity = s ? '0' : '1'; }};
                bar.onclick = (e) => { if (isShrunk && layout.shrinkMode) { applyState(false); e.stopPropagation(); }};
                window.addEventListener('scroll', () => { const curY = window.scrollY; if (Math.abs(curY - lastY) > 15) { applyState(curY > lastY && curY > 60); lastY = curY; } }, { passive: true });
            }
        });
    }
})();