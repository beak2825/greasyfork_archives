// ==UserScript==
// @name         Search Engine Syntax Helper (Overlay Fix V25 Debug)
// @namespace    http://tampermonkey.net/
// @version      25.7
// @description  在Google/Bing/百度搜索栏添加"高级"按钮，采用绝对悬浮策略，不破坏页面布局，完美兼容第三方脚本
// @author       CodingAssistant
// @license      MIT
// @match        *://www.google.com/*
// @match        *://www.google.co.jp/*
// @match        *://www.google.com.hk/*
// @match        *://www.baidu.com/*
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559102/Search%20Engine%20Syntax%20Helper%20%28Overlay%20Fix%20V25%20Debug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559102/Search%20Engine%20Syntax%20Helper%20%28Overlay%20Fix%20V25%20Debug%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 调试模式 ---
    var DEBUG_MODE = false; // 设置为true查看调试信息
    function log() {
        if (DEBUG_MODE) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('[搜索助手]');
            console.log.apply(console, args);
        }
    }

    // --- 0. 图标配置 ---
    var ICONS = {
        sliders: '<svg t="1765886406344" class="icon" viewBox="0 0 1088 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5556" width="200" height="200"><path d="M314.24 276.48c10.624-13.376 22.336-25.856 35.136-36.992l-63.424-63.36a25.472 25.472 0 1 0-36.096 36.032L314.24 276.48z m206.208-101.952h0.704c8.384 0 16.64 0.512 24.832 1.344v-86.4a25.536 25.536 0 0 0-51.008 0v86.4c8.128-0.832 16.384-1.28 24.768-1.28h0.64z m206.272 101.952l64.32-64.32a25.472 25.472 0 1 0-36.096-36.032l-63.488 63.36c12.8 11.136 24.576 23.616 35.2 36.992zM251.52 457.408c0-12.288 0.96-24.32 2.432-36.288H163.2a25.536 25.536 0 0 0 0 51.008h88.64a338.688 338.688 0 0 1-0.32-14.72z m625.984-36.288h-90.688a295.424 295.424 0 0 1 2.176 51.008h88.512a25.472 25.472 0 0 0 0-51.008z m-137.472 209.152a398.4 398.4 0 0 1-31.872 40.192l46.72 46.72a25.6 25.6 0 0 0 36.096-36.096l-50.944-50.816z m-490.24 50.816a25.6 25.6 0 0 0 36.096 36.096l46.72-46.72a398.144 398.144 0 0 1-31.872-40.192l-50.944 50.816z m504.064-223.68c0-52.928-17.6-101.824-47.296-140.992a234.624 234.624 0 0 0-102.4-77.248l0.256-1.152-17.472-5.12a238.08 238.08 0 0 0-41.92-8.128l-2.048-0.256h-0.128a230.272 230.272 0 0 0-21.888-1.152h-1.152c-7.616 0-14.912 0.512-21.888 1.152h-0.128l-2.112 0.256a236.864 236.864 0 0 0-41.856 8.128l-16.896 4.928 0.128 1.152c-41.152 15.808-76.736 42.88-102.912 77.44a233.088 233.088 0 0 0-47.296 140.992c0 37.952 6.592 69.12 16.768 94.912 15.36 38.72 38.72 64.896 57.472 84.736 9.408 9.856 17.664 18.304 23.296 25.536 5.76 7.232 8.512 12.8 9.28 17.28 4.096 21.696 4.544 49.024 4.544 55.936v2.048c0 31.36 25.408 56.64 56.704 56.64h130.944c31.36 0 56.704-25.344 56.704-56.64v-1.92c0-6.912 0.384-34.304 4.48-56 0.64-3.008 1.92-6.4 4.544-10.688 4.48-7.296 12.992-16.384 23.488-27.392 15.68-16.512 35.648-37.312 51.584-66.88 15.872-29.568 27.264-67.776 27.2-117.568z m-168.512 352.64h-129.92a24.32 24.32 0 0 0 0 48.64h129.92a24.384 24.384 0 0 0 0-48.64z m0 61.44h-129.92a24.32 24.32 0 0 0 0 48.704h129.92a24.32 24.32 0 0 0 0-48.704z m-53.568 61.952H464.896l-0.128 2.176c0 13.44 20.672 24.384 39.808 24.384h31.744c19.136 0 39.808-10.88 39.808-24.32L576 933.376h-44.16z" fill="#396FFF" p-id="5557"></path></svg>'
    };

    var CONFIG = {
        menuId: 'g-syntax-menu',
        hostClass: 'g-syntax-host',
        btnContent: ICONS.sliders,
        // --- 核心参数调整 ---
        bingIconLeft: '45px',    // 图标距离输入框左侧 45px (避开原生放大镜)
        bingTextPadding: '75px'  // 输入框文字向右推 75px
    };

    // --- 1. 站点适配配置 ---
    var SITE_CONFIG = {
        google: {
            check: function() { return location.hostname.includes('google'); },
            inputSelector: 'input[name="q"], textarea[name="q"]',
            type: 'google',
            stylePatch: '\
                textarea[name="q"], input[name="q"] { padding-left: 48px !important; box-sizing: border-box !important; }\
                .a4bIc { position: relative !important; overflow: visible !important; }\
            '
        },
        baidu: {
            check: function() { return location.hostname.includes('baidu'); },
            inputSelector: '#kw, #chat-textarea, .s_ipt',
            type: 'baidu',
            stylePatch: '\
                .s_ipt_wr { position: relative !important; z-index: 999 !important; overflow: visible !important; }\
                #form { position: relative !important; overflow: visible !important; }\
                #kw, #chat-textarea, .s_ipt { padding-left: 48px !important; box-sizing: border-box !important; }\
                .input-wrap { position: relative !important; overflow: visible !important; }\
                .soutu-env-result .input-wrap { position: relative !important; }\
            '
        },
        bing: {
            check: function() { return location.hostname.includes('bing'); },
            inputSelector: '#sb_form_q',
            type: 'bing',
            // Bing: 样式由 JS 强力控制，这里只做基础兜底
            stylePatch: ''
        }
    };

    var currentSiteKey = Object.keys(SITE_CONFIG).find(function(key) {
        return SITE_CONFIG[key].check();
    });
    var currentSite = SITE_CONFIG[currentSiteKey];

    log('当前站点:', currentSiteKey, currentSite);

    if (!currentSite) {
        log('未识别的网站，脚本退出');
        return;
    }

    // --- 2. 搜索技巧配置 ---
    var searchTools = [
        { label: '🔒 完全匹配 ("")', desc: '搜索确切词组', action: function(v) { return '"' + v.trim() + '"'; } },
        { label: '➕ 自定义站点', desc: '指定域名', action: function(v) { var d = prompt("输入域名:"); return d ? v.trim() + ' site:' + d : v; } },
        { label: '📄 PDF文件', desc: '只搜 PDF', action: function(v) { return v.trim() + ' filetype:pdf'; } },
        { label: '📑 Word文档', desc: 'DOC/DOCX', action: function(v) { return v.trim() + ' filetype:doc'; } },
        { label: '📊 Excel表格', desc: 'XLS/XLSX', action: function(v) { return v.trim() + ' filetype:xls'; } },
        { label: '⛔ 排除关键词', desc: '排除干扰结果 (-)', action: function(v) { return v.trim() + ' -'; } },
        { label: '📑 标题包含', desc: 'intitle:', action: function(v) { return 'intitle:' + v.trim(); } },
        { label: '🔗 查找相似网站', desc: 'related:', action: function(v) { var d = prompt("输入网站域名:"); return d ? 'related:' + d : v; } },
        { label: '📖 查找定义', desc: 'define:', action: function(v) { return 'define:' + v.trim(); } }
    ];

    // --- 3. 全局样式 ---
    var globalCss = '\
        /* 菜单样式 */\
        #' + CONFIG.menuId + ' {\
            display: none; position: fixed; z-index: 2147483647;\
            width: 180px; background: white;\
            box-shadow: 0 4px 16px rgba(0,0,0,0.15); border-radius: 8px;\
            padding: 4px 0; border: 1px solid #dfe1e5;\
            font-family: Arial, sans-serif; text-align: left; line-height: 1.3;\
        }\
        .g-syntax-item { padding: 6px 12px; cursor: pointer; font-size: 12px; color: #3c4043; display: flex; flex-direction: column; }\
        .g-syntax-item:hover { background-color: #f1f3f4; color: #1a73e8; }\
        .g-syntax-desc { font-size: 10px; color: #70757a; margin-top: 1px; opacity: 0.8; }\
        /* Google/Baidu 传统按钮 */\
        .g-syntax-btn-legacy {\
            display: flex !important; align-items: center !important; justify-content: center !important;\
            width: 28px !important; height: 28px !important; cursor: pointer !important; border-radius: 50% !important;\
            color: #4e6ef2 !important; transition: background 0.2s !important;\
            background-color: rgba(255, 255, 255, 0.9) !important;\
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;\
        }\
        .g-syntax-btn-legacy svg {\
            width: 18px !important; height: 18px !important; fill: currentColor !important;\
            display: block !important;\
        }\
        .g-syntax-btn-legacy:hover { background-color: rgba(78, 110, 242, 0.1) !important; color: #1a73e8 !important; }\
        .pos-google { position: absolute !important; top: 50% !important; transform: translateY(-50%) !important; left: 12px !important; z-index: 100 !important; }\
        .pos-baidu { position: absolute !important; top: 50% !important; transform: translateY(-50%) !important; left: 12px !important; z-index: 10000 !important; }\
        /* Bing Shadow Host (绝对定位，不占流空间) */\
        .bing-shadow-host {\
            position: absolute !important;\
            top: 50% !important;\
            transform: translateY(-50%) !important;\
            left: ' + CONFIG.bingIconLeft + ' !important;\
            width: 30px !important;\
            height: 30px !important;\
            z-index: 10005 !important;\
            display: block !important;\
            pointer-events: auto !important;\
        }\
        ' + currentSite.stylePatch;
    GM_addStyle(globalCss);
    log('全局样式已注入');

    // --- 4. Shadow DOM 样式 (Bing) ---
    var shadowCss = '\
        :host {\
            display: flex; align-items: center; justify-content: center;\
            width: 100%; height: 100%;\
        }\
        #btn-inner {\
            display: flex; align-items: center; justify-content: center;\
            width: 28px; height: 28px; border-radius: 50%;\
            cursor: pointer; color: #70757a; transition: all 0.2s;\
        }\
        #btn-inner:hover {\
            background-color: rgba(60, 64, 67, 0.1); color: #0078d4;\
        }\
        svg { width: 18px; height: 18px; fill: currentColor; }\
    ';

    // --- 5. 核心逻辑 ---

    function createMenu() {
        if (document.getElementById(CONFIG.menuId)) return document.getElementById(CONFIG.menuId);
        var menu = document.createElement('div');
        menu.id = CONFIG.menuId;
        searchTools.forEach(function(tool) {
            var item = document.createElement('div');
            item.className = 'g-syntax-item';
            item.innerHTML = '<span>' + tool.label + '</span><span class="g-syntax-desc">' + tool.desc + '</span>';
            item.onclick = function(e) {
                e.stopPropagation();
                applySearch(tool);
                menu.style.display = 'none';
            };
            menu.appendChild(item);
        });
        document.body.appendChild(menu);
        document.addEventListener('click', function() { menu.style.display = 'none'; });
        log('菜单已创建');
        return menu;
    }

    function showMenu(rect) {
        var menu = createMenu();
        var menuWidth = 180;  // 菜单宽度
        var padding = 10;     // 边缘间距

        // 先显示菜单以获取实际高度
        menu.style.visibility = 'hidden';
        menu.style.display = 'block';
        var menuHeight = menu.offsetHeight;
        menu.style.visibility = '';

        // 计算可用空间
        var viewportHeight = window.innerHeight;
        var viewportWidth = window.innerWidth;
        var spaceBelow = viewportHeight - rect.bottom - padding;
        var spaceAbove = rect.top - padding;

        // 垂直定位：优先向下，空间不足则向上
        var top;
        if (spaceBelow >= menuHeight) {
            top = rect.bottom + padding;
        } else if (spaceAbove >= menuHeight) {
            top = rect.top - menuHeight - padding;
        } else {
            // 两边都不够，贴近较大的边缘
            top = spaceBelow > spaceAbove ? (viewportHeight - menuHeight - padding) : padding;
        }

        // 水平定位：确保不超出边缘
        var left = rect.left;
        if (left + menuWidth > viewportWidth - padding) {
            left = viewportWidth - menuWidth - padding;
        }
        if (left < padding) {
            left = padding;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        log('菜单已显示，位置:', left, top);
    }

    // --- 核心：Bing 样式强行修复 ---
    function enforceBingStyles() {
        var input = document.querySelector('#sb_form_q');
        if (!input) return;

        // **修复关键**：找到输入框的直接容器作为定位基准
        var container = input.parentElement;

        // 尝试找到最合适的定位容器
        // Bing的结构通常是：form > div > input
        // 我们需要让input的直接父元素成为定位基准
        var candidates = [
            input.parentElement,
            input.closest('.b_searchboxForm'),
            input.closest('#sb_form')
        ].filter(Boolean);

        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (candidate && candidate.contains(input)) {
                container = candidate;
                break;
            }
        }

        // 1. 确保容器是"定位基准"
        if (container && getComputedStyle(container).position === 'static') {
            container.style.setProperty('position', 'relative', 'important');
        }

        // 2. 确保输入框文字避让图标
        if (input.style.paddingLeft !== CONFIG.bingTextPadding) {
            input.style.setProperty('padding-left', CONFIG.bingTextPadding, 'important');
        }

        // 3. 确保原生放大镜显示并定位正确
        var nativeIcon = document.querySelector('.b_searchIcon');
        if (nativeIcon) {
            nativeIcon.style.setProperty('left', '10px', 'important');
            nativeIcon.style.setProperty('z-index', '100', 'important');
            nativeIcon.style.setProperty('display', 'block', 'important');
            nativeIcon.style.setProperty('position', 'absolute', 'important');
            nativeIcon.style.setProperty('top', '50%', 'important');
            nativeIcon.style.setProperty('transform', 'translateY(-50%)', 'important');
        }
    }

    function injectButton() {
        var input = document.querySelector(currentSite.inputSelector);
        if (!input) {
            log('❌ 未找到输入框:', currentSite.inputSelector);
            return;
        }
        log('✅ 找到输入框:', input);

        var container = input.parentElement;
        log('初始容器:', container);

        if (currentSite.type === 'google') {
            if (!container.classList.contains('a4bIc')) {
                var p = input.closest('.a4bIc');
                if (p) container = p;
            }
        } else if (currentSite.type === 'baidu') {
            // 百度：尝试多个可能的容器（从近到远，支持新旧版本）
            var candidates = [
                input.closest('.input-wrap'),      // 新版百度chat样式
                input.closest('.s_ipt_wr'),        // 传统百度
                input.closest('.soutu-input-wrap'),// 图片搜索
                input.closest('#s_tab_inner'),
                input.closest('#form'),
                input.parentElement,
                input.closest('form')
            ].filter(Boolean);

            log('百度候选容器:', candidates);

            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                if (candidate && candidate.contains(input)) {
                    container = candidate;
                    log('✅ 选中容器:', candidate.className || candidate.id || candidate.tagName);
                    break;
                }
            }

            // 确保容器有定位属性
            if (container) {
                var position = getComputedStyle(container).position;
                log('容器position属性:', position);
                if (position === 'static') {
                    container.style.setProperty('position', 'relative', 'important');
                    log('✅ 已设置容器为 relative');
                }
            }
        } else if (currentSite.type === 'bing') {
            // **修复关键**：使用输入框的直接父元素，而不是form
            // 这样可以确保绝对定位相对于输入框容器
            var directParent = input.parentElement;
            var searchBox = input.closest('.b_searchboxForm');

            // 优先使用直接父元素，如果不存在则使用searchBox
            container = directParent || searchBox || input.closest('form');
        }

        if (!container) {
            log('❌ 未找到合适的容器');
            return;
        }
        log('✅ 最终容器:', container);

        if (container.querySelector('.' + CONFIG.hostClass) || container.querySelector('.g-syntax-btn-legacy')) {
            log('⚠️ 按钮已存在，跳过注入');
            return;
        }

        // --- Bing: Shadow DOM + Absolute (悬浮不占位) ---
        if (currentSite.type === 'bing') {
            // 先强制设置容器为relative定位
            if (getComputedStyle(container).position === 'static') {
                container.style.setProperty('position', 'relative', 'important');
            }

            var host = document.createElement('div');
            host.className = CONFIG.hostClass + ' bing-shadow-host';

            // 内联样式双重保险
            host.style.cssText = 'position:absolute!important;left:' + CONFIG.bingIconLeft + '!important;top:50%!important;transform:translateY(-50%)!important;z-index:10005!important;display:block!important;width:30px!important;height:30px!important;pointer-events:auto!important;';

            var shadow = host.attachShadow({ mode: 'open' });
            var style = document.createElement('style');
            style.textContent = shadowCss;
            shadow.appendChild(style);
            var btn = document.createElement('div');
            btn.id = 'btn-inner';
            btn.innerHTML = CONFIG.btnContent;
            btn.title = "高级搜索";
            shadow.appendChild(btn);

            btn.onclick = function(e) {
                e.stopPropagation(); e.preventDefault();
                var rect = btn.getBoundingClientRect();
                showMenu(rect);
            };

            container.appendChild(host);
            enforceBingStyles();
            log('✅ Bing按钮已注入');

        } else {
            // Google / Baidu
            var btn = document.createElement('div');
            btn.className = 'g-syntax-btn-legacy';
            btn.innerHTML = CONFIG.btnContent;
            if (currentSite.type === 'google') btn.classList.add('pos-google');
            if (currentSite.type === 'baidu') btn.classList.add('pos-baidu');
            btn.title = "高级搜索";
            btn.onclick = function(e) {
                e.stopPropagation();
                var rect = btn.getBoundingClientRect();
                showMenu(rect);
            };
            container.appendChild(btn);
            log('✅ ' + currentSite.type + ' 按钮已注入，类名:', btn.className);
            log('按钮元素:', btn);
            log('按钮计算样式:', getComputedStyle(btn).position, getComputedStyle(btn).left, getComputedStyle(btn).zIndex);
        }
    }

    function applySearch(tool) {
        var input = document.querySelector(currentSite.inputSelector);
        if (!input) return;
        var newVal = tool.action(input.value);
        input.value = newVal;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.focus();
        log('✅ 已应用搜索:', newVal);
    }

    // --- 6. 监控 ---
    var observer = new MutationObserver(function() {
        if (!document.querySelector('.' + CONFIG.hostClass) && !document.querySelector('.g-syntax-btn-legacy')) {
            log('🔄 检测到DOM变化，重新注入按钮');
            injectButton();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    log('✅ DOM监控已启动');

    // 心跳检测 (防止样式失效)
    if (currentSite.type === 'bing') {
        setInterval(enforceBingStyles, 200);
        log('✅ Bing心跳检测已启动');
    }

    // 首次注入
    setTimeout(function() {
        log('⏰ 执行首次注入');
        injectButton();
    }, 500);

    log('🚀 脚本初始化完成');
})();
