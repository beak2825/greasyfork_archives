// ==UserScript==
// @name         轻量级聚合搜索-精美侧边栏版 (Gemini修改版)
// @name:en      Light aggregate search
// @namespace    http://bbs.91wc.net/aggregate-search.htm
// @version      12.4.0
// @description  搜索引擎切换，增加临时关闭、域名黑白名单、一键添加域名功能。修复布局问题，增加文字头像兜底。
// @description:en Switch search engine, with temporary close, domain whitelist/blacklist, and one-click add domain features.
// @author       Wilson & Modified by Gemini
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @match        *://*/*
// @exclude      *://www.google.com/recaptcha/*
// @exclude      *://gmail.com/*
// @exclude      *://mail.*.com/*
// @exclude      *://mail.163.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/561164/%E8%BD%BB%E9%87%8F%E7%BA%A7%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2-%E7%B2%BE%E7%BE%8E%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%89%88%20%28Gemini%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561164/%E8%BD%BB%E9%87%8F%E7%BA%A7%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2-%E7%B2%BE%E7%BE%8E%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%89%88%20%28Gemini%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // --- 脚本运行前置检查 ---
    var scriptEnabled = GM_getValue("wish_script_enabled", true);
    var domainMode = GM_getValue("wish_domain_mode", "blacklist"); // 可选: blacklist, whitelist, disabled
    var domainListText = GM_getValue("wish_domain_list", "gmail.com\nmail.google.com\nmail.163.com");
    var domainList = domainListText.split('\n').map(d => d.trim()).filter(Boolean);
    var currentHost = window.location.hostname;

    if (!scriptEnabled) {
        $('body').append(`
            <div id="wish-reenable-btn" title="聚合搜索已停用，点击启用" style="position: fixed; left: 10px; bottom: 10px; z-index: 2147483647; background: #f44336; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 20px;">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
            </div>
        `);
        $('#wish-reenable-btn').on('click', function() {
            GM_setValue("wish_script_enabled", true);
            location.reload();
        });
        return;
    }

    if (domainMode === 'whitelist') {
        let isWhitelisted = domainList.some(domain => currentHost.includes(domain));
        if (!isWhitelisted) {
            console.log('聚合搜索: 当前域名不在白名单中，脚本已禁用。');
            return;
        }
    } else if (domainMode === 'blacklist') {
        let isBlacklisted = domainList.some(domain => currentHost.includes(domain));
        if (isBlacklisted) {
            console.log('聚合搜索: 当前域名在黑名单中，脚本已禁用。');
            return;
        }
    }

    // --- 默认配置 ---
    var DEFAULT_CONFIG = {
        is_google_blank: 1,
        cache_days: 30,
        trigger_width: 20,
        panel_width: 280,
        panel_width_icon: 80,
        panel_height: 540,
        win_width: 900,
        win_height: 700,
        is_pinned: false,
        item_height: 40,
        global_hotkey: "Ctrl+g"
    };

    var defaultLinkListText = `
[谷歌搜索] [https://www.google.com/search?q=%s]
[百度搜索] [https://www.baidu.com/s?wd=%s]
[Bing搜索] [https://cn.bing.com/search?q=%s]
[B站] [http://search.bilibili.com/all?keyword=%s]
[微信] [http://weixin.sogou.com/weixin?type=2&query=%s]
[Yandex] [https://yandex.com/search/?text=%s]
[GitHub] [https://github.com/search?utf8=✓&q=%s]
[知乎] [https://www.zhihu.com/search?type=content&q=%s]
[淘宝] [https://s.taobao.com/search?q=%s]
[京东] [http://search.jd.com/Search?keyword=%s]
[豆瓣] [https://www.douban.com/search?source=suggest&q=%s]
[YouTube] [https://www.youtube.com/results?search_query=%s]
[百度翻译] [https://fanyi.baidu.com/#en/zh/%s]
[谷歌翻译] [https://translate.google.com/?text=%s]
[维基百科] [https://zh.wikipedia.org/wiki/%s]
[Stackoverflow] [https://stackoverflow.com/search?q=%s]
[Startpage] [https://www.startpage.com/sp/search?q=%s]
[DuckDuckGo] [https://duckduckgo.com/?q=%s]
`.trim();

    var DEFAULT_FOLDER_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g0PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgaGVpZHRoPSIxOCIgZmlsbD0iI2JiYiI+PHBhdGggZD0iTTEwIDRINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJoMTJhMiAyIDAgMDAyLTJWOGEyIDIgMCAwMC0yLTJkLTgtNi0yLTJ6Ii8+PC9zdmc+";

    var ICONS = {
        pin_outline: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7l-2 2v2h10v-2l-2-2V5a3 3 0 0 0-3-3z"></path><path d="M12 14v8"></path></svg>',
        pin_filled: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7l-2 2v2h10v-2l-2-2V5a3 3 0 0 0-3-3z"></path><path d="M12 14v8"></path></svg>',
        settings: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.82 1.51l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        layout: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        more: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>',
        power: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
        close: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        shield: '<svg style="pointer-events:none" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>'
    };

    var trim = str => (typeof str === 'string' ? str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : str);
    var getDomain = url => { try { return new URL(url).hostname; } catch (e) { return ""; } };
    var generateUniqueId = () => 'se-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

// --- 辅助函数：根据名字生成颜色和文字头像 ---
    var generateLetterIcon = function(name) {
        if (!name) name = "?";
        var letter = name.charAt(0).toUpperCase();

        // 1. 根据名字计算 Hash 值，用于生成伪随机颜色
        // (这样做的好处是：同一个网站每次刷新颜色是固定的，但不同网站颜色看起来是随机的)
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        // 2. 使用 HSL 生成颜色
        // Hue (色相): 0 - 360 (全色谱随机)
        var h = Math.abs(hash) % 360;
        // Saturation (饱和度): 70% - 90% (保证颜色鲜艳)
        var s = 70 + (Math.abs(hash) % 20);
        // Lightness (亮度): 40% - 55% (关键点：控制在中间值，既能在白底看清，也能在黑底看清)
        var l = 40 + (Math.abs(hash) % 15);

        var color = `hsl(${h}, ${s}%, ${l}%)`;

        // 3. 生成无背景 SVG
        var svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <text x="50%" y="50%" dy=".35em" text-anchor="middle" fill="${color}" font-family="sans-serif" font-weight="900" font-size="24">${letter}</text>
        </svg>`;
        return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    };

    var searchDataList = [];
    var searchDataMap = new Map();

    var IconManager = {
        get: function(domain, name, callback) {
            if (!domain) return callback("");
            var key = "icon_v2_" + domain;
            var cached = GM_getValue(key);
            var now = Date.now();
            if (cached && (now - cached.time < DEFAULT_CONFIG.cache_days * 86400000)) {
                return callback(cached.data);
            }
            // 缓存不存在，先不返回，继续请求
            var faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            GM_xmlhttpRequest({
                method: "GET", url: faviconUrl, responseType: "blob",
                onload: function(response) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        if (base64data && base64data.length > 100) {
                            GM_setValue(key, { data: base64data, time: now });
                            callback(base64data); // 获取成功，回调图片
                        } else {
                             // 获取失败时不存空值，下次再试，或者由UI保持显示文字头像
                        }
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function() { }
            });
        }
    };

    var DataManager = {
        parseTextAndAssignIds: function(text) {
            var lines = text.split(/\r?\n/);
            var result = [];
            lines.forEach(line => {
                line = trim(line);
                if (!line) return;
                var match = line.match(/\[(.*?)\]\s*\[(.*?)\]/);
                if (match) {
                    var name = match[1].trim();
                    var url = match[2].trim();
                    var isNewWindow = /\[\s*?新窗口(打开)?\s*?\]/.test(line);
                    var isHidden = /\[\s*?隐藏\s*?\]/.test(line);
                    var isGroup = url.startsWith("group://");
                    result.push({
                        id: isGroup ? null : generateUniqueId(),
                        name: name,
                        url: url,
                        newWindow: isNewWindow,
                        hidden: isHidden
                    });
                }
            });
            return result;
        },
        load: function() {
            var dataV2 = GM_getValue("wish_search_data_with_ids");
            if (dataV2) {
                try { searchDataList = JSON.parse(dataV2); } catch(e) { searchDataList = this.parseTextAndAssignIds(defaultLinkListText); }
            } else {
                var oldData = GM_getValue("wish_s_searchlinklist") || defaultLinkListText;
                searchDataList = this.parseTextAndAssignIds(oldData);
                this.save();
            }
            searchDataMap.clear();
            searchDataList.forEach(item => { if (item.id) searchDataMap.set(item.id, item); });
        },
        save: function() {
            GM_setValue("wish_search_data_with_ids", JSON.stringify(searchDataList));
            searchDataMap.clear();
            searchDataList.forEach(item => { if (item.id) searchDataMap.set(item.id, item); });
        }
    };


    var main = function() {
        DataManager.load();

        var savedDelay = GM_getValue("wish_config_trigger_delay", DEFAULT_CONFIG.trigger_delay);
        var savedPanelW = GM_getValue("wish_panel_w", DEFAULT_CONFIG.panel_width);
        var savedPanelWIcon = GM_getValue("wish_panel_w_icon", DEFAULT_CONFIG.panel_width_icon);
        var savedPanelH = GM_getValue("wish_panel_h", DEFAULT_CONFIG.panel_height);
        var savedItemH = GM_getValue("wish_item_height", DEFAULT_CONFIG.item_height);
        var savedHotkey = GM_getValue("wish_global_hotkey", DEFAULT_CONFIG.global_hotkey);
        var isPinned = GM_getValue("wish_pinned", false);
        var isTemporarilyClosed = false;

        var CONFIG = {
            ...DEFAULT_CONFIG,
            trigger_delay: parseInt(savedDelay),
            panel_width: parseInt(savedPanelW),
            panel_width_icon: parseInt(savedPanelWIcon),
            panel_height: parseInt(savedPanelH),
            item_height: parseInt(savedItemH),
            global_hotkey: savedHotkey
        };

        if (document.domain.indexOf("google.com") !== -1 && CONFIG.is_google_blank) {
            $("#search .rc a").attr("target", "_blank");
        }

        var getKeyword = function() {
            var sidebarInput = $("#wish-search-input").val();
            if (sidebarInput && sidebarInput.trim() !== "") return encodeURIComponent(sidebarInput.trim());
            var val = $("input[name=q], input[name=wd], input[name=query], input[name=text], input[name=p], #kw, #search_input, input[type=search]").val();
            if (!val) {
                var selection = window.getSelection().toString();
                if(selection && selection.trim() !== "") return encodeURIComponent(selection.trim());
            }
            return encodeURIComponent((val || "").trim());
        };

var renderList = function() {
            var html = "";
            var index = 0;
            searchDataList.forEach(item => {
                if (item.hidden) return;
                var isGroup = item.url.startsWith("group://");
                var shortcutHint = (index < 9) ? `Alt+${index + 1}` : "";

                if (isGroup) {
                    // --- 组的处理逻辑 ---
                    var groupIds = [];
                    try { groupIds = JSON.parse(decodeURIComponent(item.url.replace("group://", ""))); } catch (e) {}

                    // 获取组内前4个
                    var subItems = groupIds.map(id => searchDataMap.get(id)).filter(Boolean).slice(0, 4);
                    var iconHtml = "";

                    if (subItems.length > 0) {
                        // 【这里是关键】：四宫格模式
                        iconHtml = '<div class="wish-group-grid">';
                        subItems.forEach(sub => {
                            var subDomain = getDomain(sub.url.replace("%s", ""));

                            // 1. 核心代码：生成文字头像 (例如 "谷歌" -> "谷")
                            var subFallback = generateLetterIcon(sub.name);

                            // 2. 将 src 默认设为文字头像
                            // class="wish-group-subicon" 会被脚本底部的逻辑尝试替换为真实图标，如果替换失败，就保持显示文字
                            iconHtml += `<img class="wish-group-subicon" data-domain="${subDomain}" src="${subFallback}" style="width:100%;height:100%;object-fit:cover;">`;
                        });
                        iconHtml += '</div>';
                    } else {
                        // 空组的情况：显示组名的第一个字
                        var groupLetterIcon = generateLetterIcon(item.name);
                        iconHtml = `<img class="wish-icon" src="${groupLetterIcon}" />`;
                    }

                    html += `
                    <div class="wish-item wish-group-item" data-index="${index++}" data-url='${item.url}'>
                        <div class="wish-checkbox-placeholder"></div>
                        <a href="javascript:;" class="wish-link">
                            <div class="wish-icon-container">${iconHtml}</div>
                            <span class="wish-text" style="font-weight:600; color:var(--wish-primary)">${item.name}</span>
                            <span class="wish-shortcut-hint">${shortcutHint}</span>
                        </a>
                    </div>`;

                } else {
                    // --- 普通列表项的处理逻辑 ---
                    var url = item.url;
                    if (url.indexOf("%s") === -1) url += "%s";
                    var domain = getDomain(url.replace("%s", ""));

                    // 1. 核心代码：生成文字头像
                    var textIcon = generateLetterIcon(item.name);

                    // 2. 将 src 默认设为文字头像
                    html += `
                    <div class="wish-item" data-index="${index++}" data-id="${item.id}" data-url="${url}" data-original-name="${item.name}" data-target="${item.newWindow ? '_blank' : '_self'}">
                        <label class="wish-checkbox-wrapper">
                            <input type="checkbox" class="wish-check">
                            <span class="wish-checkmark"></span>
                        </label>
                        <a href="javascript:;" class="wish-link" title="${item.name}">
                            <div class="wish-icon-container">
                                <img class="wish-icon" data-domain="${domain}" data-name="${item.name}" src="${textIcon}" />
                            </div>
                            <span class="wish-text">${item.name}</span>
                            <span class="wish-shortcut-hint">${shortcutHint}</span>
                        </a>
                    </div>`;
                }
            });
            return html;
        };

        var initUI = function() {
            var pos = GM_getValue("wish_s_position", "auto");
            var initialSideClass = (pos === 'right') ? 'wish-side-right' : 'wish-side-left';
            var currentLayout = GM_getValue("wish_layout_mode", "full");
            var initialPanelWidth = (currentLayout === 'icon-only') ? CONFIG.panel_width_icon : CONFIG.panel_width;

            var css = `
            <style>
                :root {
                    --wish-bg: rgba(255, 255, 255, 0.9);
                    --wish-border: rgba(255, 255, 255, 0.7);
                    --wish-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.4) inset;
                    --wish-item-bg: rgba(255, 255, 255, 0.4);
                    --wish-item-hover: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7));
                    --wish-item-active: rgba(0, 122, 255, 0.1);
                    --wish-item-shadow: 0 2px 6px rgba(0,0,0,0.04);
                    --wish-item-hover-shadow: 0 6px 14px rgba(0,0,0,0.09);
                    --wish-primary: #007aff;
                    --wish-text: #333;
                    --wish-panel-w: ${initialPanelWidth}px;
                    --wish-panel-h: ${CONFIG.panel_height}px;
                    --wish-item-h: ${CONFIG.item_height}px;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --wish-bg: rgba(40, 40, 40, 0.9);
                        --wish-border: rgba(255, 255, 255, 0.1);
                        --wish-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
                        --wish-item-bg: rgba(255, 255, 255, 0.05);
                        --wish-item-hover: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.1));
                        --wish-item-active: rgba(10, 132, 255, 0.3);
                        --wish-item-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        --wish-item-hover-shadow: 0 6px 12px rgba(0,0,0,0.4);
                        --wish-text: #f0f0f0;
                    }
                }
                .wish-list::-webkit-scrollbar { width: 3px; height: 3px; }
                .wish-list::-webkit-scrollbar-track { background: transparent; }
                .wish-list::-webkit-scrollbar-thumb { background: transparent; border-radius: 3px; }
                .wish-list.scrolling::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.4); transition: background 0.2s; }
                .wish-list.scrolling::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.6); }

                .wish-trigger-zone { position: fixed; top: 0; bottom: 0; width: ${CONFIG.trigger_width}px; z-index: 2147483646; background: transparent; cursor: default; }
                #wish-trigger-left { left: 0; }
                #wish-trigger-right { right: 0; }

                #wish-panel {
                    position: fixed; width: var(--wish-panel-w); height: var(--wish-panel-h);
                    background: var(--wish-bg);
                    backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%);
                    border: 1px solid var(--wish-border); box-shadow: var(--wish-shadow);
                    z-index: 2147483647; border-radius: 16px;
                    display: flex; flex-direction: column; opacity: 0; pointer-events: none;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s;
                }
                #wish-panel.wish-side-left { left: 16px; transform: translateX(-120%); }
                #wish-panel.wish-side-left.wish-active { transform: translateX(0); opacity: 1; pointer-events: auto; }
                #wish-panel.wish-side-right { right: 16px; transform: translateX(120%); }
                #wish-panel.wish-side-right.wish-active { transform: translateX(0); opacity: 1; pointer-events: auto; }

                .wish-resize-bar { position: absolute; top: 0; bottom: 0; width: 6px; cursor: col-resize; z-index: 10; }
                #wish-panel.wish-side-left .wish-resize-bar { right: -3px; }
                #wish-panel.wish-side-right .wish-resize-bar { left: -3px; }
                .wish-resize-bar-bottom { position: absolute; left: 0; right: 0; bottom: -3px; height: 6px; cursor: row-resize; z-index: 10; }

                /* 问题1修复：Top Row 布局调整，容纳所有按钮 */
                .wish-top-row {
                    display: flex; align-items: center; padding: 10px 8px 4px 8px; gap: 4px;
                    flex-shrink: 0; width: 100%; box-sizing: border-box;
                    z-index: 20; position: relative;
                }
                #wish-search-input {
                    flex: 1 1 auto; min-width: 0; width: 100px; /* 允许缩小 */
                    box-sizing: border-box; padding: 0 12px; border-radius: 99px;
                    border: 1px solid rgba(128,128,128,0.15); background: var(--wish-item-bg);
                    color: var(--wish-text); font-size: 13px; outline: none; transition: all 0.25s;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
                    height: 30px; line-height: 30px;
                }
                #wish-search-input:focus { border-color: var(--wish-primary); background: var(--wish-bg); box-shadow: 0 4px 12px rgba(0,122,255,0.15); }
                .wish-icon-btn {
                    width: 28px; height: 28px; flex-shrink: 0;
                    border-radius: 50%; display: flex; justify-content: center; align-items: center;
                    cursor: pointer; color: var(--wish-text); opacity: 0.6; transition: all 0.2s; background: transparent;
                }
                .wish-icon-btn:hover { opacity: 1; background: var(--wish-item-bg); color: var(--wish-primary); transform:scale(1.1); }
                .wish-icon-btn.active { opacity: 1; color: var(--wish-primary); background: var(--wish-item-bg); }

                .wish-list { flex: 1 1 auto; height: 0; overflow-y: auto; overflow-x: hidden; padding: 8px 14px; min-height: 0; }
                .wish-item, .wish-batch-btn, .wish-btn-light, .wish-tooltip-item {
                    display: flex; align-items: center; height: var(--wish-item-h); border-radius: 999px;
                    margin-bottom: 6px; background: var(--wish-item-bg); border: 1px solid transparent;
                    box-shadow: var(--wish-item-shadow); transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position:relative; cursor: pointer; color: var(--wish-text); text-decoration: none !important;
                }
                .wish-batch-btn, .wish-btn-light { justify-content: center; width: 100%; font-size: calc(var(--wish-item-h) * 0.34); font-weight: 600; padding: 0; }
                .wish-item:hover, .wish-batch-btn:hover, .wish-btn-light:hover, .wish-tooltip-item:hover {
                    background: var(--wish-item-hover); box-shadow: var(--wish-item-hover-shadow);
                    transform: translateY(-2px); border-color: rgba(255,255,255,0.3); z-index: 2;
                }
                .wish-item:active, .wish-item.wish-selected, .wish-batch-btn:active, .wish-btn-light:active, .wish-tooltip-item:active {
                    background: var(--wish-item-active); box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); transform: scale(0.98);
                }
                .wish-item.wish-selected { border-color: var(--wish-primary); }
                .wish-batch-btn { color: var(--wish-primary); }
                .wish-btn-light { color: var(--wish-text); opacity: 0.9; }

                .wish-checkbox-wrapper { display: flex; align-items: center; height: 100%; position: relative; width: 20px; margin-right: 6px; padding-left: 10px; cursor: pointer; user-select: none; }
                .wish-checkbox-placeholder { width: 36px; height: 100%; }
                .wish-check { position: absolute; opacity: 0; cursor: pointer; }
                .wish-checkmark { position: absolute; left: 10px; background: transparent; border: 1.5px solid rgba(128,128,128,0.4); border-radius: 50%; width: 14px; height: 14px; transition:0.2s; }
                .wish-item:hover .wish-checkmark { border-color: rgba(128,128,128,0.8); }
                .wish-check:checked ~ .wish-checkmark { background-color: var(--wish-primary); border-color: var(--wish-primary); box-shadow: 0 2px 4px rgba(0,122,255,0.3); }
                .wish-checkmark:after { content: ""; position: absolute; display: none; left: 35%; top: 15%; width: 25%; height: 50%; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
                .wish-check:checked ~ .wish-checkmark:after { display: block; }

                .wish-link { flex: 1; display: flex; align-items: center; text-decoration: none !important; color: inherit; margin-left: 2px; overflow: hidden; height: 100%; }
                .wish-icon-container { width: 22px; height: 22px; margin-right: 12px; flex-shrink: 0; display:flex; align-items:center; justify-content:center;}
                .wish-icon { width: 100%; height: 100%; border-radius: 5px; object-fit: contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1)); }
                .wish-group-grid { width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; border-radius: 5px; overflow: hidden; background: rgba(128,128,128,0.1); gap: 1px; }
                .wish-group-subicon { width: 100%; height: 100%; object-fit: cover; }
                .wish-text { font-size: calc(var(--wish-item-h) * 0.35); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex:1;}
                .wish-shortcut-hint { font-size: 11px; color: inherit; margin-left: 8px; opacity: 0.8; font-family: monospace; font-weight: 600; padding-right: 10px; }

                .wish-footer {
                    padding: 8px 14px 12px 14px; border-top: 1px solid rgba(128,128,128,0.1);
                    text-align: center; flex-shrink: 0; display: none;
                    flex-direction: column; gap: 8px; width: 100%; box-sizing: border-box;
                    z-index: 10;
                }
                .wish-footer-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
                .wish-footer-links { font-size: 11px; color: var(--wish-text); opacity: 0.6; display:flex; gap:10px; align-items:center; }
                .wish-action-link { cursor: pointer; transition: opacity 0.2s; white-space:nowrap; } .wish-action-link:hover { opacity: 1; color: var(--wish-primary); }

                #wish-tooltip-panel {
                    position: fixed; z-index: 2147483648;
                    background: var(--wish-bg); backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid var(--wish-border); box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    border-radius: 12px; padding: 8px; display: none; width: 220px;
                    max-height: 400px; overflow-y: auto; pointer-events: auto;
                }
                .wish-tooltip-item { padding: 0 10px; margin-bottom: 4px; }
                .wish-tooltip-icon { width: 20px; height: 20px; margin-right: 10px; border-radius: 4px; object-fit:contain; }
                .wish-tooltip-text { font-size: calc(var(--wish-item-h) * 0.35); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                #wish-actions-menu {
                    position: fixed; z-index: 2147483648;
                    background: var(--wish-bg); backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid var(--wish-border); box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    border-radius: 12px; padding: 6px;
                    display: none; flex-direction: column; gap: 4px;
                }

                #wish-panel.wish-icon-only-layout { min-width: 60px; }
                #wish-panel.wish-icon-only-layout .wish-top-row { justify-content: center; padding: 6px 4px; }
                #wish-menu-btn { display: none; }
                #wish-panel.wish-icon-only-layout #wish-close-btn { display: none; }

                /* 在icon模式下，隐藏顶部工具栏的所有按钮，只显示 menu 按钮 */
                #wish-panel.wish-icon-only-layout #wish-domain-btn,
                #wish-panel.wish-icon-only-layout #wish-layout-btn,
                #wish-panel.wish-icon-only-layout #wish-pin-btn,
                #wish-panel.wish-icon-only-layout #wish-disable-btn,
                #wish-panel.wish-icon-only-layout #wish-open-setting,
                #wish-panel.wish-icon-only-layout #wish-search-input,
                #wish-panel.wish-icon-only-layout #wish-close-btn {
                    display: none;
                }
                #wish-panel.wish-icon-only-layout #wish-menu-btn { display: flex; }

                #wish-panel.wish-icon-only-layout .wish-list { padding: 4px 8px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-content: flex-start; }
                #wish-panel.wish-icon-only-layout .wish-item { width: 38px; height: 38px; margin-bottom: 0; justify-content: center; }
                #wish-panel.wish-icon-only-layout .wish-link { padding: 0; margin: 0; width: 100%; height: 100%; justify-content: center; }
                #wish-panel.wish-icon-only-layout .wish-icon-container { margin: 0; width: 24px; height: 24px; }
                #wish-panel.wish-icon-only-layout .wish-text,
                #wish-panel.wish-icon-only-layout .wish-shortcut-hint,
                #wish-panel.wish-icon-only-layout .wish-checkbox-wrapper,
                #wish-panel.wish-icon-only-layout .wish-checkbox-placeholder,
                #wish-panel.wish-icon-only-layout .wish-footer {
                    display: none !important;
                }

                /* 设置界面样式 (保持原样) */
                #wish-setting-overlay, #wish-delete-overlay, #wish-group-editor-overlay, #wish-batch-import-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 2147483648; display: none; backdrop-filter: blur(4px); justify-content: center; align-items: center; }
                #wish-setting-box, #wish-delete-box, #wish-group-editor-box, #wish-batch-import-box { background: #fff; padding: 0; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden; position: relative; border: 1px solid rgba(0,0,0,0.1); max-width: 90vw; max-height: 90vh; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #333; }
                @media (prefers-color-scheme: dark) { #wish-setting-box, #wish-delete-box, #wish-group-editor-box, #wish-batch-import-box { background: #222; border-color: #444; color: #eee; } }
                #wish-setting-box { width: ${GM_getValue('wish_win_w', CONFIG.win_width)}px; height: ${GM_getValue('wish_win_h', CONFIG.win_height)}px; }
                #wish-delete-box { width: 360px; max-height: 80vh; }
                #wish-group-editor-box { width: 450px; height: 500px; }
                #wish-batch-import-box { width: 500px; }
                .ws-header { padding: 14px 20px; border-bottom: 1px solid rgba(128,128,128,0.15); font-weight: 600; font-size: 15px; display:flex; justify-content:space-between; background: rgba(128,128,128,0.05); cursor: move; }
                .ws-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 16px; }
                .ws-config-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; flex-wrap: wrap; }
                .ws-input-sm { width: 45px; padding: 4px; border: 1px solid #ccc; border-radius: 6px; text-align: center; font-size:12px; background: transparent; color: inherit; }
                .ws-input-key { width: 90px; padding: 4px; border: 1px solid #ccc; border-radius: 6px; text-align: center; font-size:12px; font-family:monospace; background: transparent; color: inherit;}
                .ws-toolbar { display: flex; gap: 8px; margin-bottom: 12px; align-items: center; flex-wrap: wrap;}
                .ws-btn { padding: 6px 12px; border: 1px solid rgba(128,128,128,0.3); background: rgba(128,128,128,0.05); border-radius: 20px; cursor: pointer; font-size: 12px; color: inherit; white-space:nowrap; transition: all 0.2s;}
                .ws-btn:hover { background: rgba(128,128,128,0.15); border-color: rgba(128,128,128,0.5); transform: translateY(-1px); }
                .ws-btn-red { color: #e53935; border-color: rgba(229, 57, 53, 0.3); }
                .ws-btn-red:hover { background: rgba(229, 57, 53, 0.1); border-color: #e53935; }
                .ws-btn-primary { background: var(--wish-primary); color: white; border: none; }
                .ws-btn-primary:hover { filter: brightness(1.1); background: var(--wish-primary); }
                .ws-list-container { flex: 1; border: 1px solid rgba(128,128,128,0.15); border-radius: 8px; overflow-y: auto; background: rgba(128,128,128,0.03); }
                .ws-list-item { display: flex; align-items: center; padding: 0 10px; height: 40px; border-bottom: 1px solid rgba(128,128,128,0.1); background: transparent; }
                .ws-list-item:last-child { border-bottom: none; }
                .ws-drag-handle { margin-right: 8px; color: #999; cursor: grab; font-size: 14px; padding: 0 6px; height:100%; display: flex; align-items: center; }
                .ws-drag-handle:hover { color: var(--wish-primary); background: rgba(128,128,128,0.1); }
                .ws-icon-preview { width: 22px; height: 22px; object-fit: contain; margin-right: 10px; flex-shrink: 0; border-radius: 4px; }
                .ws-item-inputs { flex: 1; display: flex; gap: 8px; align-items: center; width: 100%; }
                .ws-input { padding: 4px 8px; border: 1px solid transparent; background: transparent; border-radius: 6px; font-size: 13px; color: inherit; height: 30px; box-sizing: border-box; transition: 0.2s;}
                .ws-input:focus { border-color: var(--wish-primary); background: rgba(128,128,128,0.05); outline: none; }
                .ws-input-name { width: 90px; flex-shrink: 0; font-weight: 600; }
                .ws-input-url { flex: 1; color: #666; min-width: 0; }
                .ws-chk-label { font-size: 12px; opacity:0.8; display:flex; align-items:center; gap:4px; cursor:pointer; margin-left:8px; white-space:nowrap; }
                .ws-footer { padding: 14px 20px; border-top: 1px solid rgba(128,128,128,0.15); display: flex; justify-content: flex-end; gap: 10px; background: rgba(128,128,128,0.03); }
                .ws-resize-handle { position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; cursor: nwse-resize; z-index: 10; opacity: 0.5; background: linear-gradient(135deg, transparent 50%, var(--wish-primary) 50%); }
                .ws-group-option { display: flex; align-items: center; padding: 8px 12px; border-bottom: 1px solid rgba(128,128,128,0.1); cursor: pointer; transition:background 0.1s; }
                .ws-group-option:hover { background: rgba(128,128,128,0.05); }
                .ws-group-option input { margin-right: 12px; }
                .ws-group-option img { width: 20px; height: 20px; margin-right: 12px; object-fit:contain; border-radius:4px; }
                .ws-group-option span { font-size: 13px; }
                .ws-group-option .url-hint { font-size: 12px; opacity:0.5; margin-left: 10px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
                .del-list-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid rgba(128,128,128,0.1); }
                .del-icon { width: 18px; height: 18px; margin-right: 10px; }
                .del-info { display: flex; flex-direction: column; overflow: hidden; }
                .del-name { font-weight: bold; font-size: 13px; }
                .del-url { font-size: 12px; opacity:0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            </style>`;

            var triggersHtml = '';
            if (pos === 'auto') {
                triggersHtml = `<div id="wish-trigger-left" class="wish-trigger-zone" title="左侧展开"></div><div id="wish-trigger-right" class="wish-trigger-zone" title="右侧展开"></div>`;
            } else if (pos === 'left') {
                triggersHtml = `<div id="wish-trigger-left" class="wish-trigger-zone" title="展开"></div>`;
            } else {
                triggersHtml = `<div id="wish-trigger-right" class="wish-trigger-zone" title="展开"></div>`;
            }

            // 问题2：在Top Row添加 域名管理按钮 (#wish-domain-btn) 和 移动关闭按钮 (#wish-close-btn)
            var html = `
            ${css}
            ${triggersHtml}
            <input type="file" id="ws-import-file-input" accept=".json" style="display:none;">
            <div id="wish-panel" class="${initialSideClass} ${isPinned ? 'wish-pinned wish-active' : ''} ${currentLayout === 'icon-only' ? 'wish-icon-only-layout' : ''}">
                <div class="wish-resize-bar" title="拖动调整宽度"></div>
                <div class="wish-resize-bar-bottom" title="拖动调整高度"></div>
                <div class="wish-top-row">
                    <input type="text" id="wish-search-input" placeholder="输入关键词">
                    <div class="wish-icon-btn" id="wish-domain-btn" title="添加当前域名到名单">${ICONS.shield}</div>
                    <div class="wish-icon-btn" id="wish-layout-btn" title="切换布局">${ICONS.layout}</div>
                    <div class="wish-icon-btn" id="wish-pin-btn" title="置顶">${isPinned ? ICONS.pin_filled : ICONS.pin_outline}</div>
                    <div class="wish-icon-btn" id="wish-open-setting" title="设置">${ICONS.settings}</div>
                    <div class="wish-icon-btn" id="wish-disable-btn" title="永久关闭">${ICONS.power}</div>
                    <div class="wish-icon-btn" id="wish-close-btn" title="临时关闭">${ICONS.close}</div>
                    <div class="wish-icon-btn" id="wish-menu-btn" title="更多操作">${ICONS.more}</div>
                </div>
                <div class="wish-list">
                    ${renderList()}
                </div>
                <div class="wish-footer">
                    <div class="wish-footer-row">
                        <div class="wish-footer-links">
                            <span class="wish-action-link" id="wish-side-all">全选</span>
                            <span class="wish-action-link" id="wish-side-none">不选</span>
                        </div>
                        <button class="wish-btn-light" id="wish-save-as-group">📁 存为组</button>
                    </div>
                    <button class="wish-batch-btn" id="wish-batch-open">批量打开选中</button>
                </div>
            </div>

            <div id="wish-actions-menu"></div>
            <div id="wish-tooltip-panel"></div>

            <div id="wish-setting-overlay">
                <div id="wish-setting-box">
                    <div class="ws-header"><span>搜索源管理</span></div>
                    <div class="ws-body">
                        <div class="ws-config-row">
                            <label>位置: <select id="ws-pos-select" style="padding:2px;"><option value="auto">双侧自动</option><option value="left">固定左侧</option><option value="right">固定右侧</option></select></label>
                            <label>延迟: <input type="number" id="ws-delay-input" class="ws-input-sm" value="${CONFIG.trigger_delay}">ms</label>
                            <label title="调整侧边栏的行高">行高: <input type="number" id="ws-itemh-input" class="ws-input-sm" value="${CONFIG.item_height}">px</label>
                            <label title="全局唤出快捷键 (Backspace删除)">热键: <input type="text" id="ws-hotkey-input" class="ws-input-key" value="${CONFIG.global_hotkey}" readonly></label>
                        </div>
                        <div class="ws-config-row" style="border-top: 1px solid rgba(128,128,128,0.15); padding-top: 12px; margin-top: 8px;">
                            <label for="ws-domain-mode-select">域名生效模式:</label>
                            <select id="ws-domain-mode-select" style="padding:4px; border-radius:6px; background:transparent; color:inherit; border: 1px solid #ccc;">
                                <option value="blacklist">黑名单模式 (在以下域名禁用)</option>
                                <option value="whitelist">白名单模式 (仅在以下域名启用)</option>
                                <option value="disabled">不启用</option>
                            </select>
                            <button class="ws-btn" id="ws-add-current-domain-btn" style="margin-left: 10px;"></button>
                        </div>
                        <div class="ws-config-row">
                            <textarea id="ws-domain-list-textarea" placeholder="每行一个域名, 例如: example.com" style="width: 100%; height: 80px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.15); padding: 8px; font-family: monospace; font-size: 13px; background: rgba(128,128,128,0.03); color: inherit; box-sizing: border-box; resize: vertical;"></textarea>
                        </div>
                        <div class="ws-toolbar">
                            <button class="ws-btn" id="ws-btn-all">全选</button>
                            <button class="ws-btn" id="ws-btn-none">全不选</button>
                            <button class="ws-btn" id="ws-btn-hide-sel">批量隐藏</button>
                            <button class="ws-btn" id="ws-btn-show-sel">批量显示</button>
                            <button class="ws-btn ws-btn-red" id="ws-btn-del">删除</button>
                            <span style="flex:1"></span>
                            <button class="ws-btn" id="ws-btn-batch-import" title="按指定格式批量添加新项目">批量导入</button>
                            <button class="ws-btn" id="ws-btn-import" title="从文件导入配置，将覆盖现有设置">导入</button>
                            <button class="ws-btn" id="ws-btn-export" title="将当前配置导出到文件">导出</button>
                            <button class="ws-btn" id="ws-btn-add-group">➕ 添加组</button>
                            <button class="ws-btn" id="ws-btn-add">➕ 新增</button>
                            <button class="ws-btn" id="ws-btn-reset">↺ 恢复</button>
                        </div>
                        <div class="ws-list-container" id="ws-sortable-list"></div>
                    </div>
                    <div class="ws-footer">
                        <button class="ws-btn" id="ws-close-setting">取消</button>
                        <button class="ws-btn ws-btn-primary" id="ws-save-setting">保存配置</button>
                    </div>
                    <div class="ws-resize-handle"></div>
                </div>
            </div>
            <!-- 其他弹窗HTML保持不变... -->
            <div id="wish-group-editor-overlay">
                <div id="wish-group-editor-box">
                    <div class="ws-header"><span>编辑组 (勾选要加入的引擎)</span></div>
                    <div class="ws-list-container" id="ws-group-selector" style="background:rgba(128,128,128,0.02);"></div>
                    <div class="ws-footer">
                        <button class="ws-btn" id="ws-close-group-edit">取消</button>
                        <button class="ws-btn ws-btn-primary" id="ws-save-group-edit">确定</button>
                    </div>
                </div>
            </div>
            <div id="wish-delete-overlay">
                <div id="wish-delete-box">
                    <div class="ws-header" style="color:#e53935">确认删除以下项目？</div>
                    <div class="ws-list-container" id="wish-delete-list" style="max-height:300px;"></div>
                    <div class="ws-footer">
                        <button class="ws-btn" id="wish-cancel-del">取消</button>
                        <button class="ws-btn ws-btn-red" id="wish-confirm-del">确认删除</button>
                    </div>
                </div>
            </div>
            <div id="wish-batch-import-overlay">
                <div id="wish-batch-import-box">
                    <div class="ws-header"><span>批量导入</span></div>
                    <div class="ws-body">
                        <p style="margin-top:0; margin-bottom:10px; font-size:12px; opacity:0.8;">每行一条记录，使用分隔符隔开名称和URL。新项目将添加至列表末尾。</p>
                        <div class="ws-config-row" style="justify-content:center;">
                            <label for="ws-batch-separator">分隔符:</label>
                            <input type="text" id="ws-batch-separator" class="ws-input-sm" value="|">
                        </div>
                        <textarea id="ws-batch-input-area" placeholder="例如:\n百度|https://www.baidu.com/s?wd=%s\n必应|https://cn.bing.com/search?q=%s" style="width: 100%; height: 200px; margin-top: 10px; border-radius: 8px; border: 1px solid rgba(128,128,128,0.15); padding: 8px; font-family: monospace; font-size: 13px; background: rgba(128,128,128,0.03); color: inherit; box-sizing: border-box; resize: vertical;"></textarea>
                    </div>
                    <div class="ws-footer">
                        <button class="ws-btn" id="ws-cancel-batch-import">取消</button>
                        <button class="ws-btn ws-btn-primary" id="ws-confirm-batch-import">添加至列表</button>
                    </div>
                </div>
            </div>
            `;

            $("body").append(html);

            var $panel = $("#wish-panel");
            var $tooltip = $("#wish-tooltip-panel");
            var $sidebarInput = $("#wish-search-input");
            var $footer = $(".wish-footer");
            var tooltipTimer;
            var currentSelectedIndex = -1;
            var $actionsMenu = $("#wish-actions-menu");

            // 问题3：在图标模式的菜单中添加 域名管理 和 关闭按钮
            $actionsMenu.append($("#wish-domain-btn").clone(true, true)); // 增加
            $actionsMenu.append($("#wish-layout-btn").clone(true, true));
            $actionsMenu.append($("#wish-pin-btn").clone(true, true));
            $actionsMenu.append($("#wish-open-setting").clone(true, true));
            $actionsMenu.append($("#wish-disable-btn").clone(true, true));
            $actionsMenu.append($("#wish-close-btn").clone(true, true)); // 增加

            $("#wish-menu-btn").on("click", function(e) {
                e.stopPropagation();
                var btnRect = this.getBoundingClientRect();
                var isLeft = $panel.hasClass("wish-side-left");
                var top = btnRect.top;
                var style = { top: top + 'px', left: 'auto', right: 'auto', display: 'flex' };
                if (isLeft) {
                    style.left = (btnRect.right + 5) + 'px';
                } else {
                    style.right = (window.innerWidth - btnRect.left + 5) + 'px';
                }
                $actionsMenu.css(style);
            });

            // 初始化域名按钮状态
            if(domainList.some(d => currentHost.includes(d))) {
                $("#wish-domain-btn, #wish-actions-menu #wish-domain-btn").addClass("active");
            }
            // 域名按钮点击事件
            $(document).on("click", "#wish-domain-btn", function(e){
                e.stopPropagation();
                var currentList = GM_getValue("wish_domain_list", "");
                var list = currentList.split('\n').map(d => d.trim()).filter(Boolean);
                var exists = list.some(d => currentHost.includes(d));

                if(exists) {
                    alert("当前域名已在名单中。\n请在设置中手动删除。");
                } else {
                    var modeName = domainMode === 'blacklist' ? "黑名单" : "白名单";
                    if(confirm(`将当前域名 ${currentHost} 添加到${modeName}？`)) {
                        var newList = currentList + "\n" + currentHost;
                        GM_setValue("wish_domain_list", newList.trim());
                        $(this).addClass("active");
                        $("#wish-actions-menu #wish-domain-btn").addClass("active");
                    }
                }
                $actionsMenu.hide();
            });

            $(document).on("click", "#wish-close-btn", function(e) {
                e.stopPropagation();
                $actionsMenu.hide();
                isTemporarilyClosed = true;
                $('#wish-trigger-left, #wish-trigger-right').remove();
                hidePanel();
            });

            $(document).on("click", "#wish-layout-btn", function(e) {
                e.stopPropagation();
                $actionsMenu.hide();
                var isIconOnly = $panel.hasClass("wish-icon-only-layout");
                if (isIconOnly) {
                    $panel.removeClass("wish-icon-only-layout");
                    document.documentElement.style.setProperty('--wish-panel-w', CONFIG.panel_width + 'px');
                    GM_setValue("wish_layout_mode", "full");
                } else {
                    $panel.addClass("wish-icon-only-layout");
                    document.documentElement.style.setProperty('--wish-panel-w', CONFIG.panel_width_icon + 'px');
                    GM_setValue("wish_layout_mode", "icon-only");
                }
                updateVerticalCenter();
            });

            $(document).on("click", "#wish-pin-btn", function(e) {
                e.stopPropagation();
                isPinned = !isPinned;
                $("#wish-pin-btn, #wish-actions-menu #wish-pin-btn").toggleClass("active", isPinned).html(isPinned ? ICONS.pin_filled : ICONS.pin_outline);
                $panel.toggleClass("wish-pinned", isPinned);
                GM_setValue("wish_pinned", isPinned);
                if (isPinned) { $panel.addClass("wish-active"); if (!$panel.hasClass("wish-icon-only-layout")) $sidebarInput.focus(); }
            });

            $(document).on("click", "#wish-open-setting", function(e) {
                e.stopPropagation();
                $actionsMenu.hide();
                var $c = $("#ws-sortable-list").empty();
                searchDataList.forEach(item => $c.append(createSettingItem(item)));
                $("#ws-pos-select").val(GM_getValue("wish_s_position", "auto"));
                $("#ws-domain-mode-select").val(GM_getValue("wish_domain_mode", "blacklist"));
                $("#ws-domain-list-textarea").val(GM_getValue("wish_domain_list", "gmail.com\nmail.google.com\nmail.163.com"));
                updateDomainButtonState();
                $("#wish-setting-overlay").css("display", "flex");
                if(!isPinned) hidePanel();
            });

            $(document).on("click", "#wish-disable-btn", function(e) {
                e.stopPropagation();
                $actionsMenu.hide();
                if (confirm("确定要永久关闭聚合搜索吗？\n你可以在油猴扩展中重新启用它。")) {
                    GM_setValue("wish_script_enabled", false);
                    location.reload();
                }
            });

            var $list = $(".wish-list");
            var scrollTimeout;
            $list.on('scroll', function() {
                $list.addClass('scrolling');
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function() {
                    $list.removeClass('scrolling');
                }, 1500);
            });

            var updateVerticalCenter = function() {
                var winH = $(window).height();
                var panelH = $panel.height();
                var top = Math.round((winH - panelH) / 2);
                if (top < 10) top = 10;
                $panel.css("top", top + "px");
            };
            updateVerticalCenter();
            $(window).on("resize", updateVerticalCenter);

            var showPanel = (side, preText) => {
                if (isTemporarilyClosed || $panel.hasClass("wish-active")) return;
                if (typeof side === 'string') {
                    $panel.removeClass("wish-side-left wish-side-right")
                          .addClass(side === 'left' ? 'wish-side-left' : 'wish-side-right');
                }
                $panel.addClass("wish-active");
                if (!$panel.hasClass("wish-icon-only-layout")) {
                    $sidebarInput.focus();
                    if (preText) {
                        $sidebarInput.val(preText).select();
                    } else if ($sidebarInput.val() === "") {
                        var sel = window.getSelection().toString().trim();
                        if(sel) $sidebarInput.val(sel).select();
                    }
                }
            };

            var hidePanel = () => {
                if (isPinned || !$panel.hasClass("wish-active")) return;
                $panel.removeClass("wish-active");
                $tooltip.hide();
                $sidebarInput.blur();
                $sidebarInput.val("");
                currentSelectedIndex = -1;
                updateSelection();
            };

            var showTimer;
            $("#wish-trigger-left").on("mouseenter", () => { clearTimeout(showTimer); showTimer = setTimeout(() => showPanel('left'), CONFIG.trigger_delay); }).on("mouseleave", () => clearTimeout(showTimer));
            $("#wish-trigger-right").on("mouseenter", () => { clearTimeout(showTimer); showTimer = setTimeout(() => showPanel('right'), CONFIG.trigger_delay); }).on("mouseleave", () => clearTimeout(showTimer));

            $(document).on('mousedown', function(e) {
                if (!isPinned && $panel.hasClass('wish-active')) {
                    if ($(e.target).closest('#wish-panel, .wish-trigger-zone, #wish-tooltip-panel, #wish-actions-menu').length === 0) {
                        hidePanel();
                    }
                }
                if ($actionsMenu.is(":visible") && $(e.target).closest('#wish-actions-menu, #wish-menu-btn').length === 0) {
                    $actionsMenu.hide();
                }
            });

            $(document).on('mouseleave', function(e) {
                 if (e.toElement === null && e.relatedTarget === null) {
                     if (!isPinned && $panel.hasClass('wish-active')) {
                         hidePanel();
                     }
                 }
            });

            $(".wish-list").on("change", ".wish-check", function() {
                var count = $(".wish-check:checked").length;
                if(count > 0) {
                    $footer.css("display", "flex");
                    $("#wish-batch-open").text(`批量打开 (${count})`);
                } else {
                    $footer.hide();
                }
            });
            $footer.hide();

            window.addEventListener("keydown", function(e) {
                if ($(e.target).is("input, textarea")) return;
                var hotkey = CONFIG.global_hotkey || "";
                var isActive = $panel.hasClass("wish-active");
                var parts = hotkey.toLowerCase().split("+");
                var keyMatch = e.key.toLowerCase() === parts[parts.length-1];
                var altMatch = parts.includes("alt") === e.altKey;
                var ctrlMatch = parts.includes("ctrl") === e.ctrlKey;
                var shiftMatch = parts.includes("shift") === e.shiftKey;
                var metaMatch = parts.includes("meta") === e.metaKey;
                if (parts.length === 1 && !e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) { altMatch = ctrlMatch = shiftMatch = metaMatch = true; }

                if (keyMatch && altMatch && ctrlMatch && shiftMatch && metaMatch) {
                    if (isTemporarilyClosed) return;
                    e.preventDefault(); e.stopPropagation();
                    if (isActive) {
                        if(!isPinned) hidePanel();
                    } else {
                        var pos = GM_getValue("wish_s_position", "auto");
                        var selText = window.getSelection().toString().trim();
                        showPanel(pos === 'right' ? 'right' : 'left', selText);
                    }
                    return;
                }
                if (isActive) {
                    if (e.key === "Escape") { e.preventDefault(); if(!isPinned) hidePanel(); $actionsMenu.hide(); return; }
                    if (e.altKey && /^Digit[1-9]$/.test(e.code)) { e.preventDefault(); e.stopPropagation(); var idx = parseInt(e.code.replace("Digit", "")) - 1; triggerItem(idx); return; }
                    var maxIndex = $(".wish-item").length - 1;
                    if (e.key === "ArrowDown") { e.preventDefault(); currentSelectedIndex++; if (currentSelectedIndex > maxIndex) currentSelectedIndex = 0; updateSelection(); }
                    else if (e.key === "ArrowUp") { e.preventDefault(); currentSelectedIndex--; if (currentSelectedIndex < 0) currentSelectedIndex = maxIndex; updateSelection(); }
                    else if (e.key === "Enter") {
                        if ($(document.activeElement).is($sidebarInput) && currentSelectedIndex === -1) { e.preventDefault(); triggerItem(0); }
                        else if (currentSelectedIndex >= 0) { e.preventDefault(); triggerItem(currentSelectedIndex); }
                    }
                }
            }, true);

            var updateSelection = () => {
                $(".wish-item").removeClass("wish-selected");
                if (currentSelectedIndex >= 0) {
                    var $el = $(`.wish-item[data-index='${currentSelectedIndex}']`);
                    if ($el.length > 0) {
                        $el.addClass("wish-selected");
                        var container = $(".wish-list")[0]; var item = $el[0];
                        if (item.offsetTop < container.scrollTop) { container.scrollTop = item.offsetTop; }
                        else if (item.offsetTop + item.offsetHeight > container.scrollTop + container.offsetHeight) { container.scrollTop = item.offsetTop + item.offsetHeight - container.offsetHeight; }
                    }
                }
            };

            var triggerItem = (idx) => { var $el = $(`.wish-item[data-index='${idx}']`); if($el.length) $el.find(".wish-link").click(); };

            var showTooltip = function($target, idListUrl) {
                if (!idListUrl) return;
                try {
                    var idList = JSON.parse(decodeURIComponent(idListUrl));
                    var items = idList.map(id => searchDataMap.get(id)).filter(Boolean);
                    if (!items || items.length === 0) return;
                    $tooltip.empty();
                    items.forEach(it => {
                        var d = getDomain(it.url.replace("%s", ""));
                        var $tItem = $(`<a href="javascript:;" class="wish-tooltip-item" data-url="${it.url}" data-new-window="${it.newWindow}"><img class="wish-tooltip-icon" src=""><span class="wish-tooltip-text">${it.name}</span></a>`);
                        // 组内图标也使用文字兜底逻辑
                        var txtIcon = generateLetterIcon(it.name);
                        $tItem.find("img").attr("src", txtIcon);
                        IconManager.get(d, it.name, function(b) { if(b) $tItem.find("img").attr("src", b); });
                        $tooltip.append($tItem);
                    });
                    $tooltip.css({ display: 'block', top: '-9999px', left: '-9999px' });
                    // ... tooltip positioning logic same as before ...
                    var targetRect = $target[0].getBoundingClientRect();
                    var panelRect = $panel[0].getBoundingClientRect();
                    var tipWidth = $tooltip.outerWidth();
                    var tipHeight = $tooltip.outerHeight();
                    var winWidth = window.innerWidth;
                    var winHeight = window.innerHeight;
                    var isLeftPanel = $panel.hasClass("wish-side-left");
                    var newTop = targetRect.top;
                    if (newTop + tipHeight > winHeight) newTop = winHeight - tipHeight - 10;
                    if (newTop < 10) newTop = 10;
                    var newLeft;
                    if (isLeftPanel) {
                        newLeft = panelRect.right + 5;
                        if (newLeft + tipWidth > winWidth) newLeft = panelRect.left - tipWidth - 5;
                    } else {
                        newLeft = panelRect.left - tipWidth - 5;
                        if (newLeft < 0) newLeft = panelRect.right + 5;
                    }
                    $tooltip.css({ top: newTop + 'px', left: newLeft + 'px' });
                } catch (e) {}
            };


            $tooltip.on("mouseenter", () => clearTimeout(tooltipTimer)).on("mouseleave", () => $tooltip.hide());
            $(document).on("mouseenter", ".wish-group-item", function() { clearTimeout(tooltipTimer); showTooltip($(this), $(this).data("url").replace("group://", "")); });
            $(document).on("mouseleave", ".wish-group-item", function() { tooltipTimer = setTimeout(() => $tooltip.hide(), 400); });
            $(document).on("mouseenter", ".ws-edit-group-btn, .ws-icon-preview", function() { var $row = $(this).closest(".ws-list-item"); var url = $row.find(".ws-input-url").val(); if(url.startsWith("group://")) showTooltip($row, url.replace("group://", "")); });
            $(document).on("mouseleave", ".ws-edit-group-btn, .ws-icon-preview", function() { $tooltip.hide(); });

            $(document).on("click", ".wish-tooltip-item", function() {
                var url = $(this).data("url").replace(/%s/i, getKeyword());
                var newWindow = $(this).data("new-window");
                if(newWindow) { GM_openInTab(url, {active: true, insert: true}); } else { window.location.href = url; }
            });

            var isPanelResizing = false;
            $(".wish-resize-bar").on("mousedown", function(e) {
                isPanelResizing = true; e.preventDefault(); $("body").css("cursor", "col-resize"); var startX = e.pageX; var startW = $panel.width(); var isLeft = $panel.hasClass("wish-side-left");
                $(document).on("mousemove.wishw", function(em) {
                    if (!isPanelResizing) return;
                    var dx = em.pageX - startX;
                    var newW = isLeft ? (startW + dx) : (startW - dx);
                    var isIconMode = $panel.hasClass("wish-icon-only-layout");
                    var minW = isIconMode ? 60 : 150;
                    if (newW < minW) newW = minW;
                    if (newW > 800) newW = 800;
                    document.documentElement.style.setProperty('--wish-panel-w', newW + 'px');
                }).on("mouseup.wishw", function() {
                    isPanelResizing = false;
                    $("body").css("cursor", "");
                    $(document).off(".wishw");
                    var finalWidth = $panel.width();
                    if ($panel.hasClass("wish-icon-only-layout")) {
                        CONFIG.panel_width_icon = finalWidth;
                        GM_setValue("wish_panel_w_icon", finalWidth);
                    } else {
                        CONFIG.panel_width = finalWidth;
                        GM_setValue("wish_panel_w", finalWidth);
                    }
                });
            });

            var isPanelHResizing = false;
            $(".wish-resize-bar-bottom").on("mousedown", function(e) { isPanelHResizing = true; e.preventDefault(); $("body").css("cursor", "row-resize"); var startY = e.pageY; var startH = $panel.height(); $(document).on("mousemove.wishh", function(em) { if (!isPanelHResizing) return; var newH = startH + (em.pageY - startY); if (newH < 200) newH = 200; $panel.css('height', newH + 'px'); }).on("mouseup.wishh", function() { isPanelHResizing = false; $("body").css("cursor", ""); $(document).off(".wishh"); GM_setValue("wish_panel_h", parseInt($panel.css("height"))); updateVerticalCenter(); }); });

            $(document).on("click", ".wish-link", function(e) {
                var $item = $(this).closest(".wish-item");
                var rawUrl = $item.data("url");
                if (rawUrl.startsWith("group://")) {
                     try {
                         var kw = getKeyword();
                         var idList = JSON.parse(decodeURIComponent(rawUrl.replace("group://", "")));
                         var currentPageDomain = window.location.hostname;
                         var isFirstLinkOpened = false;
                         idList.forEach(id => {
                             var sub = searchDataMap.get(id);
                             if (!sub) return;
                             var subDomain = getDomain(sub.url);
                             if (subDomain && currentPageDomain.includes(subDomain)) { return; }
                             var finalUrl = sub.url.replace(/%s/i, kw);
                             if (sub.newWindow) { GM_openInTab(finalUrl, {active: !isFirstLinkOpened, insert: true}); isFirstLinkOpened = true; }
                             else { if(!isFirstLinkOpened) { window.location.href = finalUrl; isFirstLinkOpened = true; } else { GM_openInTab(finalUrl, {active: false, insert: true}); } }
                         });
                     } catch(err) { console.error("Error opening group:", err); }
                     return;
                }
                var url = rawUrl.replace(/%s/i, getKeyword());
                if(e.which === 2) { GM_openInTab(url, {active: false, insert: true}); return; }
                if ($item.data("target") === '_blank') { GM_openInTab(url, {active: true, insert: true}); } else { window.location.href = url; }
            });
            $(document).on("mousedown", ".wish-link", function(e){ if(e.which===2) e.preventDefault(); });

            $("#wish-side-all").on("click", function() { $(".wish-list .wish-check").prop("checked", true).trigger("change"); });
            $("#wish-side-none").on("click", function() { $(".wish-list .wish-check").prop("checked", false).trigger("change"); });

            $("#wish-save-as-group").on("click", function() {
                var checked = $(".wish-check:checked"); if (checked.length < 2) return alert("请至少勾选两个网站");
                var name = prompt("请输入新组的名称:", "新建搜索组"); if(!name) return;
                var newGroupIdList = [];
                checked.each(function() { var $row = $(this).closest(".wish-item"); var id = $row.data("id"); if(id) { newGroupIdList.push(id); } });
                if(newGroupIdList.length === 0) return alert("未能获取有效的选中项");
                var newGroupItem = { id: null, name: name, url: "group://" + encodeURIComponent(JSON.stringify(newGroupIdList)), newWindow: false, hidden: false };
                searchDataList.unshift(newGroupItem);
                DataManager.save();
                location.reload();
            });
            $("#wish-batch-open").on("click", function() {
                var checked = $(".wish-check:checked"); if (checked.length === 0) return alert("请先勾选网站"); var kw = getKeyword();
                checked.each(function() { var $it = $(this).closest(".wish-item"); var u = $it.data("url"); if(!u.startsWith("group://")) { GM_openInTab(u.replace(/%s/i, kw), {active: false, insert: true}); } });
            });

            // 问题4：加载图片逻辑更新。默认已是文字头像，这里负责异步替换。
            setTimeout(() => {
                $(".wish-icon").each(function() {
                    var $img = $(this);
                    IconManager.get($img.data("domain"), $img.data("name"), function(base64) {
                        if (base64) $img.attr("src", base64);
                    });
                });
            $(".wish-group-subicon").each(function() {
                    var $img = $(this);
                    // 尝试获取图标，如果获取到了就替换 src，如果没获取到(base64为空)，就什么都不做(保留原本的文字头像)
                    IconManager.get($img.data("domain"), "", function(base64) {
                        if (base64) $img.attr("src", base64);
                    });
                });
            }, 50);

            function createSettingItem(item) {
                var { id, name, url, newWindow, hidden } = item;
                var isGroup = url.startsWith("group://");
                var domain = isGroup ? "" : getDomain(url.replace("%s", ""));
                var initialIcon = isGroup ? DEFAULT_FOLDER_ICON : generateLetterIcon(name);

                var $itemEl = $(`
                <div class="ws-list-item" draggable="false" data-id="${id || ''}">
                    <div class="ws-drag-handle" title="按住拖动排序">☰</div>
                    <input type="checkbox" class="ws-chk-del" style="margin-right:6px;">
                    <img class="wish-icon ws-icon-preview" src="${initialIcon}">
                    <div class="ws-item-inputs">
                        <input type="text" class="ws-input ws-input-name" value="${name}" placeholder="名称">
                        ${isGroup
                          ? `<button class="ws-btn ws-edit-group-btn" style="flex:1;text-align:left;color:#666;">📁 编辑组内容...</button>
                             <input type="hidden" class="ws-input-url" value='${url}'>`
                          : `<input type="text" class="ws-input ws-input-url" value="${url}" placeholder="URL">`
                        }
                        ${!isGroup ? `
                        <label class="ws-chk-label"><input type="checkbox" class="ws-input-new" ${newWindow?'checked':''}>新窗</label>
                        <label class="ws-chk-label"><input type="checkbox" class="ws-input-hide" ${hidden?'checked':''}>隐藏</label>
                        ` : ''}
                    </div>
                </div>`);

                if(!isGroup) {
                    IconManager.get(domain, name, function(b64){ if(b64) $itemEl.find(".ws-icon-preview").attr("src", b64); });
                    $itemEl.find(".ws-input-url").on("change", function(){ IconManager.get(getDomain(this.value.replace("%s", "")), "", (b) => $itemEl.find(".ws-icon-preview").attr("src", b)); });
                }
                return $itemEl;
            }

            var currentEditingInput = null;
            $(document).on("click", ".ws-edit-group-btn", function() {
                currentEditingInput = $(this).siblings(".ws-input-url");
                var currentUrl = currentEditingInput.val();
                var currentIdList = [];
                try { currentIdList = JSON.parse(decodeURIComponent(currentUrl.replace("group://", ""))); } catch(e){}
                var $selector = $("#ws-group-selector").empty();
                $("#ws-sortable-list .ws-list-item").each(function(){
                    var $row = $(this);
                    var id = $row.data("id");
                    if (!id) return;
                    var iconSrc = $row.find(".ws-icon-preview").attr("src");
                    var name = $row.find(".ws-input-name").val();
                    var url = $row.find(".ws-input-url").val();
                    var isSelected = currentIdList.includes(id);
                    var $opt = $(`<label class="ws-group-option"><input type="checkbox" ${isSelected ? 'checked' : ''} data-id="${id}"><img src="${iconSrc}"><span>${name}</span><span class="url-hint">${url.substring(0,30)}...</span></label>`);
                    $selector.append($opt);
                });
                $("#wish-group-editor-overlay").css("display", "flex");
            });

            $("#ws-close-group-edit").click(() => $("#wish-group-editor-overlay").hide());

            $("#ws-save-group-edit").click(() => {
                var newGroupIdList = [];
                $("#ws-group-selector input:checked").each(function() { newGroupIdList.push($(this).data("id")); });
                var jsonStr = JSON.stringify(newGroupIdList);
                var encodedJson = encodeURIComponent(jsonStr);
                if(currentEditingInput) { currentEditingInput.val("group://" + encodedJson); }
                $("#wish-group-editor-overlay").hide();
            });

            var dragSrcEl = null;
            $("#ws-sortable-list").on("dragstart", ".ws-list-item", function(e) { dragSrcEl = this; e.originalEvent.dataTransfer.effectAllowed = 'move'; });
            $("#ws-sortable-list").on("dragover", ".ws-list-item", function(e) { e.preventDefault(); e.originalEvent.dataTransfer.dropEffect = 'move'; return false; });
            $("#ws-sortable-list").on("drop", ".ws-list-item", function(e) { e.stopPropagation(); if (dragSrcEl !== this) { var $src = $(dragSrcEl), $dest = $(this); if ($src.index() < $dest.index()) $dest.after($src); else $dest.before($src); } return false; });

            $("#ws-btn-all").click(() => $(".ws-chk-del").prop("checked", true));
            $("#ws-btn-none").click(() => $(".ws-chk-del").prop("checked", false));
            $("#ws-btn-hide-sel").click(() => $(".ws-chk-del:checked").closest(".ws-list-item").find(".ws-input-hide").prop("checked", true));
            $("#ws-btn-show-sel").click(() => $(".ws-chk-del:checked").closest(".ws-list-item").find(".ws-input-hide").prop("checked", false));

            $("#ws-btn-del").click(function() {
                var checked = $(".ws-chk-del:checked");
                if(checked.length === 0) return;
                var $delList = $("#wish-delete-list").empty();
                checked.each(function() { var $row = $(this).closest(".ws-list-item"); $delList.append(`<div class="del-list-item"><img class="del-icon" src="${$row.find(".ws-icon-preview").attr("src")}"><div class="del-info"><span class="del-name">${$row.find(".ws-input-name").val()}</span><span class="del-url">${$row.find(".ws-input-url").val().substring(0,50)}</span></div></div>`); });
                $("#wish-delete-overlay").css("display", "flex");
            });
            $("#wish-confirm-del").click(function() { $(".ws-chk-del:checked").closest(".ws-list-item").remove(); $("#wish-delete-overlay").hide(); });
            $("#wish-cancel-del").click(() => $("#wish-delete-overlay").hide());

            $("#ws-btn-add").click(() => { $("#ws-sortable-list").prepend(createSettingItem({id: generateUniqueId(), name: "新搜索", url: "https://", newWindow: false, hidden: false})).scrollTop(0); });
            $("#ws-btn-add-group").click(() => { $("#ws-sortable-list").prepend(createSettingItem({id: null, name: "新分组", url: "group://" + encodeURIComponent("[]"), newWindow: false, hidden: false})).scrollTop(0); });
            $("#ws-btn-reset").click(() => { if(confirm("恢复默认？")) { $("#ws-sortable-list").empty(); DataManager.parseTextAndAssignIds(defaultLinkListText).forEach(i => $("#ws-sortable-list").append(createSettingItem(i))); } });
            $("#ws-close-setting").click(() => $("#wish-setting-overlay").hide());

            $("#ws-hotkey-input").on("keydown", function(e) {
                if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); $(this).val(""); return; }
                e.preventDefault(); var keys = [];
                if(e.ctrlKey) keys.push("Ctrl"); if(e.altKey) keys.push("Alt"); if(e.shiftKey) keys.push("Shift"); if(e.metaKey) keys.push("Meta");
                if (['Control','Alt','Shift','Meta'].indexOf(e.key) === -1) keys.push(e.key);
                $(this).val(keys.join("+"));
            });

            function updateDomainButtonState() {
                const $btn = $("#ws-add-current-domain-btn");
                const mode = $("#ws-domain-mode-select").val();
                if (mode === 'blacklist') { $btn.text("添加当前域名到黑名单").show(); }
                else if (mode === 'whitelist') { $btn.text("添加当前域名到白名单").show(); }
                else { $btn.hide(); }
            }
            $("#ws-domain-mode-select").on("change", updateDomainButtonState);
            $("#ws-add-current-domain-btn").on("click", function() {
                const $textarea = $('#ws-domain-list-textarea');
                let currentList = $textarea.val();
                const domains = currentList.split('\n').map(d => d.trim()).filter(Boolean);
                if (domains.includes(currentHost)) { alert('当前域名已存在于列表中！'); return; }
                const newList = currentList.trim() === '' ? currentHost : currentList + '\n' + currentHost;
                $textarea.val(newList);
                alert(`已将 "${currentHost}" 添加到列表。请记得点击“保存配置”。`);
            });

            function getDataFromSettingsUI() {
                var list = [];
                $("#ws-sortable-list .ws-list-item").each(function() {
                    var $row = $(this);
                    var id = $row.data("id");
                    var name = $row.find(".ws-input-name").val();
                    var url = $row.find(".ws-input-url").val();
                    var isGroup = url.startsWith("group://");
                    list.push({ id: id ? id : null, name: name, url: url, newWindow: isGroup ? false : $row.find(".ws-input-new").is(":checked"), hidden: isGroup ? false : $row.find(".ws-input-hide").is(":checked") });
                });
                return list;
            }

            $("#ws-save-setting").click(() => {
                searchDataList = getDataFromSettingsUI();
                DataManager.save();
                GM_setValue("wish_s_position", $("#ws-pos-select").val());
                GM_setValue("wish_config_trigger_delay", $("#ws-delay-input").val());
                GM_setValue("wish_item_height", $("#ws-itemh-input").val());
                GM_setValue("wish_global_hotkey", $("#ws-hotkey-input").val());
                GM_setValue("wish_domain_mode", $("#ws-domain-mode-select").val());
                GM_setValue("wish_domain_list", $("#ws-domain-list-textarea").val());
                location.reload();
            });

            $("#ws-btn-export").on("click", function() {
                var dataToExport = getDataFromSettingsUI();
                var jsonString = JSON.stringify(dataToExport, null, 2);
                var blob = new Blob([jsonString], { type: "application/json" });
                var url = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download = `aggregate-search-backup-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            $("#ws-btn-import").on("click", function() { $("#ws-import-file-input").val(null).click(); });
            $("#ws-import-file-input").on("change", function(e) {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        var importedData = JSON.parse(event.target.result);
                        if (!Array.isArray(importedData)) { throw new Error("导入的数据不是一个有效的数组。"); }
                        if (confirm("警告：导入将覆盖您当前的全部配置，确定要继续吗？")) {
                            searchDataList = importedData;
                            DataManager.save();
                            alert("导入成功！页面将刷新以应用更改。");
                            location.reload();
                        }
                    } catch (err) { alert("导入失败: " + err.message); }
                };
                reader.readAsText(file);
            });

            $("#ws-btn-batch-import").on("click", function() { $("#wish-batch-import-overlay").css("display", "flex"); });
            $("#ws-cancel-batch-import").on("click", function() { $("#wish-batch-import-overlay").hide(); });
            $("#ws-confirm-batch-import").on("click", function() {
                var text = $("#ws-batch-input-area").val();
                var separator = $("#ws-batch-separator").val();
                if (!text.trim() || !separator) { return alert("请输入内容和分隔符。"); }
                var lines = text.split('\n').filter(line => line.trim() !== '');
                var importedCount = 0;
                var failedLines = [];
                lines.forEach(line => {
                    var parts = line.split(separator);
                    if (parts.length >= 2) {
                        var name = parts[0].trim();
                        var url = parts.slice(1).join(separator).trim();
                        if(name && url) {
                            var newItemData = { id: generateUniqueId(), name: name, url: url, newWindow: false, hidden: false };
                            $("#ws-sortable-list").append(createSettingItem(newItemData));
                            importedCount++;
                        } else { failedLines.push(line); }
                    } else { failedLines.push(line); }
                });
                if (importedCount > 0) {
                    var message = `成功添加 ${importedCount} 个新的搜索引擎到列表末尾。\n请检查后点击“保存配置”按钮以应用更改。`;
                    if(failedLines.length > 0) { message += `\n\n以下 ${failedLines.length} 行导入失败，请检查格式：\n` + failedLines.join('\n'); }
                    alert(message);
                    $("#wish-batch-import-overlay").hide();
                    $("#ws-batch-input-area").val('');
                } else { alert("没有可导入的项目。请检查您的文本和分隔符是否正确。"); }
            });


            var isWinResizing = false;
            $(".ws-resize-handle").on("mousedown", function(e) {
                isWinResizing = true; e.preventDefault();
                var $box = $("#wish-setting-box"), startX = e.pageX, startY = e.pageY, startW = $box.width(), startH = $box.height();
                $(document).on("mousemove.wsresize", function(em) { if (isWinResizing) { $box.css({ width: startW + (em.pageX - startX), height: startH + (em.pageY - startY) }); } }).on("mouseup.wsresize", function() { isWinResizing = false; $(document).off(".wsresize"); GM_setValue("wish_win_w", $box.width()); GM_setValue("wish_win_h", $box.height()); });
            });
        };

        initUI();
    };

    main();

})(jQuery);