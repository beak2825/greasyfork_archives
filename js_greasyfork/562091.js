// ==UserScript==
// @name         Discuz! 论坛助手 (Discuz! Forum Assistant)
// @name:en      Discuz! Forum Assistant
// @namespace    http://tampermonkey.net/
// @version      13.13.0
// @description  Discuz! 论坛全能助手：智能抓取模式（Alt+键只抓作者前3页）、全量抓取模式（Ctrl+Alt+键抓所有）；一键提取图片（自动修复文件名/格式/并发下载）；沉浸式阅读；自定义下载路径。
// @description:en Discuz! Forum Assistant: Smart scraping (Alt+keys for author's first 3 pages), full scraping (Ctrl+Alt+keys); One-click image download (auto-fix filenames/extensions/concurrent); Immersive reading; Custom download path.
// @license      GPL-3.0
// @author       transwarp
// @match        *://*/*thread-*-*-*.html
// @match        *://*/*forum.php?*mod=viewthread*
// @match        *://*/*forum.php?*mod=forumdisplay*
// @match        *://*/*home.php?*mod=space*&do=thread*
// @icon         https://www.discuz.net/favicon.ico
// @connect      *
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562091/Discuz%21%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%28Discuz%21%20Forum%20Assistant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562091/Discuz%21%20%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20%28Discuz%21%20Forum%20Assistant%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 基础配置
    var App = {
        key: 'gm_discuz_assistant_config',
        posKey: 'gm_discuz_assistant_pos',
        historyKey: 'gm_discuz_download_history',
        isRunning: false,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        currentMode: '',
        textData: [],
        imgData: [],
        meta: { tid: null, authorid: null, title: null, authorName: null, forumName: null },
        defaultConfig: {
            bgColor: '#f7f1e3', paperColor: '#fffef8', textColor: '#2d3436',
            fontSize: 18, fontWeight: 400, lineHeight: 1.8,
            fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
            widthMode: '860px', minLength: 0,
            
            // 单独下载配置
            tplTextFolder: '{{author}}',
            tplTextFileName: '{{title}}',
            tplImgFolder: '{{author}}/{{title}}',
            tplImgFileName: '{{index}}_{{floor}}_{{date}}',
            retainOriginalFiles: true, 
            
            // 批量下载独立配置
            batchTextFolder: '{{author}}',
            batchTextFileName: '{{title}}',
            batchImgFolder: '{{author}}/{{title}}',
            batchImgFileName: '{{index}}_{{floor}}_{{date}}',
            batchRetainOriginal: true,

            allowDuplicate: false,
            batchText: true,
            batchImg: true,
            batchVideo: true,

            // 高级网络配置
            maxConcurrency: 5,   
            downloadDelay: 100,
            scanDelay: 800,
            
            // 扫描逻辑 (新)
            scanStartMode: '1' // '1' = 强制从第一页, 'current' = 从当前页
        },
        userConfig: {},
        downloadHistory: new Set()
    };

    if (App.isMobile) return;

    window.onerror = function(msg, url, line) {
        if (msg === 'Script error.' || line === 0) return true;
        return false;
    };

    // 配置加载
    App.userConfig = Object.assign({}, App.defaultConfig);
    var saved = localStorage.getItem(App.key);
    if (saved) { 
        try { 
            var parsed = JSON.parse(saved); 
            App.userConfig = Object.assign(App.userConfig, parsed);
            if(App.userConfig.scanDelay === undefined) App.userConfig.scanDelay = 800;
            if(App.userConfig.maxConcurrency === undefined) App.userConfig.maxConcurrency = 5;
            if(App.userConfig.downloadDelay === undefined) App.userConfig.downloadDelay = 100;
            if(App.userConfig.scanStartMode === undefined) App.userConfig.scanStartMode = '1';
        } catch(e){} 
    }

    var savedHistory = localStorage.getItem(App.historyKey);
    if (savedHistory) { try { var parsedHist = JSON.parse(savedHistory); if (Array.isArray(parsedHist)) App.downloadHistory = new Set(parsedHist); } catch(e) {} }

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
        getCurrentPageNumber: function(url) {
            // 尝试解析 url 中的 page 参数，如果找不到则返回 1
            var u = url || window.location.href;
            var match = u.match(/[?&]page=(\d+)/);
            if (match) return parseInt(match[1]);
            // 尝试伪静态 forum-fid-page.html
            match = u.match(/-(\d+)\.html/); 
            // 注意：伪静态可能是 forum-fid-page.html，或者是 thread-tid-page-1.html
            // 这里做一个简单的尝试，不一定100%准确，默认回退到1
            if (match) return parseInt(match[1]);
            return 1;
        },
        buildUrl: function(tid, page, authorid) {
            var baseUrl = window.location.origin + '/forum.php?mod=viewthread&tid=' + tid + '&page=' + page;
            if (authorid && authorid !== '0' && authorid !== 0) baseUrl += '&authorid=' + authorid;
            return baseUrl;
        },
        fetchDoc: function(url, callback, errCallback) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: function(response) {
                    if (response.status !== 200) { if (errCallback) errCallback('HTTP ' + response.status); return; }
                    var buffer = response.response;
                    var decoder = new TextDecoder(document.characterSet || 'utf-8');
                    var text = decoder.decode(buffer);
                    if (text.indexOf('</html>') === -1 || (text.indexOf('发表于') === -1 && text.indexOf('div') !== -1)) {
                        text = new TextDecoder('gbk').decode(buffer);
                    }
                    callback(new DOMParser().parseFromString(text, "text/html"));
                },
                onerror: function(e) { if (errCallback) errCallback('Network Error'); }
            });
        },
        sanitizeFilename: function(name) {
            return name.replace(/[\\:*?"<>|]/g, '_').replace(/[\r\n\t]/g, '').replace(/\s+/g, ' ').trim().substring(0, 200);
        },
        extractDate: function(str) {
            var match = str.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (match) {
                return match[1] + match[2].padStart(2, '0') + match[3].padStart(2, '0');
            }
            return '';
        },
        renderTemplate: function(tpl, data) {
            if (!tpl) return "";
            var res = tpl;
            for (var key in data) {
                var regex = new RegExp('{{' + key + '}}', 'g');
                var val = String(data[key] || '');
                if (key === 'url' || key === 'post_url') val = val.replace(/[:/]/g, '_');
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
        },
        saveHistory: function() { localStorage.setItem(App.historyKey, JSON.stringify(Array.from(App.downloadHistory))); },
        exportHistory: function() {
            var content = JSON.stringify(Array.from(App.downloadHistory));
            var blob = new Blob([content], {type: "application/json"});
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a'); a.href = url; a.download = 'discuz_history.json';
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
            UI.showToast("✅ 历史记录已导出");
        },
        importHistory: function() {
            var input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = function(e) {
                var file = e.target.files[0]; if (!file) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var arr = JSON.parse(e.target.result);
                        if (Array.isArray(arr)) {
                            arr.forEach(function(id) { App.downloadHistory.add(id); });
                            Utils.saveHistory(); UI.showToast("✅ 导入 " + arr.length + " 条");
                        }
                    } catch(err) { alert("文件错误"); }
                };
                reader.readAsText(file);
            };
            input.click();
        },
        clearHistory: function() {
            if (confirm("⚠️ 确定要清空历史记录吗？")) {
                App.downloadHistory.clear(); Utils.saveHistory(); UI.showToast("🗑️ 记录已清空");
            }
        }
    };

    // 3. 样式定义
    var Styles = {
        init: function() {
            var css = [
                '#gm-start-panel { position: fixed; z-index: 2147483647 !important; display: flex; flex-direction: column; gap: 8px; background: rgba(255,255,255,0.95); backdrop-filter: blur(5px); padding: 12px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid rgba(0,0,0,0.05); width: 180px; box-sizing: border-box; transition: opacity 0.3s; }',
                '.gm-drag-handle { padding: 0 0 6px 0; cursor: move; text-align: center; font-size: 10px; color: #999; border-bottom: 1px solid rgba(0,0,0,0.05); margin-bottom: 4px; user-select: none; }',
                '.gm-btn-main { padding: 10px 0; border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; width: 100%; box-sizing: border-box; }',
                '.gm-btn-main:hover { transform: translateY(-2px); filter: brightness(1.1); }',
                '.gm-btn-main:disabled { background-color: #bdc3c7 !important; cursor: not-allowed; transform: none; pointer-events: none; }',
                '.gm-shortcut-hint { font-size: 9px; opacity: 0.7; display: block; margin-top: 2px; font-weight: normal; font-family: monospace; }',
                '.gm-split-group { display: flex; width: 100%; gap: 1px; }',
                '.gm-btn-split-l { flex: 1; border-radius: 8px 0 0 8px; background-color: #3498db; color: white; border: none; padding: 10px 0; cursor: pointer; font-size: 14px; font-weight: 600; text-align: center; display:flex; align-items:center; justify-content:center; flex-direction:column; white-space: nowrap; overflow: hidden; pointer-events: auto !important; box-sizing: border-box; min-width: 0; }',
                '.gm-btn-split-r { width: 40px; border-radius: 0 8px 8px 0; background-color: #2980b9; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; pointer-events: auto !important; box-sizing: border-box; }',
                '#gm-folder-popup, #gm-filter-popup { position: fixed; width: 280px; background: #ffffff; border-radius: 8px; padding: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.25); display: none; border: 1px solid #eee; z-index: 2147483651; box-sizing: border-box; text-align: left; font-family: system-ui, sans-serif; }',
                '.gm-popup-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 6px; display:flex; justify-content:space-between; align-items:center; }',
                '.gm-popup-subtitle { font-size: 11px; font-weight: bold; color: #666; margin-top: 10px; margin-bottom: 5px; padding-left: 2px; border-left: 3px solid #8e44ad; }',
                '.gm-input-group { margin-bottom: 8px; }',
                '.gm-input-label { display: block; font-size: 11px; color: #666; margin-bottom: 3px; }',
                '.gm-popup-input { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px; color: #333; }',
                '.gm-tags-container-small { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #eee; }',
                '.gm-tag-small { background: #f1f3f5; color: #555; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer; border: 1px solid #e9ecef; }',
                '.gm-tag-small:hover { background: #e9ecef; }',
                '#gm-progress-container { width: 100%; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; margin-top: 8px; display: none; }',
                '#gm-progress-bar { width: 0%; height: 100%; background: #2ecc71; transition: width 0.2s ease; }',
                '.gm-toast { position: fixed; top: 150px; left: 50%; transform: translateX(-50%); background: rgba(33, 37, 41, 0.95); backdrop-filter: blur(8px); color: #fff; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 2147483650; transition: all 0.4s; opacity: 0; pointer-events: none; }',
                '.gm-toast.show { opacity: 1; }',
                '.gm-checkbox-row { display: flex; align-items: center; margin-top: 6px; font-size: 12px; color: #333; }',
                '.gm-checkbox-row input { margin-right: 6px; }',
                '.gm-check-group { display: flex; gap: 15px; margin-top: 5px; }',
                '.gm-check-item { display: flex; align-items: center; font-size: 12px; cursor: pointer; }',
                '.gm-check-item input { margin-right: 4px; }',
                '.gm-action-btn { width: auto; padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }',
                '.gm-action-btn:hover { background: #2ecc71; }',
                '.gm-hist-btn { padding: 4px 8px; background: #95a5a6; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; margin-right: 5px; }',
                '.gm-hist-btn:hover { background: #7f8c8d; }',
                '.gm-hist-btn.danger { background: #e74c3c; }',
                '.gm-hist-btn.danger:hover { background: #c0392b; }',
                '#gm-reader-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: var(--bg-color); color: var(--text-color); z-index: 2147483640; font-family: var(--font-family); overflow: hidden; outline: none; line-height: 1.5; }',
                '#gm-reader-scroll-box { position: relative; z-index: 2147483641; width: 100%; height: 100%; box-sizing: border-box; display: block; overflow-y: auto; padding: 40px 0 120px 0; scroll-behavior: smooth; }',
                '.gm-content-wrapper { width: var(--content-width); max-width: 95vw; margin: 0 auto; padding: 60px 80px; box-sizing: border-box; background-color: var(--paper-color); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border-radius: 8px; min-height: calc(100vh - 100px); }',
                '@media (max-width: 768px) { .gm-content-wrapper { padding: 30px 20px; width: 100% !important; border-radius: 0; box-shadow: none; } }',
                '#gm-fab-menu { position: fixed; bottom: 40px; right: 40px; width: 50px; height: 50px; border-radius: 25px; background: rgba(33, 37, 41, 0.9); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; z-index: 2147483648; cursor: pointer; box-shadow: 0 8px 30px rgba(0,0,0,0.3); transition: all 0.3s; backdrop-filter: blur(4px); }',
                '#gm-reader-toolbar { position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: rgba(255,255,255,0.95); color: #333; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; transform: translateY(-100%); transition: transform 0.3s ease; z-index: 2147483649; backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); }',
                '#gm-reader-toolbar.visible { transform: translateY(0); }',
                '.gm-tool-btn { background: transparent; border: 1px solid #e9ecef; color: #495057; padding: 6px 14px; border-radius: 8px; margin-left: 8px; font-size: 13px; font-weight: 500; cursor: pointer; }',
                '#gm-reader-toc, #gm-reader-settings { position: fixed; background: rgba(255,255,255,0.95); color: #333; z-index: 2147483649; transition: transform 0.3s; backdrop-filter: blur(12px); }',
                '#gm-reader-toc { top: 0; left: 0; bottom: 0; width: 300px; transform: translateX(-100%); display: flex; flex-direction: column; border-right: 1px solid rgba(0,0,0,0.05); }',
                '#gm-reader-toc.visible { transform: translateX(0); }',
                '.gm-toc-item { padding: 12px 20px; font-size: 14px; border-bottom: 1px solid rgba(0,0,0,0.02); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; color: #495057; }',
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

    // 4. SpaceCrawler 对象
    var SpaceCrawler = {
        queue: [],
        totalThreads: 0,
        processedCount: 0,
        filters: {},
        isScanning: false,

        showFilterDialog: function() {
            var popup = document.getElementById('gm-filter-popup');
            if (popup) { popup.style.display = 'block'; return; }

            popup = document.createElement('div');
            popup.id = 'gm-filter-popup';
            popup.style.top = '100px'; popup.style.left = '50%'; popup.style.transform = 'translateX(-50%)';

            var html = `
                <div class="gm-popup-title">
                    <span>🔍 批量下载设置</span>
                    <span style="cursor:pointer" onclick="document.getElementById('gm-filter-popup').style.display='none'">❌</span>
                </div>

                <div class="gm-popup-subtitle">扫描范围</div>
                <div class="gm-input-group">
                    <div class="gm-checkbox-row" style="margin-top:0;">
                        <input type="radio" name="gm-scan-mode" id="gm-scan-mode-1" value="1" ${App.userConfig.scanStartMode !== 'current'?'checked':''}>
                        <label for="gm-scan-mode-1" style="margin-right:15px;">从第 1 页开始 (全量)</label>
                        
                        <input type="radio" name="gm-scan-mode" id="gm-scan-mode-curr" value="current" ${App.userConfig.scanStartMode === 'current'?'checked':''}>
                        <label for="gm-scan-mode-curr">从当前页开始 (续传)</label>
                    </div>
                </div>

                <div class="gm-popup-subtitle">扫描/下载设置</div>
                <div class="gm-input-group">
                    <span class="gm-input-label">扫描翻页间隔 (ms)</span>
                    <input class="gm-popup-input" type="number" id="inp-scan-delay" value="${App.userConfig.scanDelay}" min="0" step="100">
                </div>
                
                <div class="gm-input-group" style="display:flex; gap:10px; margin-top:5px;">
                    <div style="flex:1"><span class="gm-input-label">并发数</span><input class="gm-popup-input" type="number" id="inp-max-threads" value="${App.userConfig.maxConcurrency}" min="1"></div>
                    <div style="flex:1"><span class="gm-input-label">下载间隔(ms)</span><input class="gm-popup-input" type="number" id="inp-download-delay" value="${App.userConfig.downloadDelay}" min="0"></div>
                </div>

                <div class="gm-popup-subtitle">下载内容</div>
                <div class="gm-check-group">
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-text" ${App.userConfig.batchText?'checked':''}>文本</label>
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-img" ${App.userConfig.batchImg?'checked':''}>图片</label>
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-video" ${App.userConfig.batchVideo?'checked':''}>视频</label>
                </div>

                <div class="gm-popup-subtitle">选项</div>
                <div class="gm-checkbox-row">
                    <input type="checkbox" id="gm-opt-dup" ${App.userConfig.allowDuplicate?'checked':''}>
                    <label for="gm-opt-dup">允许重复下载 (忽略历史)</label>
                </div>
                <div class="gm-checkbox-row">
                    <input type="checkbox" id="gm-opt-batch-retain" ${App.userConfig.batchRetainOriginal?'checked':''}>
                    <label for="gm-opt-batch-retain">保留原始文件名 (图片)</label>
                </div>
                
                <div class="gm-input-group" style="margin-top:10px;">
                    <span class="gm-input-label">批量图片/视频目录</span>
                    <input class="gm-popup-input" id="inp-batch-img-folder" value="${App.userConfig.batchImgFolder||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量图片文件名</span>
                    <input class="gm-popup-input" id="inp-batch-img-file" value="${App.userConfig.batchImgFileName||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量文本目录</span>
                    <input class="gm-popup-input" id="inp-batch-txt-folder" value="${App.userConfig.batchTextFolder||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量文本文件名</span>
                    <input class="gm-popup-input" id="inp-batch-txt-file" value="${App.userConfig.batchTextFileName||''}">
                </div>
                
                <div class="gm-tags-container-small">
                    <div class="gm-tag-small" onclick="UI.insertTag('{{author}}')">昵称</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{author_id}}')">UID</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{title}}')">标题</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{date}}')">日期</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{index}}')">序号</div>
                </div>

                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #eee; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <button class="gm-hist-btn" id="gm-btn-import" title="导入 .json 历史记录">📥 导入</button>
                        <button class="gm-hist-btn" id="gm-btn-export" title="导出历史记录为 .json">📤 导出</button>
                        <button class="gm-hist-btn danger" id="gm-btn-clear" title="清空所有记录">🗑️ 清空</button>
                    </div>
                    <button class="gm-action-btn" id="gm-btn-start-batch">🚀 开始下载</button>
                </div>
            `;
            document.body.appendChild(popup);

            // 绑定事件
            var inputs = ['gm-opt-text', 'gm-opt-img', 'gm-opt-video', 'gm-opt-dup', 'gm-opt-batch-retain', 
                          'inp-batch-img-folder', 'inp-batch-img-file', 'inp-batch-txt-folder', 'inp-batch-txt-file',
                          'inp-max-threads', 'inp-download-delay', 'inp-scan-delay'];
            
            inputs.forEach(function(id) {
                var el = document.getElementById(id);
                if(!el) return;
                
                if(el.type === 'checkbox') {
                    el.onchange = function() {
                        if(id === 'gm-opt-text') App.userConfig.batchText = this.checked;
                        if(id === 'gm-opt-img') App.userConfig.batchImg = this.checked;
                        if(id === 'gm-opt-video') App.userConfig.batchVideo = this.checked;
                        if(id === 'gm-opt-dup') App.userConfig.allowDuplicate = this.checked;
                        if(id === 'gm-opt-batch-retain') App.userConfig.batchRetainOriginal = this.checked;
                        localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                    };
                } else {
                    el.onfocus = function() { UI.lastFocusedInput = this; };
                    el.oninput = function() {
                        if(id === 'inp-batch-img-folder') App.userConfig.batchImgFolder = this.value;
                        if(id === 'inp-batch-img-file') App.userConfig.batchImgFileName = this.value;
                        if(id === 'inp-batch-txt-folder') App.userConfig.batchTextFolder = this.value;
                        if(id === 'inp-batch-txt-file') App.userConfig.batchTextFileName = this.value;
                        if(id === 'inp-max-threads') App.userConfig.maxConcurrency = parseInt(this.value) || 5;
                        if(id === 'inp-download-delay') App.userConfig.downloadDelay = parseInt(this.value) || 100;
                        if(id === 'inp-scan-delay') App.userConfig.scanDelay = parseInt(this.value) || 800;
                        localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                    };
                }
            });
            
            // Radio buttons for scan mode
            document.getElementById('gm-scan-mode-1').onchange = function() { if(this.checked) { App.userConfig.scanStartMode = '1'; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); } };
            document.getElementById('gm-scan-mode-curr').onchange = function() { if(this.checked) { App.userConfig.scanStartMode = 'current'; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); } };

            // 绑定历史记录按钮
            document.getElementById('gm-btn-start-batch').onclick = function() {
                // 再次检查配置是否完整
                if (!App.userConfig.batchText && !App.userConfig.batchImg && !App.userConfig.batchVideo) {
                    alert("请至少勾选一种下载内容！"); return;
                }
                popup.style.display = 'none';
                SpaceCrawler.startScan();
            };
            document.getElementById('gm-btn-import').onclick = Utils.importHistory;
            document.getElementById('gm-btn-export').onclick = Utils.exportHistory;
            document.getElementById('gm-btn-clear').onclick = Utils.clearHistory;
        },

        startScan: function() {
            if (this.isScanning) return;
            var url = window.location.href;
            var startPage = 1;

            if (App.userConfig.scanStartMode === 'current') {
                // 尝试保留当前页码
                startPage = Utils.getCurrentPageNumber(url);
            } else {
                // 强制从第1页开始
                // 简单粗暴替换 page 参数
                if (url.match(/[?&]page=\d+/)) {
                    url = url.replace(/(page=)\d+/, '$11');
                } else if (url.match(/forum-\d+-\d+\.html/)) {
                    // 简单适配伪静态，将 forum-fid-page.html 替换为 page=1
                    url = url.replace(/-(\d+)\.html/, '-1.html');
                } else {
                    url += (url.indexOf('?') !== -1 ? '&' : '?') + 'page=1';
                }
            }

            this.isScanning = true;
            UI.updateStatus('准备开始...', '#f39c12');
            UI.showProgress();
            this.queue = [];
            this.scanPage(url, startPage);
        },

        scanPage: function(url, pageNum) {
            UI.updateStatus('扫描第 ' + pageNum + ' 页', '#f39c12');
            
            var scanDelay = parseInt(App.userConfig.scanDelay);
            if (isNaN(scanDelay)) scanDelay = 800;
            
            var isForumDisplay = url.indexOf('mod=forumdisplay') !== -1;

            Utils.fetchDoc(url, function(doc) {
                if (isForumDisplay) {
                     var tbodies = doc.querySelectorAll('tbody[id^="normalthread_"]');
                     tbodies.forEach(function(tbody) {
                         var tr = tbody.querySelector('tr');
                         var titleLink = tr.querySelector('a.xst') || tr.querySelector('th > a[href*="tid"]');
                         if(!titleLink) return;
                         var tidMatch = titleLink.href.match(/tid=(\d+)/);
                         if (!tidMatch) return;
                         var tid = tidMatch[1];
                         var title = titleLink.innerText.trim();
                         var authLink = tbody.querySelector('.by cite a');
                         var authorName = authLink ? authLink.innerText.trim() : "匿名";
                         var uid = '0';
                         if(authLink && authLink.href.match(/uid=(\d+)/)) uid = authLink.href.match(/uid=(\d+)/)[1];

                         var dateEm = tbody.querySelector('.by em span') || tbody.querySelector('.by em');
                         var date = dateEm ? dateEm.innerText.trim() : "";
                         
                         if (!App.userConfig.allowDuplicate && App.downloadHistory.has(tid)) return;
                         SpaceCrawler.queue.push({ tid: tid, title: title, forum: "", date: date, author: authorName, uid: uid });
                     });
                } else {
                    var rows = doc.querySelectorAll('table tr');
                    rows.forEach(function(tr) {
                        var titleTh = tr.querySelector('th');
                        if (!titleTh) return;
                        var titleLink = titleTh.querySelector('a[href*="tid"]');
                        if (!titleLink) return;
                        var tidMatch = titleLink.href.match(/tid=(\d+)/);
                        if (!tidMatch) return;
                        var tid = tidMatch[1];
                        var title = titleLink.innerText.trim();
                        
                        var uid = Utils.getQuery(url, 'uid') || '0';
                        
                        var byTd = tr.querySelector('td.by');
                        var timeStr = "";
                        if (byTd) {
                            var em = byTd.querySelector('em'); 
                            if (em) timeStr = em.innerText.trim();
                            if (em && em.querySelector('a')) timeStr = em.querySelector('a').innerText.trim();
                        }
                        if (!App.userConfig.allowDuplicate && App.downloadHistory.has(tid)) return;
                        SpaceCrawler.queue.push({ tid: tid, title: title, forum: "", date: timeStr, author: "", uid: uid });
                    });
                }

                var nextBtn = doc.querySelector('.pg .nxt') || doc.querySelector('#pgt .nxt');
                if (nextBtn) {
                    var nextUrl = nextBtn.href;
                    if (nextUrl.indexOf('http') !== 0) {
                        if (nextUrl.indexOf('/') === 0) nextUrl = window.location.origin + nextUrl;
                        else nextUrl = window.location.origin + '/' + nextUrl; 
                    }
                    setTimeout(function() { SpaceCrawler.scanPage(nextUrl, pageNum + 1); }, scanDelay);
                } else {
                    SpaceCrawler.isScanning = false;
                    SpaceCrawler.totalThreads = SpaceCrawler.queue.length;
                    if (SpaceCrawler.totalThreads === 0) {
                        alert("未找到新帖子（可能已全部下载过）。"); UI.resetButtons(); UI.hideProgress();
                    } else {
                        if (confirm("扫描完成！共 " + SpaceCrawler.totalThreads + " 个新任务。\n开始下载？")) {
                            SpaceCrawler.processQueue();
                        } else {
                            UI.resetButtons(); UI.hideProgress();
                        }
                    }
                }
            }, function() { alert("扫描页面失败"); SpaceCrawler.isScanning = false; UI.resetButtons(); });
        },

        processQueue: function() {
            if (this.queue.length === 0) {
                UI.updateStatus('全部完成!', '#27ae60');
                setTimeout(function(){ UI.resetButtons(); UI.hideProgress(); }, 3000);
                return;
            }
            var task = this.queue.shift();
            SpaceCrawler.processedCount++;
            UI.updateStatus('处理: ' + SpaceCrawler.processedCount + '/' + SpaceCrawler.totalThreads, '#2980b9');
            UI.updateProgress(SpaceCrawler.processedCount, SpaceCrawler.totalThreads);
            
            Scraper.fetchThreadAndDownload(task, function(success) {
                if (success) { App.downloadHistory.add(task.tid); Utils.saveHistory(); }
                setTimeout(function() { SpaceCrawler.processQueue(); }, 1000);
            });
        }
    };

    // 5. 抓取逻辑
    var Scraper = {
        fetchThreadAndDownload: function(taskInfo, callback) {
            var tid = taskInfo.tid;
            var url = Utils.buildUrl(tid, 1, null);

            Utils.fetchDoc(url, function(doc) {
                var fullTitle = Utils.getThreadTitle(doc);
                var authorName = taskInfo.author || "匿名"; 
                var authorId = taskInfo.uid || '0';
                
                // Try to get more accurate author info from thread
                if(authorName === "匿名" || authorId === '0') {
                    var authLink = doc.querySelector('.authi .xw1') || doc.querySelector('.authi a[href*="uid"]');
                    if(authLink) {
                        authorName = authLink.innerText.trim();
                        if(authLink.href.match(/uid=(\d+)/)) authorId = authLink.href.match(/uid=(\d+)/)[1];
                    }
                }

                var threadContext = {
                    forum_name: taskInfo.forum || 'Discuz',
                    title: fullTitle || taskInfo.title, 
                    html_title: doc.title,
                    author: authorName, 
                    author_id: authorId,
                    post_url: url, url: url, tid: tid,
                    date: Utils.extractDate(taskInfo.date || '') || Scraper.getTemplateData().date 
                };

                var allMedia = [];
                var hasContent = false;

                if (App.userConfig.batchText) {
                    var posts = Scraper.parsePosts(doc);
                    if (posts.length > 0) {
                        var content = "=== " + threadContext.title + " ===\nUID: " + threadContext.author_id + "\nLink: " + url + "\n\n";
                        content += posts.map(function(p) { return "### " + p.floor + "楼\n\n" + p.text; }).join('\n\n' + '-'.repeat(30) + '\n\n');
                        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                        allMedia.push({ url: URL.createObjectURL(blob), floor: '1', date: posts[0].date, type: 'text', ext: '.txt' });
                        hasContent = true;
                    }
                }

                if (App.userConfig.batchImg) {
                    var imgs = Scraper.parseImages(doc);
                    imgs.forEach(function(img) {
                        allMedia.push({ url: img.url, floor: img.floor, date: img.date, type: 'img', fileName: img.fileName });
                    });
                    if(imgs.length > 0) hasContent = true;
                }

                if (App.userConfig.batchVideo) {
                    var videos = Scraper.parseVideos(doc);
                    videos.forEach(function(vid) {
                        var ext = vid.ext || '.mp4';
                        allMedia.push({ url: vid.url, floor: vid.floor, date: vid.date, type: 'video', ext: ext });
                    });
                    if(videos.length > 0) hasContent = true;
                }

                if (!hasContent) { callback(true); return; }

                Scraper.batchDownloadMedia(allMedia, threadContext, function() {
                    allMedia.forEach(m => { if(m.type === 'text') URL.revokeObjectURL(m.url); });
                    callback(true);
                });

            }, function() { callback(false); });
        },

        batchDownloadMedia: function(mediaList, threadContext, doneCallback) {
            if (mediaList.length === 0) { doneCallback(); return; }

            var uniqueItems = []; var seenUrls = new Set();
            mediaList.forEach(function(item) { if (!seenUrls.has(item.url)) { seenUrls.add(item.url); uniqueItems.push(item); } });

            var active = 0; 
            var max = parseInt(App.userConfig.maxConcurrency) || 5; 
            var delay = parseInt(App.userConfig.downloadDelay) || 100;
            var finished = 0; var total = uniqueItems.length;

            var imgFolderTpl = App.userConfig.batchImgFolder || '{{author}}/{{title}}';
            var txtFolderTpl = App.userConfig.batchTextFolder || '{{author}}';

            var queue = uniqueItems.slice();

            var process = function() {
                while (active < max && queue.length > 0) {
                    var item = queue.shift(); active++; downloadOne(item);
                }
            };

            var downloadOne = function(item) {
                var idxStr = String(finished + 1).padStart(3, '0');
                var floorStr = item.floor; if (/^\d+$/.test(floorStr)) floorStr += '楼';
                var itemData = Object.assign({}, threadContext, { index: idxStr, floor: floorStr, date: item.date || threadContext.date });

                var folderName = "";
                var baseName = "";
                var ext = "";
                
                if (item.type === 'text') {
                    folderName = Utils.renderTemplate(txtFolderTpl, threadContext);
                    baseName = Utils.renderTemplate(App.userConfig.batchTextFileName || '{{title}}', itemData);
                    ext = '.txt';
                } else if (item.type === 'img') {
                    folderName = Utils.renderTemplate(imgFolderTpl, threadContext);
                    if (App.userConfig.batchRetainOriginal && item.fileName && item.fileName.length > 2) {
                        baseName = Utils.sanitizeFilename(item.fileName);
                        if(baseName.toLowerCase().endsWith('.jpg')) baseName=baseName.slice(0,-4);
                        if(baseName.toLowerCase().endsWith('.png')) baseName=baseName.slice(0,-4);
                    } else {
                        baseName = Utils.renderTemplate(App.userConfig.batchImgFileName || '{{index}}_{{floor}}_{{date}}', itemData);
                    }
                    ext = '.jpg';
                } else {
                    folderName = Utils.renderTemplate(imgFolderTpl, threadContext);
                    baseName = Utils.renderTemplate(App.userConfig.batchImgFileName || '{{index}}_{{floor}}_{{date}}', itemData);
                    ext = item.ext || '.mp4';
                }
                
                if (baseName.endsWith('.txt')) baseName = baseName.slice(0, -4);
                
                var filename = (folderName ? (folderName + '/') : '') + baseName + ext;

                if (item.type === 'img') {
                    GM_xmlhttpRequest({
                        method: "GET", url: item.url, responseType: 'blob', headers: { 'Referer': window.location.href },
                        onload: function(res) {
                            if(res.status===200) {
                                var blob = new Blob([res.response], {type: "image/jpeg"});
                                var u = URL.createObjectURL(blob);
                                GM_download({
                                    url: u, name: filename, saveAs: false,
                                    onload: function(){ URL.revokeObjectURL(u); active--; finished++; check(); },
                                    onerror: function(){ active--; finished++; check(); }
                                });
                            } else { active--; finished++; check(); }
                        },
                        onerror: function(){ active--; finished++; check(); }
                    });
                } else {
                    GM_download({
                        url: item.url, name: filename, saveAs: false,
                        onload: function() { active--; finished++; check(); },
                        onerror: function() { active--; finished++; check(); }
                    });
                }
                
                function check() { 
                    if (finished === total) doneCallback(); 
                    else setTimeout(process, delay); 
                }
            };
            process();
        },

        // 单贴解析逻辑
        parsePosts: function(doc) {
            var results = [];
            var postDivs = doc.querySelectorAll('div[id^="post_"], .plc');
            for(var i=0; i<postDivs.length; i++){
                var div = postDivs[i];
                if(div.id && (div.id === 'post_new' || div.id.indexOf('post_rate') !== -1)) continue;
                if(div.innerText.length<2) continue;
                var floor = Scraper.getFloor(div);
                var date = Scraper.getDate(div);
                var contentDiv = div.querySelector('.t_f') || div.querySelector('.pcb');
                if(contentDiv) {
                    var temp = contentDiv.cloneNode(true);
                    var garbage = temp.querySelectorAll('script, style, .jammer, .pstatus');
                    garbage.forEach(g => g.remove());
                    temp.innerHTML = temp.innerHTML.replace(/<br\s*\/?>/gi, '##BR##');
                    var text = temp.innerText.replace(/##BR##/g, '\n').replace(/\u00a0/g, ' ').trim();
                    if(text) results.push({floor:floor, text: text, date: date});
                }
            }
            return results;
        },

        parseImages: function(doc) {
            var images = [];
            var postDivs = doc.querySelectorAll('div[id^="post_"], .plc');
            if (postDivs.length === 0) postDivs = doc.querySelectorAll('div[id^="post_"], .plc');
            postDivs.forEach(function(div) {
                if (div.id && (div.id === 'post_new' || div.id.indexOf('post_rate') !== -1)) return;
                var floor = Scraper.getFloor(div);
                var date = Scraper.getDate(div);
                var imgs = div.querySelectorAll('.t_f img, .savephotop img, .mbn img, .tattl img, img[zoomfile], img[file], .message img');
                imgs.forEach(function(img) {
                    var src = img.getAttribute('zoomfile') || img.getAttribute('file') || img.src;
                    if (!src) return;
                    if (src.indexOf('mod=attachment') !== -1) src = src.replace('&noupdate=yes', '');
                    if (src.indexOf('http') !== 0) { try { src = new URL(src, window.location.href).href; } catch(e) { src = window.location.origin + '/' + src; } }
                    var lowSrc = src.toLowerCase();
                    if (Scraper.isGarbageImage(lowSrc)) return;
                    if (img.className && img.className.indexOf('vm') !== -1) return;
                    
                    var originalName = img.getAttribute('title') || img.getAttribute('alt') || '';
                    if ((!originalName || originalName.length < 3) && img.id && img.id.indexOf('aimg_') === 0) {
                        var menuId = img.id + '_menu';
                        // 注意：如果是批量下载，doc 是 XHR 返回的文档；如果是当前页，doc 是 document
                        var tipDiv = doc.getElementById(menuId);
                        if (tipDiv) {
                            var fnEl = tipDiv.querySelector('p > strong');
                            if (fnEl) originalName = fnEl.innerText.trim();
                        }
                    }
                    
                    images.push({ url: src, floor: floor, date: date, fileName: originalName });
                });
            });
            return images;
        },

        parseVideos: function(doc) {
            var videos = [];
            var postDivs = doc.querySelectorAll('div[id^="post_"], .plc');
            postDivs.forEach(function(div) {
                var floor = Scraper.getFloor(div);
                var date = Scraper.getDate(div);
                var vTags = div.querySelectorAll('video source, video');
                vTags.forEach(function(v) {
                    var src = v.src || v.querySelector('source')?.src;
                    if (src) {
                        if (src.indexOf('http') !== 0) src = window.location.origin + '/' + src;
                        videos.push({ url: src, floor: floor, date: date, ext: '.mp4' });
                    }
                });
                var aTags = div.querySelectorAll('a[href*=".mp4"], a[href*=".mov"], a[href*=".avi"]');
                aTags.forEach(function(a) {
                    var src = a.href;
                    var ext = src.substring(src.lastIndexOf('.'));
                    if (ext.length > 5) ext = '.mp4';
                    videos.push({ url: src, floor: floor, date: date, ext: ext });
                });
            });
            return videos;
        },

        getFloor: function(div) {
            var floor = "?";
            var floorEm = div.querySelector('.pi strong a') || div.querySelector('.pi a em');
            if (floorEm) { var txt = floorEm.innerText.trim(); var num = txt.match(/\d+/); floor = num ? num[0] : txt; }
            else { var mFloor = div.querySelector('.authi li.grey em'); if (mFloor) floor = mFloor.innerText.replace(/[\r\n]/g, '').replace('^#', '').trim(); }
            return floor;
        },
        getDate: function(div) {
            var authi = div.querySelector('.authi em') || div.querySelector('.authi .rela');
            if (authi) { return Utils.extractDate(authi.innerText); }
            return "";
        },
        isGarbageImage: function(lowSrc) {
            return (lowSrc.includes('smilies/') || lowSrc.includes('common/back.gif') || lowSrc.includes('common/none.gif') || lowSrc.includes('static/image') || lowSrc.includes('avatar.php') || lowSrc.includes('uc_server') || lowSrc.includes('uid=') || lowSrc.includes('sign') || lowSrc.includes('icon') || lowSrc.includes('btn') || lowSrc.includes('nophoto'));
        },

        init: function(mode, isQuick) {
            if (App.isRunning) return;
            App.currentMode = mode; App.isQuickMode = isQuick; UI.resetButtons();
            var tid = Utils.getQuery(window.location.href, 'tid');
            if (!tid) { var match = window.location.href.match(/thread-(\d+)-/); if (match) tid = match[1]; }
            if (!tid) { alert('无法识别当前帖子TID'); return; }
            App.meta.tid = tid; App.meta.title = Utils.getThreadTitle(document);
            Scraper.setupAndStart();
        },
        setupAndStart: function() {
             var authorid = Utils.getQuery(window.location.href, 'authorid');
             if(!authorid) {
                 var a = document.querySelector('.authi .xw1') || document.querySelector('.authi a[href*="uid"]');
                 if(a) { var m = a.href.match(/uid=(\d+)/); if(m) authorid = m[1]; }
             }
             App.meta.authorid = authorid || '0';
             // 获取单帖作者名
             var an = document.querySelector('.authi .xw1');
             App.meta.authorName = an ? an.innerText.trim() : "匿名";
             
             App.isRunning = true; App.textData = []; App.imgData = [];
             Scraper.loopPage(1);
        },
        loopPage: function(page) {
            UI.updateStatus('P ' + page, '#e67e22');
            var url = Utils.buildUrl(App.meta.tid, page, App.meta.authorid);
            
            var currentPage = Utils.getCurrentPageNumber();
            // 优化：如果是当前页，直接使用 document 解析，无需重新请求
            if (page === currentPage) {
                 if (App.currentMode === 'images') {
                     var imgs = Scraper.parseImages(document); if (imgs.length > 0) App.imgData = App.imgData.concat(imgs);
                 } else {
                     var posts = Scraper.parsePosts(document); if (posts.length > 0) App.textData = App.textData.concat(posts);
                 }
                 var nextBtn = document.querySelector('.pg .nxt') || document.querySelector('#pgt .nxt');
                 if (nextBtn) { setTimeout(function() { Scraper.loopPage(page + 1); }, 600); } else { Scraper.finish(); }
            } else {
                Utils.fetchDoc(url, function(doc) {
                     if (App.currentMode === 'images') {
                         var imgs = Scraper.parseImages(doc); if (imgs.length > 0) App.imgData = App.imgData.concat(imgs);
                     } else {
                         var posts = Scraper.parsePosts(doc); if (posts.length > 0) App.textData = App.textData.concat(posts);
                     }
                     var nextBtn = doc.querySelector('.pg .nxt') || doc.querySelector('#pgt .nxt');
                     if (nextBtn) { setTimeout(function() { Scraper.loopPage(page + 1); }, 600); } else { Scraper.finish(); }
                }, function(){ App.isRunning = false; });
            }
        },
        finish: function() {
            App.isRunning = false;
            if (App.currentMode === 'images') {
                 if (App.imgData.length === 0) { alert('未找到图片'); UI.resetButtons(); return; }
                 Scraper.downloadImagesViaBlob(App.imgData);
            } else if (App.currentMode === 'read') {
                 Reader.open(); UI.hidePanel();
            } else {
                Scraper.doDownloadText();
            }
        },
        
        downloadImagesViaBlob: function(mediaList) {
             var uniqueItems = []; var seenUrls = new Set();
             mediaList.forEach(function(item) { if (!seenUrls.has(item.url)) { seenUrls.add(item.url); uniqueItems.push(item); } });
             var active = 0; 
             // 修复：单贴模式下也要读取配置
             var max = parseInt(App.userConfig.maxConcurrency) || 5; 
             var delay = parseInt(App.userConfig.downloadDelay) || 100;
             
             var finished = 0; var total = uniqueItems.length;
             var globalData = Scraper.getTemplateData();
             var folderName = Utils.renderTemplate(App.userConfig.tplImgFolder || '{{title}}', globalData);
             var queue = uniqueItems.slice();
             
             UI.showToast("🚀 下载 " + total + " 张图片...");
             UI.showProgress();

             var process = function() { while(active<max && queue.length>0) { active++; down(queue.shift()); } };
             
             var down = function(item) {
                 var idxStr = String(finished + 1).padStart(3, '0');
                 var floorStr = item.floor; if (/^\d+$/.test(floorStr)) floorStr += '楼';
                 var itemData = Object.assign({}, globalData, { index: idxStr, floor: floorStr, date: item.date || globalData.date });
                 
                 var baseName = "";
                 
                 if (App.userConfig.retainOriginalFiles && item.fileName && item.fileName.length > 2) {
                     baseName = Utils.sanitizeFilename(item.fileName);
                     if (baseName.toLowerCase().endsWith('.jpg')) baseName = baseName.slice(0, -4);
                     if (baseName.toLowerCase().endsWith('.png')) baseName = baseName.slice(0, -4);
                 } else {
                     baseName = Utils.renderTemplate(App.userConfig.tplImgFileName || '{{index}}_{{floor}}_{{date}}', itemData);
                 }
                 
                 if (baseName.endsWith('.txt')) baseName = baseName.slice(0, -4);
                 var filename = (folderName ? (folderName + '/') : '') + baseName + '.jpg';
                 
                 GM_xmlhttpRequest({
                     method: "GET", url: item.url, responseType: 'blob', headers: { 'Referer': window.location.href },
                     onload: function(res) {
                         if (res.status === 200) {
                             var blob = new Blob([res.response], { type: "image/jpeg" });
                             var blobUrl = URL.createObjectURL(blob);
                             GM_download({
                                 url: blobUrl, name: filename, saveAs: false,
                                 onload: function() { URL.revokeObjectURL(blobUrl); active--; finished++; UI.updateProgress(finished, total); UI.updateStatus(finished+'/'+total, '#e67e22'); check(); 
                                 // Add single download to history
                                 App.downloadHistory.add(App.meta.tid); Utils.saveHistory();
                                 },
                                 onerror: function() { active--; finished++; UI.updateProgress(finished, total); check(); }
                             });
                         } else { active--; finished++; UI.updateProgress(finished, total); check(); }
                     },
                     onerror: function() { active--; finished++; UI.updateProgress(finished, total); check(); }
                 });
                 
                 function check() { 
                     if (finished === total) finish(); else setTimeout(process, delay); 
                 }
            };
            var finish = function() { UI.hideProgress(); UI.updateStatus('完成', '#27ae60'); setTimeout(function() { UI.resetButtons(); }, 2000); };
            process();
        },

        doDownloadText: function() {
            var content = "=== " + App.meta.title + " ===\nUID: " + App.meta.authorid + "\n\n";
            content += App.textData.map(function(p) { return "### " + p.floor + "楼\n\n" + p.text; }).join('\n\n' + '-'.repeat(30) + '\n\n');
            var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var globalData = Scraper.getTemplateData();
            var folderName = Utils.renderTemplate(App.userConfig.tplTextFolder || '', globalData);
            var fileName = Utils.renderTemplate(App.userConfig.tplTextFileName || '{{title}}', globalData) + '.txt';
            var fullPath = folderName ? (folderName + '/' + fileName) : fileName;
            
            UI.showProgress(); UI.updateProgress(100, 100);
            GM_download({
                url: url, name: fullPath, saveAs: false,
                onload: function() { 
                    URL.revokeObjectURL(url); UI.hideProgress(); UI.updateStatus('完成', '#27ae60'); setTimeout(function() { UI.resetButtons(); }, 2000); 
                    // Add single download to history
                    App.downloadHistory.add(App.meta.tid); Utils.saveHistory();
                }
            });
        },
        getTemplateData: function() {
            var today = new Date();
            var dateStr = today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0');
            return {
                forum_name: App.meta.forumName || 'Discuz',
                title: App.meta.title || '无标题',
                html_title: document.title,
                author: App.meta.authorName || App.meta.authorid || '匿名',
                author_id: App.meta.authorid || '0',
                post_url: window.location.href, url: window.location.href, tid: App.meta.tid, date: dateStr
            };
        }
    };

    // 6. UI 初始化
    var UI = {
        lastFocusedInput: null, 

        init: function() {
            var tryRender = function() { if(document.body) { UI.render(); } };
            if(document.body) { tryRender(); }
            document.addEventListener('DOMContentLoaded', tryRender);
            window.addEventListener('load', tryRender);
        },
        render: function() {
            if (document.getElementById('gm-start-panel')) return;
            var p = document.createElement('div'); p.id = 'gm-start-panel'; p.style.top = '150px'; p.style.left = '20px';
            p.innerHTML = '<div class="gm-drag-handle">::: 助手 :::</div>';
            
            var isSpacePage = window.location.href.indexOf('home.php') !== -1 && window.location.href.indexOf('do=thread') !== -1;
            var isForumDisplay = window.location.href.indexOf('mod=forumdisplay') !== -1;

            if (isSpacePage || isForumDisplay) {
                // 批量模式：分体式按钮
                var g = document.createElement('div'); g.className = 'gm-split-group';
                
                var bMain = document.createElement('div'); bMain.className = 'gm-btn-split-l'; bMain.id='gm-btn-batch-run';
                bMain.innerText = '⚡ 批量下载'; bMain.style.backgroundColor = '#8e44ad'; 
                bMain.onclick = function() { SpaceCrawler.startScan(); }; // 点击左侧直接开始
                
                var bSet = document.createElement('div'); bSet.className = 'gm-btn-split-r'; bSet.innerText = '⚙️'; bSet.style.backgroundColor='#7d3c98';
                bSet.onclick = function(e) { e.stopPropagation(); UI.togglePopup('gm-filter-popup', this); }; // 点击右侧打开设置，传入this作为定位锚点
                
                g.appendChild(bMain); g.appendChild(bSet);
                p.appendChild(g);
                
                // 预渲染批量设置弹窗（隐藏）
                UI.renderBatchConfigPopup();
            } else {
                // 普通模式
                var g1 = document.createElement('div'); g1.className = 'gm-split-group';
                var b1 = document.createElement('div'); b1.className = 'gm-btn-split-l'; b1.id='gm-btn-text'; b1.innerHTML = '💾 文本 <span class="gm-shortcut-hint">Alt+D</span>'; b1.style.backgroundColor='#3498db';
                b1.onclick = function(){ Scraper.init('download', true); };
                g1.appendChild(b1);
                var s1 = document.createElement('div'); s1.className = 'gm-btn-split-r'; s1.innerText='⚙️'; s1.style.backgroundColor='#2980b9';
                s1.onclick = function(e){ e.stopPropagation(); UI.togglePopup('gm-folder-popup', this); };
                g1.appendChild(s1);
                p.appendChild(g1);

                var g2 = document.createElement('div'); g2.className = 'gm-split-group';
                var b2 = document.createElement('div'); b2.className = 'gm-btn-split-l'; b2.id='gm-btn-img'; b2.innerHTML = '🖼️ 图片 <span class="gm-shortcut-hint">Alt+I</span>'; b2.style.backgroundColor='#9b59b6';
                b2.onclick = function(){ Scraper.init('images', true); };
                g2.appendChild(b2);
                var s2 = document.createElement('div'); s2.className = 'gm-btn-split-r'; s2.innerText='⚙️'; s2.style.backgroundColor='#8e44ad';
                s2.onclick = function(e){ e.stopPropagation(); UI.togglePopup('gm-folder-popup', this); };
                g2.appendChild(s2);
                p.appendChild(g2);
                
                // 阅读按钮
                var btnRead = document.createElement('div'); btnRead.id = 'gm-btn-read'; btnRead.className = 'gm-btn-main';
                btnRead.innerHTML = '📖 阅读 <span class="gm-shortcut-hint">Alt+R</span>'; btnRead.style.backgroundColor = '#e67e22';
                btnRead.onclick = function() { Scraper.init('read', true); };
                p.appendChild(btnRead);
            }

            var prog = document.createElement('div'); prog.id = 'gm-progress-container';
            prog.innerHTML = '<div id="gm-progress-bar"></div>'; p.appendChild(prog);

            document.body.appendChild(p); UI.makeDraggable(p, p.querySelector('.gm-drag-handle'));
            
            // 普通模式设置弹窗
            var popup = document.createElement('div'); popup.id = 'gm-folder-popup';
            popup.innerHTML = `
                <div class="gm-popup-title">📂 单帖配置 <span style="cursor:pointer;float:right" onclick="this.parentNode.parentNode.style.display='none'">❌</span></div>
                
                <div class="gm-popup-subtitle">高级设置 (全局)</div>
                <div class="gm-input-group" style="display:flex; gap:10px;">
                    <div style="flex:1"><span class="gm-input-label">并发数</span><input class="gm-popup-input" type="number" id="inp-tpl-max-threads" value="${App.userConfig.maxConcurrency}" min="1"></div>
                    <div style="flex:1"><span class="gm-input-label">间隔(ms)</span><input class="gm-popup-input" type="number" id="inp-tpl-download-delay" value="${App.userConfig.downloadDelay}" min="0"></div>
                </div>
                <div class="gm-checkbox-row" style="margin-bottom:10px;border-bottom:1px dashed #eee;padding-bottom:10px;">
                    <input type="checkbox" id="gm-opt-single-dup" ${App.userConfig.allowDuplicate?'checked':''}>
                    <label for="gm-opt-single-dup">允许重复下载 (忽略历史)</label>
                </div>

                <div class="gm-checkbox-row" style="margin-bottom:10px;border-bottom:1px dashed #eee;padding-bottom:10px;">
                    <input type="checkbox" id="gm-opt-retain-name" ${App.userConfig.retainOriginalFiles ? 'checked' : ''}>
                    <label for="gm-opt-retain-name" title="尝试从图片标题提取原始文件名">保留原始文件名 (优先使用 alt/title)</label>
                </div>

                <div class="gm-input-group"><span class="gm-input-label">图片目录</span><input class="gm-popup-input" id="inp-tpl-img-folder" value="${App.userConfig.tplImgFolder||''}"></div>
                <div class="gm-input-group"><span class="gm-input-label">图片文件名 (备份规则)</span><input class="gm-popup-input" id="inp-tpl-img-file" value="${App.userConfig.tplImgFileName}"></div>
                <div class="gm-input-group"><span class="gm-input-label">文本目录</span><input class="gm-popup-input" id="inp-tpl-txt-folder" value="${App.userConfig.tplTextFolder||''}"></div>
                <div class="gm-input-group"><span class="gm-input-label">文本文件名</span><input class="gm-popup-input" id="inp-tpl-txt-file" value="${App.userConfig.tplTextFileName}"></div>
                <div class="gm-tags-container-small">
                    <div class="gm-tag-small" onclick="UI.insertTag('{{author}}')">昵称</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{author_id}}')">UID</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{title}}')">标题</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{index}}')">序号</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{date}}')">日期</div>
                </div>

                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #eee; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:12px;color:#666;">历史记录</span>
                    <div>
                        <button class="gm-hist-btn" id="gm-btn-import-single" title="导入 .json 历史记录">📥</button>
                        <button class="gm-hist-btn" id="gm-btn-export-single" title="导出历史记录">📤</button>
                        <button class="gm-hist-btn danger" id="gm-btn-clear-single" title="清空历史">🗑️</button>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);
            
            var bind = function(id, k) { var el=document.getElementById(id); if(el) { el.onfocus=function(){UI.lastFocusedInput=this}; el.oninput=function(){ App.userConfig[k]=this.value; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); }; } };
            bind('inp-tpl-img-folder', 'tplImgFolder'); bind('inp-tpl-img-file', 'tplImgFileName');
            bind('inp-tpl-txt-folder', 'tplTextFolder'); bind('inp-tpl-txt-file', 'tplTextFileName');
            
            // New inputs bindings for single panel
            var elThreads = document.getElementById('inp-tpl-max-threads');
            if(elThreads) elThreads.oninput = function() { App.userConfig.maxConcurrency = parseInt(this.value) || 5; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); };
            
            var elDelay = document.getElementById('inp-tpl-download-delay');
            if(elDelay) elDelay.oninput = function() { App.userConfig.downloadDelay = parseInt(this.value) || 100; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); };
            
            var elDup = document.getElementById('gm-opt-single-dup');
            if(elDup) elDup.onchange = function() { App.userConfig.allowDuplicate = this.checked; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); };

            var ck = document.getElementById('gm-opt-retain-name');
            if(ck) ck.onchange = function() { App.userConfig.retainOriginalFiles = this.checked; localStorage.setItem(App.key, JSON.stringify(App.userConfig)); };

            // Bind history buttons for single mode
            document.getElementById('gm-btn-import-single').onclick = Utils.importHistory;
            document.getElementById('gm-btn-export-single').onclick = Utils.exportHistory;
            document.getElementById('gm-btn-clear-single').onclick = Utils.clearHistory;
        },

        renderBatchConfigPopup: function() {
            var popup = document.createElement('div'); popup.id = 'gm-filter-popup';
            popup.innerHTML = `
                <div class="gm-popup-title">⚙️ 批量下载设置 <span style="cursor:pointer;float:right" onclick="this.parentNode.parentNode.style.display='none'">❌</span></div>
                
                <div class="gm-popup-subtitle">下载内容选择</div>
                <div class="gm-check-group">
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-text" ${App.userConfig.batchText?'checked':''}>文本</label>
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-img" ${App.userConfig.batchImg?'checked':''}>图片</label>
                    <label class="gm-check-item"><input type="checkbox" id="gm-opt-video" ${App.userConfig.batchVideo?'checked':''}>视频</label>
                </div>

                <div class="gm-popup-subtitle">高级选项</div>
                <div class="gm-input-group" style="display:flex; gap:10px;">
                    <div style="flex:1"><span class="gm-input-label">并发数</span><input class="gm-popup-input" type="number" id="inp-max-threads" value="${App.userConfig.maxConcurrency}" min="1"></div>
                    <div style="flex:1"><span class="gm-input-label">间隔(ms)</span><input class="gm-popup-input" type="number" id="inp-download-delay" value="${App.userConfig.downloadDelay}" min="0"></div>
                </div>
                <div class="gm-checkbox-row">
                    <input type="checkbox" id="gm-opt-dup" ${App.userConfig.allowDuplicate?'checked':''}>
                    <label for="gm-opt-dup">允许重复下载 (忽略历史)</label>
                </div>
                <div class="gm-checkbox-row">
                    <input type="checkbox" id="gm-opt-batch-retain" ${App.userConfig.batchRetainOriginal?'checked':''}>
                    <label for="gm-opt-batch-retain">保留原始文件名 (图片)</label>
                </div>
                
                <div class="gm-input-group" style="margin-top:10px;">
                    <span class="gm-input-label">批量图片/视频目录</span>
                    <input class="gm-popup-input" id="inp-batch-img-folder" value="${App.userConfig.batchImgFolder||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量图片文件名 (备份规则)</span>
                    <input class="gm-popup-input" id="inp-batch-img-file" value="${App.userConfig.batchImgFileName||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量文本目录</span>
                    <input class="gm-popup-input" id="inp-batch-txt-folder" value="${App.userConfig.batchTextFolder||''}">
                </div>
                <div class="gm-input-group">
                    <span class="gm-input-label">批量文本文件名</span>
                    <input class="gm-popup-input" id="inp-batch-txt-file" value="${App.userConfig.batchTextFileName||''}">
                </div>
                
                <div class="gm-tags-container-small">
                    <div class="gm-tag-small" onclick="UI.insertTag('{{author}}')">作者</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{title}}')">标题</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{date}}')">日期</div>
                    <div class="gm-tag-small" onclick="UI.insertTag('{{index}}')">序号</div>
                </div>

                <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #eee; text-align:right;">
                    <span style="font-size:11px;color:#999;cursor:pointer;margin-right:10px;" onclick="if(confirm('清空历史记录？')) {App.downloadHistory.clear();localStorage.setItem(App.historyKey,'[]');alert('已清空')}">🗑️ 清空历史</span>
                </div>
            `;
            document.body.appendChild(popup);

            // 绑定事件
            var inputs = ['gm-opt-text', 'gm-opt-img', 'gm-opt-video', 'gm-opt-dup', 'gm-opt-batch-retain', 
                          'inp-batch-img-folder', 'inp-batch-img-file', 'inp-batch-txt-folder', 'inp-batch-txt-file',
                          'inp-max-threads', 'inp-download-delay', 'inp-scan-delay'];
            
            inputs.forEach(function(id) {
                var el = document.getElementById(id);
                if(!el) return;
                
                if(el.type === 'checkbox') {
                    el.onchange = function() {
                        if(id === 'gm-opt-text') App.userConfig.batchText = this.checked;
                        if(id === 'gm-opt-img') App.userConfig.batchImg = this.checked;
                        if(id === 'gm-opt-video') App.userConfig.batchVideo = this.checked;
                        if(id === 'gm-opt-dup') App.userConfig.allowDuplicate = this.checked;
                        if(id === 'gm-opt-batch-retain') App.userConfig.batchRetainOriginal = this.checked;
                        localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                    };
                } else {
                    el.onfocus = function() { UI.lastFocusedInput = this; };
                    el.oninput = function() {
                        if(id === 'inp-batch-img-folder') App.userConfig.batchImgFolder = this.value;
                        if(id === 'inp-batch-img-file') App.userConfig.batchImgFileName = this.value;
                        if(id === 'inp-batch-txt-folder') App.userConfig.batchTextFolder = this.value;
                        if(id === 'inp-batch-txt-file') App.userConfig.batchTextFileName = this.value;
                        if(id === 'inp-max-threads') App.userConfig.maxConcurrency = parseInt(this.value) || 5;
                        if(id === 'inp-download-delay') App.userConfig.downloadDelay = parseInt(this.value) || 100;
                        if(id === 'inp-scan-delay') App.userConfig.scanDelay = parseInt(this.value) || 800;
                        localStorage.setItem(App.key, JSON.stringify(App.userConfig));
                    };
                }
            });
        },

        togglePopup: function(id, trigger) { 
            var p = document.getElementById(id); 
            if(!p) return;
            
            if(window.getComputedStyle(p).display === 'none') { 
                p.style.display='block'; 
                // 智能定位
                if (trigger) {
                    var rect = trigger.getBoundingClientRect();
                    var pRect = p.getBoundingClientRect();
                    var top = rect.top;
                    var left = rect.right + 10; // 默认显示在右侧
                    
                    // 如果右侧超出屏幕，则显示在左侧
                    if (left + pRect.width > window.innerWidth) {
                        left = rect.left - pRect.width - 10;
                    }
                    // 如果底部超出屏幕，向上偏移
                    if (top + pRect.height > window.innerHeight) {
                        top = window.innerHeight - pRect.height - 10;
                    }
                    
                    p.style.top = top + 'px';
                    p.style.left = left + 'px';
                } else {
                    p.style.top='150px'; p.style.left='200px'; 
                }
            } else {
                p.style.display='none'; 
            }
        },
        insertTag: function(tag) { 
            // 默认插入到图片文件名框，或者最后聚焦的框
            var el = UI.lastFocusedInput;
            if (!el) {
                // 如果是批量模式，默认插到批量图片文件名；如果是单贴模式，插到单贴图片文件名
                if (document.getElementById('gm-filter-popup') && document.getElementById('gm-filter-popup').style.display !== 'none') {
                    el = document.getElementById('inp-batch-img-file');
                } else {
                    el = document.getElementById('inp-tpl-img-file');
                }
            }
            
            if(el) {
                var start = el.selectionStart; var end = el.selectionEnd; var val = el.value;
                el.value = val.substring(0, start) + tag + val.substring(end);
                el.dispatchEvent(new Event('input'));
                el.focus();
                el.setSelectionRange(start + tag.length, start + tag.length);
            }
        },
        resetButtons: function() {
             var b = document.getElementById('gm-btn-text'); if(b) { b.childNodes[0].nodeValue = '💾 文本 '; b.style.backgroundColor='#3498db'; }
             var b2 = document.getElementById('gm-btn-img'); if(b2) { b2.childNodes[0].nodeValue = '🖼️ 图片 '; b2.style.backgroundColor='#9b59b6'; }
             var b3 = document.getElementById('gm-btn-batch-run'); if(b3) { b3.innerText = '⚡ 批量下载'; b3.disabled = false; b3.style.backgroundColor='#8e44ad'; }
        },
        updateStatus: function(txt, col) {
             var b = document.getElementById('gm-btn-text');
             if(App.currentMode === 'download' && b) { b.childNodes[0].nodeValue = txt; b.style.backgroundColor = col; }
             var b2 = document.getElementById('gm-btn-img');
             if(App.currentMode === 'images' && b2) { b2.childNodes[0].nodeValue = txt; b2.style.backgroundColor = col; }
             var b3 = document.getElementById('gm-btn-batch-run');
             if(b3) { b3.innerText = txt; b3.style.backgroundColor = col; b3.disabled = true; }
        },
        showProgress: function() { document.getElementById('gm-progress-container').style.display='block'; },
        hideProgress: function() { document.getElementById('gm-progress-container').style.display='none'; },
        updateProgress: function(curr, total) { var p = document.getElementById('gm-progress-bar'); if(p) p.style.width = Math.floor((curr/total)*100) + '%'; },
        showToast: function(msg) { var t = document.querySelector('.gm-toast'); if(!t) { t=document.createElement('div'); t.className='gm-toast'; document.body.appendChild(t); } t.innerText = msg; t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); }, 3000); },
        makeDraggable: function(el, handle) {
            var pos1=0,pos2=0,pos3=0,pos4=0;
            handle.onmousedown = function(e) { e.preventDefault(); pos3=e.clientX; pos4=e.clientY; document.onmouseup=function(){document.onmouseup=null;document.onmousemove=null;}; document.onmousemove=function(e){ e.preventDefault(); pos1=pos3-e.clientX; pos2=pos4-e.clientY; pos3=e.clientX; pos4=e.clientY; el.style.top=(el.offsetTop-pos2)+"px"; el.style.left=(el.offsetLeft-pos1)+"px"; }; };
        }
    };
    
    var Keyboard = {
        globalHandler: function(e) {
            if (window.location.href.indexOf('home.php') !== -1) return;
            if (e.altKey && (e.key === 'i' || e.key === 'I')) { e.preventDefault(); Scraper.init('images', !e.ctrlKey); }
        },
        spacePageHandler: function(e) {
            if (window.location.href.indexOf('do=thread') === -1 && window.location.href.indexOf('mod=forumdisplay') === -1) return;
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.key === 'ArrowLeft') {
                var prev = document.querySelector('.pg .pgb a') || document.querySelector('.pg a.prev');
                if (prev) { e.preventDefault(); prev.click(); }
            } else if (e.key === 'ArrowRight') {
                var next = document.querySelector('.pg a.nxt');
                if (next) { e.preventDefault(); next.click(); }
            }
        }
    };

    Styles.init(); 
    UI.init();
    
    document.addEventListener('keydown', Keyboard.globalHandler);
    document.addEventListener('keydown', Keyboard.spacePageHandler);

})();