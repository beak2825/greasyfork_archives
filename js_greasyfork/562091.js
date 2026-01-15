// ==UserScript==
// @name         Discuz! 论坛助手 (Discuz! Forum Assistant)
// @name:en      Discuz! Forum Assistant
// @namespace    http://tampermonkey.net/
// @version      10.8.1
// @description  Discuz! 论坛全能助手：智能抓取模式（Alt+键只抓作者前3页）、全量抓取模式（Ctrl+Alt+键抓所有）；一键提取图片（自动修复文件名/格式/并发下载）；沉浸式阅读；自定义下载路径。
// @description:en Discuz! Forum Assistant: Smart scraping (Alt+keys for author's first 3 pages), full scraping (Ctrl+Alt+keys); One-click image download (auto-fix filenames/extensions/concurrent); Immersive reading; Custom download path.
// @license      GPL-3.0
// @author       transwarp
// @match        *://*/*thread-*-*-*.html
// @match        *://*/*forum.php?*mod=viewthread*
// @icon         https://www.discuz.net/favicon.ico
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/562091/Discuz%21%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%28Discuz%21%20Forum%20Assistant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562091/Discuz%21%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%28Discuz%21%20Forum%20Assistant%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 基础配置
    var App = {
        key: 'gm_discuz_assistant_config',
        posKey: 'gm_discuz_assistant_pos',
        isRunning: false,
        isQuickMode: true,
        currentMode: '', // 'download', 'images', 'read'
        textData: [],
        imgData: [],
        meta: { tid: null, authorid: null, title: null, authorName: null, forumName: null },
        defaultConfig: {
            bgColor: '#f7f1e3', paperColor: '#fffef8', textColor: '#2d3436',
            fontSize: 18, fontWeight: 400, lineHeight: 1.8,
            fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
            widthMode: '860px', minLength: 0,
            // --- 命名配置 ---
            // 文本配置 (默认不创建文件夹，文件名仅帖子标题)
            tplTextFolder: '',
            tplTextFileName: '{{title}}',
            // 图片配置 (默认创建文件夹，使用帖子标题)
            tplImgFolder: '{{title}}',
            tplImgFileName: '{{index}}_{{floor}}_{{date}}'
        },
        userConfig: {}
    };

    // 配置加载与迁移
    App.userConfig = Object.assign({}, App.defaultConfig);
    var saved = localStorage.getItem(App.key);
    if (saved) {
        try {
            var parsed = JSON.parse(saved);
            if (parsed.tplText) { parsed.tplTextFileName = parsed.tplText; delete parsed.tplText; }
            App.userConfig = Object.assign(App.userConfig, parsed);
        } catch(e){}
    }

    // 2. 工具函数
    var Utils = {
        safeAddStyle: function(css) {
            if (typeof GM_addStyle !== 'undefined') { GM_addStyle(css); }
            else {
                var style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                (document.head || document.documentElement).appendChild(style);
            }
        },
        getQuery: function(url, variable) {
            var query = url.split('?')[1];
            if (!query) return null;
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] == variable) { return pair[1]; }
            }
            return null;
        },
        buildUrl: function(tid, page, authorid) {
            var baseUrl = window.location.origin + '/forum.php?mod=viewthread&tid=' + tid + '&page=' + page;
            if (authorid && authorid !== '0' && authorid !== 0) {
                baseUrl += '&authorid=' + authorid;
            }
            return baseUrl;
        },
        fetchDoc: function(url, callback, errCallback) {
            fetch(url).then(r => r.arrayBuffer()).then(buffer => {
                var decoder = new TextDecoder(document.characterSet || 'utf-8');
                var text = decoder.decode(buffer);
                if (text.indexOf('</html>') === -1 || (text.indexOf('发表于') === -1 && text.indexOf('div') !== -1)) {
                    text = new TextDecoder('gbk').decode(buffer);
                }
                callback(new DOMParser().parseFromString(text, "text/html"));
            }).catch(e => { if (errCallback) errCallback(e); });
        },
        sanitizeFilename: function(name) {
            return name.replace(/[\\:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim().substring(0, 200);
        },
        detectImageExtension: function(url) {
            var match = url.match(/\.(jpg|jpeg|png|gif|webp|bmp)/i);
            return match ? match[0].toLowerCase() : '.jpg';
        },
        // 修复：正确解析日期并补零 (2025-4-5 -> 20250405)
        extractDate: function(str) {
            var match = str.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (match) {
                var year = match[1];
                var month = match[2].padStart(2, '0');
                var day = match[3].padStart(2, '0');
                return year + month + day;
            }
            return '';
        },
        renderTemplate: function(tpl, data) {
            if (!tpl) return "";
            var res = tpl;
            for (var key in data) {
                var regex = new RegExp('{{' + key + '}}', 'g');
                var val = String(data[key] || '');
                if (key === 'url' || key === 'post_url') {
                    val = val.replace(/[:/]/g, '_');
                }
                res = res.replace(regex, val);
            }
            return Utils.sanitizeFilename(res);
        },
        getThreadTitle: function(doc) {
            var el = doc.getElementById('thread_subject');
            if (el) return el.innerText.trim();
            var h1 = doc.querySelector('h1.ts') || doc.querySelector('h1');
            if (h1) return h1.innerText.trim();
            return doc.title.split(' - ')[0].trim();
        }
    };

    // 3. 样式定义
    var Styles = {
        init: function() {
            var css = [
                '#gm-start-panel { position: fixed; top: 20%; right: 10px; z-index: 2147483647; display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.95); backdrop-filter: blur(5px); padding: 8px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); width: 130px; box-sizing: border-box; transition: opacity 0.3s; }',
                '.gm-drag-handle { padding: 4px; cursor: move; text-align: center; font-size: 10px; color: #999; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 5px; letter-spacing: 1px; user-select: none; }',
                '.gm-drag-handle:hover { color: #666; background: rgba(0,0,0,0.02); border-radius: 6px; }',
                '.gm-btn-main { padding: 10px 0; border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; font-family: system-ui, sans-serif; transition: all 0.2s; width: 100%; position: relative; }',
                '.gm-btn-main:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); filter: brightness(1.1); }',
                '.gm-shortcut-hint { font-size: 9px; opacity: 0.7; display: block; margin-top: 2px; font-weight: normal; font-family: monospace; }',
                '.gm-split-group { display: flex; width: 100%; gap: 1px; }',
                '.gm-btn-split-l { flex: 1; border-radius: 8px 0 0 8px; background-color: #9b59b6; color: white; border: none; padding: 10px 0; cursor: pointer; font-size: 14px; font-weight: 600; text-align: center; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; flex-direction: column; }',
                '.gm-btn-split-l:hover { filter: brightness(1.1); }',
                '.gm-btn-split-r { width: 40px; border-radius: 0 8px 8px 0; background-color: #8e44ad; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; position: relative; z-index: 2147483648; flex-shrink: 0; pointer-events: auto !important; }',
                '.gm-btn-split-r:active { transform: scale(0.95); }',
                '.gm-btn-split-r:hover { filter: brightness(1.1); }',
                // 配置面板样式
                '#gm-folder-popup { position: fixed; width: 240px; background: #ffffff; border-radius: 8px; padding: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.25); display: none; font-family: system-ui, sans-serif; border: 1px solid #eee; z-index: 2147483651; box-sizing: border-box; text-align: left; }',
                '.gm-popup-title { font-size: 12px; font-weight: bold; color: #555; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }',
                '.gm-popup-subtitle { font-size: 11px; font-weight: bold; color: #666; margin-top: 8px; margin-bottom: 4px; padding-left: 2px; border-left: 3px solid #8e44ad; }',
                '.gm-input-group { margin-bottom: 6px; }',
                '.gm-input-label { display: block; font-size: 10px; color: #888; margin-bottom: 2px; }',
                '.gm-popup-input { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 11px; color: #333; }',
                '.gm-popup-input:focus { border-color: #a29bfe; outline: none; }',
                '.gm-popup-hint { font-size: 9px; color: #e74c3c; margin-top: 2px; display: block; line-height: 1.2; }',
                '.gm-tags-container-small { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #eee; }',
                '.gm-tag-small { background: #f1f3f5; color: #555; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer; border: 1px solid #e9ecef; }',
                '.gm-tag-small:hover { background: #e9ecef; color: #333; border-color: #ced4da; }',
                '#gm-progress-container { width: 100%; height: 6px; background: #e9ecef; border-radius: 3px; overflow: hidden; margin-top: 5px; display: none; }',
                '#gm-progress-bar { width: 0%; height: 100%; background: #2ecc71; transition: width 0.2s ease; }',
                '.gm-toast { position: fixed; top: 80px; left: 50%; transform: translateX(-50%) translateY(-20px); background: rgba(33, 37, 41, 0.95); backdrop-filter: blur(8px); color: #fff; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 2147483650; transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); opacity: 0; pointer-events: none; font-family: system-ui, sans-serif; display: flex; align-items: center; gap: 8px; }',
                '.gm-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }',
                '#gm-reader-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: var(--bg-color); color: var(--text-color); z-index: 2147483640; font-family: var(--font-family); overflow: hidden; outline: none; line-height: 1.5; }',
                '#gm-reader-scroll-box { position: relative; z-index: 2147483641; width: 100%; height: 100%; box-sizing: border-box; display: block; overflow-y: auto; padding: 40px 0 120px 0; scroll-behavior: smooth; }',
                '.gm-content-wrapper { width: var(--content-width); max-width: 95vw; margin: 0 auto; padding: 60px 80px; box-sizing: border-box; background-color: var(--paper-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border-radius: 8px; min-height: calc(100vh - 100px); }',
                '@media (max-width: 768px) { .gm-content-wrapper { padding: 30px 20px; width: 100% !important; border-radius: 0; box-shadow: none; } }',
                '#gm-fab-menu { position: fixed; bottom: 40px; right: 40px; width: 50px; height: 50px; border-radius: 25px; background: rgba(33, 37, 41, 0.9); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; z-index: 2147483648; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,0.3); transition: all 0.3s; backdrop-filter: blur(4px); }',
                '#gm-fab-menu:hover { transform: scale(1.1) rotate(90deg); background: #000; }',
                '#gm-reader-toolbar { position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: rgba(255,255,255,0.95); color: #333; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; transform: translateY(-100%); transition: transform 0.3s ease; z-index: 2147483649; backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); }',
                '#gm-reader-toolbar.visible { transform: translateY(0); }',
                '.gm-tool-btn { background: transparent; border: 1px solid #e9ecef; color: #495057; padding: 6px 14px; border-radius: 8px; margin-left: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }',
                '.gm-tool-btn:hover { background: #f8f9fa; border-color: #dee2e6; color: #212529; }',
                '#gm-btn-exit { color: #e03131; border-color: #ffe3e3; }',
                '#gm-btn-exit:hover { background: #fff5f5; border-color: #ffc9c9; }',
                '#gm-reader-toc, #gm-reader-settings { position: fixed; background: rgba(255,255,255,0.95); color: #333; z-index: 2147483649; transition: transform 0.3s; backdrop-filter: blur(12px); }',
                '#gm-reader-toc { top: 0; left: 0; bottom: 0; width: 300px; transform: translateX(-100%); display: flex; flex-direction: column; border-right: 1px solid rgba(0,0,0,0.05); }',
                '#gm-reader-toc.visible { transform: translateX(0); }',
                '.gm-toc-header { padding: 20px; font-weight: 700; font-size: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); }',
                '.gm-toc-item { padding: 12px 20px; font-size: 14px; border-bottom: 1px solid rgba(0,0,0,0.02); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; color: #495057; transition: all 0.2s; }',
                '.gm-toc-item:hover { background: rgba(0,0,0,0.03); padding-left: 24px; color: #228be6; }',
                '#gm-reader-settings { bottom: 0; left: 0; width: 100%; transform: translateY(100%); padding: 30px; box-sizing: border-box; max-height: 70vh; overflow-y: auto; border-radius: 20px 20px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.1); }',
                '#gm-reader-settings.visible { transform: translateY(0); }',
                '.gm-set-row { display: flex; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }',
                '.gm-set-label { width: 70px; font-size: 14px; color: #868e96; font-weight: 600; }',
                '.gm-set-ctrl { flex: 1; display: flex; gap: 12px; align-items: center; min-width: 200px; }',
                '.gm-set-ctrl select, .gm-set-ctrl input[type=text] { width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 8px; background: #fff; font-size: 14px; outline: none; }',
                '.gm-theme-btn { flex: 1; padding: 10px; border: 1px solid #dee2e6; background: #fff; border-radius: 8px; cursor: pointer; color: #495057; font-size: 13px; font-weight: 500; }',
                '.gm-theme-btn.active { background: #e7f5ff; border-color: #228be6; color: #1971c2; }',
                '.gm-post-item { margin-bottom: 60px; }',
                '.gm-post-meta { font-size: 12px; color: #adb5bd; margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px; font-family: system-ui, sans-serif; }',
                '.gm-post-text { font-size: var(--font-size) !important; font-weight: var(--font-weight) !important; line-height: var(--line-height) !important; font-family: var(--font-family) !important; text-align: justify; white-space: pre-wrap; word-break: break-all; letter-spacing: 0.03em; }'
            ];
            Utils.safeAddStyle(css.join('\n'));
        }
    };

    // 4. Reader 对象
    var Reader = {
        open: function() {
            var html = this.buildHTML();
            var overlay = document.createElement('div');
            overlay.id = 'gm-reader-overlay';
            overlay.innerHTML = html;
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            this.fillContent();
            this.bindEvents();
            this.applyConfig();
            Keyboard.enableReader();
        },
        buildHTML: function() {
            var title = App.meta.title || '阅读模式';
            var fonts = [ { name: "微软雅黑", val: "'Microsoft YaHei', 'PingFang SC', sans-serif" }, { name: "宋体", val: "'SimSun', serif" }, { name: "楷体", val: "'KaiTi', serif" }, { name: "系统默认", val: "sans-serif" } ];
            var fontOpts = fonts.map(function(f) { return '<option value="' + f.val + '">' + f.name + '</option>'; }).join('');
            return [
                '<div id="gm-reader-scroll-box"><div class="gm-content-wrapper" id="gm-content-area"></div></div>',
                '<div id="gm-fab-menu">☰</div>',
                '<div id="gm-reader-toolbar">',
                '   <span class="gm-toolbar-title" style="max-width:60%;overflow:hidden;white-space:nowrap;font-size:16px;font-weight:600;">' + title + '</span>',
                '   <div style="display:flex;align-items:center;">',
                '       <button class="gm-tool-btn" id="gm-btn-toc">📑 目录</button>',
                '       <button class="gm-tool-btn" id="gm-btn-set">⚙️ 设置</button>',
                '       <button class="gm-tool-btn" id="gm-btn-exit">❌ 关闭</button>',
                '   </div>',
                '</div>',
                '<div id="gm-reader-toc"><div class="gm-toc-header">目录</div><div id="gm-toc-list" style="flex:1;overflow-y:auto;"></div></div>',
                '<div id="gm-reader-settings">',
                '   <div class="gm-set-row"><span class="gm-set-label">配色</span><div class="gm-set-ctrl"><button class="gm-theme-btn" id="btn-warm">📖 羊皮</button><button class="gm-theme-btn" id="btn-night">🌙 极夜</button></div></div>',
                '   <div class="gm-set-row"><span class="gm-set-label">字体</span><div class="gm-set-ctrl"><select id="inp-font">' + fontOpts + '</select></div></div>',
                '   <div class="gm-set-row"><span class="gm-set-label">字号</span><div class="gm-set-ctrl"><input type="range" id="inp-size" min="14" max="32" step="1"></div></div>',
                '   <div class="gm-set-row"><span class="gm-set-label">行距</span><div class="gm-set-ctrl"><input type="range" id="inp-line" min="1.4" max="2.4" step="0.1"></div></div>',
                '   <div class="gm-set-row"><span class="gm-set-label">宽度</span><div class="gm-set-ctrl"><select id="inp-width"><option value="600px">窄版</option><option value="860px">舒适</option><option value="1000px">宽屏</option><option value="90%">全幅</option></select></div></div>',
                '</div>'
            ].join('');
        },
        fillContent: function() {
            var cFrag = document.createDocumentFragment();
            var tFrag = document.createDocumentFragment();
            App.textData.forEach(function(post, idx) {
                var pid = 'gm-post-' + idx;
                var div = document.createElement('div');
                div.className = 'gm-post-item'; div.id = pid;
                div.innerHTML = '<div class="gm-post-meta">[' + post.floor + '楼]</div><div class="gm-post-text">' + post.text + '</div>';
                cFrag.appendChild(div);
                var item = document.createElement('div');
                item.className = 'gm-toc-item'; item.innerText = post.floor + ' - ' + post.title;
                item.onclick = function() { Reader.scrollTo(pid); };
                tFrag.appendChild(item);
            });
            document.getElementById('gm-content-area').appendChild(cFrag);
            document.getElementById('gm-toc-list').appendChild(tFrag);
        },
        scrollTo: function(pid) {
            document.querySelectorAll('.visible').forEach(function(e){e.classList.remove('visible');});
            var el = document.getElementById(pid);
            if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
        },
        applyConfig: function() {
            var ov = document.getElementById('gm-reader-overlay');
            if (!ov) return;
            var c = App.userConfig;
            ov.style.setProperty('--bg-color', c.bgColor);
            ov.style.setProperty('--paper-color', c.paperColor);
            ov.style.setProperty('--text-color', c.textColor);
            ov.style.setProperty('--font-size', c.fontSize + 'px');
            ov.style.setProperty('--font-weight', c.fontWeight);
            ov.style.setProperty('--line-height', c.lineHeight);
            ov.style.setProperty('--font-family', c.fontFamily);
            ov.style.setProperty('--content-width', c.widthMode);
            var setVal = function(id, v) { var e=document.getElementById(id); if(e) e.value=v; };
            setVal('inp-size', c.fontSize); setVal('inp-line', c.lineHeight); setVal('inp-width', c.widthMode); setVal('inp-font', c.fontFamily);
        },
        save: function() { localStorage.setItem(App.key, JSON.stringify(App.userConfig)); this.applyConfig(); },
        close: function() {
            var ov = document.getElementById('gm-reader-overlay');
            if (ov) ov.remove();
            document.body.style.overflow = '';
            Keyboard.disableReader();
            UI.showPanel();
        },
        bindEvents: function() {
            document.getElementById('gm-btn-exit').onclick = this.close;
            var toggle = function(id) {
                var el = document.getElementById(id);
                var showing = !el.classList.contains('visible');
                document.querySelectorAll('.visible').forEach(function(e){e.classList.remove('visible');});
                if(showing) el.classList.add('visible');
            };
            document.getElementById('gm-btn-toc').onclick = function() { toggle('gm-reader-toc'); };
            document.getElementById('gm-btn-set').onclick = function() { toggle('gm-reader-settings'); };
            document.getElementById('gm-fab-menu').onclick = function() { toggle('gm-reader-toolbar'); };
            document.getElementById('gm-content-area').onclick = function() { document.querySelectorAll('.visible').forEach(function(e){e.classList.remove('visible');}); };
            var bind = function(id, k) {
                var el = document.getElementById(id);
                el.onchange = function(e){ App.userConfig[k]=e.target.value; Reader.save(); };
                el.oninput = function(e){ App.userConfig[k]=e.target.value; Reader.applyConfig(); };
            };
            bind('inp-size', 'fontSize'); bind('inp-line', 'lineHeight'); bind('inp-width', 'widthMode'); bind('inp-font', 'fontFamily');
            document.getElementById('btn-night').onclick = function() { App.userConfig.bgColor='#1a1a1a'; App.userConfig.paperColor='#2c2c2c'; App.userConfig.textColor='#a0a0a0'; Reader.save(); };
            document.getElementById('btn-warm').onclick = function() { App.userConfig.bgColor='#f7f1e3'; App.userConfig.paperColor='#fffef8'; App.userConfig.textColor='#2d3436'; Reader.save(); };
        }
    };

    // 5. 抓取逻辑
    var Scraper = {
        init: function(mode, isQuick) {
            if (App.isRunning) return;
            App.currentMode = mode;
            App.isQuickMode = isQuick;

            UI.resetButtons();

            App.meta.forumName = window.location.hostname;
            var titleParts = document.title.split('-');
            if(titleParts.length > 1) { App.meta.forumName = titleParts[titleParts.length-1].trim(); }

            var tid = Utils.getQuery(window.location.href, 'tid');
            if (!tid) {
                var match = window.location.href.match(/thread-(\d+)-/);
                if (match) tid = match[1];
            }
            if (!tid) { alert('无法识别当前帖子TID'); return; }
            App.meta.tid = tid;

            var authorid = Utils.getQuery(window.location.href, 'authorid');
            if (!authorid) {
                var firstPost = document.querySelector('div[id^="post_"]');
                if (firstPost) {
                    var link = firstPost.querySelector('a[href*="authorid"]');
                    if (link) authorid = Utils.getQuery(link.href, 'authorid');
                    else if (firstPost.innerText.indexOf('匿名') !== -1) authorid = '0';
                    var authNameEl = firstPost.querySelector('.authi .xw1') || firstPost.querySelector('.pi a');
                    if (authNameEl) App.meta.authorName = authNameEl.innerText.trim();
                }
            }

            var currPage = Utils.getQuery(window.location.href, 'page') || '1';
            var needPrefetch = (currPage !== '1' && (!authorid || !document.title));

            if (needPrefetch) {
                UI.updateStatus('预取...', '#9b59b6');
                var page1Url = Utils.buildUrl(tid, 1, null);
                Utils.fetchDoc(page1Url, function(doc) {
                    // 尝试获取纯净标题
                    App.meta.title = Utils.getThreadTitle(doc);
                    
                    var realAuthorId = null;
                    var fp = doc.querySelector('div[id^="post_"]');
                    if (fp) {
                        var l = fp.querySelector('a[href*="authorid"]');
                        if (l) {
                            realAuthorId = Utils.getQuery(l.href, 'authorid') || Utils.getQuery(l.href, 'uid');
                        } else if (fp.innerText.indexOf('匿名') !== -1) {
                            realAuthorId = '0';
                        }
                        var an = fp.querySelector('.authi .xw1') || fp.querySelector('.pi a');
                        if (an) App.meta.authorName = an.innerText.trim();
                    }
                    App.meta.authorid = realAuthorId || authorid;
                    Scraper.setupAndStart();
                }, function() { Scraper.setupAndStart(); });
            } else {
                // 当前页面获取标题
                App.meta.title = Utils.getThreadTitle(document);
                App.meta.authorid = authorid;
                Scraper.setupAndStart();
            }
        },

        setupAndStart: function() {
            if (!App.meta.authorid) {
                var input = prompt("未自动识别到作者ID，请输入 (0代表全部/匿名):", "0");
                if (input === null) return;
                App.meta.authorid = input;
            }
            if ((App.currentMode === 'read' || App.currentMode === 'download') && App.meta.authorid === '0') {
                var len = prompt("匿名模式：请输入最小字数过滤 (建议200，0不过滤):", "200");
                App.userConfig.minLength = parseInt(len) || 0;
            } else {
                App.userConfig.minLength = 0;
            }
            App.isRunning = true;
            App.textData = [];
            App.imgData = [];
            App.stats = { kept: 0, filtered: 0 };
            Scraper.loopPage(1);
        },

        loopPage: function(page) {
            UI.updateStatus('P ' + page, '#e67e22');
            var url = Utils.buildUrl(App.meta.tid, page, App.meta.authorid);
            Utils.fetchDoc(url, function(doc) {
                if (App.currentMode === 'images') {
                    var imgs = Scraper.parseImages(doc);
                    if (imgs.length > 0) App.imgData = App.imgData.concat(imgs);
                } else {
                    var posts = Scraper.parsePosts(doc);
                    if (posts.length > 0) App.textData = App.textData.concat(posts);
                }

                if (App.isQuickMode && App.meta.authorid && App.meta.authorid !== '0' && page >= 3) {
                     Scraper.finish();
                     return;
                }

                var nextBtn = doc.querySelector('.pg .nxt') || doc.querySelector('#pgt .nxt');
                if (nextBtn) {
                    setTimeout(function() { Scraper.loopPage(page + 1); }, 600);
                } else {
                    Scraper.finish();
                }
            }, function(err) {
                App.isRunning = false;
                alert('抓取中断: ' + err);
            });
        },

        parsePosts: function(doc) {
            var results = [];
            var postDivs = doc.querySelectorAll('div[id^="post_"]');
            for (var i = 0; i < postDivs.length; i++) {
                var div = postDivs[i];
                if (div.innerText.length < 10) continue;
                var floor = "?";
                var floorEm = div.querySelector('.pi strong a') || div.querySelector('.pi a em');
                if (floorEm) floor = floorEm.innerText.trim();
                var contentDiv = div.querySelector('.t_f') || div.querySelector('.pcb') || div.querySelector('.message');
                if (contentDiv) {
                    var temp = contentDiv.cloneNode(true);
                    var garbage = temp.querySelectorAll('script, style, .jammer, .y, .pstatus, .tip, div.quote, .a_pr');
                    for (var j = 0; j < garbage.length; j++) garbage[j].remove();
                    temp.innerHTML = temp.innerHTML.replace(/<br\s*\/?>/gi, "##BR##");
                    var text = temp.innerText.replace(/##BR##/g, "\n").replace(/\n\s*\n/g, "\n").replace(/发表于 \d{4}.*?\n/g, "");
                    text = text.trim();
                    if (text.length >= App.userConfig.minLength) {
                        var firstLine = text.split('\n')[0];
                        var titleStr = firstLine.length > 25 ? firstLine.substring(0, 25) + "..." : firstLine;
                        results.push({ floor: floor, title: titleStr, text: text });
                        App.stats.kept++;
                    }
                }
            }
            return results;
        },

        parseImages: function(doc) {
            var images = [];
            var postDivs = doc.querySelectorAll('div[id^="post_"]');
            postDivs.forEach(function(div) {
                var floor = "?";
                var floorEm = div.querySelector('.pi strong a') || div.querySelector('.pi a em');
                if (floorEm) {
                    var txt = floorEm.innerText.trim();
                    var num = txt.match(/\d+/);
                    floor = num ? num[0] : txt;
                }

                var date = "";
                var authi = div.querySelector('.authi em');
                if (authi) { date = Utils.extractDate(authi.innerText); }

                var imgs = div.querySelectorAll('.t_f img, .savephotop img, .mbn img, img[zoomfile], img[file]');
                
                imgs.forEach(function(img) {
                    var src = img.getAttribute('zoomfile') || img.getAttribute('file') || img.src;
                    if (!src) return;
                    if (src.indexOf('http') !== 0) { src = window.location.origin + '/' + src; }
                    
                    var lowSrc = src.toLowerCase();
                    if (lowSrc.includes('smilies/') || 
                        lowSrc.includes('common/back.gif') || 
                        lowSrc.includes('common/none.gif') || 
                        lowSrc.includes('static/image') ||
                        lowSrc.includes('avatar.php') ||  
                        lowSrc.includes('uc_server') ||
                        lowSrc.includes('uid=') ||
                        lowSrc.includes('/avatar/') || 
                        lowSrc.includes('sign') ||      
                        lowSrc.includes('icon') ||      
                        lowSrc.includes('btn') ||
                        lowSrc.includes('nophoto'))     
                    {
                        return;
                    }

                    if (img.className && img.className.indexOf('vm') !== -1) return;
                    
                    images.push({ url: src, floor: floor, date: date });
                });
            });
            return images;
        },

        getTemplateData: function() {
            var today = new Date();
            var dateStr = today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');
            return {
                forum_name: App.meta.forumName || 'Discuz',
                title: App.meta.title || '无标题',
                html_title: document.title, // 新增网页标题
                author: App.meta.authorName || App.meta.authorid || '匿名',
                post_url: window.location.href,
                url: window.location.href,
                tid: App.meta.tid,
                date: dateStr // 默认日期为下载日期
            };
        },

        doDownloadImages: function() {
            var uniqueItems = [];
            var seenUrls = new Set();
            App.imgData.forEach(function(item) {
                if (!seenUrls.has(item.url)) {
                    seenUrls.add(item.url);
                    uniqueItems.push(item);
                }
            });

            // 1. 获取全局数据
            var globalData = Scraper.getTemplateData();
            // 2. 渲染文件夹名称 (支持空目录)
            var folderTpl = App.userConfig.tplImgFolder || '';
            var folderName = Utils.renderTemplate(folderTpl, globalData);

            UI.showToast("🚀 目录: " + (folderName || "根目录") + "\n准备下载 " + uniqueItems.length + " 张图片...");

            if (typeof GM_download === 'undefined') {
                alert('错误：您的脚本管理器不支持 GM_download 接口，无法下载。');
                return;
            }

            var count = 0;
            UI.showProgress();
            UI.updateStatus('下载中...', '#2980b9');

            var maxConcurrency = 5;
            var activeDownloads = 0;
            var queue = uniqueItems.map((item, index) => ({ item, index }));
            var total = queue.length;
            var finished = 0;
            var successCount = 0;
            var fallbackTriggered = false; // 是否触发了降级

            var checkFinish = function() {
                activeDownloads--;
                finished++;
                UI.updateProgress(finished, total);
                
                if (finished === total) {
                    var skipped = total - successCount;
                    var msg = '完成! (存' + successCount + (skipped > 0 ? '/跳' + skipped : '') + ')';
                    UI.updateStatus(msg, '#27ae60');
                    setTimeout(function() {
                        UI.hideProgress();
                        UI.resetButtons();
                    }, 3000);
                } else {
                    processQueue();
                }
            };

            var downloadItem = function(itemData) {
                var item = itemData.item;
                var index = itemData.index;

                // 3. 准备单张图片的数据
                var idxStr = String(index + 1).padStart(3, '0');
                // 修复楼层显示：如果楼层仅为数字，添加“楼”字
                var floorStr = item.floor || '0';
                if (/^\d+$/.test(floorStr)) { floorStr += '楼'; }

                var itemDataForTpl = Object.assign({}, globalData, {
                    index: idxStr,
                    floor: floorStr,
                    date: item.date || globalData.date 
                });

                // 4. 渲染文件名
                var fileTpl = App.userConfig.tplImgFileName || '{{index}}_{{floor}}_{{date}}';
                var baseName = Utils.renderTemplate(fileTpl, itemDataForTpl);

                var attemptDownload = function(retryCount, forceNoFolder) {
                    var hasGMXHR = (typeof GM_xmlhttpRequest !== 'undefined');
                    var isDirectDL = !hasGMXHR;
                    
                    // 确定最终路径：如果 forceNoFolder 为真或配置为空，则不带目录
                    var currentFolder = (forceNoFolder || !folderName) ? '' : folderName;

                    if (hasGMXHR) {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: item.url,
                            responseType: 'blob',
                            headers: {
                                'Referer': window.location.href,
                                'X-Requested-With': 'XMLHttpRequest',
                                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                            },
                            onload: function(response) {
                                if (response.status !== 200) { 
                                    checkFinish();
                                    return; 
                                }
                                var blob = response.response;
                                if (blob.size < 10240) { 
                                    var reader = new FileReader();
                                    reader.onload = function() {
                                        var text = reader.result;
                                        if (text && (text.includes('<!DOCTYPE html>') || text.includes('<html>'))) {
                                            checkFinish(); 
                                        } else {
                                            saveBlob(blob, currentFolder);
                                        }
                                    };
                                    reader.onerror = function() { saveBlob(blob, currentFolder); };
                                    reader.readAsText(blob);
                                    return;
                                }
                                saveBlob(blob, currentFolder);
                            },
                            onerror: function(e) { handleError('Network Error'); }
                        });
                    } else {
                        // 回退方案
                        var ext = Utils.detectImageExtension(item.url);
                        var filename = currentFolder ? (currentFolder + '/' + baseName + ext) : (baseName + ext);
                        GM_download({
                            url: item.url,
                            name: filename,
                            saveAs: false,
                            onerror: function(e) { handleGMError(e, true); }, // 标记为直接下载
                            onload: function() { successCount++; checkFinish(); }
                        });
                    }

                    function saveBlob(blob, folder) {
                        var newBlob = new Blob([blob], { type: "image/jpeg" });
                        var blobUrl = URL.createObjectURL(newBlob);
                        var filename = folder ? (folder + '/' + baseName + '.jpg') : (baseName + '.jpg');
                        GM_download({
                            url: blobUrl,
                            name: filename,
                            saveAs: false,
                            onerror: function(e) { handleGMError(e, false); },
                            onload: function() { 
                                setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 1000); 
                                successCount++;
                                checkFinish(); 
                            }
                        });
                    }

                    // 专门处理 GM_download 错误（主要是目录创建失败）
                    function handleGMError(err, isDirect) {
                        console.warn('GM_download Error:', err);
                        // 如果有目录且还没降级过，尝试降级
                        if (folderName && !fallbackTriggered) {
                            fallbackTriggered = true;
                            UI.showToast("⚠️ 无法创建目录，自动回落到根目录");
                            // 自动清空配置
                            App.userConfig.tplImgFolder = "";
                            localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                            // 更新输入框显示（如果面板开着）
                            var inp = document.getElementById('inp-tpl-img-folder');
                            if(inp) inp.value = "";
                            
                            // 重试当前下载（无目录）
                            attemptDownload(retryCount, true);
                        } else if (retryCount > 0) {
                            setTimeout(function() { attemptDownload(retryCount - 1, forceNoFolder); }, 1500);
                        } else {
                            checkFinish();
                        }
                    }

                    function handleError(err) {
                        if (retryCount > 0) {
                            setTimeout(function() { attemptDownload(retryCount - 1, forceNoFolder); }, 1500);
                        } else {
                            checkFinish();
                        }
                    }
                };

                attemptDownload(3, false);
            };

            var processQueue = function() {
                while (activeDownloads < maxConcurrency && queue.length > 0) {
                    var nextTask = queue.shift();
                    activeDownloads++;
                    downloadItem(nextTask);
                }
            };

            processQueue();
        },

        doDownloadText: function() {
            var content = "=== " + App.meta.title + " ===\nUID: " + App.meta.authorid + "\n\n";
            content += App.textData.map(function(p) { return "### " + p.floor + "楼 " + p.title + "\n\n" + p.text; }).join('\n\n' + '-'.repeat(30) + '\n\n');
            var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            
            // 1. 获取全局数据
            var data = Scraper.getTemplateData();
            // 2. 渲染文件夹 (支持空目录)
            var folderTpl = App.userConfig.tplTextFolder || '';
            var folderName = Utils.renderTemplate(folderTpl, data);
            
            // 3. 渲染文件名
            var template = App.userConfig.tplTextFileName || '{{title}}';
            var fileNameOnly = Utils.renderTemplate(template, data) + '.txt';
            
            // 4. 组合路径
            var fullPath = folderName ? (folderName + '/' + fileNameOnly) : fileNameOnly;
            
            if (typeof GM_download !== 'undefined') {
                GM_download({
                    url: a.href,
                    name: fullPath,
                    saveAs: false,
                    onload: function() {
                        finishTextDownload();
                    },
                    onerror: function(err) {
                        console.warn('Text DL Error:', err);
                        // 失败回落：自动清空配置并使用简单下载
                        if (folderName) {
                            UI.showToast("⚠️ 无法创建文本目录，回落到根目录");
                            App.userConfig.tplTextFolder = "";
                            localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                             var inp = document.getElementById('inp-tpl-text-folder');
                            if(inp) inp.value = "";
                        }
                        // 使用 <a> 标签下载到默认位置
                        a.download = fileNameOnly;
                        document.body.appendChild(a); a.click();
                        document.body.removeChild(a);
                        finishTextDownload();
                    }
                });
            } else {
                // 不支持 GM_download，直接用 a 标签（不支持目录）
                a.download = fileNameOnly;
                document.body.appendChild(a); a.click();
                document.body.removeChild(a);
                finishTextDownload();
            }

            function finishTextDownload() {
                setTimeout(function() { URL.revokeObjectURL(a.href); }, 1000);
                UI.updateStatus('完成', '#27ae60');
                setTimeout(function() { UI.resetButtons(); }, 2000);
            }
        },

        finish: function() {
            App.isRunning = false;
            if (App.currentMode === 'images') {
                if (App.imgData.length === 0) { 
                    alert('未找到图片'); 
                    UI.resetButtons();
                    return; 
                }
                Scraper.doDownloadImages();
            } else {
                if (App.textData.length === 0) { 
                    alert('未找到内容'); 
                    UI.resetButtons();
                    return; 
                }
                if (App.currentMode === 'download') Scraper.doDownloadText();
                else { Reader.open(); UI.hidePanel(); }
            }
        }
    };

    var Keyboard = {
        globalHandler: function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            var isImages = (e.key === 'i' || e.key === 'I');
            var isDownload = (e.key === 'd' || e.key === 'D');
            var isRead = (e.key === 'r' || e.key === 'R');
            if (!isImages && !isDownload && !isRead) return;

            if (e.altKey && !e.ctrlKey) {
                e.preventDefault();
                if(isImages) Scraper.init('images', true);
                if(isDownload) Scraper.init('download', true);
                if(isRead) Scraper.init('read', true);
            } else if (e.altKey && e.ctrlKey) {
                e.preventDefault();
                if(isImages) Scraper.init('images', false);
                if(isDownload) Scraper.init('download', false);
                if(isRead) Scraper.init('read', false);
            }
        },
        readerHandler: function(e) {
            if (!document.getElementById('gm-reader-overlay')) return;
            var code = e.key;
            var box = document.getElementById('gm-reader-scroll-box');
            if (!box) return;
            var pageH = window.innerHeight * 0.85;
            if (['ArrowRight','PageDown',' ','Space','ArrowDown'].includes(code)) { box.scrollBy({ top: pageH, behavior: 'smooth' }); e.preventDefault(); }
            else if (['ArrowLeft','PageUp','ArrowUp'].includes(code)) { box.scrollBy({ top: -pageH, behavior: 'smooth' }); e.preventDefault(); }
            else if (code === 'Escape') { Reader.close(); }
        },
        initGlobal: function() { document.addEventListener('keydown', this.globalHandler, false); },
        enableReader: function() { document.addEventListener('keydown', this.readerHandler, true); },
        disableReader: function() { document.removeEventListener('keydown', this.readerHandler, true); }
    };

    var UI = {
        init: function() {
            if(document.body) { UI.render(); }
            else { document.addEventListener('DOMContentLoaded', UI.render); }
            Keyboard.initGlobal();
        },
        render: function() {
            if (document.getElementById('gm-start-panel')) return;
            var p = document.createElement('div');
            p.id = 'gm-start-panel';

            var handle = document.createElement('div');
            handle.className = 'gm-drag-handle';
            handle.innerText = '::: 拖拽 :::';
            p.appendChild(handle);

            // 文本下载按钮组 (拆分设计)
            var splitGroupText = document.createElement('div');
            splitGroupText.className = 'gm-split-group';
            
            var btnText = document.createElement('div');
            btnText.id = 'gm-btn-text';
            btnText.className = 'gm-btn-split-l';
            btnText.innerHTML = '💾 文本 <span class="gm-shortcut-hint">Alt+D</span>';
            btnText.style.backgroundColor = '#3498db'; // 初始颜色
            btnText.onclick = function() { Scraper.init('download', true); };
            
            var btnTextSet = document.createElement('div');
            btnTextSet.className = 'gm-btn-split-r';
            btnTextSet.innerText = '⚙️';
            btnTextSet.style.backgroundColor = '#2980b9'; // 稍深一点的颜色区分
            btnTextSet.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); 
                UI.togglePopup('text'); // 传入类型
            }, true);
            
            splitGroupText.appendChild(btnText);
            splitGroupText.appendChild(btnTextSet);
            p.appendChild(splitGroupText);
            
            // 图片下载按钮组 (拆分设计)
            var splitGroupImg = document.createElement('div');
            splitGroupImg.className = 'gm-split-group';
            
            var btnImg = document.createElement('div');
            btnImg.id = 'gm-btn-img';
            btnImg.className = 'gm-btn-split-l';
            btnImg.innerHTML = '🖼️ 图片 <span class="gm-shortcut-hint">Alt+I</span>';
            btnImg.onclick = function() { Scraper.init('images', true); };
            
            var btnImgSet = document.createElement('div');
            btnImgSet.className = 'gm-btn-split-r';
            btnImgSet.innerText = '⚙️';
            btnImgSet.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); 
                UI.togglePopup('image'); // 传入类型
            }, true);
            
            splitGroupImg.appendChild(btnImg);
            splitGroupImg.appendChild(btnImgSet);
            p.appendChild(splitGroupImg);

            // 阅读按钮 (保持原样)
            var btnRead = document.createElement('div');
            btnRead.id = 'gm-btn-read';
            btnRead.className = 'gm-btn-main';
            btnRead.innerHTML = '📖 阅读 <span class="gm-shortcut-hint">Alt + R</span>';
            btnRead.style.backgroundColor = '#e67e22';
            btnRead.onclick = function() { Scraper.init('read', true); };
            p.appendChild(btnRead);

            var prog = document.createElement('div');
            prog.id = 'gm-progress-container';
            prog.innerHTML = '<div id="gm-progress-bar"></div>';
            p.appendChild(prog);
            document.body.appendChild(p);
            
            // 配置面板 (挂载到body)
            var popup = document.createElement('div');
            popup.id = 'gm-folder-popup';
            
            var tags = [
                { k: '{{title}}', n: '帖子标题' },
                { k: '{{html_title}}', n: '网页标题' },
                { k: '{{author}}', n: '作者' },
                { k: '{{forum_name}}', n: '论坛' },
                { k: '{{date}}', n: '日期/发布' },
                { k: '{{index}}', n: '序号(图)' },
                { k: '{{floor}}', n: '楼层(图)' }
            ];
            var tagHtml = tags.map(t => `<div class="gm-tag-small" data-val="${t.k}"><span>${t.k}</span>${t.n}</div>`).join('');
            
            // 渲染输入框，分为文本和图片两组
            popup.innerHTML = `
                <div class="gm-popup-title">📂 命名设置</div>
                
                <div class="gm-popup-subtitle">文本设置</div>
                <div class="gm-input-group">
                    <span class="gm-input-label">文本目录 <span class="gm-popup-hint">(留空不创建目录)</span></span>
                    <input class="gm-popup-input" id="inp-tpl-text-folder" type="text" value="${App.userConfig.tplTextFolder || ''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">文本文件名 (.txt)</span>
                    <input class="gm-popup-input" id="inp-tpl-text-file" type="text" value="${App.userConfig.tplTextFileName}">
                </div>

                <div class="gm-popup-subtitle">图片设置</div>
                <div class="gm-input-group">
                    <span class="gm-input-label">图片目录 <span class="gm-popup-hint">(留空不创建目录)</span></span>
                    <input class="gm-popup-input" id="inp-tpl-img-folder" type="text" value="${App.userConfig.tplImgFolder || ''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">图片文件名 (.jpg)</span>
                    <input class="gm-popup-input" id="inp-tpl-img-file" type="text" value="${App.userConfig.tplImgFileName}">
                </div>

                <div class="gm-tags-container-small">${tagHtml}</div>
            `;
            document.body.appendChild(popup);

            UI.makeDraggable(p, handle);
            UI.bindPopupEvents();
        },
        togglePopup: function(sourceType) {
            var p = document.getElementById('gm-folder-popup');
            var style = window.getComputedStyle(p);
            
            // 简单的切换显示逻辑
            if(style.display === 'none') {
                // 确定定位参考点
                var btn = null;
                if (sourceType === 'text') btn = document.querySelectorAll('.gm-btn-split-r')[0];
                else btn = document.querySelectorAll('.gm-btn-split-r')[1];

                if (btn) {
                    var rect = btn.getBoundingClientRect();
                    var top = rect.top;
                    var left = rect.left - 250; 
                    if (left < 10) left = rect.right + 10;
                    
                    p.style.top = top + 'px';
                    p.style.left = left + 'px';
                }
                p.style.display = 'block'; 
                
                // 自动聚焦到对应的输入框
                if (sourceType === 'text') document.getElementById('inp-tpl-text-folder').focus();
                else document.getElementById('inp-tpl-img-folder').focus();

            } else { 
                p.style.display = 'none'; 
            }
        },
        bindPopupEvents: function() {
            var inpTextFolder = document.getElementById('inp-tpl-text-folder');
            var inpTextFile = document.getElementById('inp-tpl-text-file');
            var inpImgFolder = document.getElementById('inp-tpl-img-folder');
            var inpImgFile = document.getElementById('inp-tpl-img-file');
            
            if(!inpTextFolder) return;

            var inputs = [inpTextFolder, inpTextFile, inpImgFolder, inpImgFile];
            var lastFocused = inpTextFolder; 

            inputs.forEach(function(el) {
                el.onfocus = function() { lastFocused = el; };
                el.oninput = function() {
                    App.userConfig.tplTextFolder = inpTextFolder.value;
                    App.userConfig.tplTextFileName = inpTextFile.value;
                    App.userConfig.tplImgFolder = inpImgFolder.value;
                    App.userConfig.tplImgFileName = inpImgFile.value;
                    localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                };
            });

            document.querySelectorAll('.gm-tag-small').forEach(function(tag) {
                tag.onclick = function() {
                    var input = lastFocused;
                    var val = tag.getAttribute('data-val');
                    var start = input.selectionStart;
                    var end = input.selectionEnd;
                    var text = input.value;
                    var newText = text.substring(0, start) + val + text.substring(end);
                    input.value = newText;
                    input.focus();
                    input.setSelectionRange(start + val.length, start + val.length);
                    // 触发保存
                    input.dispatchEvent(new Event('input'));
                };
            });
        },
        resetButtons: function() {
            // 重置所有按钮状态
            var setBtn = function(id, txt, col) {
                var el = document.getElementById(id);
                if(el) {
                    if(el.childNodes[0].nodeType === 3) el.childNodes[0].nodeValue = txt + ' ';
                    else el.innerText = txt;
                    el.style.backgroundColor = col;
                }
            };
            setBtn('gm-btn-text', '💾 文本', '#3498db');
            setBtn('gm-btn-img', '🖼️ 图片', '#9b59b6');
        },
        updateStatus: function(txt, col) {
            if (App.currentMode === 'read') return;

            var targetBtn = null;
            if (App.currentMode === 'download') targetBtn = document.getElementById('gm-btn-text');
            else if (App.currentMode === 'images') targetBtn = document.getElementById('gm-btn-img');

            if (targetBtn) {
                if(targetBtn.childNodes[0].nodeType === 3) targetBtn.childNodes[0].nodeValue = txt + ' ';
                else targetBtn.innerText = txt;
                targetBtn.style.backgroundColor = col;
            }
        },
        showProgress: function() {
            if (App.currentMode === 'read') return;
            var p = document.getElementById('gm-progress-container');
            if(p) p.style.display = 'block';
            var b = document.getElementById('gm-progress-bar');
            if(b) b.style.width = '0%';
        },
        updateProgress: function(curr, total) {
            if (App.currentMode === 'read') return;
            var b = document.getElementById('gm-progress-bar');
            if(b) {
                var pct = Math.floor((curr / total) * 100);
                b.style.width = pct + '%';
            }
        },
        hideProgress: function() {
            var p = document.getElementById('gm-progress-container');
            if(p) p.style.display = 'none';
        },
        showToast: function(msg, duration) {
            var t = document.getElementById('gm-toast');
            if (!t) {
                t = document.createElement('div');
                t.id = 'gm-toast';
                t.className = 'gm-toast';
                t.innerHTML = '<span>🚀</span><span id="gm-toast-msg"></span>';
                document.body.appendChild(t);
            }
            document.getElementById('gm-toast-msg').innerText = msg;
            t.classList.remove('show');
            void t.offsetWidth;
            t.classList.add('show');
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(function() { t.classList.remove('show'); }, duration || 3000);
        },
        hidePanel: function() { var p = document.getElementById('gm-start-panel'); if(p) p.style.display='none'; },
        showPanel: function() { var p = document.getElementById('gm-start-panel'); if(p) p.style.display='flex'; },

        makeDraggable: function(element, handle) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            var lastPos = localStorage.getItem(App.posKey);
            if(lastPos) {
                try {
                    var xy = JSON.parse(lastPos);
                    element.style.top = xy.top;
                    element.style.left = xy.left;
                    element.style.right = 'auto';
                } catch(e) {}
            }
            handle.onmousedown = dragMouseDown;
            function dragMouseDown(e) {
                e = e || window.event; e.preventDefault();
                pos3 = e.clientX; pos4 = e.clientY;
                document.onmouseup = closeDragElement; document.onmousemove = elementDrag;
                
                var pop = document.getElementById('gm-folder-popup');
                if(pop) pop.style.display = 'none';
            }
            function elementDrag(e) {
                e = e || window.event; e.preventDefault();
                pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
                pos3 = e.clientX; pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.right = 'auto';
            }
            function closeDragElement() {
                document.onmouseup = null; document.onmousemove = null;
                localStorage.setItem(App.posKey, JSON.stringify({ top: element.style.top, left: element.style.left }));
            }
        }
    };

    Styles.init();
    UI.init();

})();