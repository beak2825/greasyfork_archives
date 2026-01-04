// ==UserScript==
// @name         TGFC论坛助手
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  TGFC论坛增强：Neo-Retro深色主题、快捷工具栏、用户/关键词屏蔽、多标签标注、紧凑模式、Markdown渲染、摘录库、发帖统计(含连发统计)、自定义配色/字体、十大话题优化
// @author       Heiren + AI
// @match        https://s.tgfcer.com/*
// @match        https://s.tgfcer.com/forum-*.html
// @match        https://s.tgfcer.com/read-*.html
// @match        https://club.tgfcer.com/*
// @match        https://bbs.tgfcer.com/*
// @match        https://bbs.tgfcer.com/forum-*.html
// @match        https://bbs.tgfcer.com/thread-*.html
// @match        https://tgfcer.com/*
// @exclude      *://*/wap/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      bbs.tgfcer.com
// @connect      s.tgfcer.com
// @connect      club.tgfcer.com
// @connect      tgfcer.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558130/TGFC%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558130/TGFC%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 严防死守：如果是 WAP 版页面，主脚本直接退出，不执行任何逻辑
    if (location.href.includes('/wap/')) {
        console.log('[TGFC] 检测到 WAP 页面，主脚本退出');
        return;
    }

    // 跳过个人资料页
    if (location.href.includes('space.php') || location.href.includes('action=viewpro')) {
        return;
    }

    // 立即注入关键布局样式（防止页面闪烁）
    (function injectCriticalStyles() {
        let mainWidth, bgColor, font, fontSize;
        try {
            mainWidth = GM_getValue("mainWidth", "1200");
            bgColor = GM_getValue("bgColor", "#BDBEBD");
            font = GM_getValue("font", "");
            fontSize = GM_getValue("fontSize", "");
        } catch (e) {
            mainWidth = "1200";
            bgColor = "#BDBEBD";
            font = "";
            fontSize = "";
        }

        const criticalCSS = `
            :root {
                --tgfc-main-width: ${mainWidth}px;
                --tgfc-bg-color: ${bgColor};
                --tgfc-font: ${font || 'inherit'};
                --tgfc-font-size: ${fontSize || 'inherit'};
            }
            body {
                background: var(--tgfc-bg-color) !important;
            }
            /* 字体设置应用到帖子内容 */
            .t_f, .postmessage, .quote, .blockcode, .reply_wrap,
            .t_f *, .postmessage *, .quote *, .reply_wrap *,
            #threadlist, #threadlist td, #threadlist th, #threadlist a,
            .threadlist, .threadlist td, .threadlist th, .threadlist a,
            #postlist, #postlist td, 
            textarea[name="message"] {
                ${font ? `font-family: var(--tgfc-font) !important;` : ''}
                ${fontSize ? `font-size: var(--tgfc-font-size) !important;` : ''}
                ${fontSize ? `line-height: 1.6 !important;` : ''}
            }
            /* 设置面板使用固定字体 */
            #tgfc-panel, #tgfc-panel * {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                font-size: 13px !important;
                line-height: 1.4 !important;
            }
            #tgfc-panel h3 {
                font-size: 16px !important;
            }
            #tgfc-panel select, #tgfc-panel input[type="text"] {
                font-size: 12px !important;
            }
            
            /* 发帖输入框行高重置 */
            textarea[name="message"] {
                 line-height: normal !important;
            }


            /* 助手UI元素字号 */
            .t_f .tgfc-btn, .postmessage .tgfc-btn {
                 font-size: 10px !important;
                 line-height: 12px !important;
            }

            body > .wrap, #footer .wrap {
                max-width: var(--tgfc-main-width) !important;
                min-width: 0 !important;
                width: var(--tgfc-main-width) !important;
                margin: 0 auto !important;
            }
            body > .wrap {
                opacity: 0;
                transition: opacity 0.15s ease-out;
            }
            #footer .wrap, #footlinks {
                text-align: right !important;
                float: none !important;
            }
            body.tgfc-ready > .wrap { opacity: 1; }
            @keyframes tgfc-fallback-show { to { opacity: 1; } }
            body:not(.tgfc-ready) > .wrap {
                animation: tgfc-fallback-show 0.3s ease-out 2s forwards;
            }
        `;

        const style = document.createElement('style');
        style.id = 'tgfc-critical-css';
        style.textContent = criticalCSS;
        if (document.head) {
            document.head.insertBefore(style, document.head.firstChild);
        } else if (document.documentElement) {
            document.documentElement.insertBefore(style, document.documentElement.firstChild);
        } else {
            document.write('<style id="tgfc-critical-css">' + criticalCSS + '</style>');
        }

        function markReady() {
            if (document.body) {
                requestAnimationFrame(() => document.body.classList.add('tgfc-ready'));
            } else if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', markReady, { once: true });
            } else {
                requestAnimationFrame(markReady);
            }
        }

        markReady();
    })();

    // 模块 1: 基础配置与存储
    let memStore = {};
    function Safe_GetValue(key, def) {
        try { return GM_getValue(key, def); } catch (e) { return memStore[key] || def; }
    }
    function Safe_SetValue(key, val) {
        try { GM_setValue(key, val); } catch (e) { memStore[key] = val; }
    }

    const defaultConfig = {
        menuPlus: true,
        blocked: [],
        blockedKeywords: [],
        highlighted: {},
        customPresets: [],
        font: "",
        fontSize: "",
        bgColor: "#BDBEBD",
        mainWidth: "1200",
        pageZoom: "1.0",
        globalPostBg: "",
        globalPostColor: "",
        hideList: true,
        showListTip: true,
        hideKeyword: true,
        showKeywordTip: true,
        hideContent: true,
        showContentTip: true,
        compactMode: true,
        markdown: true,
        neoretro: false
    };

    const presets = [
        // 艺术系：康定斯基风格，大胆原色对比
        { name: '深蓝金', bg: '#1a237e', color: '#ffeb3b', size: '14px', category: '艺术系' },
        { name: '胭脂红', bg: '#b71c1c', color: '#fff8e1', size: '14px', category: '艺术系' },
        { name: '丹霞金', bg: '#db4d43', color: '#ddd736', size: '14px', category: '艺术系' },
        // 自然系：柔和舒适，长时间阅读
        { name: '信笺麻', bg: '#d5d5aa', color: '#2b1e43', size: '14px', category: '自然系' },
        { name: '薄荷绿', bg: '#e8f5e9', color: '#2e7d32', size: '14px', category: '自然系' },
        { name: '烟紫灰', bg: '#e0d6d1', color: '#5f4e57', size: '14px', category: '自然系' },
        // 活力系：明亮清爽，提神醒目
        { name: '炽焰橙', bg: '#ff6f00', color: '#1a1a1a', size: '14px', category: '活力系' },
        { name: '暖阳米', bg: '#fdf6e3', color: '#586e75', size: '14px', category: '活力系' },
        { name: '极客蓝', bg: '#f0f5ff', color: '#2f54eb', size: '14px', category: '活力系' },
        // 标记系：醒目标注，快速定位
        { name: '警示红', bg: '#fff1f0', color: '#cf1322', size: '14px', category: '标记系' },
        { name: '荧光黄', bg: '#ffff00', color: '#000000', size: '14px', category: '标记系' },
        { name: '焦点黄', bg: '#fffde7', color: '#f57f17', size: '14px', category: '标记系' },
        // 暗色系：夜间模式，低光环境
        { name: '复古暗', bg: '#303030', color: '#e0e0e0', size: '14px', category: '暗色系' },
        { name: '深海蓝', bg: '#1a3a4a', color: '#7dd3e8', size: '14px', category: '暗色系' },
        { name: '酒红暗', bg: '#4a2030', color: '#e8b4c4', size: '14px', category: '暗色系' }
    ];

    const fontPresets = [
        { name: '默认', val: '' },
        { name: '微软雅黑', val: 'Microsoft YaHei, "微软雅黑", sans-serif' },
        { name: '苹果苹方', val: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif' },
        { name: '思源黑体', val: '"Source Han Sans SC", "Noto Sans SC", sans-serif' },
        { name: '冬青黑体', val: '"Hiragino Sans GB", sans-serif' },
        { name: 'Tahoma', val: 'Tahoma, sans-serif' },
        { name: '衡线体', val: 'Georgia, "Times New Roman", serif' },
        { name: '黑体', val: 'SimHei, "Heiti SC", sans-serif' },
        { name: '宋体', val: 'SimSun, "宋体", serif' },
        { name: '仿宋', val: 'FangSong, "FangSong SC", serif' },
        { name: '楷体', val: 'KaiTi, "Kaiti SC", serif' }
    ];

    const fontSizePresets = [
        { name: '默认', val: '' },
        { name: '12px', val: '12px' },
        { name: '13px', val: '13px' },
        { name: '14px', val: '14px' },
        { name: '15px', val: '15px' },
        { name: '16px', val: '16px' },
        { name: '18px', val: '18px' },
        { name: '20px', val: '20px' },
        { name: '24px', val: '24px' },
        { name: '28px', val: '28px' },
        { name: '32px', val: '32px' }
    ];



    function cleanStr(s) { return s ? s.replace(/[\r\n\t\u200b-\u200d\uFEFF\xA0]+/g, " ").trim() : ""; }

    function getConfig() {
        let b = Safe_GetValue("blocked", defaultConfig.blocked);
        let highlighted = Safe_GetValue("highlighted", defaultConfig.highlighted) || {};

        // 数据迁移: tag 字符串 -> tags 数组
        let needMigration = false;
        for (let user in highlighted) {
            if (highlighted[user].tag !== undefined && highlighted[user].tags === undefined) {
                const oldTag = highlighted[user].tag;
                highlighted[user].tags = oldTag ? oldTag.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
                delete highlighted[user].tag;
                needMigration = true;
            }
        }
        if (needMigration) {
            Safe_SetValue("highlighted", highlighted);
        }

        return {
            menuPlus: Safe_GetValue("menuPlus", defaultConfig.menuPlus),
            blocked: Array.isArray(b) ? b.map(cleanStr).filter(Boolean) : [],
            blockedKeywords: (() => { let kw = Safe_GetValue("blockedKeywords", defaultConfig.blockedKeywords); return Array.isArray(kw) ? kw.map(cleanStr).filter(Boolean) : []; })(),
            highlighted: highlighted,
            customPresets: Safe_GetValue("customPresets", defaultConfig.customPresets) || [],
            font: Safe_GetValue("font", defaultConfig.font),
            fontSize: Safe_GetValue("fontSize", defaultConfig.fontSize),
            bgColor: Safe_GetValue("bgColor", defaultConfig.bgColor),
            mainWidth: Safe_GetValue("mainWidth", defaultConfig.mainWidth),
            globalPostBg: Safe_GetValue("globalPostBg", defaultConfig.globalPostBg),
            globalPostColor: Safe_GetValue("globalPostColor", defaultConfig.globalPostColor),
            globalUserBg: Safe_GetValue("globalUserBg", ""),
            globalUserColor: Safe_GetValue("globalUserColor", ""),
            globalContentBg: Safe_GetValue("globalContentBg", ""),
            globalContentColor: Safe_GetValue("globalContentColor", ""),

            hideList: Safe_GetValue("hideList", defaultConfig.hideList),
            showListTip: Safe_GetValue("showListTip", defaultConfig.showListTip),
            hideKeyword: Safe_GetValue("hideKeyword", defaultConfig.hideKeyword),
            showKeywordTip: Safe_GetValue("showKeywordTip", defaultConfig.showKeywordTip),
            hideContent: Safe_GetValue("hideContent", defaultConfig.hideContent),
            showContentTip: Safe_GetValue("showContentTip", defaultConfig.showContentTip),
            compact: Safe_GetValue("compactMode", defaultConfig.compactMode),
            markdown: Safe_GetValue("markdown", defaultConfig.markdown),
            neoretro: Safe_GetValue("neoretro", defaultConfig.neoretro),
            nr_backup_bg: Safe_GetValue("nr_backup_bg"),
            nr_backup_color: Safe_GetValue("nr_backup_color"),
            nr_backup_ubg: Safe_GetValue("nr_backup_ubg"),
            nr_backup_ucol: Safe_GetValue("nr_backup_ucol"),
            nr_backup_cbg: Safe_GetValue("nr_backup_cbg"),
            nr_backup_ccol: Safe_GetValue("nr_backup_ccol")
        };
    }

    function saveConfig(c) {
        Safe_SetValue("menuPlus", c.menuPlus);
        Safe_SetValue("blocked", c.blocked);
        Safe_SetValue("blockedKeywords", c.blockedKeywords);
        Safe_SetValue("highlighted", c.highlighted);
        Safe_SetValue("customPresets", c.customPresets);
        Safe_SetValue("font", c.font);
        Safe_SetValue("fontSize", c.fontSize);
        Safe_SetValue("bgColor", c.bgColor);
        Safe_SetValue("mainWidth", c.mainWidth);
        Safe_SetValue("globalPostBg", c.globalPostBg);
        Safe_SetValue("globalPostColor", c.globalPostColor);
        Safe_SetValue("globalUserBg", c.globalUserBg);
        Safe_SetValue("globalUserColor", c.globalUserColor);
        Safe_SetValue("globalContentBg", c.globalContentBg);
        Safe_SetValue("globalContentColor", c.globalContentColor);

        Safe_SetValue("hideList", c.hideList);
        Safe_SetValue("showListTip", c.showListTip);
        Safe_SetValue("hideKeyword", c.hideKeyword);
        Safe_SetValue("showKeywordTip", c.showKeywordTip);
        Safe_SetValue("hideContent", c.hideContent);
        Safe_SetValue("showContentTip", c.showContentTip);
        Safe_SetValue("compactMode", c.compact);
        Safe_SetValue("markdown", c.markdown);
        Safe_SetValue("neoretro", c.neoretro);
        Safe_SetValue("nr_backup_bg", c.nr_backup_bg);
        Safe_SetValue("nr_backup_color", c.nr_backup_color);
        Safe_SetValue("nr_backup_ubg", c.nr_backup_ubg);
        Safe_SetValue("nr_backup_ucol", c.nr_backup_ucol);
        Safe_SetValue("nr_backup_cbg", c.nr_backup_cbg);
        Safe_SetValue("nr_backup_ccol", c.nr_backup_ccol);

        // 同步配置到 localStorage，供 WAP 版脚本读取
        try {
            const wapConfig = {
                blocked: c.blocked,
                blockedKeywords: c.blockedKeywords,
                highlighted: c.highlighted,
                hideList: c.hideList,
                hideKeyword: c.hideKeyword,
                hideContent: c.hideContent,
            };
            localStorage.setItem('tgfc_wap_config', JSON.stringify(wapConfig));
        } catch (e) {
            console.warn('[TGFC助手] WAP配置同步失败:', e);
        }
    }



    // 模块 2: Menu+ 导航增强
    function initMenuPlus() {
        const STORAGE_KEY_PM = 'tgfc_pmprompt_hidden';
        const STORAGE_KEY_MENU = 'tgfc_custom_menu_items';

        const defaultMenuItems = [
            { id: 'threads', name: '我的主题', url: 'https://s.tgfcer.com/my.php?item=threads&srchfid=25', enabled: true },
            { id: 'posts', name: '我的回复', url: 'https://s.tgfcer.com/my.php?item=posts&srchfid=25', enabled: true },
            { id: 'fav', name: '收藏夹', url: 'https://s.tgfcer.com/my.php?item=favorites&type=thread', enabled: true },
            { id: 'forum25', name: '常去版面', url: 'https://s.tgfcer.com/forum-25-1.html', enabled: false },
            { id: 'ai', name: 'AI 工具箱', url: 'https://yourtool.com', enabled: false }
        ];

        // 数据迁移与同步逻辑：优先读取 GM_storage，如果为空则常识迁移 localStorage 数据
        function loadMenuItems() {
            try {
                // 1. 尝试从 GM_storage 读取
                let raw = GM_getValue(STORAGE_KEY_MENU);
                // 2. 如果 GM_storage 为空，尝试从 localStorage 迁移
                if (!raw) {
                    raw = localStorage.getItem(STORAGE_KEY_MENU);
                    if (raw) {
                        GM_setValue(STORAGE_KEY_MENU, raw); // 迁移保存
                    }
                }

                if (!raw) return defaultMenuItems.slice();
                const arr = JSON.parse(raw);
                return Array.isArray(arr) ? arr : defaultMenuItems.slice();
            } catch (e) {
                console.error("Menu Load Error:", e);
                return defaultMenuItems.slice();
            }
        }

        function saveMenuItems(items) {
            const str = JSON.stringify(items);
            GM_setValue(STORAGE_KEY_MENU, str);
            localStorage.setItem(STORAGE_KEY_MENU, str);
        }

        function fade(el, show) {
            el.style.transition = 'opacity 0.25s ease';
            el.style.opacity = show ? '1' : '0';
            setTimeout(() => el.style.display = show ? '' : 'none', show ? 0 : 250);
        }

        function setHidden(hidden) {
            const val = hidden ? '1' : '0';
            GM_setValue(STORAGE_KEY_PM, val);
            localStorage.setItem(STORAGE_KEY_PM, val);
            updateSwitch(hidden);
            document.querySelectorAll('#pmprompt').forEach(el => {
                el.style.transition = 'opacity 0.25s ease';
                el.style.opacity = hidden ? '0' : '1';
                setTimeout(() => el.style.display = hidden ? 'none' : '', hidden ? 250 : 0);
            });
        }

        function isHidden() {
            let val = GM_getValue(STORAGE_KEY_PM);
            if (val === undefined || val === null) {
                const localVal = localStorage.getItem(STORAGE_KEY_PM);
                if (localVal !== null) {
                    val = localVal;
                    GM_setValue(STORAGE_KEY_PM, val);
                }
            }
            return val === '1';
        }

        function updateSwitch(hidden) {
            const sw = document.getElementById('tgfc-toggle-switch');
            if (!sw) return;
            sw.textContent = hidden ? '🔕' : '🔔';
        }

        function createSwitch(container) {
            if (document.getElementById('tgfc-toggle-switch')) return;

            const sw = document.createElement('a');
            sw.id = 'tgfc-toggle-switch';
            sw.href = 'javascript:void(0);';
            sw.textContent = '通知栏：已隐藏 ▢';
            sw.style.cssText = 'font-size:12px;text-decoration:none;cursor:pointer;';
            sw.onmouseover = () => sw.style.textDecoration = 'underline';
            sw.onmouseout = () => sw.style.textDecoration = 'none';
            sw.onclick = () => setHidden(!isHidden());

            container.appendChild(sw);
            updateSwitch(isHidden());
        }

        function createDropdownTrigger(anchor) {
            if (document.getElementById('tgfc-dropdown-trigger')) return;

            const wrapper = document.createElement('span');
            wrapper.id = 'tgfc-dropdown-trigger';
            wrapper.style.cssText = 'font-size:12px;cursor:pointer;position:relative;';

            const link = document.createElement('a');
            link.href = 'https://s.tgfcer.com/forum-25-1.html';
            link.textContent = '快速通道 ▼';
            link.style.cssText = `
              text-decoration: none;
              color: inherit;
              cursor: pointer;
          `;
            link.onmouseover = () => link.style.textDecoration = 'underline';
            link.onmouseout = () => link.style.textDecoration = 'none';

            wrapper.appendChild(link);

            anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
            anchor.parentNode.insertBefore(document.createTextNode(' | '), wrapper.nextSibling);

            return wrapper;
        }

        function createMenuContainer() {
            let menu = document.getElementById('tgfc-dropdown-menu');
            if (menu) return menu;

            menu = document.createElement('div');
            menu.id = 'tgfc-dropdown-menu';
            menu.style.cssText = `
              position: fixed;
              display: none;
              z-index: 999999;
              background: rgba(255,255,255,0.35);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              padding: 4px 0;
              transform: translateX(6px);
              opacity: 0;
              transition: opacity 0.18s ease, transform 0.18s ease;
              white-space: nowrap;
          `;
            document.body.appendChild(menu);
            return menu;
        }

        function createModal() {
            let overlay = document.getElementById('tgfc-edit-overlay');
            if (overlay) return overlay;

            overlay = document.createElement('div');
            overlay.id = 'tgfc-edit-overlay';
            overlay.style.cssText = `
              position: fixed;
              inset: 0;
              background: rgba(0,0,0,0.15);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 1000000;
          `;

            const modal = document.createElement('div');
            modal.id = 'tgfc-edit-modal';
            modal.style.cssText = `
              background: rgba(255,255,255,0.9);
              backdrop-filter: blur(20px);
              border-radius: 14px;
              box-shadow: 0 8px 20px rgba(0,0,0,0.2);
              padding: 14px 16px 12px;
              min-width: 260px;
              max-width: 320px;
              font-size: 12px;
              color: #000;
          `;

            const title = document.createElement('div');
            title.id = 'tgfc-edit-title';
            title.textContent = '编辑链接';
            title.style.cssText = `
              font-weight: bold;
              text-align: center;
              margin-bottom: 8px;
          `;

            const nameLabel = document.createElement('div');
            nameLabel.textContent = '名称';
            nameLabel.style.cssText = `margin-top: 4px; margin-bottom: 2px; font-size: 11px;`;

            const nameInput = document.createElement('input');
            nameInput.id = 'tgfc-edit-name';
            nameInput.type = 'text';
            nameInput.style.cssText = `
              width: 100%;
              padding: 4px 6px;
              font-size: 12px;
              border-radius: 6px;
              border: 1px solid #ccc;
              box-sizing: border-box;
          `;

            const urlLabel = document.createElement('div');
            urlLabel.textContent = '地址';
            urlLabel.style.cssText = `margin-top: 6px; margin-bottom: 2px; font-size: 11px;`;

            const urlInput = document.createElement('input');
            urlInput.id = 'tgfc-edit-url';
            urlInput.type = 'text';
            urlInput.style.cssText = `
              width: 100%;
              padding: 4px 6px;
              font-size: 12px;
              border-radius: 6px;
              border: 1px solid #ccc;
              box-sizing: border-box;
          `;

            const btnRow = document.createElement('div');
            btnRow.style.cssText = `
              margin-top: 10px;
              display: flex;
              justify-content: flex-end;
              gap: 8px;
          `;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = '取消';
            cancelBtn.style.cssText = `
              padding: 2px 10px;
              font-size: 12px;
              border-radius: 12px;
              border: none;
              background: #e0e0e0;
              cursor: pointer;
          `;

            const saveBtn = document.createElement('button');
            saveBtn.textContent = '保存';
            saveBtn.style.cssText = `
              padding: 2px 12px;
              font-size: 12px;
              border-radius: 12px;
              border: none;
              background: #007aff;
              color: #fff;
              cursor: pointer;
          `;

            btnRow.appendChild(cancelBtn);
            btnRow.appendChild(saveBtn);

            modal.appendChild(title);
            modal.appendChild(nameLabel);
            modal.appendChild(nameInput);
            modal.appendChild(urlLabel);
            modal.appendChild(urlInput);
            modal.appendChild(btnRow);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            return overlay;
        }

        function renderMenu(menu, items) {
            menu.innerHTML = '';

            const enabledItems = items.filter(i => i.enabled);
            let draggedItem = null;
            let draggedRow = null;

            enabledItems.forEach((item, index) => {
                const row = document.createElement('div');
                row.draggable = true;
                row.dataset.id = item.id;
                row.dataset.index = index;
                row.style.cssText = `
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 4px 10px;
                  font-size: 12px;
                  color: #000;
                  cursor: grab;
                  min-height: 24px;
                  transition: background 0.15s, transform 0.15s;
              `;
                row.onmouseover = () => { if (!draggedRow) row.style.background = 'rgba(255,255,255,0.5)'; };
                row.onmouseout = () => { if (!draggedRow) row.style.background = 'transparent'; };

                // 拖拽手柄
                const handle = document.createElement('span');
                handle.textContent = '⋮⋮';
                handle.title = '拖拽排序';
                handle.style.cssText = `
                  cursor: grab;
                  color: #999;
                  font-size: 10px;
                  margin-right: 6px;
                  user-select: none;
                  opacity: 0.5;
                  transition: opacity 0.15s;
              `;
                row.addEventListener('mouseenter', () => handle.style.opacity = '1');
                row.addEventListener('mouseleave', () => handle.style.opacity = '0.5');

                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.name;
                link.style.cssText = `
                  text-decoration: none;
                  color: inherit;
                  flex: 1 1 auto;
                  pointer-events: auto;
              `;
                link.ondragstart = (e) => e.preventDefault(); // 防止链接自身拖拽

                const actions = document.createElement('span');
                actions.style.cssText = `
                  flex: 0 0 auto;
                  margin-left: 6px;
                  opacity: 0;
                  transition: opacity 0.15s ease;
              `;

                const editBtn = document.createElement('span');
                editBtn.textContent = '🖊';
                editBtn.title = '编辑';
                editBtn.style.cssText = `cursor: pointer; margin-right: 4px; font-size: 10px;`;

                const delBtn = document.createElement('span');
                delBtn.textContent = '✕';
                delBtn.title = '删除';
                delBtn.style.cssText = `cursor: pointer; font-size: 10px;`;

                row.addEventListener('mouseenter', () => actions.style.opacity = '1');
                row.addEventListener('mouseleave', () => actions.style.opacity = '0');

                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEditModal(items, item);
                });

                delBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newItems = items.filter(x => x.id !== item.id);
                    saveMenuItems(newItems);
                    renderMenu(menu, newItems);
                });

                // 拖拽事件
                row.addEventListener('dragstart', (e) => {
                    draggedItem = item;
                    draggedRow = row;
                    row.style.opacity = '0.5';
                    row.style.cursor = 'grabbing';
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', item.id);
                });

                row.addEventListener('dragend', () => {
                    row.style.opacity = '1';
                    row.style.cursor = 'grab';
                    draggedItem = null;
                    draggedRow = null;
                    // 清除所有行的拖拽样式
                    menu.querySelectorAll('div[draggable]').forEach(r => {
                        r.style.borderTop = '';
                        r.style.borderBottom = '';
                    });
                });

                row.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (draggedRow && draggedRow !== row) {
                        const rect = row.getBoundingClientRect();
                        const midY = rect.top + rect.height / 2;
                        // 清除其他行的边框
                        menu.querySelectorAll('div[draggable]').forEach(r => {
                            r.style.borderTop = '';
                            r.style.borderBottom = '';
                        });
                        if (e.clientY < midY) {
                            row.style.borderTop = '2px solid #007aff';
                        } else {
                            row.style.borderBottom = '2px solid #007aff';
                        }
                    }
                });

                row.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (!draggedItem || draggedItem.id === item.id) return;

                    const rect = row.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    const insertBefore = e.clientY < midY;

                    // 重新排序
                    const fromIndex = enabledItems.findIndex(i => i.id === draggedItem.id);
                    let toIndex = enabledItems.findIndex(i => i.id === item.id);
                    if (fromIndex === -1 || toIndex === -1) return;

                    // 调整目标位置
                    if (!insertBefore) toIndex++;
                    if (fromIndex < toIndex) toIndex--;

                    // 在原始 items 数组中重新排序
                    const itemsCopy = items.slice();
                    const realFromIndex = itemsCopy.findIndex(i => i.id === draggedItem.id);
                    const realToIndex = itemsCopy.findIndex(i => i.id === item.id);
                    const [moved] = itemsCopy.splice(realFromIndex, 1);
                    const finalIndex = insertBefore ? realToIndex : realToIndex + 1;
                    itemsCopy.splice(realFromIndex < realToIndex ? finalIndex - 1 : finalIndex, 0, moved);

                    saveMenuItems(itemsCopy);
                    renderMenu(menu, itemsCopy);
                });

                actions.appendChild(editBtn);
                actions.appendChild(delBtn);

                row.appendChild(handle);
                row.appendChild(link);
                row.appendChild(actions);
                menu.appendChild(row);
            });

            const addRow = document.createElement('div');
            addRow.textContent = '＋ 添加链接';
            addRow.style.cssText = `
              padding: 4px 10px;
              font-size: 12px;
              color: #007aff;
              cursor: pointer;
              border-top: 1px solid rgba(255,255,255,0.6);
              margin-top: 2px;
          `;
            addRow.onmouseover = () => addRow.style.background = 'rgba(255,255,255,0.5)';
            addRow.onmouseout = () => addRow.style.background = 'transparent';
            addRow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditModal(items, null);
            });

            menu.appendChild(addRow);
        }

        function openEditModal(allItems, item) {
            const overlay = createModal();
            const modal = document.getElementById('tgfc-edit-modal');
            const title = document.getElementById('tgfc-edit-title');
            const nameInput = document.getElementById('tgfc-edit-name');
            const urlInput = document.getElementById('tgfc-edit-url');
            const [cancelBtn, saveBtn] = modal.querySelectorAll('button');

            title.textContent = item ? '编辑链接' : '添加新链接';
            nameInput.value = item ? item.name : '';
            urlInput.value = item ? item.url : '';

            overlay.style.display = 'flex';

            function close() {
                overlay.style.display = 'none';
                cancelBtn.onclick = null;
                saveBtn.onclick = null;
            }

            cancelBtn.onclick = () => close();

            saveBtn.onclick = () => {
                const name = nameInput.value.trim();
                const url = urlInput.value.trim();
                if (!name || !url) {
                    alert('名称和地址不能为空');
                    return;
                }

                let itemsCopy = allItems.slice();
                if (item) {
                    itemsCopy = itemsCopy.map(x =>
                        x.id === item.id ? { ...x, name, url, enabled: true } : x
                    );
                } else {
                    const id = 'custom_' + Date.now();
                    itemsCopy.push({ id, name, url, enabled: true });
                }

                saveMenuItems(itemsCopy);
                const menu = document.getElementById('tgfc-dropdown-menu');
                if (menu) renderMenu(menu, itemsCopy);
                close();
            };
        }

        function attachHover(trigger, menu) {
            let hoverTimer = null;
            let visible = false;

            function showMenu() {
                const rect = trigger.getBoundingClientRect();
                // 竖条菜单：下拉框从左侧展开
                menu.style.right = `${window.innerWidth - rect.left + 8}px`;
                menu.style.top = `${rect.top}px`;
                menu.style.left = 'auto';
                menu.style.display = 'block';
                requestAnimationFrame(() => {
                    menu.style.opacity = '1';
                    menu.style.transform = 'translateX(0)';
                });
                visible = true;
            }

            function hideMenu() {
                menu.style.opacity = '0';
                menu.style.transform = 'translateX(6px)';
                setTimeout(() => {
                    if (menu.style.opacity === '0') menu.style.display = 'none';
                }, 180);
                visible = false;
            }

            trigger.addEventListener('mouseenter', () => {
                if (hoverTimer) clearTimeout(hoverTimer);
                if (!visible) showMenu();
            });

            trigger.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    if (!menu.matches(':hover')) hideMenu();
                }, 120);
            });

            menu.addEventListener('mouseleave', () => {
                hoverTimer = setTimeout(() => {
                    if (!trigger.matches(':hover')) hideMenu();
                }, 120);
            });

            menu.addEventListener('mouseenter', () => {
                if (hoverTimer) clearTimeout(hoverTimer);
            });
        }

        function tryInsert() {
            // 隐藏原有的邀请和帮助链接
            document.querySelectorAll('a[href*="invite.php"], a[href*="faq.php"]').forEach(link => {
                if (link.style.display === 'none') return;
                link.style.display = 'none';
                let prev = link.previousSibling;
                while (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent.trim() === '') {
                    prev = prev.previousSibling;
                }
                if (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent.includes('|')) {
                    prev.textContent = prev.textContent.replace(/\s*\|\s*$/, '');
                }
            });

            // 创建浮动竖条菜单
            if (!document.getElementById('tgfc-floating-menu')) {
                const menu = document.createElement('div');
                menu.id = 'tgfc-floating-menu';
                menu.style.cssText = `
                    position: fixed;
                    top: 33%;
                    transform: translateY(-50%);
                    z-index: 999999;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                    padding: 4px 2px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 10px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    transition: opacity 0.2s, box-shadow 0.2s;
                    opacity: 0.5;
                `;
                menu.onmouseenter = () => { menu.style.opacity = '1'; menu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.18), 0 0 1px rgba(0, 0, 0, 0.15)'; };
                menu.onmouseleave = () => { menu.style.opacity = '0.5'; menu.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1)'; };

                // 计算并更新位置（紧贴论坛内容区右侧）
                // 计算并更新位置（紧贴论坛内容区右侧）
                function updatePosition() {
                    const mainbox = document.querySelector('.mainbox') || document.querySelector('#wrapper') || document.querySelector('body > center > table');
                    let positioned = false;

                    if (mainbox) {
                        const rect = mainbox.getBoundingClientRect();
                        // 确保找到的元素有实际宽度，且位置合理
                        if (rect.width > 300) {
                            const rightEdge = rect.right + window.scrollX;
                            // 紧贴内容区右侧，留4px间距
                            // 如果计算出的 left 太小（比如小于屏幕一半），说明定位有问题，在大屏幕下至少应在中间靠右
                            if (rightEdge > 100) {
                                menu.style.left = `${Math.min(rightEdge + 16, window.innerWidth - 40)}px`;
                                menu.style.right = 'auto'; // 清除 right
                                positioned = true;
                            }
                        }
                    }

                    if (!positioned) {
                        // 如果找不到有效的内容区（如 post.php 布局不同），则根据设置的页面宽度计算理论位置
                        // 模拟居中布局：屏幕中心 + 一半宽度 + 4px 间距
                        const conf = getConfig(); // 获取用户设置的页面宽度
                        const width = parseInt(conf.mainWidth || '1200', 10);
                        const centerRight = window.innerWidth / 2 + width / 2;

                        // 同样限制不超过右侧屏幕边缘
                        const finalLeft = Math.min(centerRight + 16, window.innerWidth - 42);

                        menu.style.left = `${finalLeft}px`;
                        menu.style.right = 'auto';
                    }
                }

                // 快速通道
                const trigger = document.createElement('div');
                trigger.id = 'tgfc-dropdown-trigger';
                trigger.style.cssText = 'cursor:pointer;position:relative;';
                const link = document.createElement('a');
                link.href = 'https://s.tgfcer.com/forum-25-1.html';
                link.textContent = '🚀';
                link.title = '快速通道';
                link.style.cssText = 'text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:18px;border-radius:5px;transition:background 0.15s;';
                link.onmouseover = () => { link.style.background = 'rgba(0, 122, 255, 0.12)'; };
                link.onmouseout = () => { link.style.background = 'transparent'; };
                trigger.appendChild(link);

                // 摘录库
                const libLink = document.createElement('a');
                libLink.id = 'tgfc-lib-link';
                libLink.href = 'javascript:void(0);';
                libLink.textContent = '📚';
                libLink.title = '摘录库';
                libLink.style.cssText = 'text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:18px;border-radius:5px;transition:background 0.15s;';
                libLink.onmouseover = () => { libLink.style.background = 'rgba(88, 86, 214, 0.12)'; };
                libLink.onmouseout = () => { libLink.style.background = 'transparent'; };
                libLink.onclick = (e) => {
                    e.preventDefault();
                    if (typeof openLibPanel === 'function') openLibPanel();
                };

                // 统计按钮
                const statsBtn = document.createElement('a');
                statsBtn.id = 'tgfc-floating-stats';
                statsBtn.href = 'javascript:void(0);';
                statsBtn.textContent = '📊';
                statsBtn.title = '发帖统计';
                statsBtn.style.cssText = 'text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:18px;border-radius:5px;transition:background 0.15s;';
                statsBtn.onmouseover = () => { statsBtn.style.background = 'rgba(255, 215, 0, 0.2)'; };
                statsBtn.onmouseout = () => { statsBtn.style.background = 'transparent'; };
                statsBtn.onclick = (e) => {
                    e.preventDefault();
                    if (typeof openTagStatsPanel === 'function') openTagStatsPanel();
                };

                // 通知栏开关
                const sw = document.createElement('a');
                sw.id = 'tgfc-toggle-switch';
                sw.href = 'javascript:void(0);';
                sw.textContent = isHidden() ? '🔕' : '🔔';
                sw.title = '通知栏';
                sw.style.cssText = 'text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:18px;border-radius:5px;transition:background 0.15s;';
                sw.onmouseover = () => { sw.style.background = 'rgba(255, 149, 0, 0.12)'; };
                sw.onmouseout = () => { sw.style.background = 'transparent'; };
                sw.onclick = () => setHidden(!isHidden());

                // Neo-Retro 风格切换 (循环：关 -> 简约红 -> 暗夜霓虹)
                const nrBtn = document.createElement('a');
                // 状态图标: 关(熊猫-原版), 简(狐狸-红), 暗(猫头鹰-黑) -> 卡通可爱风
                const modes = ['🐼', '🦊', '🦉'];
                const titles = ['点击切换: 简约深红 (Fox)', '点击切换: 暗夜霓虹 (Owl)', '点击切换: 关闭/原版 (Panda)'];

                const updateBtnState = (val) => {
                    if (val === true) val = 1;
                    val = Number(val) || 0;
                    nrBtn.textContent = modes[val] || modes[0];
                    nrBtn.title = titles[val] || titles[0];
                };

                // init state
                let currentMode = getConfig().neoretro;
                updateBtnState(currentMode);

                nrBtn.href = 'javascript:void(0);';
                nrBtn.style.cssText = 'text-decoration:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:24px;height:24px;font-size:18px;border-radius:5px;transition:background 0.15s;';
                nrBtn.onmouseover = () => { nrBtn.style.background = 'rgba(255, 144, 232, 0.2)'; };
                nrBtn.onmouseout = () => { nrBtn.style.background = 'transparent'; };
                nrBtn.onclick = (e) => {
                    e.preventDefault();
                    let c = getConfig();
                    let val = c.neoretro;
                    if (val === true) val = 1;
                    if (!val) val = 0;
                    val = Number(val);

                    val = (val + 1) % 3; // Cycle 0->1->2->0

                    c.neoretro = val;
                    saveConfig(c);
                    updateBtnState(val);
                    applyNeoRetro(val);
                };

                // 排列顺序：快速通道 | 摘录库 | 统计 | 通知栏 | 风格切换
                menu.appendChild(trigger);
                menu.appendChild(libLink);
                menu.appendChild(statsBtn);
                menu.appendChild(sw);
                menu.appendChild(nrBtn);

                updateSwitch(isHidden());

                document.body.appendChild(menu);
                updatePosition();

                // 监听窗口大小变化
                window.addEventListener('resize', updatePosition);
                // 初始化快速通道下拉菜单
                const dropdownMenu = createMenuContainer();
                const items = loadMenuItems();
                renderMenu(dropdownMenu, items);
                attachHover(trigger, dropdownMenu);
            }
        }

        function init() {
            tryInsert();
            const hidden = isHidden();
            document.querySelectorAll('#pmprompt').forEach(el => {
                el.style.opacity = hidden ? '0' : '1';
                el.style.display = hidden ? 'none' : '';
            });
            const observer = new MutationObserver(tryInsert);
            observer.observe(document.body, { childList: true, subtree: true });
        }

        init();
    }

    // 模块 3: 样式表
    const css = `
        /* Neo-Retro Mode (Gumroad Style) */
        :root {
            --nr-bg: #d8d4ca;
            --nr-fg: #000000;
            --nr-ink: #801010; /* Christmas Deep Red (Classic) */
            --nr-green: #244a20; /* Pine Green */
            --nr-gold: #ffcc00;  /* Star Gold */
            --nr-accent: #ff90e8;
            
            /* 圣诞斜纹质感：极细微的纹理叠加 */
            --nr-stripe: repeating-linear-gradient(
                45deg,
                rgba(0,0,0,0.1),
                rgba(0,0,0,0.1) 10px,
                transparent 10px,
                transparent 20px
            );

            --nr-border: 2px solid var(--nr-ink);
            --nr-shadow: 6px 6px 0 0 var(--nr-ink);
            --nr-shadow-sm: 3px 3px 0 0 var(--nr-ink);
            --nr-shadow-hover: 1px 1px 0 0 var(--nr-ink);
            --nr-font: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        body.tgfc-neoretro-mode {
            /* background-color 由 JS 控制以支持自定义设置 */
            background-image: radial-gradient(#b0b0b0 1px, transparent 1px) !important;
            background-size: 24px 24px !important;
            color: var(--nr-fg) !important;
            font-family: var(--nr-font) !important;
        }

        /* === 全局表头居中 (适用于所有主题包括原版) === */
        .threadlist thead th,
        .threadlist thead td,
        .forumlist thead th,
        .forumlist thead td {
            text-align: center !important;
        }

        /* === 1. Neo-Retro 容器样式重构 === */
        /* 第一步：让外层容器透明，防止遮挡背景色 */
        .tgfc-neoretro-mode .wrap, 
        .tgfc-neoretro-mode .mainbox,
        .tgfc-neoretro-mode .viewthread {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* 第二步：只给真正的内容卡片添加白底 */
        .tgfc-neoretro-mode .forumlist,
        .tgfc-neoretro-mode .threadlist,
        .tgfc-neoretro-mode .pm,
        .tgfc-neoretro-mode #postlist > div,
        .tgfc-neoretro-mode table[id^="pid"] {
            background-color: #ffffff !important;
            border: var(--nr-border) !important;
            box-shadow: var(--nr-shadow) !important;
            border-radius: 0 !important;
            margin-bottom: 8px !important; /* 减小楼层间距，恢复紧凑 */
            color: #000 !important;
        }

        /* === 调整楼层间距背景 === */
        /* 让 viewthread 容器透明，使楼层之间的 margin 露出 Body 的背景色 (米色) */
        .tgfc-neoretro-mode .viewthread,
        .tgfc-neoretro-mode #postlist {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
        }

        /* 确保具体楼层依然是白底卡片 */
        .tgfc-neoretro-mode #postlist > div,
        .tgfc-neoretro-mode table[id^="pid"] {
            background-color: #ffffff !important;
            border: var(--nr-border) !important;
            box-shadow: var(--nr-shadow) !important;
            margin-bottom: 8px !important; /* 紧凑间距 */
        }

        /* === 2. 导航栏 (Header) 独立样式 === */
        /* 覆盖用户指出的顽固蓝色标题区域 - 只改颜色，不改尺寸 */
        .tgfc-neoretro-mode #header,
        .tgfc-neoretro-mode div.mainbox h1,
        .tgfc-neoretro-mode div.viewthread h1,
        .tgfc-neoretro-mode h3 { 
            background-color: var(--nr-ink) !important; /* 强制红底 */
            background-image: none !important; /* 去除蓝色图片背景 */
            color: #fff !important;
            /* 不添加额外边框/阴影/高度，保持原版尺寸 */
        }
        /* Header 单独保留边框阴影 */
        .tgfc-neoretro-mode #header {
            background-color: var(--nr-ink) !important;
            background-image: none !important;
            color: #fff !important;
            border: var(--nr-border) !important;
            box-shadow: var(--nr-shadow) !important;
        }
        
        /* === 列表表头/分类行 (浅红背景 + 居中) === */
        .tgfc-neoretro-mode .threadlist thead tr,
        .tgfc-neoretro-mode .threadlist thead th,
        .tgfc-neoretro-mode .threadlist thead td,
        .tgfc-neoretro-mode .threadlist .category,
        .tgfc-neoretro-mode .threadlist .category td,
        .tgfc-neoretro-mode .forumlist thead tr,
        .tgfc-neoretro-mode .forumlist thead th,
        .tgfc-neoretro-mode .forumlist thead td,
        .tgfc-neoretro-mode table[id^="forum_"] thead tr,
        .tgfc-neoretro-mode table[id^="forum_"] thead th,
        .tgfc-neoretro-mode table[id^="forum_"] thead td {
            background: #ffd8d8 !important; /* 加深的浅红色 */
            background-image: none !important;
            color: var(--nr-ink) !important; /* 深红文字 */
            border-bottom: 2px solid var(--nr-ink) !important;
            text-align: center !important; /* 文字居中 */
        }
        .tgfc-neoretro-mode .threadlist thead a,
        .tgfc-neoretro-mode .threadlist .category a,
        .tgfc-neoretro-mode .forumlist thead a,
        .tgfc-neoretro-mode table[id^="forum_"] thead a {
             color: var(--nr-ink) !important;
        }

        /* === 3. 圣诞模式专用覆盖 (Xmas Extensions) === */
        /* 标题栏增加纹理 (Container) */
        .tgfc-neoretro-xmas #header,
        .tgfc-neoretro-xmas .mainbox.viewthread h1,
        .tgfc-neoretro-xmas .mainbox h3,
        .tgfc-neoretro-xmas .threadlist .category,
        .tgfc-neoretro-xmas #nav,
        .tgfc-neoretro-xmas .pop_bg {
            background-image: var(--nr-stripe) !important;
        }



        .tgfc-neoretro-mode .threadlist td,
        .tgfc-neoretro-mode .threadlist th {
            border-bottom: 1px solid var(--nr-ink) !important;
        }

        .tgfc-neoretro-mode input,
        .tgfc-neoretro-mode textarea,
        .tgfc-neoretro-mode select {
            border: 2px solid var(--nr-ink) !important;
            background: #fff !important;
            padding: 5px !important;
            border-radius: 0 !important;
            box-shadow: 2px 2px 0 0 #ccc !important;
            font-family: var(--nr-font) !important;
        }
        .tgfc-neoretro-mode input:focus,
        .tgfc-neoretro-mode textarea:focus {
            box-shadow: 2px 2px 0 0 var(--nr-ink) !important;
            outline: none !important;
            background: #fffef0 !important;
        }

        /* 基础按钮样式 (简约深红版 - Gumroad Pink) */
        .tgfc-neoretro-mode button, 
        .tgfc-neoretro-mode .tgfc-btn,
        .tgfc-neoretro-mode .pn {
            background: var(--nr-accent) !important;
            color: var(--nr-ink) !important;
            border: 2px solid var(--nr-ink) !important;
            box-shadow: var(--nr-shadow-sm) !important;
            font-weight: bold !important;
            border-radius: 0 !important;
            text-shadow: none !important;
            transform: translate(0, 0) !important;
            transition: transform 0.1s, box-shadow 0.1s !important;
            cursor: pointer !important;
        }
        .tgfc-neoretro-mode button:hover,
        .tgfc-neoretro-mode .tgfc-btn:hover,
        .tgfc-neoretro-mode .pn:hover {
            transform: translate(2px, 2px) !important;
            box-shadow: var(--nr-shadow-hover) !important;
            background: #ffc900 !important; /* Standard Yellow hover */
        }
        .tgfc-neoretro-mode button:active,
        .tgfc-neoretro-mode .tgfc-btn:active,
        .tgfc-neoretro-mode .pn:active {
            transform: translate(3px, 3px) !important;
            box-shadow: none !important;
        }

        /* === Mode 2: 暗夜霓虹 (Neo-Retro Dark) === */
        /* 按照简约深红版结构设计，只改配色 */
        
        /* ★★★ 背景点暗化 ★★★ */
        body.tgfc-neoretro-dark {
            background-image: radial-gradient(#444444 1px, transparent 1px) !important;
        }
        
        /* ★★★ 全局暴力覆盖 ★★★ */
        
        /* 0. 基础：所有文字默认亮灰色 */
        body.tgfc-neoretro-dark,
        body.tgfc-neoretro-dark * {
            color: #cccccc;
        }
        
        /* 1. 所有链接默认亮粉色 */
        body.tgfc-neoretro-dark a {
            color: #ff9999 !important;
        }
        
        /* 2. ①面包屑导航 + 所有 p 标签 */
        body.tgfc-neoretro-dark p,
        body.tgfc-neoretro-dark p a,
        body.tgfc-neoretro-dark #forumlist {
            color: #ffffff !important;
        }
        
        /* 3. ②分页器区域深色化 */
        body.tgfc-neoretro-dark .pg,
        body.tgfc-neoretro-dark .pages,
        body.tgfc-neoretro-dark .pg a,
        body.tgfc-neoretro-dark .pages a {
            background: #303030 !important;
            color: #ff9999 !important;
            border-color: #ff6b6b !important;
        }
        body.tgfc-neoretro-dark .pg strong {
            background: #ff6b6b !important;
            color: #000 !important;
        }
        
        /* 4. ③Tab标签区域 (全部/精华/投票) */
        body.tgfc-neoretro-dark .toptab,
        body.tgfc-neoretro-dark .toptab td,
        body.tgfc-neoretro-dark ul.tabs,
        body.tgfc-neoretro-dark ul.tabs li,
        body.tgfc-neoretro-dark .subforum_left,
        body.tgfc-neoretro-dark .subforum_left_up {
            background: #303030 !important;
            background-color: #303030 !important;
            background-image: none !important;
            color: #cccccc !important;
        }
        body.tgfc-neoretro-dark .toptab a,
        body.tgfc-neoretro-dark ul.tabs a {
            color: #ff9999 !important;
        }
        
        /* 5. ④"版块主题"分隔行 - 深度覆盖 */
        body.tgfc-neoretro-dark .threadlist tr td[colspan],
        body.tgfc-neoretro-dark .threadlist tr th[colspan],
        body.tgfc-neoretro-dark .forumlist tr td[colspan] {
            background-color: #3d1010 !important;
            background: #3d1010 !important;
            color: #ffffff !important;
        }
        /* 针对表格内那个只有空格和文字的空 tr */
        body.tgfc-neoretro-dark .threadlist tbody tr td[colspan="4"],
        body.tgfc-neoretro-dark .threadlist tbody tr td[colspan="5"],
        body.tgfc-neoretro-dark .threadlist tbody tr td[colspan="6"] {
            background-color: #3d1010 !important;
            color: #ffffff !important;
            text-align: center !important;
            font-weight: bold;
        }
        /* 同时把这行前面的那两个空 td 也染红，防止露出灰边 */
        body.tgfc-neoretro-dark .threadlist tr:has(td[colspan]) td {
            background-color: #3d1010 !important;
        }
        
        /* 6. 表单区域深色化 */
        body.tgfc-neoretro-dark form,
        body.tgfc-neoretro-dark .postform,
        body.tgfc-neoretro-dark .quickpost,
        body.tgfc-neoretro-dark .typeoption,
        body.tgfc-neoretro-dark table.tfm,
        body.tgfc-neoretro-dark .mainbox table {
            background: #303030 !important;
            background-color: #303030 !important;
            color: #cccccc !important;
        }
        body.tgfc-neoretro-dark input,
        body.tgfc-neoretro-dark select,
        body.tgfc-neoretro-dark textarea {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #ff6b6b !important;
        }
        body.tgfc-neoretro-dark label {
            color: #cccccc !important;
        }
        
        /* 7. 帖子标题白色 */
        body.tgfc-neoretro-dark .threadlist th a,
        body.tgfc-neoretro-dark .xst {
            color: #ffffff !important;
        }
        
        /* 8. 快速发帖/回复区域 */
        body.tgfc-neoretro-dark #quickpost,
        body.tgfc-neoretro-dark .box,
        body.tgfc-neoretro-dark .postoptions,
        body.tgfc-neoretro-dark .postform,
        body.tgfc-neoretro-dark .smilies,
        body.tgfc-neoretro-dark #smilieslist {
            background: #303030 !important;
            background-color: #303030 !important;
            color: #cccccc !important;
        }
        body.tgfc-neoretro-dark #quickpost h4,
        body.tgfc-neoretro-dark #quickpost h5,
        body.tgfc-neoretro-dark .box h4,
        body.tgfc-neoretro-dark .smilies h4 {
            background: #3d1010 !important;
            color: #ffffff !important;
        }
        body.tgfc-neoretro-dark .headactions a {
            color: #ff9999 !important;
        }
        body.tgfc-neoretro-dark .btns,
        body.tgfc-neoretro-dark .btns a {
            color: #ff9999 !important;
        }
        /* 表情区域分页 */
        body.tgfc-neoretro-dark .smilies .pages,
        body.tgfc-neoretro-dark .smilies .pages a {
            background: #303030 !important;
        }
        body.tgfc-neoretro-dark .smilies table {
            background: transparent !important;
        }
        
        /* 9. Diff 面板（标签编辑弹窗）深色化 - 全面覆盖 */
        body.tgfc-neoretro-dark #tgfc-diff-pop {
            background: rgba(26, 26, 26, 0.98) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid #444 !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
            color: #cccccc !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop input[type="text"],
        body.tgfc-neoretro-dark #tgfc-diff-pop input[type="color"],
        body.tgfc-neoretro-dark #tgfc-diff-pop select,
        body.tgfc-neoretro-dark #tgfc-diff-pop textarea {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop label,
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-ios-header {
            color: #aaaaaa !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop button {
            background: #3d1010 !important;
            color: #ffffff !important;
            border: 1px solid #661010 !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-pre-item {
            background: #3a3a3a !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-pre-item:hover {
            background: #3d1010 !important;
            border-color: #661010 !important;
        }
        /* iOS风格分组卡片 */
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-ios-group {
            background: #3a3a3a !important;
            border: 1px solid #444 !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-ios-row {
            background: #3a3a3a !important;
            border-color: #444 !important;
            color: #cccccc !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-ios-row label {
            color: #888888 !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-ios-section-title {
            color: #888888 !important;
            background: transparent !important;
        }
        /* 默认按钮样式 */
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-default-btn {
            background: #444 !important;
            color: #ffffff !important;
            border: none !important;
        }
        body.tgfc-neoretro-dark #tgfc-diff-pop .tgfc-default-btn:hover {
            background: #555 !important;
        }
        
        /* 1. 外层容器透明 */
        .tgfc-neoretro-dark .wrap, 
        .tgfc-neoretro-dark .mainbox,
        .tgfc-neoretro-dark .viewthread {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* 2. 内容卡片深灰底 */
        .tgfc-neoretro-dark .forumlist,
        .tgfc-neoretro-dark .threadlist,
        .tgfc-neoretro-dark .pm,
        .tgfc-neoretro-dark #postlist > div,
        .tgfc-neoretro-dark table[id^="pid"] {
            background-color: #303030 !important;
            border: 2px solid #ff6b6b !important;
            box-shadow: 4px 4px 0 0 #330000 !important;
            margin-bottom: 8px !important;
            color: #cccccc !important;
        }

        /* 3. H1 标题栏 (红底白字) */
        .tgfc-neoretro-dark div.mainbox h1,
        .tgfc-neoretro-dark div.viewthread h1,
        .tgfc-neoretro-dark h3 { 
            background-color: #801010 !important; /* 保持深红 */
            background-image: none !important;
            color: #fff !important;
        }
        /* H1 内部所有链接、span 都要白色 */
        .tgfc-neoretro-dark div.mainbox h1 a,
        .tgfc-neoretro-dark div.mainbox h1 span,
        .tgfc-neoretro-dark div.viewthread h1 a,
        .tgfc-neoretro-dark h3 a,
        .tgfc-neoretro-dark h1 a {
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark #header,
        .tgfc-neoretro-dark #header .wrap,
        .tgfc-neoretro-dark #header div,
        .tgfc-neoretro-dark #header table,
        .tgfc-neoretro-dark #header td,
        .tgfc-neoretro-dark #header tr,
        .tgfc-neoretro-dark #header th,
        .tgfc-neoretro-dark #header nav,
        .tgfc-neoretro-dark .headermenu,
        .tgfc-neoretro-dark #topmenu,
        .tgfc-neoretro-dark #topmenu ul,
        .tgfc-neoretro-dark #topmenu li,
        .tgfc-neoretro-dark #topmenu td,
        .tgfc-neoretro-dark #menu,
        .tgfc-neoretro-dark #menu ul,
        .tgfc-neoretro-dark #menu li,
        .tgfc-neoretro-dark #menu td,
        .tgfc-neoretro-dark #nav,
        .tgfc-neoretro-dark #nav ul,
        .tgfc-neoretro-dark #nav li,
        .tgfc-neoretro-dark .nav,
        .tgfc-neoretro-dark .nav ul,
        .tgfc-neoretro-dark .topnav,
        .tgfc-neoretro-dark .topnav td,
        .tgfc-neoretro-dark #toplinks,
        .tgfc-neoretro-dark #toplinks td {
            background-color: #303030 !important;
            background-image: none !important;
            background: #303030 !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark #header a,
        .tgfc-neoretro-dark #topmenu a,
        .tgfc-neoretro-dark #menu a,
        .tgfc-neoretro-dark #nav a,
        .tgfc-neoretro-dark .nav a,
        .tgfc-neoretro-dark .topnav a,
        .tgfc-neoretro-dark #toplinks a,
        .tgfc-neoretro-dark .headermenu a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark #header a:hover,
        .tgfc-neoretro-dark #topmenu a:hover,
        .tgfc-neoretro-dark #menu a:hover,
        .tgfc-neoretro-dark #nav a:hover,
        .tgfc-neoretro-dark .nav a:hover,
        .tgfc-neoretro-dark .topnav a:hover,
        .tgfc-neoretro-dark #toplinks a:hover {
            color: #ffffff !important;
        }
        /* Logo 区域 */
        .tgfc-neoretro-dark #logo,
        .tgfc-neoretro-dark .logo {
            background-color: #303030 !important;
        }
        
        /* 顶部导航区域 - 使用属性选择器覆盖内联样式 */
        .tgfc-neoretro-dark div[style*="background-color:#efefef"],
        .tgfc-neoretro-dark div[style*="background-color: #efefef"],
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"],
        .tgfc-neoretro-dark div[style*="background-color: #DDDDDD"],
        .tgfc-neoretro-dark div[style*="background-color:#dddddd"],
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"],
        .tgfc-neoretro-dark div[style*="background-color: #F7F7F7"],
        .tgfc-neoretro-dark div[style*="background-color:#f7f7f7"] {
            background-color: #303030 !important;
            background: #303030 !important;
        }
        .tgfc-neoretro-dark div[style*="background-color:#efefef"] a,
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"] a,
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"] a,
        .tgfc-neoretro-dark div[style*="background-color: #efefef"] a,
        .tgfc-neoretro-dark div[style*="background-color: #DDDDDD"] a,
        .tgfc-neoretro-dark div[style*="background-color: #F7F7F7"] a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark div[style*="background-color:#efefef"] a:hover,
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"] a:hover,
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"] a:hover {
            color: #ffffff !important;
        }
        /* 顶部导航区域文字颜色 */
        .tgfc-neoretro-dark div[style*="background-color:#efefef"],
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"],
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"],
        .tgfc-neoretro-dark div[style*="background-color:#efefef"] *,
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"] *,
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"] * {
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark div[style*="background-color:#efefef"] a,
        .tgfc-neoretro-dark div[style*="background-color:#DDDDDD"] a,
        .tgfc-neoretro-dark div[style*="background-color:#F7F7F7"] a {
            color: #ff9999 !important;
        }
        
        /* Footer 底部区域 */
        .tgfc-neoretro-dark #footer,
        .tgfc-neoretro-dark #footer .wrap,
        .tgfc-neoretro-dark #footlinks,
        .tgfc-neoretro-dark .footer,
        .tgfc-neoretro-dark #ft,
        .tgfc-neoretro-dark #ft .wrap {
            background-color: #303030 !important;
            background-image: none !important;
            background: #303030 !important;
            color: #888888 !important;
            border-top: 1px solid #333 !important;
        }
        .tgfc-neoretro-dark #footer a,
        .tgfc-neoretro-dark #footlinks a,
        .tgfc-neoretro-dark .footer a,
        .tgfc-neoretro-dark #ft a {
            color: #ff9999 !important;
        }
        
        /* ============================================
           全面深色化：弹出面板、下拉菜单、表单、对话框
           ============================================ */
        
        /* 1. 所有弹出层/浮动层 */
        .tgfc-neoretro-dark .popup,
        .tgfc-neoretro-dark .popupmenu,
        .tgfc-neoretro-dark .popupmenu_popup,
        .tgfc-neoretro-dark .dropmenu,
        .tgfc-neoretro-dark .dropdown,
        .tgfc-neoretro-dark .dropdown-menu,
        .tgfc-neoretro-dark .menu_popup,
        .tgfc-neoretro-dark .jsmenu,
        .tgfc-neoretro-dark .jsmenu_popup,
        .tgfc-neoretro-dark [id$="_menu"],
        .tgfc-neoretro-dark [id$="_popup"],
        .tgfc-neoretro-dark .layer,
        .tgfc-neoretro-dark .floatbox,
        .tgfc-neoretro-dark .tips,
        .tgfc-neoretro-dark .tooltip {
            background-color: #252525 !important;
            background: #252525 !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
        }
        .tgfc-neoretro-dark .popup a,
        .tgfc-neoretro-dark .popupmenu a,
        .tgfc-neoretro-dark .dropmenu a,
        .tgfc-neoretro-dark .dropdown a,
        .tgfc-neoretro-dark .jsmenu a,
        .tgfc-neoretro-dark [id$="_menu"] a,
        .tgfc-neoretro-dark [id$="_popup"] a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .popup a:hover,
        .tgfc-neoretro-dark .popupmenu a:hover,
        .tgfc-neoretro-dark .dropmenu a:hover,
        .tgfc-neoretro-dark .dropdown a:hover,
        .tgfc-neoretro-dark .jsmenu a:hover {
            color: #ffffff !important;
            background-color: #333 !important;
        }
        
        /* 2. 所有表单元素 */
        .tgfc-neoretro-dark input,
        .tgfc-neoretro-dark input[type="text"],
        .tgfc-neoretro-dark input[type="password"],
        .tgfc-neoretro-dark input[type="search"],
        .tgfc-neoretro-dark input[type="email"],
        .tgfc-neoretro-dark input[type="number"],
        .tgfc-neoretro-dark textarea,
        .tgfc-neoretro-dark select {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        .tgfc-neoretro-dark input::placeholder,
        .tgfc-neoretro-dark textarea::placeholder {
            color: #888888 !important;
        }
        .tgfc-neoretro-dark input:focus,
        .tgfc-neoretro-dark textarea:focus,
        .tgfc-neoretro-dark select:focus {
            border-color: #ff6b6b !important;
            outline: none !important;
        }
        .tgfc-neoretro-dark select option {
            background-color: #3a3a3a !important;
            color: #ffffff !important;
        }
        
        /* 3. 按钮 */
        .tgfc-neoretro-dark button,
        .tgfc-neoretro-dark input[type="button"],
        .tgfc-neoretro-dark input[type="submit"],
        .tgfc-neoretro-dark .button,
        .tgfc-neoretro-dark .btn {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        .tgfc-neoretro-dark button:hover,
        .tgfc-neoretro-dark input[type="button"]:hover,
        .tgfc-neoretro-dark input[type="submit"]:hover,
        .tgfc-neoretro-dark .button:hover,
        .tgfc-neoretro-dark .btn:hover {
            background-color: #4a4a4a !important;
            border-color: #666 !important;
        }
        
        /* 4. 对话框/模态框 */
        .tgfc-neoretro-dark .dialog,
        .tgfc-neoretro-dark .modal,
        .tgfc-neoretro-dark .lightbox,
        .tgfc-neoretro-dark .overlay_content,
        .tgfc-neoretro-dark .fwin,
        .tgfc-neoretro-dark .fwin_content,
        .tgfc-neoretro-dark #fwin_content,
        .tgfc-neoretro-dark .alert_info,
        .tgfc-neoretro-dark .showmenu {
            background-color: #252525 !important;
            background: #252525 !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        .tgfc-neoretro-dark .dialog h1,
        .tgfc-neoretro-dark .dialog h2,
        .tgfc-neoretro-dark .dialog h3,
        .tgfc-neoretro-dark .modal h1,
        .tgfc-neoretro-dark .modal h2,
        .tgfc-neoretro-dark .modal h3,
        .tgfc-neoretro-dark .fwin h1,
        .tgfc-neoretro-dark .fwin h2,
        .tgfc-neoretro-dark .fwin h3 {
            background-color: #333 !important;
            color: #ffffff !important;
        }
        
        /* 5. 表格 */
        .tgfc-neoretro-dark table,
        .tgfc-neoretro-dark th,
        .tgfc-neoretro-dark td {
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark th {
            background-color: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark tr:nth-child(even) td {
            background-color: #1f1f1f !important;
        }
        .tgfc-neoretro-dark tr:hover td {
            background-color: #3a3a3a !important;
        }
        
        /* 6. 引用块 - 增强可读性 (强力覆盖) */
        .tgfc-neoretro-dark .quote,
        .tgfc-neoretro-dark blockquote,
        .tgfc-neoretro-dark .quotetitle,
        .tgfc-neoretro-dark .quotecontent,
        .tgfc-neoretro-dark .blockcode,
        .tgfc-neoretro-dark .blockquote,
        .tgfc-neoretro-dark .quote blockquote,
        .tgfc-neoretro-dark div.quote,
        .tgfc-neoretro-dark div.quote blockquote {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            background-image: none !important;
            border: 1px solid #444 !important;
            border-color: #444 !important;
            color: #cccccc !important;
        }
        /* 消除 blockquote 的所有边框和背景 */
        .tgfc-neoretro-dark .quote > blockquote,
        body.tgfc-neoretro-dark .quote > blockquote,
        body.tgfc-neoretro-dark div.quote > blockquote {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            border: none !important;
            border-top: none !important;
            border-bottom: none !important;
            margin: 0 !important;
            padding: 10px !important;
        }
        
        .tgfc-neoretro-dark .quote *,
        .tgfc-neoretro-dark blockquote *,
        .tgfc-neoretro-dark .quotetitle *,
        .tgfc-neoretro-dark .quotecontent *,
        .tgfc-neoretro-dark .blockcode *,
        .tgfc-neoretro-dark .blockquote * {
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .quote a,
        .tgfc-neoretro-dark blockquote a,
        .tgfc-neoretro-dark .quotetitle a,
        .tgfc-neoretro-dark .quotecontent a,
        .tgfc-neoretro-dark .blockcode a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .quote i,
        .tgfc-neoretro-dark .quote b,
        .tgfc-neoretro-dark .quote font,
        .tgfc-neoretro-dark blockquote i,
        .tgfc-neoretro-dark blockquote b,
        .tgfc-neoretro-dark blockquote font {
            color: #cccccc !important;
        }
        /* 引用标题 */
        .tgfc-neoretro-dark .quote h5,
        .tgfc-neoretro-dark .quote h6,
        .tgfc-neoretro-dark .quotetitle,
        .tgfc-neoretro-dark div.quote h5,
        .tgfc-neoretro-dark div.quote h6,
        body.tgfc-neoretro-dark .quote h5,
        body.tgfc-neoretro-dark .quote h6 {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            background-image: none !important;
            color: #ffffff !important;
            border-bottom: 1px solid #444 !important;
            border: none !important;
            margin: 0 !important;
            padding: 5px 10px !important;
        }
        
        /* 引用块内所有背景覆盖 */
        .tgfc-neoretro-dark .quote div,
        .tgfc-neoretro-dark .quote table,
        .tgfc-neoretro-dark .quote td,
        .tgfc-neoretro-dark .quote tr,
        .tgfc-neoretro-dark blockquote div,
        .tgfc-neoretro-dark blockquote table,
        .tgfc-neoretro-dark blockquote td,
        .tgfc-neoretro-dark blockquote tr {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
            color: #cccccc !important;
        }
        /* 引用块内带内联样式的元素 */
        .tgfc-neoretro-dark .quote div[style],
        .tgfc-neoretro-dark .quote table[style],
        .tgfc-neoretro-dark blockquote div[style],
        .tgfc-neoretro-dark blockquote table[style] {
            background-color: #3a3a3a !important;
            background: #3a3a3a !important;
        }
        
        
        /* 7. 代码块 */
        .tgfc-neoretro-dark .code,
        .tgfc-neoretro-dark .codeblock,
        .tgfc-neoretro-dark pre,
        .tgfc-neoretro-dark code {
            background-color: #282828 !important;
            border-color: #444 !important;
            color: #d4d4d4 !important;
        }
        
        /* 8. 分页 */
        .tgfc-neoretro-dark .pages,
        .tgfc-neoretro-dark .pagination,
        .tgfc-neoretro-dark .pager {
            background-color: transparent !important;
        }
        .tgfc-neoretro-dark .pages a,
        .tgfc-neoretro-dark .pagination a,
        .tgfc-neoretro-dark .pager a {
            background-color: #3a3a3a !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        .tgfc-neoretro-dark .pages a:hover,
        .tgfc-neoretro-dark .pagination a:hover,
        .tgfc-neoretro-dark .pager a:hover {
            background-color: #3a3a3a !important;
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .pages strong,
        .tgfc-neoretro-dark .pages .current,
        .tgfc-neoretro-dark .pagination .current {
            background-color: #801010 !important;
            color: #ffffff !important;
        }
        
        /* 9. 标签页/选项卡 */
        .tgfc-neoretro-dark .tabs,
        .tgfc-neoretro-dark .tab,
        .tgfc-neoretro-dark .tab-content,
        .tgfc-neoretro-dark .tabmenu {
            background-color: #303030 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tabs a,
        .tgfc-neoretro-dark .tab a,
        .tgfc-neoretro-dark .tabmenu a {
            background-color: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tabs a:hover,
        .tgfc-neoretro-dark .tabs a.active,
        .tgfc-neoretro-dark .tab a:hover,
        .tgfc-neoretro-dark .tab a.active {
            background-color: #3a3a3a !important;
            color: #ffffff !important;
        }
        
        /* 10. 用户信息弹窗 */
        .tgfc-neoretro-dark .userinfo,
        .tgfc-neoretro-dark .profile_popup,
        .tgfc-neoretro-dark #userinfo,
        .tgfc-neoretro-dark .card,
        .tgfc-neoretro-dark .user_card {
            background-color: #252525 !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        
        /* 11. 搜索框 */
        .tgfc-neoretro-dark .search,
        .tgfc-neoretro-dark #search,
        .tgfc-neoretro-dark .searchbox {
            background-color: #3a3a3a !important;
            border-color: #444 !important;
        }
        
        /* 12. 通知/提示 */
        .tgfc-neoretro-dark .notice,
        .tgfc-neoretro-dark .warning,
        .tgfc-neoretro-dark .info,
        .tgfc-neoretro-dark .error,
        .tgfc-neoretro-dark .message,
        .tgfc-neoretro-dark .alert {
            background-color: #252525 !important;
            color: #cccccc !important;
            border-color: #444 !important;
        }
        
        /* 13. 帖子操作栏 */
        .tgfc-neoretro-dark .postactions,
        .tgfc-neoretro-dark .postfoot,
        .tgfc-neoretro-dark .actions {
            background-color: #303030 !important;
            border-color: #333 !important;
        }
        .tgfc-neoretro-dark .postactions a,
        .tgfc-neoretro-dark .postfoot a,
        .tgfc-neoretro-dark .actions a {
            color: #888888 !important;
        }
        .tgfc-neoretro-dark .postactions a:hover,
        .tgfc-neoretro-dark .postfoot a:hover,
        .tgfc-neoretro-dark .actions a:hover {
            color: #ff9999 !important;
        }
        
        /* 14. 所有带浅色背景的div（通用覆盖） */
        .tgfc-neoretro-dark div[style*="background:#f"],
        .tgfc-neoretro-dark div[style*="background: #f"],
        .tgfc-neoretro-dark div[style*="background:#e"],
        .tgfc-neoretro-dark div[style*="background: #e"],
        .tgfc-neoretro-dark div[style*="background:#d"],
        .tgfc-neoretro-dark div[style*="background: #d"],
        .tgfc-neoretro-dark div[style*="background:#c"],
        .tgfc-neoretro-dark div[style*="background: #c"],
        .tgfc-neoretro-dark div[style*="background:white"],
        .tgfc-neoretro-dark div[style*="background: white"],
        .tgfc-neoretro-dark div[style*="background:#fff"],
        .tgfc-neoretro-dark div[style*="background: #fff"] {
            background-color: #303030 !important;
            background: #303030 !important;
        }
        
        /* 15. 论坛特有的菜单面板 */
        .tgfc-neoretro-dark #my_menu,
        .tgfc-neoretro-dark #memcp_menu,
        .tgfc-neoretro-dark #nav_menu,
        .tgfc-neoretro-dark .sidemenu,
        .tgfc-neoretro-dark .sidebar {
            background-color: #252525 !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        .tgfc-neoretro-dark #my_menu a,
        .tgfc-neoretro-dark #memcp_menu a,
        .tgfc-neoretro-dark .sidemenu a,
        .tgfc-neoretro-dark .sidebar a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark #my_menu a:hover,
        .tgfc-neoretro-dark #memcp_menu a:hover {
            background-color: #333 !important;
            color: #ffffff !important;
        }
        
        /* ============================================
           TGFC助手 自定义面板深色化
           ============================================ */
        
        /* 16. 快速通道下拉菜单 */
        .tgfc-neoretro-dark #tgfc-dropdown-menu {
            background: rgba(40, 40, 40, 0.95) !important;
            border: 1px solid #444 !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        }
        .tgfc-neoretro-dark #tgfc-dropdown-menu a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark #tgfc-dropdown-menu a:hover {
            background: #3a3a3a !important;
            color: #fff !important;
        }
        .tgfc-neoretro-dark #tgfc-dropdown-menu span {
            color: #888 !important;
        }
        .tgfc-neoretro-dark #tgfc-dropdown-menu svg {
            color: #888 !important;
        }
        .tgfc-neoretro-dark #tgfc-dropdown-menu svg:hover {
            color: #ff9999 !important;
        }
        
        /* 17. 快速通道编辑弹窗 */
        .tgfc-neoretro-dark #tgfc-edit-overlay {
            background: rgba(0, 0, 0, 0.6) !important;
        }
        .tgfc-neoretro-dark #tgfc-edit-modal {
            background: rgba(40, 40, 40, 0.95) !important;
            color: #cccccc !important;
            border: 1px solid #444 !important;
        }
        .tgfc-neoretro-dark #tgfc-edit-modal #tgfc-edit-title {
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark #tgfc-edit-modal input {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        .tgfc-neoretro-dark #tgfc-edit-modal button {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border: 1px solid #555 !important;
        }
        .tgfc-neoretro-dark #tgfc-edit-modal button:hover {
            background: #4a4a4a !important;
        }
        
        /* 18. 摘录库 - 添加弹窗 */
        .tgfc-neoretro-dark #tgfc-lib-overlay {
            background: rgba(0, 0, 0, 0.6) !important;
        }
        .tgfc-neoretro-dark #tgfc-lib-modal {
            background: #252525 !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-modal-header {
            background: linear-gradient(180deg, #333 0%, #3a3a3a 100%) !important;
            color: #ffffff !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-modal-body {
            background: #252525 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-label {
            color: #aaaaaa !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-select,
        .tgfc-neoretro-dark .tgfc-lib-input,
        .tgfc-neoretro-dark .tgfc-lib-textarea {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border-color: #555 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-preview {
            background: #282828 !important;
            color: #aaaaaa !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-modal-footer {
            background: #3a3a3a !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-btn-cancel {
            background: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-btn-save {
            background: #801010 !important;
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-add-cat {
            background: #2d7a3a !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-add-cat:hover {
            background: #236d30 !important;
        }
        
        /* 19. 摘录库 - 总览面板 */
        .tgfc-neoretro-dark #tgfc-lib-panel {
            background: #303030 !important;
            border: 1px solid #333 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-panel-header {
            background: linear-gradient(180deg, #3a3a3a 0%, #252525 100%) !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-panel-title {
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-panel-close {
            background: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-panel-close:hover {
            background: #4a4a4a !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-toolbar {
            background: #252525 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-filter-select {
            background: #3a3a3a !important;
            color: #ffffff !important;
            border-color: #555 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-count {
            color: #888888 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-tool-btn {
            background: #3a3a3a !important;
            color: #ff9999 !important;
            border-color: #555 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-tool-btn:hover {
            background: #3a3a3a !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-panel-body {
            background: #303030 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-empty {
            color: #666666 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item {
            background: #252525 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-content {
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-meta {
            color: #888888 !important;
            border-color: #333 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-source {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-btn {
            background: #3a3a3a !important;
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-btn:hover {
            background: #4a4a4a !important;
        }
        .tgfc-neoretro-dark .tgfc-lib-item-btn.delete {
            color: #ff6b6b !important;
        }
        
        /* 20. 发帖统计面板 */
        .tgfc-neoretro-dark #tgfc-stats-overlay {
            background: rgba(0, 0, 0, 0.7) !important;
        }
        .tgfc-neoretro-dark #tgfc-stats-panel {
            background: #252525 !important;
            border: 1px solid #333 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-header {
            background: linear-gradient(180deg, #333 0%, #3a3a3a 100%) !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-title {
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-close {
            background: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-close:hover {
            background: #4a4a4a !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-body {
            background: #282828 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-tabs {
            border-color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-tab {
            background: #3a3a3a !important;
            color: #ff9999 !important;
            border-color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-tab.active {
            background: #801010 !important;
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-tab:hover:not(.active) {
            background: #3a3a3a !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-section {
            background: #252525 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-section-title {
            background: linear-gradient(90deg, #333, #252525) !important;
            color: #aaaaaa !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-table th {
            background: #3a3a3a !important;
            color: #aaaaaa !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-table td {
            color: #cccccc !important;
            border-color: #333 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-table tr:hover td {
            background: #3a3a3a !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-num {
            color: #66b3ff !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-progress {
            background: #252525 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-progress-bar {
            background: #333 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-progress-text {
            color: #888888 !important;
        }
        .tgfc-neoretro-dark .tgfc-stats-footer {
            background: #252525 !important;
            border-color: #444 !important;
            color: #666666 !important;
        }
        
        /* 21. Markdown 渲染样式 */
        .tgfc-neoretro-dark .md-content {
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .md-content h1,
        .tgfc-neoretro-dark .md-content h2,
        .tgfc-neoretro-dark .md-content h3,
        .tgfc-neoretro-dark .md-content h4,
        .tgfc-neoretro-dark .md-content h5,
        .tgfc-neoretro-dark .md-content h6 {
            color: #ffffff !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .md-content code {
            background: #282828 !important;
            color: #d4d4d4 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content pre {
            background: #282828 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content blockquote {
            background: #222 !important;
            border-left-color: #666 !important;
            color: #aaaaaa !important;
        }
        .tgfc-neoretro-dark .md-content table {
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content th {
            background: #3a3a3a !important;
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .md-content td {
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content hr {
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .md-content ul,
        .tgfc-neoretro-dark .md-content ol {
            color: #cccccc !important;
        }
        
        /* 22. 楼主标签 Dark Mode */
        .tgfc-neoretro-dark .tgfc-op-tag {
            background: #ff6600 !important;
            color: #ffffff !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
            font-weight: bold !important;
        }
        
        /* 23. 紧凑模式用户区域 Dark Mode */
        .tgfc-neoretro-dark.tgfc-compact .postauthor {
            background: #303030 !important;
        }
        .tgfc-neoretro-dark .tgfc-c-uid a {
            color: #ff9999 !important;
        }
        .tgfc-neoretro-dark .tgfc-c-tag {
            color: #cccccc !important;
        }
        .tgfc-neoretro-dark .tgfc-c-sep {
            color: #555 !important;
        }
        .tgfc-neoretro-dark .tgfc-compact-top-btn {
            background: #3a3a3a !important;
            color: #888 !important;
            border-color: #444 !important;
        }
        .tgfc-neoretro-dark .tgfc-compact-top-btn:hover {
            color: #ff9999 !important;
            border-color: #ff9999 !important;
        }
        
        
        /* !! 版块主题分隔行 - 暴力覆盖 !! */
        .tgfc-neoretro-dark tr.category,
        .tgfc-neoretro-dark tr.category td,
        .tgfc-neoretro-dark tr.category th,
        .tgfc-neoretro-dark tbody.category,
        .tgfc-neoretro-dark tbody.category tr,
        .tgfc-neoretro-dark tbody.category td {
            background: #3d1010 !important;
            background-color: #3d1010 !important;
            background-image: none !important;
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark tr.category a,
        .tgfc-neoretro-dark tbody.category a {
            color: #ffffff !important;
        }

        /* 4. 表头行 + 版块主题分隔行 (深红背景 + 居中 + 白字) */
        .tgfc-neoretro-dark .threadlist thead tr,
        .tgfc-neoretro-dark .threadlist thead th,
        .tgfc-neoretro-dark .threadlist thead td,
        .tgfc-neoretro-dark .threadlist .category,
        .tgfc-neoretro-dark .threadlist .category td,
        .tgfc-neoretro-dark .threadlist .category th,
        .tgfc-neoretro-dark table .category,
        .tgfc-neoretro-dark table .category td,
        .tgfc-neoretro-dark .forumlist thead tr,
        .tgfc-neoretro-dark .forumlist thead th,
        .tgfc-neoretro-dark .forumlist thead td {
            background: #3d1010 !important; /* 深红灰 */
            background-image: none !important;
            color: #ffffff !important; /* 改为纯白，提高对比度 */
            border-bottom: 2px solid #ff6b6b !important;
            text-align: center !important;
        }
        .tgfc-neoretro-dark .threadlist thead a,
        .tgfc-neoretro-dark .threadlist .category a,
        .tgfc-neoretro-dark .forumlist thead a {
             color: #ffffff !important;
        }

        /* 4. 表头行 (深红背景 + 居中 + 白字) */
        .tgfc-neoretro-dark .threadlist thead tr,
        .tgfc-neoretro-dark .threadlist thead th,
        .tgfc-neoretro-dark .threadlist thead td,
        .tgfc-neoretro-dark .threadlist .category,
        .tgfc-neoretro-dark .threadlist .category td,
        .tgfc-neoretro-dark .forumlist thead tr,
        .tgfc-neoretro-dark .forumlist thead th,
        .tgfc-neoretro-dark .forumlist thead td {
            background: #3d1010 !important; /* 深红灰 */
            background-image: none !important;
            color: #ffffff !important; /* 改为纯白，提高对比度 */
            border-bottom: 2px solid #ff6b6b !important;
            text-align: center !important;
        }
        .tgfc-neoretro-dark .threadlist thead a,
        .tgfc-neoretro-dark .forumlist thead a {
             color: #ffffff !important;
        }

        /* 5. 帖子标题亮白 */
        .tgfc-neoretro-dark .threadlist th a,
        .tgfc-neoretro-dark .threadlist th .xst {
            color: #ffffff !important;
        }
        .tgfc-neoretro-dark .threadlist th a:visited {
            color: #888888 !important;
        }
        
        /* 5.5 列表行背景深色化 */
        .tgfc-neoretro-dark .threadlist tr,
        .tgfc-neoretro-dark .threadlist td,
        .tgfc-neoretro-dark .threadlist th,
        .tgfc-neoretro-dark .forumlist tr,
        .tgfc-neoretro-dark .forumlist td,
        .tgfc-neoretro-dark .forumlist th {
            background-color: #303030 !important;
            color: #cccccc !important;
        }
        /* 奇偶行区分 */
        .tgfc-neoretro-dark .threadlist tr:nth-child(odd),
        .tgfc-neoretro-dark .forumlist tr:nth-child(odd) {
            background-color: #222222 !important;
        }
        
        /* 5.6 导航栏链接可见 */
        .tgfc-neoretro-dark #nav a,
        .tgfc-neoretro-dark #header a,
        .tgfc-neoretro-dark .wrap > a {
            color: #ffffff !important;
        }

        /* 6. 按钮 */
        .tgfc-neoretro-dark button, 
        .tgfc-neoretro-dark .tgfc-btn, 
        .tgfc-neoretro-dark .pn {
            background: #3a3a3a !important;
            color: #ffffff !important; /* 改为纯白 */
            border: 2px solid #ff6b6b !important;
            box-shadow: 2px 2px 0 0 #330000 !important;
        }
            box-shadow: 2px 2px 0 0 #330000 !important;
        }
        .tgfc-neoretro-dark button:hover, 
        .tgfc-neoretro-dark .tgfc-btn:hover, 
        .tgfc-neoretro-dark .pn:hover {
            background: #ff6b6b !important;
            color: #000 !important;
        }
        
        /* 7. 链接颜色 */
        .tgfc-neoretro-dark a { color: #ff9999 !important; }
        .tgfc-neoretro-dark .t_f a { color: #ffd700 !important; }
        
        /* 8. 分页器 */
        .tgfc-neoretro-dark .pg a {
            background: #303030 !important;
            border: 1px solid #444 !important;
            color: #888 !important;
        }
        .tgfc-neoretro-dark .pg strong {
            background: #ff6b6b !important;
            color: #000 !important;
        }

        /* 隐藏掉不需要的线条和背景 */
        .tgfc-neoretro-mode .t_f, 
        .tgfc-neoretro-mode .postmessage {
             font-size: 16px !important;
             line-height: 1.7 !important;
        }
        .tgfc-neoretro-mode .t_f a {
            color: #d63e3e !important; /* Christmas Red Link */
            text-decoration: underline !important;
            font-weight: bold !important;
        }
        
        .tgfc-neoretro-mode td.postauthor {
            background: #f9f9f9 !important;
            border-right: 2px solid var(--nr-ink) !important;
        }

    
        
    
    body { transition: background 0.2s; }
    .mainbox.viewthread td.postauthor { width: 240px !important; overflow: visible !important; }

    /* 全局屏蔽广告 */
    ins.adsbygoogle,
    div:has(> ins.adsbygoogle),
    div[style*="width:960px"][style*="margin-bottom"],
    div[style*="width:730px"][style*="margin-bottom"],
    a[href*="googleads.g.doubleclick.net"],
    a[href*="googlesyndication.com"],
    a[style*="z-index: 89000"],
    img[src*="2mdn.net"],
    iframe[src*="2mdn.net"],
    img[src*="bing.com/th"][class*="displayad"],
    #ad-container,
    div:has(> lima-video),
    img[src*="imasdk.googleapis.com"],
    div[id^="ad_thread"],
    .ad_headerbanner,
    #ad_position_box,
    .GoogleActiveViewElement { display: none !important; }

    /* 按钮基础样式 */
    .tgfc-btn-inline { display: inline-block; margin-left: 6px; vertical-align: baseline; line-height: 1; font-size: 0; }
    .tgfc-btn {
        display: inline-block; font-size: 10px; font-weight: bold; padding: 0 4px;
        cursor: pointer; line-height: 12px; margin-right: 3px; border-radius: 3px;
        transition: all 0.1s; border: 1px solid transparent; user-select:none;
        background: rgba(255,255,255,0.9); vertical-align: 2px;
    }
    .tgfc-btn-ban { color: #ff4d4f; border-color: #ff4d4f; }
    .tgfc-btn-ban:hover { background: #ff4d4f; color: #fff; }
    .tgfc-btn-diff { color: #1890ff; border-color: #1890ff; }
    .tgfc-btn-diff:hover { background: #1890ff; color: #fff; }

    /* 标签块样式 */
    .tgfc-tag-block-normal { display: block; margin-top: 4px; margin-bottom: 2px; text-align: left; line-height: 1.4; clear: both; }
    .tgfc-tag {
        display: inline-block; padding: 1px 4px; background: #722ed1; color: #fff;
        font-size: 11px; border-radius: 3px; font-weight: normal; white-space: normal;
        word-break: break-all; max-width: 220px;
    }

    /* 屏蔽提示条 */
    .tgfc-block-box { border:1px dashed #ccc; padding:2px 5px; margin:2px 0; background:#f5f5f5; color:#999; font-size:12px; text-align:center; height: auto; line-height: 1.5; }
    .tgfc-block-box span { cursor:pointer; color:#3897ff; margin-left:10px; }
    .tgfc-list-tip-inner { background:#f9f9f9; color:#999; text-align:center; padding:6px; font-size:12px; }
    .tgfc-list-tip-inner span { cursor:pointer; color:#3897ff; margin-left:10px; }

    /* 紧凑模式专用 */
    .tgfc-compact-body { font-size: 12px; color: #666; line-height: 1.2; text-align: left; margin-top: 0; }
    .tgfc-compact-row { margin: 0; padding: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tgfc-c-id-row { white-space: normal !important; overflow: visible !important; margin-bottom: 1px; }
    .tgfc-c-id a { font-size: 14px; font-weight: bold; color: #333; text-decoration: none; }
    .tgfc-c-tag-row { white-space: normal !important; height: auto; margin-bottom: 2px; }
    .tgfc-c-rank { color: #ff4d4f; font-weight: normal; font-style: italic; margin-bottom: 2px; }
    .tgfc-c-data { font-size: 11px; color: #999; margin-bottom: 2px; }
    .tgfc-c-sep { margin: 0 4px; color: #ddd; }
    .tgfc-c-medal { margin-top: 2px; white-space: normal !important; }
    .tgfc-c-medal img { height: 30px; width: auto; margin-right: 2px; vertical-align: middle; }
    /* 楼主标签样式 */
    .tgfc-op-tag { display: inline-block; padding: 1px 6px; background: #ff9500; color: #fff; font-size: 11px; border-radius: 3px; font-weight: bold; margin-right: 4px; white-space: nowrap; }
    .tgfc-compact-top-btn { position: absolute !important; right: 0 !important; bottom: 2px !important; font-size: 10px !important; color: #ccc !important; text-decoration: none !important; cursor: pointer; border: 1px solid #eee; padding: 0 4px; border-radius: 3px; background: #fff; line-height: normal !important; }
    .tgfc-compact-top-btn:hover { color: #3897ff !important; border-color: #3897ff !important; }

    body.tgfc-compact .postauthor > * { display: none !important; }
    body.tgfc-compact .postauthor > .tgfc-compact-body { display: block !important; }
    body.tgfc-compact .postauthor { padding: 5px !important; vertical-align: top !important; background: #f7f7f7; }
    body.tgfc-compact .postcontent { padding: 5px 8px 18px 8px !important; position: relative; }
    body.tgfc-compact form > table, body.tgfc-compact .viewthread > table { margin: 0 !important; border-collapse: collapse !important; border-spacing: 0 !important; }
    body.tgfc-compact .ad_text, body.tgfc-compact .u_profile { display: none !important; }
    body.tgfc-compact .postmessage, body.tgfc-compact .t_msgfont, body.tgfc-compact .defaultpost { min-height: 0 !important; height: auto !important; padding-bottom: 0 !important; }
    body.tgfc-compact .postcontent > div[style*="height"], body.tgfc-compact .postcontent > div[style*="min-height"] { height: auto !important; min-height: 0 !important; }
    body.tgfc-compact .sign, body.tgfc-compact ins.adsbygoogle, body.tgfc-compact .a_pr, body.tgfc-compact .p_control { display: none !important; }

    /* 设置面板与 Diff 菜单 */
    #tgfc-diff-pop { display:none; position:absolute; z-index:2147483647; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 220px; border-radius: 12px; font-size: 12px; color: #333; text-align: left; padding-bottom: 5px; overflow: hidden; }
    .tgfc-ios-group { background: #fff; margin: 10px; border-radius: 10px; overflow: hidden; border: 1px solid #e5e5e5; }
    .tgfc-ios-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-bottom: 1px solid #f0f0f0; }
    .tgfc-ios-row:last-child { border-bottom: none; }
    .tgfc-ios-row label { color: #666; font-weight: 500; font-size: 11px; }
    .tgfc-ios-row input[type=text] { width: 110px; text-align: right; border: none; outline: none; background: transparent; color: #333; font-size: 11px; }
    .tgfc-ios-row input[type=color] { border: none; padding: 0; width: 40px; height: 30px; background: none; cursor: pointer; }
    .tgfc-ios-header { padding: 4px 10px 0; font-size: 10px; color: #888; text-transform: uppercase; }
    #tgfc-pre-list { padding: 4px 10px; }
    .tgfc-pre-item { display: inline-block; padding: 2px 6px; border: 1px solid #e0e0e0; border-radius: 4px; background: #f9f9f9; color: #333; cursor: pointer; font-size: 10px; transition: all 0.2s; }
    .tgfc-pre-item:hover { background: #eef; border-color: #ccf; color: #007aff; }
    .tgfc-ios-actions { padding: 4px 10px 8px; display: flex; flex-direction: column; gap: 5px; }
    .tgfc-ios-btn-row { display: flex; gap: 6px; }
    .tgfc-ios-btn { flex: 1; border: none; padding: 5px 0; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .btn-save { background: #007aff; color: #fff; }
    .btn-reset { background: #f2f2f7; color: #ff3b30; }
    .btn-add { background: #e5e5ea; color: #007aff; }

    #tgfc-ui-toggle { position:fixed; right:12px; bottom:12px; z-index:2147483647; width:26px; height:26px; border-radius:6px; background:#fff; color:#666; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,0.1); transition:all 0.3s ease; border:1px solid #e0e0e0; opacity:0.15; }
    #tgfc-ui-toggle:hover { background:#f5f5f5; color:#333; box-shadow:0 2px 8px rgba(0,0,0,0.15); opacity:1; }
    #tgfc-ui-toggle svg { width:14px; height:14px; }
    #tgfc-ui-panel { position:fixed; right:20px; bottom:70px; z-index:2147483646; width:300px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); padding:15px; font-size:12px; color:#333; display:none; max-height: 80vh; overflow-y: auto; }
    #tgfc-ui-panel h2 { margin:0 0 10px; font-size:14px; text-align:center; font-weight:bold; color:#333; }
    #tgfc-ui-panel .grp { margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px; }
    .grp-row { display:flex; align-items:center; justify-content:space-between; margin:5px 0; }
    .grp-right { display:flex; align-items:center; gap:8px; }
    .tip-chk { font-size:11px; color:#666; display:flex; align-items:center; cursor: pointer; }
    #tgfc-ui-panel input[type=text], #tgfc-ui-panel textarea { width:100%; padding:4px; margin-top:2px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box; font-family: sans-serif; font-size: 12px; }
    .grp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
    .tgfc-export-btn { font-size: 11px !important; background: #666 !important; color: #fff; border-radius: 4px !important; border: none; display: flex; align-items: center; justify-content: center; height: 22px; padding: 0 10px; cursor: pointer; }
    .tgfc-ui-textarea { min-height: 60px; resize: vertical; margin-bottom: 5px; }
    .tgfc-helper-text { font-size: 10px; color: #999; margin-left: 5px; }
    .tgfc-font-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 5px; }
    .tgfc-font-chip { background: #f0f0f0; border: 1px solid #ddd; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 11px; }
    .tgfc-font-chip:hover { background: #e0e0e0; border-color: #ccc; }
    .tgfc-color-row { display: flex; align-items: center; gap: 5px; }
    .tgfc-color-picker { border: none; padding: 0; width: 30px; height: 26px; cursor: pointer; background: none; }
    #tgfc-ui-panel .btn-row { display: flex; justify-content: space-between; margin-top: 15px; gap: 15px; }
    #tgfc-ui-panel button.tgfc-main-action { flex: 1; height: 30px; border-radius: 15px; border: none; cursor: pointer; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; padding: 0; }
    .tgfc-save-btn { background:#3897ff; color:#fff; }
    .tgfc-close-btn { background:#f5f5f5; color:#666; }
    .sw { position:relative; display:inline-block; width:36px; height:20px; cursor: pointer; vertical-align: middle; }
    .sw input { opacity:0; width:0; height:0; }
    .sl { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:#ccc; transition:.4s; border-radius:34px; }
    .sl:before { position:absolute; content:""; height:16px; width:16px; left:2px; bottom:2px; background:white; transition:.4s; border-radius:50%; }
    input:checked + .sl { background:#3897ff; }
    input:checked + .sl:before { transform:translateX(16px); }

    /* 图片放大 Lightbox */
    #tgfc-lightbox { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2147483647; justify-content:center; align-items:center; cursor:zoom-out; }
    #tgfc-lightbox.active { display:flex; }
    #tgfc-lightbox img { max-width:90%; max-height:90%; object-fit:contain; cursor:pointer; box-shadow:0 10px 50px rgba(0,0,0,0.5); border-radius:4px; }
    #tgfc-lightbox-hint { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); color:rgba(255,255,255,0.7); font-size:12px; pointer-events:none; }
    .postcontent img:not(.tgfc-no-zoom) { cursor:zoom-in; transition:transform 0.2s; }
    .postcontent img:not(.tgfc-no-zoom):hover { transform:scale(1.02); }

    /* Markdown 样式 */
    .tgfc-md-content { font-size: 15px !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #24292e; background: #ffffff !important; border-radius: 8px; padding: 15px 20px; margin: 12px auto; max-width: 96%; line-height: 1.45; border: 1px solid #e1e4e8; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .tgfc-md-content h1, .tgfc-md-content h2, .tgfc-md-content h3, .tgfc-md-content h4, .tgfc-md-content h5, .tgfc-md-content h6 { font-family: inherit; font-weight: 700; margin-top: 10px; margin-bottom: 6px; line-height: 1.3; padding: 5px 10px; border-radius: 4px; border-left-style: solid; color: #24292e; }
    .tgfc-md-content h1 { background: #2b6cb0; color: #ffffff; border-left-width: 6px; border-left-color: #1a365d; font-size: 1.3em; border-bottom: none; }
    .tgfc-md-content h2 { background: #4299e1; color: #ffffff; border-left-width: 5px; border-left-color: #2b6cb0; font-size: 1.4em; border-bottom: none; }
    .tgfc-md-content h3 { background: #ebf8ff; color: #2b6cb0; border-left-width: 4px; border-left-color: #4299e1; font-size: 1.3em; }
    .tgfc-md-content h4 { background: #f0fff4; color: #2f855a; border-left-width: 4px; border-left-color: #48bb78; font-size: 1.2em; }
    .tgfc-md-content h5 { background: #f7fafc; color: #4a5568; border-left-width: 3px; border-left-color: #cbd5e0; font-size: 1.1em; }
    .tgfc-md-content h6 { background: #fff; border: 1px solid #eee; border-left-width: 3px; border-left-color: #e2e8f0; font-size: 1.0em; color: #718096; }
    .tgfc-md-content p { margin-bottom: 4px; }
    .tgfc-md-content blockquote { border-left: 4px solid #dfe2e5; margin: 0 0 6px 0; padding: 0 1em; color: #6a737d; }
    .tgfc-md-content ul, .tgfc-md-content ol { padding-left: 2em; margin-bottom: 6px; }
    .tgfc-md-content li { margin-bottom: 4px; }
    .tgfc-md-content hr.tgfc-md-hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #e1e4e8; border: 0; }
    .tgfc-md-content img.tgfc-md-img { max-width: 100%; box-sizing: content-box; background-color: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .tgfc-md-code { position: relative; background: #f6f8fa; border-radius: 6px; font-size: 85%; line-height: 1.45; padding: 16px; margin-bottom: 16px; overflow: auto; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
    .tgfc-md-code .tgfc-md-copy { position: absolute; top: 8px; right: 8px; font-size: 12px; background: rgba(255,255,255,0.8); color: #24292e; border: 1px solid rgba(27,31,35,0.15); border-radius: 4px; padding: 3px 8px; cursor: pointer; transition: all 0.2s; opacity: 0; }
    .tgfc-md-code:hover .tgfc-md-copy { opacity: 1; }
    .tgfc-md-code .tgfc-md-copy:hover { background: #fff; }
    .tgfc-inline { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background-color: rgba(27,31,35,0.05); border-radius: 3px; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
    .tgfc-md-content a { color: #0366d6; text-decoration: none; }
    .tgfc-md-content a:hover { text-decoration: underline; }
    .tgfc-md-bold { font-weight: 600; }
    .tgfc-md-italic { font-style: italic; }

    /* 摘录库功能样式 */
    .tgfc-lib-collect-btn { margin-left: 8px; color: #fff !important; cursor: pointer; text-decoration: none !important; background: #2E6DA4; padding: 0 5px; border-radius: 2px; font-weight: normal !important; font-size: 12px; vertical-align: baseline; position: relative; top: -1px; }
    .tgfc-lib-collect-btn:hover { background: #245580; color: #fff !important; }
    .tgfc-md-enhance-btn { margin-left: 8px; color: #fff !important; cursor: pointer; text-decoration: none !important; background: #888; padding: 0 5px; border-radius: 2px; font-weight: normal !important; font-size: 12px; vertical-align: baseline; position: relative; top: -1px; }
    .tgfc-md-enhance-btn:hover { background: #666; color: #fff !important; }
    .tgfc-md-enhance-btn.tgfc-md-btn-on { background: #3897ff; }
    .tgfc-md-enhance-btn.tgfc-md-btn-on:hover { background: #2a7fd9; }
    
    /* 摘录弹窗 - iOS风格 */
    #tgfc-lib-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 2147483647; }
    #tgfc-lib-modal { background: #fff; border-radius: 14px; box-shadow: 0 25px 80px rgba(0,0,0,0.35); padding: 0; width: 650px; max-width: 95vw; font-size: 13px; color: #1c1c1e; overflow: hidden; }
    .tgfc-lib-modal-header { padding: 14px 20px; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 16px; text-align: center; background: linear-gradient(180deg, #fafafa 0%, #fff 100%); }
    .tgfc-lib-modal-body { padding: 16px 20px; }
    .tgfc-lib-field { margin-bottom: 14px; }
    .tgfc-lib-label { display: block; margin-bottom: 6px; font-size: 12px; color: #3c3c43; font-weight: 500; }
    .tgfc-lib-select { width: 100%; padding: 8px 12px; border: 1px solid #c6c6c8; border-radius: 8px; font-size: 13px; background: #fff; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
    .tgfc-lib-input { width: 100%; padding: 8px 12px; border: 1px solid #c6c6c8; border-radius: 8px; font-size: 13px; box-sizing: border-box; }
    .tgfc-lib-textarea { width: 100%; padding: 8px 12px; border: 1px solid #c6c6c8; border-radius: 8px; font-size: 13px; min-height: 60px; resize: vertical; box-sizing: border-box; font-family: inherit; }
    .tgfc-lib-cat-row { display: flex; gap: 10px; align-items: center; }
    .tgfc-lib-cat-row .tgfc-lib-select { flex: 1; }
    .tgfc-lib-add-cat { padding: 8px 14px; background: #34c759; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; justify-content: center; }
    .tgfc-lib-add-cat:hover { background: #2db84d; }
    .tgfc-lib-modal-footer { padding: 14px 20px; border-top: 1px solid #e5e5e5; display: flex; gap: 12px; justify-content: center; background: #f9f9f9; }
    .tgfc-lib-btn { padding: 8px 28px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; min-width: 90px; display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1; }
    .tgfc-lib-btn-cancel { background: #e5e5ea; color: #1c1c1e; }
    .tgfc-lib-btn-save { background: #007aff; color: #fff; }
    .tgfc-lib-btn:hover { opacity: 0.9; }
    .tgfc-lib-preview { background: #f2f2f7; border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; max-height: 120px; overflow-y: auto; font-size: 12px; color: #3c3c43; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
    
    /* 文库面板 - iOS风格 */
    #tgfc-lib-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 750px; max-width: 95vw; max-height: 85vh; background: #f2f2f7; border-radius: 16px; box-shadow: 0 30px 100px rgba(0,0,0,0.4); z-index: 2147483646; display: none; flex-direction: column; overflow: hidden; }
    .tgfc-lib-panel-header { padding: 18px 24px; border-bottom: 1px solid #c6c6c8; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(180deg, #fff 0%, #fafafa 100%); }
    .tgfc-lib-panel-title { font-size: 20px; font-weight: 700; color: #1c1c1e; }
    .tgfc-lib-panel-close { width: 32px; height: 32px; border-radius: 50%; background: #e5e5ea; border: none; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; color: #3c3c43; line-height: 1; }
    .tgfc-lib-panel-close:hover { background: #d1d1d6; }
    .tgfc-lib-toolbar { padding: 10px 24px; background: #fff; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .tgfc-lib-toolbar-left { display: flex; align-items: center; gap: 14px; }
    .tgfc-lib-toolbar-right { display: flex; align-items: center; gap: 10px; }
    .tgfc-lib-filter-select { padding: 6px 12px; border: 1px solid #c6c6c8; border-radius: 6px; font-size: 13px; background: #fff; }
    .tgfc-lib-count { font-size: 13px; color: #8e8e93; font-weight: 500; }
    .tgfc-lib-tool-btn { padding: 5px 12px; background: #fff; border: 1px solid #c6c6c8; border-radius: 6px; font-size: 12px; cursor: pointer; color: #007aff; font-weight: 600; display: flex; align-items: center; justify-content: center; text-align: center; }
    .tgfc-lib-tool-btn:hover { background: #f2f2f7; }
    .tgfc-lib-panel-body { flex: 1; overflow-y: auto; padding: 20px 24px; background: #f2f2f7; }
    .tgfc-lib-empty { text-align: center; padding: 80px 24px; color: #8e8e93; font-size: 16px; }
    
    /* 文库条目 - 卡片风格 */
    .tgfc-lib-item { background: #fff; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); transition: transform 0.15s, box-shadow 0.15s; }
    .tgfc-lib-item:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .tgfc-lib-item-content { font-size: 13px; line-height: 1.6; color: #333; margin-bottom: 12px; white-space: pre-wrap; word-break: break-word; }
    .tgfc-lib-item-meta { font-size: 12px; color: #8e8e93; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; padding-top: 12px; border-top: 1px solid #f0f0f0; }
    .tgfc-lib-item-author { color: #ff6b00; font-weight: 600; }
    .tgfc-lib-item-source { color: #007aff; text-decoration: none; font-weight: 500; }
    .tgfc-lib-item-source:hover { text-decoration: underline; }
    .tgfc-lib-item-cat { background: #1d8348; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .tgfc-lib-item-note { color: #8e44ad; background: #f5eeff; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
    .tgfc-lib-item-time { color: #999; font-size: 11px; }
    .tgfc-lib-item-actions { margin-left: auto; display: flex; gap: 8px; }
    .tgfc-lib-item-btn { padding: 4px 10px; background: #f5f5f5; border: none; border-radius: 6px; font-size: 11px; cursor: pointer; color: #007aff; font-weight: 600; display: flex; align-items: center; justify-content: center; }
    .tgfc-lib-item-btn:hover { background: #e5e5ea; }
    .tgfc-lib-item-btn.delete { color: #ff3b30; }
    .tgfc-lib-item-btn.delete:hover { background: #ffebea; }
    
    /* 分类管理弹窗 */
    .tgfc-lib-cat-list { max-height: 200px; overflow-y: auto; margin-bottom: 12px; }
    .tgfc-lib-cat-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
    .tgfc-lib-cat-item:last-child { border-bottom: none; }
    .tgfc-lib-cat-name { flex: 1; }
    .tgfc-lib-cat-del { color: #ff4d4f; cursor: pointer; font-size: 12px; padding: 2px 6px; }
    .tgfc-lib-cat-del:hover { background: #fff0f0; border-radius: 4px; }
    
    /* 标签统计面板 - 紧凑科学风格 */
    #tgfc-stats-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 2147483647; }
    #tgfc-stats-panel { background: #fff; border-radius: 8px; box-shadow: 0 16px 48px rgba(0,0,0,0.25); width: 580px; max-width: 95vw; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .tgfc-stats-header { padding: 8px 14px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: center; align-items: center; background: linear-gradient(180deg, #f9f9f9 0%, #f0f0f0 100%); position: relative; }
    .tgfc-stats-title { font-size: 13px; font-weight: 600; color: #333; letter-spacing: 0.3px; text-align: center; }
    .tgfc-stats-close { position: absolute; right: 10px; width: 20px; height: 20px; border-radius: 50%; background: #ddd; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; color: #666; line-height: 1; }
    .tgfc-stats-close { width: 20px; height: 20px; border-radius: 50%; background: #ddd; border: none; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center; color: #666; line-height: 1; }
    .tgfc-stats-close:hover { background: #ccc; }
    .tgfc-stats-body { flex: 1; overflow-y: auto; padding: 10px 14px; background: #fafafa; }
    .tgfc-stats-section { margin-bottom: 8px; background: #fff; border: 1px solid #e8e8e8; border-radius: 4px; overflow: hidden; }
    .tgfc-stats-section-title { font-size: 9px; font-weight: 700; color: #666; padding: 4px 8px; background: linear-gradient(90deg, #f5f5f5, #fff); border-bottom: 1px solid #eee; text-transform: uppercase; letter-spacing: 1px; }
    .tgfc-stats-table { width: 100%; border-collapse: collapse; font-size: 10px; }
    .tgfc-stats-table th, .tgfc-stats-table td { padding: 3px 5px; text-align: center; vertical-align: middle; }
    .tgfc-stats-table th { background: #f7f7f7; font-weight: 600; color: #555; border-bottom: 1px solid #e5e5e5; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    .tgfc-stats-table td { border-bottom: 1px solid #f0f0f0; color: #333; font-variant-numeric: tabular-nums; font-size: 10px; }
    .tgfc-stats-table tr:last-child td { border-bottom: none; }
    .tgfc-stats-table tr:hover td { background: #f8f8f8; }
    .tgfc-stats-table tr.tgfc-stats-separator td { border-top: 1px dashed #ccc; }
    .tgfc-stats-tag { display: inline-block; padding: 0 4px; background: #6c5ce7; color: #fff; border-radius: 2px; font-size: 9px; font-weight: 500; white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; vertical-align: middle; line-height: 14px; }
    .tgfc-stats-tag.op { background: #e67e22; margin-right: 4px; }
    .tgfc-stats-tag.none { background: #95a5a6; }
    .tgfc-stats-num { font-weight: 600; color: #2980b9; font-family: 'SF Mono', Menlo, Monaco, monospace; font-size: 10px; }
    .tgfc-stats-tabs { display: flex; margin-bottom: 10px; border: 1px solid #3498db; border-radius: 4px; overflow: hidden; }
    .tgfc-stats-tab { flex: 1; padding: 6px 10px; text-align: center; font-size: 10px; font-weight: 600; cursor: pointer; background: #fff; border: none; color: #3498db; transition: all 0.15s; display: flex; align-items: center; justify-content: center; text-transform: uppercase; letter-spacing: 0.5px; }
    .tgfc-stats-tab:not(:last-child) { border-right: 1px solid #3498db; }
    .tgfc-stats-tab.active { background: #3498db; color: #fff; }
    .tgfc-stats-tab:hover:not(.active) { background: #ebf5fb; }
    .tgfc-stats-progress { padding: 16px; text-align: center; }
    .tgfc-stats-progress-bar { width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden; margin: 8px 0; }
    .tgfc-stats-progress-fill { height: 100%; background: linear-gradient(90deg, #3498db, #2ecc71); transition: width 0.3s; }
    .tgfc-stats-progress-text { font-size: 10px; color: #666; font-family: 'SF Mono', Menlo, Monaco, monospace; }
    .tgfc-stats-streak-badge { display: inline-block; padding: 0 3px; background: #e74c3c; color: #fff; border-radius: 2px; font-size: 8px; font-weight: 600; margin-left: 4px; font-family: 'SF Mono', Menlo, Monaco, monospace; vertical-align: middle; line-height: 14px; }
    .tgfc-stats-floors { font-size: 9px; line-height: 1.4; max-width: 150px; word-break: break-word; }
    .tgfc-stats-floor-link { color: #1890ff; text-decoration: none; margin-right: 2px; }
    .tgfc-stats-floor-link:hover { text-decoration: underline; color: #40a9ff; }
    .tgfc-stats-floor { color: #999; margin-right: 2px; }
    .tgfc-stats-more { color: #999; font-size: 8px; }
    .tgfc-stats-footer { font-size: 8px; color: #999; text-align: right; padding: 4px 8px; border-top: 1px solid #eee; background: #fafafa; }

    /* 21. 今日十大话题面板 */
    .tgfc-top10-panel { margin: 8px 0; border: 1px solid #ddd; border-radius: 6px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden; }
    .tgfc-top10-header { display: flex; align-items: center; justify-content: center; padding: 2px 10px; background: linear-gradient(135deg, #ff6b6b, #ffa502); color: #fff !important; cursor: pointer; user-select: none; position: relative; min-height: 26px; }
    .tgfc-top10-header:hover { background: linear-gradient(135deg, #ff5252, #ff9500); }
    .tgfc-top10-title { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; color: #fff !important; text-shadow: 0 1px 1px rgba(0,0,0,0.2); }
    .tgfc-top10-right { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 4px; }
    .tgfc-top10-tabs { display: flex; align-items: center; gap: 1px; }
    .tgfc-top10-tab { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fff !important; padding: 0 3px; border-radius: 2px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s; line-height: 14px; text-shadow: 0 1px 1px rgba(0,0,0,0.2); }
    .tgfc-top10-tab:hover { background: rgba(255,255,255,0.25); }
    .tgfc-top10-tab.active { background: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.8); font-weight: 600; }
    .tgfc-top10-status { font-size: 10px; opacity: 0.9; color: #fff !important; }
    .tgfc-top10-refresh { background: transparent; border: none; color: #fff !important; width: 26px; height: 26px; line-height: 26px; text-align: center; border-radius: 3px; cursor: pointer; font-size: 16px; transition: all 0.2s; padding: 0; display: flex; align-items: center; justify-content: center; opacity: 0.9; text-shadow: 0 1px 1px rgba(0,0,0,0.2); }
    .tgfc-top10-refresh:hover { background: rgba(255,255,255,0.2); opacity: 1; transform: scale(1.1); }
    .tgfc-top10-refresh:disabled { opacity: 0.5; cursor: not-allowed; }
    .tgfc-top10-body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
    .tgfc-top10-body.expanded { max-height: 500px; }
    .tgfc-top10-list { list-style: none; margin: 0; padding: 0; }
    .tgfc-top10-list li { display: flex; align-items: center; padding: 5px 12px; border-bottom: 1px solid #f0f0f0; transition: background 0.15s; }
    .tgfc-top10-list li:last-child { border-bottom: none; }
    .tgfc-top10-list li:hover { background: #fffbf0; }
    .tgfc-top10-rank { min-width: 20px; height: 20px; line-height: 20px; text-align: center; border-radius: 50%; font-size: 10px; font-weight: 600; margin-right: 8px; }
    .tgfc-top10-rank.gold { background: linear-gradient(135deg, #ffd700, #ffb300); color: #7a5c00; }
    .tgfc-top10-rank.silver { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #444; }
    .tgfc-top10-rank.bronze { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }
    .tgfc-top10-rank.normal { background: #f0f0f0; color: #666; }
    .tgfc-top10-link { flex: 1; color: #333; text-decoration: none; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tgfc-top10-link:visited { color: #888; }
    .tgfc-top10-link:hover { color: #e74c3c; text-decoration: underline; }
    .tgfc-top10-replies { font-size: 11px; color: #e74c3c; font-weight: 600; margin-left: 10px; white-space: nowrap; }
    .tgfc-top10-views { font-size: 11px; color: #7f8c8d; margin-left: 6px; white-space: nowrap; }
    .tgfc-top10-author { font-size: 10px; color: #888; margin-left: 8px; white-space: nowrap; max-width: 80px; overflow: hidden; text-overflow: ellipsis; }
    .tgfc-top10-empty { padding: 16px; text-align: center; color: #999; font-size: 12px; }
    .tgfc-top10-loading { padding: 12px; text-align: center; }
    .tgfc-top10-loading-bar { width: 100%; height: 3px; background: #e0e0e0; border-radius: 2px; overflow: hidden; margin: 6px 0; }
    .tgfc-top10-loading-fill { height: 100%; background: linear-gradient(90deg, #ff6b6b, #ffa502); transition: width 0.3s; }
    .tgfc-top10-loading-text { font-size: 11px; color: #666; }
    /* Neo-Retro 狐狸主题适配（浅色） */
    body.tgfc-neoretro-mode .tgfc-top10-panel { background: #f5f0e8; border-color: #d4cfc5; }
    body.tgfc-neoretro-mode .tgfc-top10-list li { border-bottom-color: #e0dbd3; }
    body.tgfc-neoretro-mode .tgfc-top10-list li:hover { background: #ebe6de; }
    body.tgfc-neoretro-mode .tgfc-top10-link { color: #3d3d3d; }
    body.tgfc-neoretro-mode .tgfc-top10-link:visited { color: #888; }
    body.tgfc-neoretro-mode .tgfc-top10-rank.normal { background: #e0dbd3; color: #555; }
    body.tgfc-neoretro-mode .tgfc-top10-loading-text { color: #666; }
    /* Neo-Retro Dark 暗黑主题适配 */
    body.tgfc-neoretro-dark .tgfc-top10-panel { background: #1e1e1e; border-color: #444; }
    body.tgfc-neoretro-dark .tgfc-top10-tab { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2) !important; color: #fff !important; }
    body.tgfc-neoretro-dark .tgfc-top10-tab.active { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.8) !important; }
    body.tgfc-neoretro-dark .tgfc-top10-list li { border-bottom-color: #3a3a3a; background: #1e1e1e; }
    body.tgfc-neoretro-dark .tgfc-top10-list li:hover { background: #2a2a2a; }
    body.tgfc-neoretro-dark .tgfc-top10-link { color: #fff !important; }
    body.tgfc-neoretro-dark .tgfc-top10-link:visited { color: #999 !important; }
    body.tgfc-neoretro-dark .tgfc-top10-link:hover { color: #ffab91 !important; }
    body.tgfc-neoretro-dark .tgfc-top10-replies { color: #ff8a80 !important; }
    body.tgfc-neoretro-dark .tgfc-top10-views { color: #90a4ae !important; }
    body.tgfc-neoretro-dark .tgfc-top10-author { color: #ccc !important; }
    body.tgfc-neoretro-dark .tgfc-top10-empty { color: #ccc !important; }
    body.tgfc-neoretro-dark .tgfc-top10-loading-text { color: #ddd !important; }
    body.tgfc-neoretro-dark .tgfc-top10-rank.normal { background: #444; color: #fff; }
    body.tgfc-neoretro-dark .tgfc-top10-rank.gold { background: linear-gradient(135deg, #ffd700, #ffb300); color: #3d2e00; }
    body.tgfc-neoretro-dark .tgfc-top10-rank.silver { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #333; }
    body.tgfc-neoretro-dark .tgfc-top10-rank.bronze { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }
  `;

    // 模块 4: 核心逻辑
    function getTxt(n) { return n ? n.innerText.trim() : ""; }

    function parseTd(td) {
        let d = { name: "", linkObj: null, linkHtml: "", rank: "", stats: ["0", "0", "0"], regTime: "", jisao: "0", status: "离线", online: false, medals: "" };
        try {
            let a = td.querySelector('cite a') || td.querySelector('.postinfo a');
            if (a) {
                d.name = cleanStr(a.innerText);
                d.linkObj = a;
                d.linkHtml = a.outerHTML;
            }
            let pEm = td.querySelector('p > em');
            if (pEm) d.rank = getTxt(pEm);
            else {
                let rp = td.querySelector('p.customstatus');
                if (rp) d.rank = getTxt(rp);
                else {
                    td.querySelectorAll('p').forEach(p => {
                        if (!p.querySelector('a') && !p.className && getTxt(p).length < 20 && !p.querySelector('em')) d.rank = getTxt(p);
                    });
                }
            }
            let dl = td.querySelector('dl.profile');
            if (dl) {
                let dds = dl.querySelectorAll('dd');
                if (dds.length >= 3) d.stats = [getTxt(dds[0]), getTxt(dds[1]), getTxt(dds[2])];
                let dts = dl.querySelectorAll('dt');
                for (let i = 0; i < dts.length; i++) {
                    let dtText = dts[i].innerText;
                    if (dtText.includes('注册时间') && dds[i]) d.regTime = getTxt(dds[i]);
                    if (dtText.includes('激骚') && dds[i]) {
                        let jisaoMatch = getTxt(dds[i]).match(/(-?\d+)/);
                        if (jisaoMatch) d.jisao = jisaoMatch[1];
                    }
                }
            }
            let txt = td.innerText;
            let m = txt.match(/激骚[\s\S]*?(-?\d+)\s*度/) || txt.match(/激骚\s*(-?\d+)/) || txt.match(/骚\((-?\d+)\)/);
            if (m) d.jisao = m[1];
            if (td.querySelector('.online') || txt.includes('当前在线')) { d.status = "在线"; d.online = true; }
            else { d.status = "离线"; d.online = false; }

            let imgs = td.querySelectorAll('img');
            let medalHTML = "";
            imgs.forEach(img => {
                if (img.src.includes('trophy') || img.title.includes('勋章') || img.src.includes('medal')) medalHTML += img.outerHTML;
            });
            if (!medalHTML) { let md = td.querySelector('.medals'); if (md) medalHTML = md.innerHTML; }
            d.medals = medalHTML;
        } catch (e) { console.error(e); }
        return d;
    }

    function makeBtns(name, cfg) {
        let box = document.createElement('span');
        box.className = 'tgfc-btn-inline';
        let ban = document.createElement('span');
        ban.className = 'tgfc-btn tgfc-btn-ban';
        ban.innerText = 'Ban';
        ban.onclick = e => {
            e.stopPropagation(); e.preventDefault();
            if (confirm('屏蔽 ' + name + '?')) {
                cfg.blocked.push(name);
                saveConfig(cfg);
                location.reload();
            }
        };
        let diff = document.createElement('span');
        diff.className = 'tgfc-btn tgfc-btn-diff';
        diff.innerText = 'Diff ▼';
        diff.onclick = e => {
            e.stopPropagation(); e.preventDefault();
            let r = diff.getBoundingClientRect();
            openDiff(r.left + window.scrollX, r.bottom + window.scrollY, name);
        };
        box.appendChild(ban);
        box.appendChild(diff);
        return box;
    }

    // 显示模式渲染 (紧凑/正常)
    function doCompact(td, d, cfg, isOP) {
        if (td.querySelector('.tgfc-compact-body')) return;
        // 构建标签行：楼主标签 + 自定义标签（支持多标签）
        let tagContent = "";
        if (isOP) tagContent += `<span class="tgfc-op-tag">楼主</span>`;
        const userTags = cfg.highlighted[d.name]?.tags || [];
        userTags.forEach(tag => { tagContent += `<span class="tgfc-tag">${tag}</span>`; });
        let tagBlock = tagContent ? `<div class="tgfc-compact-row tgfc-c-tag-row">${tagContent}</div>` : "";
        let regInfo = d.regTime ? `<span class="tgfc-c-sep">|</span>${d.regTime}` : "";
        let statusHtml = `<span style="color:${d.online ? '#ff0000' : '#999'};font-weight:${d.online ? 'bold' : 'normal'}">${d.status}</span>`;
        let html = `
        <div class="tgfc-compact-body">
            <div class="tgfc-compact-row tgfc-c-id-row"><span class="tgfc-c-id">${d.linkHtml}</span><span class="c-btn-slot"></span></div>
            ${tagBlock}
            <div class="tgfc-compact-row"><span class="tgfc-c-rank">${d.rank}</span></div>
            <div class="tgfc-compact-row tgfc-c-data">帖子 ${d.stats[0]}<span class="tgfc-c-sep">|</span>精华 ${d.stats[1]}<span class="tgfc-c-sep">|</span>积分 ${d.stats[2]}${regInfo}</div>
            <div class="tgfc-compact-row tgfc-c-data">激骚 ${d.jisao} 度<span class="tgfc-c-sep">|</span>${statusHtml}</div>
            <div class="tgfc-compact-row tgfc-c-medal">${d.medals}</div>
        </div>`;
        td.insertAdjacentHTML('beforeend', html);
        let slot = td.querySelector('.c-btn-slot');
        if (slot) slot.appendChild(makeBtns(d.name, cfg));
        let contentTd = td.parentNode.querySelector('.postcontent');
        if (contentTd && !contentTd.querySelector('.tgfc-compact-top-btn')) {
            let topBtn = document.createElement('a');
            topBtn.className = 'tgfc-compact-top-btn';
            topBtn.innerText = 'TOP';
            topBtn.href = 'javascript:;';
            topBtn.onclick = function () { window.scrollTo(0, 0); };
            contentTd.appendChild(topBtn);
        }
    }

    function doNormal(td, d, cfg, isOP) {
        if (!d.linkObj.parentNode.querySelector('.tgfc-btn-inline')) d.linkObj.after(makeBtns(d.name, cfg));
        // 添加楼主标签和自定义标签（支持多标签）
        const userTags = cfg.highlighted[d.name]?.tags || [];
        if (isOP || userTags.length > 0) {
            if (!td.querySelector('.tgfc-tag-block-normal')) {
                let div = document.createElement('div');
                div.className = 'tgfc-tag-block-normal';
                // 先添加楼主标签
                if (isOP) {
                    let opTag = document.createElement('span');
                    opTag.className = 'tgfc-op-tag';
                    opTag.innerText = '楼主';
                    div.appendChild(opTag);
                }
                // 再添加自定义标签（多标签）
                userTags.forEach(tag => {
                    let t = document.createElement('span');
                    t.className = 'tgfc-tag';
                    t.innerText = tag;
                    div.appendChild(t);
                });
                let infoContainer = d.linkObj.closest('.postinfo') || d.linkObj.closest('cite') || d.linkObj.parentNode;
                if (infoContainer) infoContainer.after(div);
            }
        }
    }

    // 核心扫描逻辑
    // 统一提取帖子ID，支持多种URL格式
    function getThreadId() {
        const url = location.href;
        // 格式1: thread-123-1-1.html
        let match = url.match(/thread-(\d+)/);
        if (match) return match[1];
        // 格式2: read-123.html 或 read-htm-tid-123.html
        match = url.match(/read-(?:htm-tid-)?(\d+)/);
        if (match) return match[1];
        // 格式3: viewthread.php?tid=123
        match = url.match(/[?&]tid=(\d+)/);
        if (match) return match[1];
        return null;
    }

    // 获取当前帖子的楼主（支持跨页面，使用 sessionStorage 持久化）
    function getThreadOP() {
        const threadId = getThreadId();
        if (!threadId) return null;
        return sessionStorage.getItem('tgfc_op_' + threadId);
    }
    function setThreadOP(name) {
        const threadId = getThreadId();
        if (threadId && name) {
            sessionStorage.setItem('tgfc_op_' + threadId, name);
        }
    }

    // 从第1页异步获取楼主信息（使用 GM_xmlhttpRequest 绕过 CORS）
    function fetchThreadOP() {
        return new Promise((resolve) => {
            const threadId = getThreadId();
            if (!threadId) {
                resolve(null);
                return;
            }

            const cached = getThreadOP();
            if (cached) {
                resolve(cached);
                return;
            }

            // 使用当前域名，构建第1页URL（优先使用 thread 格式）
            const currentHost = location.hostname;
            const firstPageUrl = `https://${currentHost}/thread-${threadId}-1-1.html`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: firstPageUrl,
                withCredentials: true,
                anonymous: false,
                overrideMimeType: 'text/html; charset=gbk',
                onload: function (response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const firstTd = doc.querySelector('td.postauthor');
                        if (firstTd) {
                            const a = firstTd.querySelector('cite a') || firstTd.querySelector('.postinfo a');
                            if (a) {
                                const opName = cleanStr(a.innerText);
                                setThreadOP(opName);
                                resolve(opName);
                                return;
                            }
                        }
                    } catch (e) {
                        console.error('[TGFC助手] 解析楼主信息失败:', e);
                    }
                    resolve(null);
                },
                onerror: function (error) {
                    console.error('[TGFC助手] GM_xmlhttpRequest 请求失败:', error);
                    resolve(null);
                }
            });
        });
    }

    // 异步获取楼主后更新标签（简化版，直接操作 DOM）
    function updateOPTags(opName) {
        if (!opName) return;
        const cfg = getConfig();

        document.querySelectorAll('td.postauthor').forEach(td => {
            // 直接从 DOM 获取用户名
            const a = td.querySelector('cite a') || td.querySelector('.postinfo a');
            if (!a) return;
            const name = cleanStr(a.innerText);

            // 检查是否是楼主
            if (name !== opName) return;

            // 检查是否已有楼主标签
            if (td.querySelector('.tgfc-op-tag')) return;

            if (cfg.compact) {
                // 紧凑模式：在 .tgfc-c-id-row 后面插入标签行
                const idRow = td.querySelector('.tgfc-c-id-row');
                if (idRow) {
                    let tagRow = td.querySelector('.tgfc-c-tag-row');
                    if (!tagRow) {
                        tagRow = document.createElement('div');
                        tagRow.className = 'tgfc-compact-row tgfc-c-tag-row';
                        idRow.after(tagRow);
                    }
                    tagRow.insertAdjacentHTML('afterbegin', '<span class="tgfc-op-tag">楼主</span>');
                }
            } else {
                // 正常模式：在用户名链接后插入标签块
                let tagBlock = td.querySelector('.tgfc-tag-block-normal');
                if (!tagBlock) {
                    tagBlock = document.createElement('div');
                    tagBlock.className = 'tgfc-tag-block-normal';
                    const infoContainer = a.closest('.postinfo') || a.closest('cite') || a.parentNode;
                    if (infoContainer) infoContainer.after(tagBlock);
                }
                if (tagBlock) {
                    tagBlock.insertAdjacentHTML('afterbegin', '<span class="tgfc-op-tag">楼主</span>');
                }
            }
        });
    }

    // 图片放大 Lightbox 功能
    function initImageLightbox() {
        // 创建 lightbox 容器（只创建一次）
        if (!document.getElementById('tgfc-lightbox')) {
            const lightbox = document.createElement('div');
            lightbox.id = 'tgfc-lightbox';
            lightbox.innerHTML = `
                <img id="tgfc-lightbox-img" src="">
                <div id="tgfc-lightbox-hint">点击图片在新标签页打开 | 点击空白处关闭</div>
            `;
            document.body.appendChild(lightbox);

            // 点击背景关闭
            lightbox.onclick = (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove('active');
                }
            };

            // 点击图片在新标签页打开
            lightbox.querySelector('#tgfc-lightbox-img').onclick = (e) => {
                e.stopPropagation();
                const src = e.target.src;
                if (src) window.open(src, '_blank');
            };

            // ESC 关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    lightbox.classList.remove('active');
                }
            });
        }

        const lightbox = document.getElementById('tgfc-lightbox');
        const lightboxImg = document.getElementById('tgfc-lightbox-img');

        // 为帖子内容区的图片添加点击事件
        document.querySelectorAll('.postcontent img').forEach(img => {
            // 跳过已处理的、表情图、小图标等
            if (img.dataset.lightboxBound) return;
            if (img.classList.contains('tgfc-no-zoom')) return;
            if (img.width < 50 || img.height < 50) return; // 跳过小图

            img.dataset.lightboxBound = '1';
            img.style.cursor = 'zoom-in';

            img.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 获取原图 URL（优先使用 data-original 或父级 a 标签的 href）
                let src = img.src;
                const parentA = img.closest('a');
                if (parentA && parentA.href && /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(parentA.href)) {
                    src = parentA.href;
                }
                if (img.dataset.original) {
                    src = img.dataset.original;
                }

                lightboxImg.src = src;
                lightbox.classList.add('active');
            };
        });
    }










    function scan() {
        const cfg = getConfig();
        if (cfg.compact) document.body.classList.add('tgfc-compact');
        else document.body.classList.remove('tgfc-compact');

        // 识别楼主
        let threadOP = getThreadOP();

        if (!threadOP) {
            let currentPage = 1;
            let threadMatch = location.href.match(/thread-\d+-(\d+)-\d+\.html/);
            if (threadMatch) {
                currentPage = parseInt(threadMatch[1]);
            } else {
                let pageMatch = location.href.match(/[?&]page=(\d+)/);
                if (pageMatch) currentPage = parseInt(pageMatch[1]);
            }

            if (currentPage === 1) {
                let firstTd = document.querySelector('td.postauthor');
                if (firstTd) {
                    let a = firstTd.querySelector('cite a') || firstTd.querySelector('.postinfo a');
                    if (a) {
                        threadOP = cleanStr(a.innerText);
                        setThreadOP(threadOP);
                    }
                }
            } else {
                fetchThreadOP().then(opName => {
                    if (opName) updateOPTags(opName);
                }).catch(e => {
                    console.error('[TGFC助手] 异步获取楼主失败:', e);
                });
            }
        }

        // 处理主题列表屏蔽（ID屏蔽 + 关键词屏蔽）
        if (location.href.includes('forum-') && cfg.hideList) {
            document.querySelectorAll('tbody[id^="normalthread"]').forEach(tr => {
                if (tr.dataset.done) return;
                let a = tr.querySelector('cite a');
                let titleLink = tr.querySelector('th a.subject') || tr.querySelector('th a[href*="thread-"]') || tr.querySelector('th a');
                let titleText = titleLink ? cleanStr(titleLink.innerText) : '';

                // 检查ID屏蔽
                if (a) {
                    let name = cleanStr(a.innerText);
                    if (cfg.blocked.includes(name)) {
                        tr.style.display = 'none';
                        if (cfg.showListTip) {
                            if (!tr.nextElementSibling?.classList.contains('tgfc-list-tip-row')) {
                                let tipTr = document.createElement('tr');
                                tipTr.className = 'tgfc-list-tip-row';
                                tipTr.innerHTML = `<td colspan="10" style="padding:0; border-bottom:1px solid #CDCDCD;"><div class="tgfc-list-tip-inner">已屏蔽用户: <b>${name}</b> <span class="tg-toggle">[展开]</span><span class="tg-unban">[解禁]</span></div></td>`;
                                tipTr.querySelector('.tg-toggle').onclick = function () { const isHidden = tr.style.display === 'none'; tr.style.display = isHidden ? '' : 'none'; this.innerText = isHidden ? '[收起]' : '[展开]'; };
                                tipTr.querySelector('.tg-unban').onclick = function () { if (confirm('解禁 ' + name + '?')) { cfg.blocked = cfg.blocked.filter(x => x !== name); saveConfig(cfg); location.reload(); } };
                                tr.after(tipTr);
                            }
                        } else if (tr.nextElementSibling?.classList.contains('tgfc-list-tip-row')) tr.nextElementSibling.remove();
                        tr.dataset.done = 1;
                        return;
                    }
                }

                // 检查关键词屏蔽
                if (cfg.hideKeyword && titleText && cfg.blockedKeywords && cfg.blockedKeywords.length > 0) {
                    let matchedKeyword = cfg.blockedKeywords.find(kw => kw && titleText.toLowerCase().includes(kw.toLowerCase()));
                    if (matchedKeyword) {
                        tr.style.display = 'none';
                        if (cfg.showKeywordTip) {
                            if (!tr.nextElementSibling?.classList.contains('tgfc-list-tip-row')) {
                                let tipTr = document.createElement('tr');
                                tipTr.className = 'tgfc-list-tip-row';
                                tipTr.innerHTML = `<td colspan="10" style="padding:0; border-bottom:1px solid #CDCDCD;"><div class="tgfc-list-tip-inner">已屏蔽关键词: <b>${matchedKeyword}</b> <span class="tg-toggle">[展开]</span><span class="tg-unkw">[解禁]</span></div></td>`;
                                tipTr.querySelector('.tg-toggle').onclick = function () { const isHidden = tr.style.display === 'none'; tr.style.display = isHidden ? '' : 'none'; this.innerText = isHidden ? '[收起]' : '[展开]'; };
                                tipTr.querySelector('.tg-unkw').onclick = function () { if (confirm('移除关键词屏蔽: ' + matchedKeyword + '?')) { cfg.blockedKeywords = cfg.blockedKeywords.filter(x => x !== matchedKeyword); saveConfig(cfg); location.reload(); } };
                                tr.after(tipTr);
                            }
                        } else if (tr.nextElementSibling?.classList.contains('tgfc-list-tip-row')) tr.nextElementSibling.remove();
                    }
                }
                tr.dataset.done = 1;
            });
        }

        // 处理帖子内容屏蔽及渲染
        let tds = document.querySelectorAll('td.postauthor');
        tds.forEach(td => {
            if (td.dataset.done) return;
            let d = parseTd(td);
            if (!d.name || !d.linkObj) {
                if (cfg.compact) {
                    let tr = td.parentNode;
                    if (tr && tr.tagName === 'TR') tr.style.display = 'none';
                }
                return;
            }
            if (cfg.hideContent && cfg.blocked.includes(d.name)) {
                let box = td.closest('table[id^="pid"]') || td.closest('div[id^="pid"]');
                // 修复：如果找不到带pid的容器，智能查找最近的有效容器，并处理嵌套表格的情况
                if (!box) {
                    let t = td.closest('table');
                    while (t && t.parentElement && t.parentElement.tagName === 'TD') {
                        let up = t.parentElement.closest('table');
                        if (up) t = up; else break;
                    }
                    if (t && t.querySelectorAll('td.postauthor').length > 1) box = td.closest('tr');
                    else box = t;
                }
                if (box && box.style.display !== 'none') {
                    box.style.display = 'none';
                    if (cfg.showContentTip) {
                        let tip = document.createElement('div');
                        tip.className = 'tgfc-block-box';
                        tip.innerHTML = `已屏蔽: <b>${d.name}</b> <span class="tg-show">[展开]</span> <span class="tg-unban">[解禁]</span>`;
                        tip.querySelector('.tg-show').onclick = function () { box.style.display = box.style.display === 'none' ? '' : 'none'; this.innerText = box.style.display === 'none' ? '[展开]' : '[收起]'; };
                        tip.querySelector('.tg-unban').onclick = function () { if (confirm('解禁?')) { cfg.blocked = cfg.blocked.filter(x => x !== d.name); saveConfig(cfg); location.reload(); } };
                        box.parentNode.insertBefore(tip, box);
                    }
                    td.dataset.done = 1;
                    return;
                }
            }
            const isOP = (d.name === threadOP);
            if (cfg.compact) doCompact(td, d, cfg, isOP); else doNormal(td, d, cfg, isOP);
            // 应用帖子配色：优先使用个性化配色，否则使用全局配色
            let tbl = td.closest('table');
            let con = tbl ? tbl.querySelector('.postcontent') : null;

            // 检测是否处于 Dark Mode
            const isDarkMode = document.body.classList.contains('tgfc-neoretro-dark');

            if (cfg.highlighted[d.name]) {
                // 个性化配色优先（兼容旧结构）
                let s = cfg.highlighted[d.name];

                // Dark Mode 下，强制使用 Dark 配色而不是保存的配色
                // 这样可以避免在熊猫主题下设置的浅色在 Dark 主题下太扎眼
                if (isDarkMode) {
                    const darkBg = '#303030';
                    const darkCol = '#b0b0b0';
                    td.style.setProperty('background', darkBg, 'important');
                    td.style.color = darkCol;
                    if (con) {
                        con.style.setProperty('background', darkBg, 'important');
                        con.style.color = darkCol;
                    }
                } else {
                    // 非 Dark Mode，正常应用保存的配色
                    // 用户区（左侧）
                    let userBg = s.userBg || s.bg;
                    let userColor = s.userColor || s.color;
                    if (userBg) td.style.setProperty('background', userBg, 'important');
                    if (userColor) {
                        td.style.setProperty('color', userColor, 'important');
                        // 强制应用到所有子元素，覆盖论坛原有样式（排除功能按钮和标签）
                        td.querySelectorAll('*').forEach(el => { if (!el.classList.contains('tgfc-btn') && !el.classList.contains('tgfc-tag') && !el.classList.contains('tgfc-op-tag')) el.style.setProperty('color', userColor, 'important'); });
                    }
                    // 内容区（右侧）
                    let contentBg = s.contentBg || s.bg;
                    let contentColor = s.contentColor || s.color;
                    if (contentBg && con) con.style.setProperty('background', contentBg, 'important');
                    if (contentColor && con) {
                        con.style.setProperty('color', contentColor, 'important');
                        con.querySelectorAll('*').forEach(el => el.style.setProperty('color', contentColor, 'important'));
                    }
                }
                // 字号（无论哪种模式都应用）
                if (s.size && con) { let sz = s.size.match(/\d+/) ? s.size : s.size + 'px'; con.style.fontSize = sz; con.querySelectorAll('*').forEach(e => e.style.fontSize = sz); }
            } else if (cfg.globalUserBg || cfg.globalUserColor || cfg.globalContentBg || cfg.globalContentColor) {
                // 无个性化配色时，应用全局配色（新结构）
                if (cfg.globalUserBg) td.style.setProperty('background', cfg.globalUserBg, 'important');
                if (cfg.globalUserColor) {
                    td.style.setProperty('color', cfg.globalUserColor, 'important');
                    td.querySelectorAll('*').forEach(el => { if (!el.classList.contains('tgfc-btn') && !el.classList.contains('tgfc-tag') && !el.classList.contains('tgfc-op-tag')) el.style.setProperty('color', cfg.globalUserColor, 'important'); });
                }
                if (cfg.globalContentBg && con) con.style.setProperty('background', cfg.globalContentBg, 'important');
                if (cfg.globalContentColor && con) {
                    con.style.setProperty('color', cfg.globalContentColor, 'important');
                    con.querySelectorAll('*').forEach(el => el.style.setProperty('color', cfg.globalContentColor, 'important'));
                }
            } else if (cfg.globalPostBg || cfg.globalPostColor) {
                // 兼容旧全局配色
                if (cfg.globalPostBg) { td.style.setProperty('background', cfg.globalPostBg, 'important'); if (con) con.style.setProperty('background', cfg.globalPostBg, 'important'); }
                if (cfg.globalPostColor && con) {
                    con.style.setProperty('color', cfg.globalPostColor, 'important');
                    con.querySelectorAll('*').forEach(el => el.style.setProperty('color', cfg.globalPostColor, 'important'));
                }
            }
            td.dataset.done = 1;
        });

        // 处理引用块中被屏蔽用户的内容
        if (cfg.hideContent && cfg.blocked.length > 0) {
            document.querySelectorAll('.postcontent .quote, .postcontent blockquote').forEach(quote => {
                if (quote.dataset.blockChecked) return;
                // 跳过嵌套在 .quote 内的 blockquote，避免重复处理
                if (quote.tagName === 'BLOCKQUOTE' && quote.closest('.quote')) return;
                quote.dataset.blockChecked = '1';
                // 查找引用来源，格式通常为 "原帖由 @xxx 于 ..." 或 "Originally posted by xxx"
                const quoteText = quote.innerText || '';
                const quoteHtml = quote.innerHTML || '';
                // 匹配多种格式：原帖由 @xxx、原帖由 xxx 于、Originally posted by xxx
                const patterns = [
                    /原帖由\s*@?(\S+)\s*于/,
                    /原帖由\s*@?(\S+)\s*发/,
                    /Originally posted by\s+(\S+)/i,
                    /引用.*?@(\S+)/,
                    /posted by\s+(\S+)/i
                ];
                let blockedUser = null;
                for (const pattern of patterns) {
                    const match = quoteText.match(pattern) || quoteHtml.match(pattern);
                    if (match && match[1]) {
                        const userName = cleanStr(match[1]);
                        if (cfg.blocked.includes(userName)) {
                            blockedUser = userName;
                            break;
                        }
                    }
                }
                if (blockedUser) {
                    const originalDisplay = quote.style.display;
                    quote.style.display = 'none';
                    const tip = document.createElement('div');
                    tip.className = 'tgfc-quote-blocked-tip';
                    tip.style.cssText = 'padding:8px 12px;background:#fff5f5;border:1px dashed #ffccc7;color:#999;font-size:12px;margin:4px 0;border-radius:4px;';
                    tip.innerHTML = `已屏蔽引用: <b>${blockedUser}</b> <span class="tg-quote-toggle" style="color:#1890ff;cursor:pointer;margin-left:8px;">[展开]</span>`;
                    tip.querySelector('.tg-quote-toggle').onclick = function () {
                        const isHidden = quote.style.display === 'none';
                        quote.style.display = isHidden ? (originalDisplay || '') : 'none';
                        this.innerText = isHidden ? '[收起]' : '[展开]';
                    };
                    quote.parentNode.insertBefore(tip, quote);
                }
            });
        }

        // 添加收录按钮到帖子操作栏
        addCollectButtons();

        // 初始化图片放大功能
        initImageLightbox();
    }

    // Markdown 增强处理
    class TGMarkdownEnhancer {
        constructor() {
            this.selectors = ['div.postmessage.defaultpost'];
            this.originalHtmlMap = new Map();
            this.processedNodes = new WeakSet();
            this.observer = null;
            this.init();
        }

        init() {
            if (getConfig().markdown) {
                this.startEnhancement();
            }
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.tgfc-md-copy');
                if (btn) this.handleCopy(btn);
            });
        }

        startEnhancement() {
            this.processExistingNodes();
            this.startObserver();
        }

        startObserver() {
            if (this.observer) return;
            this.observer = new MutationObserver((mutations) => {
                if (!getConfig().markdown) return;
                let shouldProcess = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldProcess = true;
                        break;
                    }
                }
                if (shouldProcess) {
                    this.processExistingNodes();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        collectTargets() {
            let nodes = [];
            for (let sel of this.selectors) {
                let found = document.querySelectorAll(sel);
                if (found.length > 0) nodes = nodes.concat(Array.from(found));
            }
            return [...new Set(nodes)];
        }

        processExistingNodes() {
            const targets = this.collectTargets();
            targets.forEach(node => {
                if (this.processedNodes.has(node)) return;
                if (!this.originalHtmlMap.has(node)) {
                    this.originalHtmlMap.set(node, node.innerHTML);
                }
                this.enhanceNode(node);
            });
        }

        enhanceNode(node) {
            let postInfo = node.querySelector('.postinfo');
            let contentHtml = '', contentText = '';
            if (postInfo) {
                let clone = node.cloneNode(true);
                let piInClone = clone.querySelector('.postinfo');
                if (piInClone) piInClone.remove();
                contentHtml = clone.innerHTML;
                contentText = clone.innerText || clone.textContent;
            } else {
                contentHtml = node.innerHTML;
                contentText = node.innerText || node.textContent;
            }

            if (this.shouldEnhance(contentHtml, contentText)) {
                // 存储原始 HTML 到节点，供 MD 按钮读取
                node.dataset.mdOriginalHtml = node.innerHTML;
                node.dataset.mdEnhanced = 'true';

                // 创建工作副本
                let workNode = node.cloneNode(true);
                if (postInfo) {
                    workNode.querySelector('.postinfo')?.remove();
                }

                // 提取并保留所有引用块
                const quoteBlocks = [];
                const quoteElements = workNode.querySelectorAll('blockquote, .quote, [class*="quote"]');
                quoteElements.forEach((q, i) => {
                    const placeholder = `___QUOTE_PLACEHOLDER_${i}___`;
                    quoteBlocks.push({ placeholder, html: q.outerHTML });
                    q.outerHTML = placeholder;
                });

                // 美化非引用部分
                let raw = this.cleanRawText(this.extractTextWithLinks(workNode));
                let newContentHtml = this.markdownToHtml(raw);

                // 还原引用块
                quoteBlocks.forEach(({ placeholder, html }) => {
                    newContentHtml = newContentHtml.replace(placeholder, html);
                });

                node.innerHTML = '';
                if (postInfo) node.appendChild(postInfo);
                node.insertAdjacentHTML('beforeend', newContentHtml);
                this.processedNodes.add(node);

                // 同步更新对应的 MD 按钮状态
                const postTable = node.closest('table[id^="pid"]') || node.closest('table');
                if (postTable) {
                    const mdBtn = postTable.querySelector('.tgfc-md-enhance-btn');
                    if (mdBtn && mdBtn.dataset.mdState !== 'on') {
                        mdBtn.dataset.mdState = 'on';
                        mdBtn.classList.add('tgfc-md-btn-on');
                        // 更新按钮的 originalHtml 引用（通过重新触发 onclick 绑定）
                        mdBtn.dataset.mdOriginalHtmlRef = node.dataset.mdOriginalHtml;
                    }
                }
            }
        }

        shouldEnhance(html, text) {
            // 检测 Markdown 特征（允许有引用的帖子）
            const hasCodeBlock = /```[\s\S]*?```/.test(text);
            const hasHeader = /^#{1,6}\s+/m.test(text);
            const hasInlineCode = /`[^`]+`/.test(text);
            const hasUnorderedList = /^[\s]*[-*+]\s+.+/m.test(text);
            // 有序列表要求更严格：至少连续两行以数字.开头
            const hasOrderedList = /^\s*\d+\.\s+.+\n\s*\d+\.\s+.+/m.test(text);
            const hasBoldOrItalic = /\*\*[^*]+\*\*/.test(text) || /(?<!\*)\*[^*]+\*(?!\*)/.test(text);
            const hasBlockquote = /^>\s*.+/m.test(text);
            const hasLink = /\[[^\]]+\]\([^)]+\)/.test(text);

            // 强特征：代码块、标题、行内代码 - 单独即可触发
            if (hasCodeBlock || hasHeader || hasInlineCode) return true;
            // 弱特征：列表、加粗/斜体、引用、链接 - 需要至少两个才触发
            const weakFeatureCount = [hasUnorderedList, hasOrderedList, hasBoldOrItalic, hasBlockquote, hasLink].filter(Boolean).length;
            return weakFeatureCount >= 2;
        }

        cleanRawText(text) {
            if (!text) return '';
            text = text.replace(/\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);/g, '');
            return text.trim();
        }

        // 从 HTML 中提取文本，同时保留链接转换为 Markdown 格式
        extractTextWithLinks(element) {
            if (!element) return '';

            const result = [];
            const walk = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    result.push(node.textContent);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName.toLowerCase();

                    if (tag === 'a' && node.href) {
                        // 将链接转换为 Markdown 格式
                        const text = node.innerText.trim() || node.href;
                        const href = node.href;
                        // 避免截断的链接文本（如 "xxx...xxx"）
                        result.push(`[${text}](${href})`);
                    } else if (tag === 'br') {
                        result.push('\n');
                    } else if (tag === 'img') {
                        // 保留图片为 Markdown 格式
                        const alt = node.alt || '';
                        const src = node.src || '';
                        if (src) result.push(`![${alt}](${src})`);
                    } else if (tag === 'script' || tag === 'style') {
                        // 跳过脚本和样式
                    } else {
                        // 递归处理子节点
                        for (const child of node.childNodes) {
                            walk(child);
                        }
                        // 块级元素后添加换行
                        if (['div', 'p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                            result.push('\n');
                        }
                    }
                }
            };

            walk(element);
            return result.join('');
        }

        markdownToHtml(md) {
            if (!md) return '';
            md = this.cleanRawText(md);
            md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                let langAttr = lang ? `data-lang="${lang}"` : '';
                return `<pre class="tgfc-md-code" ${langAttr}><code>${this.escapeHtml(code.trim())}</code><button class="tgfc-md-copy">复制</button></pre>`;
            });
            md = md.replace(/`([^`]+)`/g, '<code class="tgfc-inline">$1</code>');
            const headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            headers.forEach((tag, i) => {
                const level = i + 1;
                const regex = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
                md = md.replace(regex, `<${tag}>$1</${tag}>`);
            });
            md = md.replace(/^---$/gm, '<hr class="tgfc-md-hr">');
            md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="tgfc-md-img">');
            md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
            md = md.replace(/\*\*([^*]+)\*\*/g, '<span class="tgfc-md-bold">$1</span>');
            md = md.replace(/\*([^*]+)\*/g, '<span class="tgfc-md-italic">$1</span>');
            md = md.replace(/^> ?(.+)$/gm, '<blockquote>$1</blockquote>');
            md = md.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li class="tgfc-md-li" style="list-style:decimal;" value="$1">$2</li>');
            md = md.replace(/^\s*[-*+] +(.+)$/gm, '<li class="tgfc-md-li">$1</li>');
            md = md.replace(/(?<!>)\n/g, '<br>');
            md = md.replace(/(<li class="tgfc-md-li" style="list-style:decimal;">[\s\S]*?<\/li>)+/gm, '<ol class="tgfc-md-ol">$&</ol>');
            md = md.replace(/(<li class="tgfc-md-li">[\s\S]*?<\/li>)+/gm, '<ul class="tgfc-md-ul">$&</ul>');
            return `<div class="tgfc-md-content">${md}</div>`;
        }

        escapeHtml(str) {
            return str.replace(/[&<>"]/g, (tag) => {
                const charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
                return charsToReplace[tag] || tag;
            });
        }

        handleCopy(btn) {
            let codeEl = btn.previousElementSibling;
            if (codeEl) {
                let txt = codeEl.textContent;
                const copyToClipboard = str => {
                    if (navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(str);
                    return Promise.reject('The Clipboard API is not available.');
                };
                const originalText = btn.innerText;
                copyToClipboard(txt).then(() => {
                    btn.innerText = '已复制!';
                    setTimeout(() => btn.innerText = originalText, 1200);
                }).catch(() => {
                    const el = document.createElement('textarea'); el.value = txt; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
                    btn.innerText = '已复制!';
                    setTimeout(() => btn.innerText = originalText, 1200);
                });
            }
        }

        // 强制美化指定楼层内容（供手动按钮调用）
        // 返回 true 表示成功美化
        forceEnhancePost(postNode) {
            if (!postNode) return false;

            let postInfo = postNode.querySelector('.postinfo');

            // 存储原始 HTML（如果尚未存储）
            if (!postNode.dataset.mdOriginalHtml) {
                postNode.dataset.mdOriginalHtml = postNode.innerHTML;
            }
            postNode.dataset.mdEnhanced = 'true';

            // 创建工作副本
            let workNode = postNode.cloneNode(true);
            if (postInfo) {
                workNode.querySelector('.postinfo')?.remove();
            }

            // 提取并保留所有引用块
            const quoteBlocks = [];
            const quoteElements = workNode.querySelectorAll('blockquote, .quote, [class*="quote"]');
            quoteElements.forEach((q, i) => {
                const placeholder = `___QUOTE_PLACEHOLDER_${i}___`;
                quoteBlocks.push({ placeholder, html: q.outerHTML });
                q.outerHTML = placeholder;
            });

            // 美化非引用部分
            let raw = this.cleanRawText(this.extractTextWithLinks(workNode));
            let newContentHtml = this.markdownToHtml(raw);

            // 还原引用块
            quoteBlocks.forEach(({ placeholder, html }) => {
                newContentHtml = newContentHtml.replace(placeholder, html);
            });

            postNode.innerHTML = '';
            if (postInfo) postNode.appendChild(postInfo);
            postNode.insertAdjacentHTML('beforeend', newContentHtml);
            this.processedNodes.add(postNode);
            return true;
        }
    }

    // 模块 5: 摘录库
    const LIBRARY_STORAGE_KEY = 'tgfc_library';

    function getLibrary() {
        try {
            const raw = GM_getValue(LIBRARY_STORAGE_KEY, null);
            if (!raw) return { categories: ['默认'], items: [] };
            const lib = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (!lib.categories) lib.categories = ['默认'];
            if (!lib.items) lib.items = [];
            return lib;
        } catch {
            return { categories: ['默认'], items: [] };
        }
    }

    function saveLibrary(lib) {
        GM_setValue(LIBRARY_STORAGE_KEY, lib);
    }

    // 获取帖子信息
    function getThreadInfo() {
        let title = document.querySelector('#nav a:last-child')?.innerText ||
            document.querySelector('.mainbox h1')?.innerText ||
            document.title.replace(/ - TGFC.*$/, '');
        return { title: title.trim(), url: location.href };
    }

    // 获取楼层号（增强版：尝试多种方式）
    function getFloorNumber(postTable) {
        // 方法1：从 <a name="数字"> 获取
        const anchors = postTable.querySelectorAll('a[name]');
        for (const a of anchors) {
            if (/^\d+$/.test(a.name)) return a.name;
        }
        // 方法2：从帖子内的 <em> 标签获取（格式：#1、1#、第1楼等）
        const ems = postTable.querySelectorAll('.postinfo em, .authorinfo em');
        for (const em of ems) {
            const match = em.innerText.match(/#?(\d+)#?楼?/);
            if (match) return match[1];
        }
        // 方法3：从 postinfo 区域的链接文本获取
        const postinfoLinks = postTable.querySelectorAll('.postinfo a, .authorinfo a');
        for (const link of postinfoLinks) {
            const match = link.innerText.match(/^#?(\d+)$/);
            if (match) return match[1];
        }
        // 方法4：从表格ID pid 后计算序号（如 pid12345 对应的楼层）
        const pidMatch = postTable.id?.match(/pid(\d+)/);
        // 方法5：统计当前是第几个帖子（最后的fallback）
        if (pidMatch) {
            const allPosts = document.querySelectorAll('table[id^="pid"]');
            let idx = 1;
            for (const p of allPosts) {
                if (p.id === postTable.id) return String(idx);
                idx++;
            }
        }
        return pidMatch ? pidMatch[1] : '?';
    }

    // 创建收录弹窗
    let libModal = null;
    let currentCollectData = null;

    function createLibModal() {
        if (libModal) return libModal;

        const overlay = document.createElement('div');
        overlay.id = 'tgfc-lib-overlay';
        overlay.innerHTML = `
            <div id="tgfc-lib-modal">
                <div class="tgfc-lib-modal-header">摘录到摘录库</div>
                <div class="tgfc-lib-modal-body">
                    <div class="tgfc-lib-preview" id="lib-preview"></div>
                    <div class="tgfc-lib-field">
                        <label class="tgfc-lib-label">分类</label>
                        <div class="tgfc-lib-cat-row">
                            <select class="tgfc-lib-select" id="lib-cat-select"></select>
                            <button class="tgfc-lib-add-cat" id="lib-add-cat">+ 新建</button>
                        </div>
                    </div>
                    <div class="tgfc-lib-field">
                        <label class="tgfc-lib-label">标注（可选）</label>
                        <textarea class="tgfc-lib-textarea" id="lib-note" placeholder="添加备注说明..."></textarea>
                    </div>
                </div>
                <div class="tgfc-lib-modal-footer">
                    <button class="tgfc-lib-btn tgfc-lib-btn-cancel" id="lib-cancel">取消</button>
                    <button class="tgfc-lib-btn tgfc-lib-btn-save" id="lib-save">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        libModal = overlay;

        // 绑定事件
        overlay.querySelector('#lib-cancel').onclick = () => closeLibModal();
        overlay.onclick = (e) => { if (e.target === overlay) closeLibModal(); };

        overlay.querySelector('#lib-add-cat').onclick = () => {
            const name = prompt('请输入新分类名称：');
            if (name && name.trim()) {
                const lib = getLibrary();
                if (!lib.categories.includes(name.trim())) {
                    lib.categories.push(name.trim());
                    saveLibrary(lib);
                    refreshCatSelect(name.trim());
                }
            }
        };

        overlay.querySelector('#lib-save').onclick = () => {
            if (!currentCollectData) return;
            const lib = getLibrary();
            const item = {
                id: 'lib_' + Date.now(),
                content: currentCollectData.content,
                contentText: currentCollectData.contentText,
                author: currentCollectData.author,
                threadTitle: currentCollectData.threadTitle,
                threadUrl: currentCollectData.threadUrl,
                floor: currentCollectData.floor,
                category: overlay.querySelector('#lib-cat-select').value,
                note: overlay.querySelector('#lib-note').value.trim(),
                savedAt: Date.now()
            };
            lib.items.unshift(item);
            saveLibrary(lib);
            closeLibModal();
            showToast('已摘录到摘录库');
        };

        return overlay;
    }

    function refreshCatSelect(selected) {
        const lib = getLibrary();
        const select = document.querySelector('#lib-cat-select');
        if (!select) return;
        select.innerHTML = lib.categories.map(c =>
            `<option value="${c}" ${c === selected ? 'selected' : ''}>${c}</option>`
        ).join('');
    }

    function openLibModal(data) {
        const modal = createLibModal();
        currentCollectData = data;
        modal.querySelector('#lib-preview').innerText = data.contentText.substring(0, 200) + (data.contentText.length > 200 ? '...' : '');
        modal.querySelector('#lib-note').value = '';
        refreshCatSelect('默认');
        modal.style.display = 'flex';
    }

    function closeLibModal() {
        if (libModal) {
            libModal.style.display = 'none';
            currentCollectData = null;
        }
    }

    // 简单提示
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;padding:10px 20px;border-radius:8px;z-index:2147483647;font-size:14px;';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
    }

    // 创建文库面板
    let libPanel = null;
    let currentFilter = '全部';

    function createLibPanel() {
        if (libPanel) return libPanel;

        const panel = document.createElement('div');
        panel.id = 'tgfc-lib-panel';
        panel.innerHTML = `
            <div class="tgfc-lib-panel-header">
                <span class="tgfc-lib-panel-title">我的摘录库</span>
                <button class="tgfc-lib-panel-close" id="lib-panel-close">×</button>
            </div>
            <div class="tgfc-lib-toolbar">
                <div class="tgfc-lib-toolbar-left">
                    <select class="tgfc-lib-filter-select" id="lib-filter">
                        <option value="全部">全部分类</option>
                    </select>
                    <span class="tgfc-lib-count" id="lib-count"></span>
                </div>
                <div class="tgfc-lib-toolbar-right">
                    <button class="tgfc-lib-tool-btn" id="lib-manage-cat">管理分类</button>
                    <button class="tgfc-lib-tool-btn" id="lib-export">导出</button>
                    <button class="tgfc-lib-tool-btn" id="lib-import">导入</button>
                </div>
            </div>
            <div class="tgfc-lib-panel-body" id="lib-body"></div>
        `;

        document.body.appendChild(panel);
        libPanel = panel;

        // 绑定事件
        panel.querySelector('#lib-panel-close').onclick = () => closeLibPanel();
        panel.querySelector('#lib-filter').onchange = (e) => {
            currentFilter = e.target.value;
            renderLibItems();
        };
        panel.querySelector('#lib-manage-cat').onclick = () => openCatManager();
        panel.querySelector('#lib-export').onclick = () => exportLibrary();
        panel.querySelector('#lib-import').onclick = () => importLibrary();

        return panel;
    }

    function openLibPanel() {
        const panel = createLibPanel();
        refreshFilterSelect();
        renderLibItems();
        panel.style.display = 'flex';
    }

    function closeLibPanel() {
        if (libPanel) libPanel.style.display = 'none';
    }

    function refreshFilterSelect() {
        const lib = getLibrary();
        const select = document.querySelector('#lib-filter');
        if (!select) return;
        select.innerHTML = '<option value="全部">全部分类</option>' +
            lib.categories.map(c => `<option value="${c}" ${c === currentFilter ? 'selected' : ''}>${c}</option>`).join('');
    }

    function renderLibItems() {
        const lib = getLibrary();
        const body = document.querySelector('#lib-body');
        const count = document.querySelector('#lib-count');
        if (!body) return;

        let items = lib.items;
        if (currentFilter !== '全部') {
            items = items.filter(i => i.category === currentFilter);
        }

        count.innerText = `共 ${items.length} 条`;

        if (items.length === 0) {
            body.innerHTML = '<div class="tgfc-lib-empty">暂无摘录内容</div>';
            return;
        }

        body.innerHTML = items.map(item => {
            const date = new Date(item.savedAt);
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            // 显示完整内容（纯文本）
            const fullContent = item.contentText || item.content.replace(/<[^>]+>/g, '');
            return `
                <div class="tgfc-lib-item" data-id="${item.id}">
                    <div class="tgfc-lib-item-content">${fullContent}</div>
                    <div class="tgfc-lib-item-meta">
                        <span class="tgfc-lib-item-author">${item.author || '未知'}</span>
                        <a class="tgfc-lib-item-source" href="${item.threadUrl}" target="_blank">${item.threadTitle}</a>
                        <span class="tgfc-lib-item-cat">${item.category}</span>
                        ${item.note ? `<span class="tgfc-lib-item-note">${item.note}</span>` : ''}
                        <span class="tgfc-lib-item-time">${dateStr}</span>
                        <div class="tgfc-lib-item-actions">
                            <button class="tgfc-lib-item-btn edit-btn">编辑</button>
                            <button class="tgfc-lib-item-btn delete delete-btn">删除</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 绑定编辑删除事件
        body.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => editLibItem(btn.closest('.tgfc-lib-item').dataset.id);
        });
        body.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => deleteLibItem(btn.closest('.tgfc-lib-item').dataset.id);
        });
    }

    function editLibItem(id) {
        const lib = getLibrary();
        const item = lib.items.find(i => i.id === id);
        if (!item) return;

        const newNote = prompt('编辑标注：', item.note || '');
        if (newNote !== null) {
            item.note = newNote.trim();
            saveLibrary(lib);
            renderLibItems();
        }
    }

    function deleteLibItem(id) {
        if (!confirm('确定删除这条摘录？')) return;
        const lib = getLibrary();
        lib.items = lib.items.filter(i => i.id !== id);
        saveLibrary(lib);
        renderLibItems();
    }

    // 分类管理
    function openCatManager() {
        const lib = getLibrary();
        const overlay = document.createElement('div');
        overlay.id = 'tgfc-lib-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div id="tgfc-lib-modal">
                <div class="tgfc-lib-modal-header">管理分类</div>
                <div class="tgfc-lib-modal-body">
                    <div class="tgfc-lib-cat-list" id="cat-list"></div>
                    <div class="tgfc-lib-field">
                        <div class="tgfc-lib-cat-row">
                            <input type="text" class="tgfc-lib-input" id="new-cat-name" placeholder="新分类名称">
                            <button class="tgfc-lib-add-cat" id="add-cat-btn">添加</button>
                        </div>
                    </div>
                </div>
                <div class="tgfc-lib-modal-footer">
                    <button class="tgfc-lib-btn tgfc-lib-btn-cancel" id="cat-close">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const renderCatList = () => {
            const lib = getLibrary();
            const list = overlay.querySelector('#cat-list');
            list.innerHTML = lib.categories.map(c => `
                <div class="tgfc-lib-cat-item">
                    <span class="tgfc-lib-cat-name">${c}</span>
                    ${c !== '默认' ? `<span class="tgfc-lib-cat-del" data-cat="${c}">删除</span>` : '<span style="color:#999;font-size:11px">默认</span>'}
                </div>
            `).join('');

            list.querySelectorAll('.tgfc-lib-cat-del').forEach(btn => {
                btn.onclick = () => {
                    const cat = btn.dataset.cat;
                    const lib = getLibrary();
                    const count = lib.items.filter(i => i.category === cat).length;
                    if (count > 0) {
                        if (!confirm(`该分类下有 ${count} 条摘录，删除后将移至"默认"分类，确定？`)) return;
                        lib.items.forEach(i => { if (i.category === cat) i.category = '默认'; });
                    }
                    lib.categories = lib.categories.filter(c => c !== cat);
                    saveLibrary(lib);
                    renderCatList();
                };
            });
        };

        renderCatList();

        overlay.querySelector('#add-cat-btn').onclick = () => {
            const input = overlay.querySelector('#new-cat-name');
            const name = input.value.trim();
            if (name) {
                const lib = getLibrary();
                if (!lib.categories.includes(name)) {
                    lib.categories.push(name);
                    saveLibrary(lib);
                    input.value = '';
                    renderCatList();
                } else {
                    alert('分类已存在');
                }
            }
        };

        overlay.querySelector('#cat-close').onclick = () => {
            overlay.remove();
            refreshFilterSelect();
        };
        overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); refreshFilterSelect(); } };
    }

    // 导出导入
    function exportLibrary() {
        const lib = getLibrary();
        const json = JSON.stringify(lib, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tgfc_library_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importLibrary() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (!data.items || !Array.isArray(data.items)) {
                        alert('文件格式错误');
                        return;
                    }
                    const lib = getLibrary();
                    const existIds = new Set(lib.items.map(i => i.id));
                    let added = 0;
                    data.items.forEach(item => {
                        if (!existIds.has(item.id)) {
                            lib.items.push(item);
                            added++;
                        }
                    });
                    if (data.categories) {
                        data.categories.forEach(c => {
                            if (!lib.categories.includes(c)) lib.categories.push(c);
                        });
                    }
                    saveLibrary(lib);
                    renderLibItems();
                    refreshFilterSelect();
                    showToast(`导入成功，新增 ${added} 条`);
                } catch {
                    alert('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 在帖子信息行添加收录按钮 & 修复回复链接
    function addCollectButtons() {
        // 从 URL 或页面元素提取 fid 和 tid
        const tidMatch = location.href.match(/thread-(\d+)/) || location.href.match(/[?&]tid=(\d+)/);
        const tid = tidMatch ? tidMatch[1] : '';

        // fid 优先从回复表单获取，其次从导航链接获取
        let fid = '';
        const formFid = document.querySelector('input[name="formhash"]')?.form?.querySelector('input[name="fid"]')?.value;
        if (formFid) {
            fid = formFid;
        } else {
            const navLink = document.querySelector('#nav a[href*="forum-"]');
            const navMatch = navLink?.href?.match(/forum-(\d+)/);
            if (navMatch) fid = navMatch[1];
        }

        document.querySelectorAll('.postinfo').forEach(postInfo => {
            if (postInfo.dataset.libDone) return;
            postInfo.dataset.libDone = '1';

            const postTable = postInfo.closest('table[id^="pid"]') || postInfo.closest('table');
            const pidMatch = postTable?.id?.match(/pid(\d+)/);
            const pid = pidMatch ? pidMatch[1] : '';

            // 找到"回复"链接
            const replyLink = Array.from(postInfo.querySelectorAll('a')).find(a =>
                a.innerText.trim() === '回复' ||
                a.onclick?.toString().includes('fastreply')
            );

            if (replyLink) {
                // 修复回复链接：构建正确的不引用回复页面链接
                if (tid && pid) {
                    const replyUrl = `post.php?action=reply&tid=${tid}${fid ? '&fid=' + fid : ''}&reppost=${pid}`;
                    replyLink.href = replyUrl;
                    replyLink.onclick = null; // 移除原有的 JS 处理
                    replyLink.removeAttribute('onclick');
                }

                // 添加摘录按钮
                if (!replyLink.nextElementSibling?.classList?.contains('tgfc-lib-collect-btn')) {
                    const collectBtn = document.createElement('a');
                    collectBtn.href = 'javascript:;';
                    collectBtn.className = 'tgfc-lib-collect-btn';
                    collectBtn.innerText = '摘录';
                    collectBtn.onclick = (e) => {
                        e.preventDefault();
                        if (postTable) collectPost(postTable);
                    };
                    replyLink.after(collectBtn);
                }

                // 添加 MD 切换按钮
                const existingMdBtn = postInfo.querySelector('.tgfc-md-enhance-btn');
                if (!existingMdBtn) {
                    const mdBtn = document.createElement('a');
                    mdBtn.href = 'javascript:;';
                    mdBtn.className = 'tgfc-md-enhance-btn';
                    mdBtn.innerText = 'MD';

                    // 获取内容节点 - 优先使用与 TGMarkdownEnhancer 相同的选择器
                    const postContent = postTable?.querySelector('div.postmessage.defaultpost') ||
                        postTable?.querySelector('.postcontent .t_msgfont') ||
                        postTable?.querySelector('.postcontent .postmessage');

                    // 检查是否已被自动美化
                    let originalHtml = null;
                    if (postContent?.dataset.mdEnhanced === 'true') {
                        // 已自动美化，初始状态为开启
                        originalHtml = postContent.dataset.mdOriginalHtml || null;
                        mdBtn.dataset.mdState = 'on';
                        mdBtn.classList.add('tgfc-md-btn-on');
                    } else {
                        // 未美化，初始状态为关闭
                        mdBtn.dataset.mdState = 'off';
                    }

                    mdBtn.onclick = (e) => {
                        e.preventDefault();
                        if (!postContent || !window.mdEnhancer) return;

                        if (mdBtn.dataset.mdState === 'off') {
                            // 开启美化
                            if (originalHtml === null) {
                                originalHtml = postContent.innerHTML;
                            }
                            const success = window.mdEnhancer.forceEnhancePost(postContent);
                            if (success) {
                                mdBtn.dataset.mdState = 'on';
                                mdBtn.classList.add('tgfc-md-btn-on');
                            }
                            // 如果失败（如有引用），按钮状态不变
                        } else {
                            // 关闭美化，还原内容
                            // 优先从闭包变量读取，其次从 dataset 读取
                            let htmlToRestore = originalHtml || postContent.dataset.mdOriginalHtml || mdBtn.dataset.mdOriginalHtmlRef;
                            if (htmlToRestore) {
                                postContent.innerHTML = htmlToRestore;
                                // 保存以便再次切换回美化
                                originalHtml = htmlToRestore;
                            }
                            mdBtn.dataset.mdState = 'off';
                            mdBtn.classList.remove('tgfc-md-btn-on');
                        }
                    };
                    // 插入到摘录按钮后面
                    const collectBtnEl = postInfo.querySelector('.tgfc-lib-collect-btn');
                    if (collectBtnEl) {
                        collectBtnEl.after(mdBtn);
                    } else {
                        replyLink.after(mdBtn);
                    }
                }
            }
        });
    }

    function collectPost(pCtrl) {
        const postTable = pCtrl.closest('table[id^="pid"]') || pCtrl.closest('table');
        if (!postTable) return;

        const postContent = postTable.querySelector('.postcontent .t_msgfont') ||
            postTable.querySelector('.postcontent .postmessage') ||
            postTable.querySelector('.postcontent');
        const postAuthor = postTable.querySelector('.postauthor cite a') ||
            postTable.querySelector('.postauthor .postinfo a');

        if (!postContent) {
            showToast('无法获取帖子内容');
            return;
        }

        const threadInfo = getThreadInfo();
        const floor = getFloorNumber(postTable);

        // 获取具体楼层链接（包含#pid锚点）
        let postUrl = threadInfo.url;
        const pidMatch = postTable.id?.match(/pid(\d+)/);
        if (pidMatch) {
            // 构建带锚点的链接
            const baseUrl = location.href.split('#')[0];
            postUrl = baseUrl + '#pid' + pidMatch[1];
        }

        openLibModal({
            content: postContent.innerHTML,
            contentText: postContent.innerText?.trim() || '',
            author: postAuthor?.innerText?.trim() || '未知',
            threadTitle: threadInfo.title,
            threadUrl: postUrl,
            floor: floor
        });
    }

    // 在导航栏添加文库入口
    function addLibraryLink() {
        // 将由 initMenuPlus 中处理，在快速通道前添加
    }

    // 标签统计功能
    function collectTagStats() {
        const cfg = getConfig();
        const threadOP = getThreadOP();
        const stats = {
            byTag: {},      // { tagName: { users: Set, posts: 0, chars: 0, streaks: {} } }
            noTag: { users: new Set(), posts: 0, chars: 0 },
            op: { posts: 0, chars: 0 },
            idStreaks: {},   // { id: { max: n, count: n } } ID连发统计
            tagStreaks: {}   // { tag: { max: n, count: n } } Tag连发统计
        };

        // 收集帖子序列（包含楼层信息）
        const postList = [];
        document.querySelectorAll('td.postauthor').forEach(td => {
            const a = td.querySelector('cite a') || td.querySelector('.postinfo a');
            if (!a) return;
            const name = cleanStr(a.innerText);
            if (!name) return;

            const tbl = td.closest('table');
            const postContent = tbl ? tbl.querySelector('.postcontent .t_msgfont, .postcontent .postmessage') : null;
            const contentText = postContent ? postContent.innerText.trim() : '';
            const userTags = cfg.highlighted[name]?.tags || [];

            // 获取楼层号和锚点（使用增强版函数）
            let floor = tbl ? getFloorNumber(tbl) : '?';
            let anchor = '';
            if (tbl) {
                // 优先使用楼层号作为锚点
                if (floor !== '?') {
                    anchor = `#${floor}`;
                } else if (tbl.id) {
                    const pidMatch = tbl.id.match(/pid(\d+)/);
                    if (pidMatch) anchor = `#pid${pidMatch[1]}`;
                }
            }

            postList.push({ name, chars: contentText.length, tags: userTags, floor, anchor });
        });

        // 计算连发（记录楼层信息）
        function calcStreaks(list) {
            const idStreaks = {};    // { id: { max: n, count: n, floors: [[startFloor, endFloor, startAnchor], ...] } }
            const tagStreaks = {};   // { tag: { max: n, count: n, floors: [[startFloor, endFloor, startAnchor], ...] } }

            let prevId = null, idStreak = 0, idStreakStart = null, idStreakStartAnchor = '';
            let prevTags = [], tagStreak = {}, tagStreakStart = {}, tagStreakStartAnchor = {};

            const saveIdStreak = (id, streak, startFloor, endFloor, startAnchor) => {
                if (streak >= 2 && id) {
                    if (!idStreaks[id]) idStreaks[id] = { max: 0, count: 0, floors: [] };
                    idStreaks[id].count++;
                    if (streak > idStreaks[id].max) idStreaks[id].max = streak;
                    idStreaks[id].floors.push([startFloor, endFloor, startAnchor]);
                }
            };

            const saveTagStreak = (tag, streak, startFloor, endFloor, startAnchor) => {
                if (streak >= 2) {
                    if (!tagStreaks[tag]) tagStreaks[tag] = { max: 0, count: 0, floors: [] };
                    tagStreaks[tag].count++;
                    if (streak > tagStreaks[tag].max) tagStreaks[tag].max = streak;
                    tagStreaks[tag].floors.push([startFloor, endFloor, startAnchor]);
                }
            };

            list.forEach((post, i) => {
                // ID连发
                if (post.name === prevId) {
                    idStreak++;
                } else {
                    saveIdStreak(prevId, idStreak, idStreakStart, list[i - 1]?.floor, idStreakStartAnchor);
                    prevId = post.name;
                    idStreak = 1;
                    idStreakStart = post.floor;
                    idStreakStartAnchor = post.anchor;
                }

                // Tag连发
                post.tags.forEach(tag => {
                    if (prevTags.includes(tag)) {
                        tagStreak[tag] = (tagStreak[tag] || 1) + 1;
                    } else {
                        saveTagStreak(tag, tagStreak[tag] || 0, tagStreakStart[tag], list[i - 1]?.floor, tagStreakStartAnchor[tag]);
                        tagStreak[tag] = 1;
                        tagStreakStart[tag] = post.floor;
                        tagStreakStartAnchor[tag] = post.anchor;
                    }
                });
                // 清理不再连续的tag
                Object.keys(tagStreak).forEach(t => {
                    if (!post.tags.includes(t)) {
                        saveTagStreak(t, tagStreak[t], tagStreakStart[t], list[i - 1]?.floor, tagStreakStartAnchor[t]);
                        delete tagStreak[t];
                        delete tagStreakStart[t];
                        delete tagStreakStartAnchor[t];
                    }
                });
                prevTags = post.tags;
            });

            // 处理最后的连发
            const lastPost = list[list.length - 1];
            saveIdStreak(prevId, idStreak, idStreakStart, lastPost?.floor, idStreakStartAnchor);
            Object.keys(tagStreak).forEach(t => {
                saveTagStreak(t, tagStreak[t], tagStreakStart[t], lastPost?.floor, tagStreakStartAnchor[t]);
            });

            return { idStreaks, tagStreaks };
        }

        // 基础统计（包含楼层列表）
        postList.forEach(post => {
            if (post.name === threadOP) {
                stats.op.posts++;
                stats.op.chars += post.chars;
            }
            if (post.tags.length === 0) {
                stats.noTag.users.add(post.name);
                stats.noTag.posts++;
                stats.noTag.chars += post.chars;
            } else {
                post.tags.forEach(tag => {
                    if (!stats.byTag[tag]) stats.byTag[tag] = { users: new Set(), posts: 0, chars: 0, floors: [] };
                    stats.byTag[tag].users.add(post.name);
                    stats.byTag[tag].posts++;
                    stats.byTag[tag].chars += post.chars;
                    stats.byTag[tag].floors.push({ floor: post.floor, anchor: post.anchor, user: post.name });
                });
            }
        });

        // 连发统计
        const streaks = calcStreaks(postList);
        stats.idStreaks = streaks.idStreaks;
        stats.tagStreaks = streaks.tagStreaks;

        return stats;
    }

    // 全帖扫描
    async function scanFullThread(onProgress) {
        const cfg = getConfig();
        const threadOP = getThreadOP();
        const stats = {
            byTag: {},
            noTag: { users: new Set(), posts: 0, chars: 0 },
            op: { posts: 0, chars: 0 },
            idStreaks: {},
            tagStreaks: {},
            totalPages: 0,
            scannedPages: 0
        };

        // 收集所有页面的帖子列表（按页码顺序）
        const allPosts = [];
        const pagePostsMap = {};

        // 获取当前帖子 URL 和总页数
        const threadId = getThreadId();
        if (!threadId) {
            console.error('[TGFC助手] 无法获取帖子ID');
            return stats;
        }

        const currentHost = location.hostname;
        let totalPages = 1;

        // 判断当前URL格式，构建对应格式的分页URL
        const currentUrl = location.href;
        const isViewThreadFormat = currentUrl.includes('viewthread.php');

        function buildPageUrl(page) {
            if (isViewThreadFormat) {
                // viewthread.php?tid=X&page=Y 格式
                return `https://${currentHost}/viewthread.php?tid=${threadId}&page=${page}`;
            } else {
                // thread-ID-PAGE-1.html 格式
                return `https://${currentHost}/thread-${threadId}-${page}-1.html`;
            }
        }

        // 从当前页获取总页数（优先使用"共X页"文本）
        const pagesDiv = document.querySelector('.pages, .pg');
        if (pagesDiv) {
            const totalMatch = pagesDiv.textContent.match(/共\s*(\d+)\s*页/);
            if (totalMatch) {
                totalPages = parseInt(totalMatch[1]);
            }
        }
        // 如果没有找到"共X页"，从链接中解析（只解析明确的页码链接）
        if (totalPages === 1) {
            const pageLinks = document.querySelectorAll('.pages a, .pg a');
            pageLinks.forEach(a => {
                // 排除"下一页"、"上一页"、"末页"等非页码链接
                const text = a.textContent.trim();
                if (/[一-龥]/.test(text)) return; // 包含中文则跳过
                if (/next|prev|last|first/i.test(text)) return;
                if (/^\.\.\.$/.test(text)) return; // 排除 "..."

                // 方法1：匹配 thread-ID-PAGE-1.html 格式
                let hrefMatch = a.href.match(/thread-\d+-(\d+)-\d+\.html/i);
                if (hrefMatch) {
                    const p = parseInt(hrefMatch[1]);
                    if (p > totalPages) totalPages = p;
                    return;
                }
                // 方法2：匹配 viewthread.php?...&page=PAGE 格式
                hrefMatch = a.href.match(/viewthread\.php.*[?&]page=(\d+)/i);
                if (hrefMatch) {
                    const p = parseInt(hrefMatch[1]);
                    if (p > totalPages) totalPages = p;
                    return;
                }
                // 方法3：匹配 read-htm-tid-ID-page-PAGE.html 格式
                hrefMatch = a.href.match(/read-htm-tid-\d+-page-(\d+)/i);
                if (hrefMatch) {
                    const p = parseInt(hrefMatch[1]);
                    if (p > totalPages) totalPages = p;
                    return;
                }
            });
        }

        stats.totalPages = totalPages;

        // 解析单个页面的帖子（包含楼层信息）
        function parsePagePosts(doc, pageNum) {
            const posts = [];
            // 内联楼层获取函数（因为getFloorNumber依赖document.querySelectorAll）
            function getFloorFromTable(tbl, allTables) {
                // 方法0（最优先）：从 strong[id^="postnum_"] 获取真实楼层号（如 "16#" → 16）
                // 这是 TGFC 论坛显示的全局真实楼层号，不会因分页而重复
                const postnumEl = tbl.querySelector('strong[id^="postnum_"]');
                if (postnumEl) {
                    const floorText = postnumEl.innerText.replace('#', '').trim();
                    const floorNum = parseInt(floorText);
                    if (floorNum > 0) return String(floorNum);
                }
                // 方法1：从 <a name="数字"> 获取（fallback）
                const anchors = tbl.querySelectorAll('a[name]');
                for (const a of anchors) {
                    if (/^\d+$/.test(a.name)) return a.name;
                }
                // 方法2：从帖子内的 <em> 标签获取
                const ems = tbl.querySelectorAll('.postinfo em, .authorinfo em');
                for (const em of ems) {
                    const match = em.innerText.match(/#?(\d+)#?楼?/);
                    if (match) return match[1];
                }
                // 方法3：从 postinfo 区域的链接文本获取
                const postinfoLinks = tbl.querySelectorAll('.postinfo a, .authorinfo a');
                for (const link of postinfoLinks) {
                    const match = link.innerText.match(/^#?(\d+)$/);
                    if (match) return match[1];
                }
                // 方法4：统计当前是第几个帖子
                if (tbl.id) {
                    let idx = 1;
                    for (const p of allTables) {
                        if (p.id === tbl.id) return String(idx);
                        idx++;
                    }
                }
                return '?';
            }

            const allTables = doc.querySelectorAll('table[id^="pid"]');
            doc.querySelectorAll('td.postauthor').forEach(td => {
                const a = td.querySelector('cite a') || td.querySelector('.postinfo a');
                if (!a) return;
                const name = cleanStr(a.innerText);
                if (!name) return;
                const tbl = td.closest('table');
                const postContent = tbl ? tbl.querySelector('.postcontent .t_msgfont, .postcontent .postmessage') : null;
                const contentText = postContent ? postContent.innerText.trim() : '';
                const userTags = cfg.highlighted[name]?.tags || [];

                // 获取楼层号和锚点
                let floor = tbl ? getFloorFromTable(tbl, allTables) : '?';
                let anchor = '';
                if (tbl) {
                    if (floor !== '?') {
                        anchor = pageNum === currentPage ? `#${floor}` : `${buildPageUrl(pageNum)}#${floor}`;
                    } else if (tbl.id) {
                        const pidMatch = tbl.id.match(/pid(\d+)/);
                        if (pidMatch) {
                            anchor = pageNum === currentPage ? `#pid${pidMatch[1]}` : `${buildPageUrl(pageNum)}#pid${pidMatch[1]}`;
                        }
                    }
                }

                posts.push({ name, chars: contentText.length, tags: userTags, floor, anchor });
            });
            return posts;
        }

        // 获取当前页页码（从 URL 解析）
        const url = location.href;
        let currentPage = 1;
        const pageMatch = url.match(/thread-\d+-(\d+)-\d+\.html/);
        if (pageMatch) {
            currentPage = parseInt(pageMatch[1]);
        } else {
            const altMatch = url.match(/page[=\-](\d+)/i);
            if (altMatch) currentPage = parseInt(altMatch[1]);
        }

        // 处理当前页
        pagePostsMap[currentPage] = parsePagePosts(document, currentPage);
        stats.scannedPages = 1;
        if (onProgress) onProgress(1, totalPages);

        // 获取其他页（使用 GM_xmlhttpRequest 支持 GBK 编码）
        for (let page = 1; page <= totalPages; page++) {
            if (page === currentPage) continue;
            try {
                const pageUrl = buildPageUrl(page);
                const html = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: pageUrl,
                        overrideMimeType: 'text/html; charset=gbk',
                        onload: (resp) => resolve(resp.responseText),
                        onerror: reject
                    });
                });
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                pagePostsMap[page] = parsePagePosts(doc, page);
                stats.scannedPages++;
                if (onProgress) onProgress(stats.scannedPages, totalPages);
                await new Promise(r => setTimeout(r, 150));
            } catch (e) {
                console.error('[TGFC助手] 扫描页面失败:', page, e);
                pagePostsMap[page] = [];
            }
        }

        // 按页码顺序合并帖子列表
        for (let page = 1; page <= totalPages; page++) {
            if (pagePostsMap[page]) allPosts.push(...pagePostsMap[page]);
        }

        // 基础统计（包含楼层列表）
        allPosts.forEach(post => {
            if (post.name === threadOP) {
                stats.op.posts++;
                stats.op.chars += post.chars;
            }
            if (post.tags.length === 0) {
                stats.noTag.users.add(post.name);
                stats.noTag.posts++;
                stats.noTag.chars += post.chars;
            } else {
                post.tags.forEach(tag => {
                    if (!stats.byTag[tag]) stats.byTag[tag] = { users: new Set(), posts: 0, chars: 0, floors: [] };
                    stats.byTag[tag].users.add(post.name);
                    stats.byTag[tag].posts++;
                    stats.byTag[tag].chars += post.chars;
                    stats.byTag[tag].floors.push({ floor: post.floor, anchor: post.anchor, user: post.name });
                });
            }
        });

        // 计算连发（记录楼层信息）
        let prevId = null, idStreak = 0, idStreakStart = null, idStreakStartAnchor = '';
        let tagStreak = {}, tagStreakStart = {}, tagStreakStartAnchor = {};

        const saveIdStreak = (id, streak, startFloor, endFloor, startAnchor) => {
            if (streak >= 2 && id) {
                if (!stats.idStreaks[id]) stats.idStreaks[id] = { max: 0, count: 0, floors: [] };
                stats.idStreaks[id].count++;
                if (streak > stats.idStreaks[id].max) stats.idStreaks[id].max = streak;
                stats.idStreaks[id].floors.push([startFloor, endFloor, startAnchor]);
            }
        };

        const saveTagStreak = (tag, streak, startFloor, endFloor, startAnchor) => {
            if (streak >= 2) {
                if (!stats.tagStreaks[tag]) stats.tagStreaks[tag] = { max: 0, count: 0, floors: [] };
                stats.tagStreaks[tag].count++;
                if (streak > stats.tagStreaks[tag].max) stats.tagStreaks[tag].max = streak;
                stats.tagStreaks[tag].floors.push([startFloor, endFloor, startAnchor]);
            }
        };

        allPosts.forEach((post, i) => {
            // ID连发
            if (post.name === prevId) {
                idStreak++;
            } else {
                saveIdStreak(prevId, idStreak, idStreakStart, allPosts[i - 1]?.floor, idStreakStartAnchor);
                prevId = post.name;
                idStreak = 1;
                idStreakStart = post.floor;
                idStreakStartAnchor = post.anchor;
            }
            // Tag连发
            const prevTags = Object.keys(tagStreak);
            post.tags.forEach(tag => {
                if (tagStreak[tag]) {
                    tagStreak[tag]++;
                } else {
                    tagStreak[tag] = 1;
                    tagStreakStart[tag] = post.floor;
                    tagStreakStartAnchor[tag] = post.anchor;
                }
            });
            prevTags.forEach(t => {
                if (!post.tags.includes(t)) {
                    saveTagStreak(t, tagStreak[t], tagStreakStart[t], allPosts[i - 1]?.floor, tagStreakStartAnchor[t]);
                    delete tagStreak[t];
                    delete tagStreakStart[t];
                    delete tagStreakStartAnchor[t];
                }
            });
        });
        // 处理最后的连发
        const lastPost = allPosts[allPosts.length - 1];
        saveIdStreak(prevId, idStreak, idStreakStart, lastPost?.floor, idStreakStartAnchor);
        Object.keys(tagStreak).forEach(t => {
            saveTagStreak(t, tagStreak[t], tagStreakStart[t], lastPost?.floor, tagStreakStartAnchor[t]);
        });

        return stats;
    }

    function openTagStatsPanel() {
        let overlay = document.getElementById('tgfc-stats-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'tgfc-stats-overlay';
            overlay.innerHTML = `
                <div id="tgfc-stats-panel">
                    <div class="tgfc-stats-header">
                        <span class="tgfc-stats-title">发帖统计</span>
                        <button class="tgfc-stats-close">✕</button>
                    </div>
                    <div class="tgfc-stats-body">
                        <div class="tgfc-stats-tabs">
                            <button class="tgfc-stats-tab active" data-mode="current">当前页</button>
                            <button class="tgfc-stats-tab" data-mode="full">全帖扫描</button>
                        </div>
                        <div class="tgfc-stats-content"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.tgfc-stats-close').onclick = () => {
                overlay.style.display = 'none';
            };
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.style.display = 'none';
            };

            // Tab 切换
            overlay.querySelectorAll('.tgfc-stats-tab').forEach(tab => {
                tab.onclick = () => {
                    overlay.querySelectorAll('.tgfc-stats-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const mode = tab.dataset.mode;
                    if (mode === 'current') {
                        renderStats(collectTagStats(), overlay.querySelector('.tgfc-stats-content'));
                    } else {
                        startFullScan(overlay.querySelector('.tgfc-stats-content'));
                    }
                };
            });
        }

        // 渲染统计结果
        function renderStats(stats, container) {
            let html = '';
            const threadOP = getThreadOP();

            // 楼主统计
            if (threadOP && stats.op.posts > 0) {
                const avgChars = stats.op.posts > 0 ? Math.round(stats.op.chars / stats.op.posts) : 0;
                // 楼主连发
                const opStreak = stats.idStreaks && stats.idStreaks[threadOP];
                const streakInfo = opStreak ? `<span class="tgfc-stats-streak-badge">${opStreak.max}连x${opStreak.count}</span>` : '';
                html += `
                    <div class="tgfc-stats-section">
                        <table class="tgfc-stats-table">
                            <tr>
                                <td><span class="tgfc-stats-tag op">楼主</span>${threadOP}${streakInfo}</td>
                                <td>发言 <span class="tgfc-stats-num">${stats.op.posts}</span></td>
                                <td>字数 <span class="tgfc-stats-num">${stats.op.chars}</span></td>
                                <td>均 <span class="tgfc-stats-num">${avgChars}</span></td>
                            </tr>
                        </table>
                    </div>
                `;
            }

            // 标签统计表格
            const tagNames = Object.keys(stats.byTag).sort();
            const hasTaggedData = tagNames.length > 0;
            const hasNoTagData = stats.noTag.users.size > 0;

            if (hasTaggedData || hasNoTagData) {
                html += `
                    <div class="tgfc-stats-section">
                        <table class="tgfc-stats-table">
                            <thead>
                                <tr><th>标签</th><th>ID</th><th>帖</th><th>字</th><th>楼层</th></tr>
                            </thead>
                            <tbody>
                `;
                tagNames.forEach(tag => {
                    const t = stats.byTag[tag];
                    const avgChars = t.posts > 0 ? Math.round(t.chars / t.posts) : 0;
                    // Tag连发标记
                    const tagStreak = stats.tagStreaks && stats.tagStreaks[tag];
                    const streakBadge = tagStreak ? ` <span class="tgfc-stats-streak-badge">${tagStreak.max}连${tagStreak.count > 1 ? 'x' + tagStreak.count : ''}</span>` : '';
                    // 楼层链接（显示所有楼层）
                    let floorsHtml = '';
                    if (t.floors && t.floors.length > 0) {
                        floorsHtml = t.floors.map(f =>
                            f.anchor ? `<a href="${f.anchor}" class="tgfc-stats-floor-link" title="${f.user}">#${f.floor}</a>` : `<span class="tgfc-stats-floor">#${f.floor}</span>`
                        ).join(' ');
                    }
                    html += `<tr><td><span class="tgfc-stats-tag" title="${tag}">${tag}</span>${streakBadge}</td><td><span class="tgfc-stats-num">${t.users.size}</span></td><td><span class="tgfc-stats-num">${t.posts}</span></td><td><span class="tgfc-stats-num">${t.chars}</span></td><td class="tgfc-stats-floors">${floorsHtml}</td></tr>`;
                });
                if (hasNoTagData) {
                    const avgChars = stats.noTag.posts > 0 ? Math.round(stats.noTag.chars / stats.noTag.posts) : 0;
                    const cls = hasTaggedData ? ' class="tgfc-stats-separator"' : '';
                    html += `<tr${cls}><td><span class="tgfc-stats-tag none">无标签</span></td><td><span class="tgfc-stats-num">${stats.noTag.users.size}</span></td><td><span class="tgfc-stats-num">${stats.noTag.posts}</span></td><td><span class="tgfc-stats-num">${stats.noTag.chars}</span></td><td>-</td></tr>`;
                }
                // 全部 ID 汇总
                const allUsers = new Set();
                let totalPosts = 0, totalChars = 0;
                tagNames.forEach(tag => { stats.byTag[tag].users.forEach(u => allUsers.add(u)); totalPosts += stats.byTag[tag].posts; totalChars += stats.byTag[tag].chars; });
                stats.noTag.users.forEach(u => allUsers.add(u)); totalPosts += stats.noTag.posts; totalChars += stats.noTag.chars;
                const totalAvg = totalPosts > 0 ? Math.round(totalChars / totalPosts) : 0;
                html += `<tr class="tgfc-stats-separator"><td><strong>全部</strong></td><td><span class="tgfc-stats-num">${allUsers.size}</span></td><td><span class="tgfc-stats-num">${totalPosts}</span></td><td><span class="tgfc-stats-num">${totalChars}</span></td><td>-</td></tr>`;
                html += '</tbody></table></div>';
            }

            // ID连发统计（含楼层）
            if (stats.idStreaks && Object.keys(stats.idStreaks).length > 0) {
                html += `<div class="tgfc-stats-section"><div class="tgfc-stats-section-title">ID连发</div><table class="tgfc-stats-table"><thead><tr><th>ID</th><th>最大</th><th>次数</th><th>楼层</th></tr></thead><tbody>`;
                Object.entries(stats.idStreaks).sort((a, b) => b[1].max - a[1].max).forEach(([id, s]) => {
                    const floorsHtml = s.floors.map(f => {
                        const range = f[0] === f[1] ? `#${f[0]}` : `#${f[0]}-${f[1]}`;
                        return f[2] ? `<a href="${f[2]}" class="tgfc-stats-floor-link">${range}</a>` : `<span class="tgfc-stats-floor">${range}</span>`;
                    }).join(' ');
                    html += `<tr><td>${id}</td><td><span class="tgfc-stats-num">${s.max}</span></td><td><span class="tgfc-stats-num">${s.count}</span></td><td class="tgfc-stats-floors">${floorsHtml}</td></tr>`;
                });
                html += '</tbody></table></div>';
            }

            // Tag连发统计（含楼层）
            if (stats.tagStreaks && Object.keys(stats.tagStreaks).length > 0) {
                html += `<div class="tgfc-stats-section"><div class="tgfc-stats-section-title">Tag连发</div><table class="tgfc-stats-table"><thead><tr><th>标签</th><th>最大</th><th>次数</th><th>楼层</th></tr></thead><tbody>`;
                Object.entries(stats.tagStreaks).sort((a, b) => b[1].max - a[1].max).forEach(([tag, s]) => {
                    const floorsHtml = s.floors.map(f => {
                        const range = f[0] === f[1] ? `#${f[0]}` : `#${f[0]}-${f[1]}`;
                        return f[2] ? `<a href="${f[2]}" class="tgfc-stats-floor-link">${range}</a>` : `<span class="tgfc-stats-floor">${range}</span>`;
                    }).join(' ');
                    html += `<tr><td><span class="tgfc-stats-tag">${tag}</span></td><td><span class="tgfc-stats-num">${s.max}</span></td><td><span class="tgfc-stats-num">${s.count}</span></td><td class="tgfc-stats-floors">${floorsHtml}</td></tr>`;
                });
                html += '</tbody></table></div>';
            }

            if (!html) {
                html = '<div style="text-align:center;padding:30px;color:#999;">没有检测到帖子</div>';
            }
            container.innerHTML = html;
        }

        // 全帖扫描
        async function startFullScan(container) {
            container.innerHTML = `
                <div class="tgfc-stats-progress">
                    <div class="tgfc-stats-progress-text">正在扫描...</div>
                    <div class="tgfc-stats-progress-bar"><div class="tgfc-stats-progress-fill" style="width:0%"></div></div>
                </div>
            `;

            const stats = await scanFullThread((scanned, total) => {
                const pct = Math.round(scanned / total * 100);
                const fill = container.querySelector('.tgfc-stats-progress-fill');
                const text = container.querySelector('.tgfc-stats-progress-text');
                if (fill) fill.style.width = pct + '%';
                if (text) text.textContent = `扫描中 ${scanned}/${total} 页 (${pct}%)`;
            });

            renderStats(stats, container);
        }

        // 默认显示当前页统计
        renderStats(collectTagStats(), overlay.querySelector('.tgfc-stats-content'));
        overlay.style.display = 'flex';
    }

    function initTagStatsLink() {
        // 统计按钮已移至浮动菜单条，此函数不再需要
        return;
    }

    // UI 及设置面板
    let diffPop = null, curUser = null;
    function openDiff(x, y, user) {
        if (!diffPop) {
            diffPop = document.createElement('div');
            diffPop.id = 'tgfc-diff-pop';
            diffPop.innerHTML = `
            <div class="tgfc-ios-group">
                <div class="tgfc-ios-row"><label>Tag</label><input type="text" class="tag-in" placeholder="多标签用逗号分隔"></div>
                <div class="tgfc-ios-row"><label>Size</label><input type="text" class="sz" placeholder="14px"></div>
            </div>
            <div class="tgfc-ios-group">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px;font-size:10px;color:#888;border-bottom:1px solid #f0f0f0;">
                    <span>用户区（左侧）</span>
                    <button id="d-reset-user" style="font-size:9px;padding:1px 4px;border:1px solid #d9d9d9;border-radius:3px;background:#fafafa;color:#666;cursor:pointer;">默认</button>
                </div>
                <div class="tgfc-ios-row"><label>Bg</label><input type="color" class="user-bg"></div>
                <div class="tgfc-ios-row"><label>Text</label><input type="color" class="user-txt"></div>
            </div>
            <div class="tgfc-ios-group">
                <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px;font-size:10px;color:#888;border-bottom:1px solid #f0f0f0;">
                    <span>内容区（右侧）</span>
                    <button id="d-reset-content" style="font-size:9px;padding:1px 4px;border:1px solid #d9d9d9;border-radius:3px;background:#fafafa;color:#666;cursor:pointer;">默认</button>
                </div>
                <div class="tgfc-ios-row"><label>Bg</label><input type="color" class="content-bg"></div>
                <div class="tgfc-ios-row"><label>Text</label><input type="color" class="content-txt"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 10px 0;">
                <span class="tgfc-ios-header" style="padding:0;">预设</span>
                <select id="preset-target" style="font-size:9px;padding:1px 2px;border:1px solid #ccc;border-radius:3px;">
                    <option value="all">全部</option>
                    <option value="user">用户区</option>
                    <option value="content">内容区</option>
                </select>
            </div>
            <div id="tgfc-pre-list" style="padding:4px 10px;"></div>
            <div class="tgfc-ios-actions">
                <div style="display:flex;gap:4px;">
                    <button class="tgfc-ios-btn btn-add" id="d-add-pre" style="flex:1;">存为预设</button>
                    <button class="tgfc-ios-btn" id="d-set-global" style="background:#e6f7ff;color:#1890ff;border:1px solid #91d5ff;flex:1;">设为全局</button>
                </div>
                <div id="tgfc-global-line" style="display:flex;gap:4px;align-items:center;padding:2px 0;font-size:9px;color:#666;">
                    <span style="color:#888;">全局:</span>
                    <span style="color:#aaa;">左</span>
                    <span id="global-user-bg" style="width:12px;height:12px;border-radius:2px;border:1px solid #ccc;" title="用户区背景"></span>
                    <span id="global-user-color" style="width:12px;height:12px;border-radius:2px;border:1px solid #ccc;" title="用户区文字"></span>
                    <span style="color:#aaa;">右</span>
                    <span id="global-content-bg" style="width:12px;height:12px;border-radius:2px;border:1px solid #ccc;" title="内容区背景"></span>
                    <span id="global-content-color" style="width:12px;height:12px;border-radius:2px;border:1px solid #ccc;" title="内容区文字"></span>
                    <span id="global-hint" style="flex:1;"></span>
                    <button class="tgfc-ios-btn" id="d-clear-global" style="background:#fff1f0;color:#cf1322;border:1px solid #ffa39e;padding:2px 6px;font-size:10px;flex:none;">清除</button>
                </div>
                <div class="tgfc-ios-btn-row">
                    <button class="tgfc-ios-btn btn-reset" id="d-reset">重置</button>
                    <button class="tgfc-ios-btn btn-save" id="d-save">保存</button>
                </div>
            </div>`;
            document.body.appendChild(diffPop);

            const refreshPresets = () => {
                let pl = diffPop.querySelector('#tgfc-pre-list');
                pl.innerHTML = '';
                let c = getConfig();

                // 填充辅助函数：根据选择器决定填充哪个区域
                const applyPreset = (p) => {
                    const target = diffPop.querySelector('#preset-target').value;
                    let c = getConfig();
                    const isDark = Number(c.neoretro) === 2;

                    // 获取预设值（兼容新旧结构，默认使用当前主题配色）
                    const defUserBg = isDark ? '#303030' : '#f7f7f7';
                    const defUserTxt = isDark ? '#b0b0b0' : '#000000';
                    const defContBg = isDark ? '#303030' : '#f0f0f0';
                    const defContTxt = isDark ? '#b0b0b0' : '#000000';

                    const userBg = p.userBg || p.bg || defUserBg;
                    const userColor = p.userColor || p.color || defUserTxt;
                    const contentBg = p.contentBg || p.bg || defContBg;
                    const contentColor = p.contentColor || p.color || defContTxt;

                    if (target === 'all' || target === 'user') {
                        diffPop.querySelector('.user-bg').value = userBg;
                        diffPop.querySelector('.user-txt').value = userColor;
                    }
                    if (target === 'all' || target === 'content') {
                        diffPop.querySelector('.content-bg').value = contentBg;
                        diffPop.querySelector('.content-txt').value = contentColor;
                    }
                    if (p.size) diffPop.querySelector('.sz').value = p.size;
                };

                // 内置预设（按分类分组显示，每行：分类名+3个配色）
                const categories = ['艺术系', '自然系', '活力系', '标记系', '暗色系'];
                categories.forEach(cat => {
                    const catPresets = presets.filter(p => p.category === cat);
                    if (catPresets.length === 0) return;
                    // 整行容器
                    let row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:3px;margin-bottom:3px;';
                    // 分类标题
                    let title = document.createElement('span');
                    title.style.cssText = 'font-size:9px;color:#999;width:36px;flex-shrink:0;';
                    title.innerText = cat;
                    row.appendChild(title);
                    // 分类下的预设按钮
                    catPresets.forEach(p => {
                        let s = document.createElement('span');
                        s.className = 'tgfc-pre-item';
                        s.innerText = p.name;
                        s.style.cssText = 'background:' + p.bg + ';color:' + p.color + ';padding:2px 6px;font-size:10px;flex:1;text-align:center;';
                        s.onclick = () => applyPreset(p);
                        row.appendChild(s);
                    });
                    pl.appendChild(row);
                });
                // 自定义预设
                if (c.customPresets.length > 0) {
                    let row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:3px;margin-bottom:3px;';
                    let title = document.createElement('span');
                    title.style.cssText = 'font-size:9px;color:#999;width:36px;flex-shrink:0;';
                    title.innerText = '自定义';
                    row.appendChild(title);
                    c.customPresets.forEach((p, idx) => {
                        let s = document.createElement('span');
                        s.className = 'tgfc-pre-item';
                        s.innerText = p.name;
                        s.title = "右键点击删除";
                        s.style.cssText = 'background:' + (p.bg || p.userBg || '#f5f5f5') + ';color:' + (p.color || p.userColor || '#333') + ';padding:2px 6px;font-size:10px;';
                        s.onclick = () => applyPreset(p);
                        s.oncontextmenu = (e) => {
                            e.preventDefault();
                            if (confirm('删除自定义预设 "' + p.name + '"?')) {
                                let conf = getConfig();
                                conf.customPresets.splice(idx, 1);
                                saveConfig(conf);
                                refreshPresets();
                            }
                        };
                        row.appendChild(s);
                    });
                    pl.appendChild(row);
                }
            };

            diffPop.onclick = e => e.stopPropagation();
            document.addEventListener('click', () => diffPop.style.display = 'none');
            diffPop.querySelector('#d-save').onclick = () => {
                let c = getConfig();
                const tagInput = diffPop.querySelector('.tag-in').value;
                const tagsArray = tagInput ? tagInput.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
                c.highlighted[curUser] = {
                    tags: tagsArray,
                    userBg: diffPop.querySelector('.user-bg').value,
                    userColor: diffPop.querySelector('.user-txt').value,
                    contentBg: diffPop.querySelector('.content-bg').value,
                    contentColor: diffPop.querySelector('.content-txt').value,
                    size: diffPop.querySelector('.sz').value
                };
                saveConfig(c);
                location.reload();
            };
            diffPop.querySelector('#d-reset').onclick = () => {
                let c = getConfig();
                delete c.highlighted[curUser];
                saveConfig(c);
                location.reload();
            };
            // 用户区恢复默认
            diffPop.querySelector('#d-reset-user').onclick = () => {
                let c = getConfig();
                const isDark = Number(c.neoretro) === 2;
                diffPop.querySelector('.user-bg').value = isDark ? '#303030' : '#f7f7f7';
                diffPop.querySelector('.user-txt').value = isDark ? '#b0b0b0' : '#000000';
            };
            // 内容区恢复默认
            diffPop.querySelector('#d-reset-content').onclick = () => {
                let c = getConfig();
                const isDark = Number(c.neoretro) === 2;
                diffPop.querySelector('.content-bg').value = isDark ? '#303030' : '#f0f0f0';
                diffPop.querySelector('.content-txt').value = isDark ? '#b0b0b0' : '#000000';
            };
            diffPop.querySelector('#d-add-pre').onclick = () => {
                let name = prompt("请输入预设名称 (如：我的配色1)");
                if (!name) return;
                let c = getConfig();
                c.customPresets.push({
                    name: name,
                    userBg: diffPop.querySelector('.user-bg').value,
                    userColor: diffPop.querySelector('.user-txt').value,
                    contentBg: diffPop.querySelector('.content-bg').value,
                    contentColor: diffPop.querySelector('.content-txt').value,
                    size: diffPop.querySelector('.sz').value
                });
                saveConfig(c);
                refreshPresets();
            };
            diffPop.querySelector('#d-set-global').onclick = () => {
                let c = getConfig();
                c.globalUserBg = diffPop.querySelector('.user-bg').value;
                c.globalUserColor = diffPop.querySelector('.user-txt').value;
                c.globalContentBg = diffPop.querySelector('.content-bg').value;
                c.globalContentColor = diffPop.querySelector('.content-txt').value;
                saveConfig(c);
                alert("已设置为全局配色（不影响已单独设置的ID）");
                location.reload();
            };
            diffPop.querySelector('#d-clear-global').onclick = () => {
                let c = getConfig();
                const hasGlobal = c.globalUserBg || c.globalUserColor || c.globalContentBg || c.globalContentColor || c.globalPostBg || c.globalPostColor;
                if (!hasGlobal) {
                    alert("当前没有设置全局配色");
                    return;
                }
                if (confirm("确定要清除全局配色吗？")) {
                    c.globalUserBg = "";
                    c.globalUserColor = "";
                    c.globalContentBg = "";
                    c.globalContentColor = "";
                    c.globalPostBg = "";
                    c.globalPostColor = "";
                    saveConfig(c);
                    alert("已清除全局配色");
                    location.reload();
                }
            };

            // 刷新全局配色状态显示
            const refreshGlobalStatus = () => {
                let c = getConfig();
                const userBgEl = diffPop.querySelector('#global-user-bg');
                const userColorEl = diffPop.querySelector('#global-user-color');
                const contentBgEl = diffPop.querySelector('#global-content-bg');
                const contentColorEl = diffPop.querySelector('#global-content-color');
                const hint = diffPop.querySelector('#global-hint');

                const hasGlobal = c.globalUserBg || c.globalUserColor || c.globalContentBg || c.globalContentColor || c.globalPostBg || c.globalPostColor;
                if (hasGlobal) {
                    // 兼容旧结构
                    userBgEl.style.background = c.globalUserBg || c.globalPostBg || '#f5f5f5';
                    userColorEl.style.background = c.globalUserColor || c.globalPostColor || '#f5f5f5';
                    contentBgEl.style.background = c.globalContentBg || c.globalPostBg || '#f5f5f5';
                    contentColorEl.style.background = c.globalContentColor || c.globalPostColor || '#f5f5f5';
                    hint.innerText = '已设置';
                    hint.style.color = '#52c41a';
                } else {
                    userBgEl.style.background = '#f5f5f5';
                    userColorEl.style.background = '#f5f5f5';
                    contentBgEl.style.background = '#f5f5f5';
                    contentColorEl.style.background = '#f5f5f5';
                    hint.innerText = '未设置';
                    hint.style.color = '#999';
                }
            };

            diffPop.refresh = refreshPresets;
            diffPop.refreshGlobal = refreshGlobalStatus;
        }

        curUser = user;
        let c = getConfig();
        const isDark = Number(c.neoretro) === 2;
        // 兼容旧结构：如果没有新字段，使用旧字段
        let h = c.highlighted[user] || {};
        const tagsDisplay = Array.isArray(h.tags) ? h.tags.join(', ') : (h.tag || '');
        diffPop.querySelector('.tag-in').value = tagsDisplay;

        // 默认颜色逻辑：如果用户没有设置，根据当前主题决定初始值
        const defUserBg = isDark ? '#303030' : '#f7f7f7';
        const defUserTxt = isDark ? '#b0b0b0' : '#000000';
        const defContBg = isDark ? '#303030' : '#f0f0f0';
        const defContTxt = isDark ? '#b0b0b0' : '#000000';

        diffPop.querySelector('.user-bg').value = h.userBg || h.bg || defUserBg;
        diffPop.querySelector('.user-txt').value = h.userColor || h.color || defUserTxt;
        diffPop.querySelector('.content-bg').value = h.contentBg || h.bg || defContBg;
        diffPop.querySelector('.content-txt').value = h.contentColor || h.color || defContTxt;
        diffPop.querySelector('.sz').value = h.size || "";
        if (diffPop.refresh) diffPop.refresh();
        if (diffPop.refreshGlobal) diffPop.refreshGlobal();
        diffPop.style.display = 'block';
        diffPop.style.top = (y + 5) + 'px';
        diffPop.style.left = x + 'px';
    }

    function initPanel() {
        if (document.getElementById('tgfc-ui-toggle')) return;

        let btn = document.createElement('div');
        btn.id = 'tgfc-ui-toggle';
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
        btn.onclick = () => {
            let p = document.querySelector('#tgfc-ui-panel');
            p.style.display = p.style.display === 'none' ? 'block' : 'none';
            if (p.style.display === 'block') loadPanel();
        };
        document.body.appendChild(btn);

        let pan = document.createElement('div');
        pan.id = 'tgfc-ui-panel';
        pan.innerHTML = `
        <h2>TGFC 助手 v${GM_info.script.version}</h2>
        <div class="grp">
            <div class="grp-row">
                <span>紧凑模式</span>
                <label class="sw"><input type="checkbox" id="ck-comp"><span class="sl"></span></label>
            </div>
            <div class="grp-row">
                <span>Menu Plus (导航增强)</span>
                <label class="sw"><input type="checkbox" id="ck-menu-plus">
                <span class="sl"></span></label>
            </div>
            <div class="grp-row">
                <span>Markdown优化</span>
                <label class="sw"><input type="checkbox" id="ck-md"><span class="sl"></span></label>
            </div>
            <div class="grp-row">
                <span>Neo-Retro 风格</span>
                <label class="sw"><input type="checkbox" id="ck-neoretro"><span class="sl"></span></label>
            </div>
            <div class="grp-row">
                <span>列表屏蔽</span>
                <div class="grp-right">
                    <label class="tip-chk"><input type="checkbox" id="ck-list-tip">提示</label>
                    <label class="sw"><input type="checkbox" id="ck-list"><span class="sl"></span></label>
                </div>
            </div>
            <div class="grp-row">
                <span>内容屏蔽</span>
                <div class="grp-right">
                    <label class="tip-chk"><input type="checkbox" id="ck-cont-tip">提示</label>
                    <label class="sw"><input type="checkbox" id="ck-cont"><span class="sl"></span></label>
                </div>
            </div>
            <div class="grp-row">
                <span>关键词屏蔽</span>
                <div class="grp-right">
                    <label class="tip-chk"><input type="checkbox" id="ck-keyword-tip">提示</label>
                    <label class="sw"><input type="checkbox" id="ck-keyword"><span class="sl"></span></label>
                </div>
            </div>
        </div>
        <div class="grp">
            <div class="grp-header">
                <span>屏蔽ID (逗号/换行分隔):</span>
                <div style="display:flex;gap:4px;">
                    <button class="tgfc-export-btn" id="btn-import-list" title="追加导入">导入</button>
                    <button class="tgfc-export-btn" id="btn-export-list" title="导出txt">导出</button>
                    <button class="tgfc-export-btn" id="btn-copy-list">复制</button>
                </div>
            </div>
            <textarea id="in-block" class="tgfc-ui-textarea"></textarea>
            <input type="file" id="file-import-list" style="display:none" accept=".txt">
        </div>
        <div class="grp">
            <div class="grp-header">
                <span style="font-size:11px;">屏蔽关键词 (逗号/换行分隔):</span>
                <div style="display:flex;gap:4px;">
                    <button class="tgfc-export-btn" id="btn-import-keywords" title="追加导入">导入</button>
                    <button class="tgfc-export-btn" id="btn-export-keywords" title="导出txt">导出</button>
                    <button class="tgfc-export-btn" id="btn-copy-keywords">复制</button>
                </div>
            </div>
            <textarea id="in-keywords" class="tgfc-ui-textarea" placeholder="标题中包含这些关键词的主题将被屏蔽"></textarea>
            <input type="file" id="file-import-keywords" style="display:none" accept=".txt">
        </div>
        <div class="grp">
            <div class="grp-header">
                <span>Tag数据管理:</span>
                <div style="display:flex;gap:4px;">
                    <button class="tgfc-export-btn" id="btn-import-tags" title="合并导入">导入</button>
                    <button class="tgfc-export-btn" id="btn-export-tags" title="导出json">导出</button>
                    <button class="tgfc-export-btn" id="btn-copy-tags">复制</button>
                </div>
            </div>
            <input type="file" id="file-import-tags" style="display:none" accept=".json">
        </div>
        <div class="grp">
            论坛页面宽度 <span class="tgfc-helper-text">最小900</span>
            <input type="text" id="in-width" placeholder="1200">
        </div>
        <div class="grp">
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:nowrap;">
                <label style="display:flex;align-items:center;gap:4px;">
                    字体
                    <select id="sel-font" style="padding:2px 4px;border-radius:4px;border:1px solid #ccc;font-size:12px;"></select>
                </label>
                <label style="display:flex;align-items:center;gap:4px;">
                    大小
                    <select id="sel-fontsize" style="padding:2px 4px;border-radius:4px;border:1px solid #ccc;width:80px;font-size:12px;"></select>
                    <input type="text" id="in-fontsize" style="width: 50px; padding: 2px 4px; border-radius: 4px; border: 1px solid #ccc;" placeholder="自定义">
                </label>
            </div>
        </div>
        <div class="grp">
            背景:
            <div class="tgfc-color-row">
                <input type="text" id="in-bg">
                <input type="color" id="in-bg-picker" class="tgfc-color-picker">
            </div>
        </div>
        <div class="btn-row">
            <button class="tgfc-main-action tgfc-close-btn">取消</button>
            <button class="tgfc-main-action tgfc-save-btn">保存并刷新</button>
        </div>
      `;
        document.body.appendChild(pan);

        // 填充字体族下拉菜单
        let fontSelect = pan.querySelector('#sel-font');
        fontPresets.forEach(fp => {
            let opt = document.createElement('option');
            opt.value = fp.val;
            opt.innerText = fp.name;
            fontSelect.appendChild(opt);
        });

        // 填充字体大小下拉菜单
        let fontSizeSelect = pan.querySelector('#sel-fontsize');
        fontSizePresets.forEach(fp => {
            let opt = document.createElement('option');
            opt.value = fp.val;
            opt.innerText = fp.name;
            fontSizeSelect.appendChild(opt);
        });

        // 字号下拉联动
        let fontSizeInput = pan.querySelector('#in-fontsize');
        fontSizeSelect.onchange = (e) => {
            fontSizeInput.value = e.target.value;
        };



        let bgText = pan.querySelector('#in-bg');
        let bgPicker = pan.querySelector('#in-bg-picker');
        bgPicker.oninput = (e) => { bgText.value = e.target.value; };
        bgText.oninput = (e) => { if (e.target.value.startsWith('#')) bgPicker.value = e.target.value; };

        // 通用复制函数
        const handleCopy = (btnId, getContent) => {
            pan.querySelector(btnId).onclick = () => {
                let content = getContent();
                if (!content) return;
                const copyToClipboard = str => {
                    if (navigator && navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(str);
                    return Promise.reject('The Clipboard API is not available.');
                };
                let btn = pan.querySelector(btnId);
                let orig = btn.innerText;
                copyToClipboard(content).then(() => {
                    btn.innerText = 'OK!'; setTimeout(() => btn.innerText = orig, 1000);
                }).catch(() => {
                    const el = document.createElement('textarea'); el.value = txt; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
                    btn.innerText = 'OK!'; setTimeout(() => btn.innerText = orig, 1000);
                });
            };
        };

        // 屏蔽列表操作
        handleCopy('#btn-copy-list', () => pan.querySelector('#in-block').value);

        pan.querySelector('#btn-export-list').onclick = () => {
            const content = pan.querySelector('#in-block').value;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tgfc_blocklist_${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        };

        pan.querySelector('#btn-import-list').onclick = () => pan.querySelector('#file-import-list').click();
        pan.querySelector('#file-import-list').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const oldVal = pan.querySelector('#in-block').value;
                pan.querySelector('#in-block').value = oldVal ? (oldVal + '\n' + text) : text;
                pan.querySelector('#file-import-list').value = ''; // reset
            };
            reader.readAsText(file);
        };

        // 关键词屏蔽操作
        handleCopy('#btn-copy-keywords', () => pan.querySelector('#in-keywords').value);

        pan.querySelector('#btn-export-keywords').onclick = () => {
            const content = pan.querySelector('#in-keywords').value;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tgfc_keywords_${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        };

        pan.querySelector('#btn-import-keywords').onclick = () => pan.querySelector('#file-import-keywords').click();
        pan.querySelector('#file-import-keywords').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const oldVal = pan.querySelector('#in-keywords').value;
                pan.querySelector('#in-keywords').value = oldVal ? (oldVal + '\n' + text) : text;
                pan.querySelector('#file-import-keywords').value = ''; // reset
            };
            reader.readAsText(file);
        };

        // Tag数据操作
        handleCopy('#btn-copy-tags', () => JSON.stringify(getConfig().highlighted, null, 2));

        pan.querySelector('#btn-export-tags').onclick = () => {
            const content = JSON.stringify(getConfig().highlighted, null, 2);
            const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tgfc_tags_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        pan.querySelector('#btn-import-tags').onclick = () => pan.querySelector('#file-import-tags').click();
        pan.querySelector('#file-import-tags').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    let c = getConfig();
                    c.highlighted = Object.assign({}, c.highlighted, json);
                    saveConfig(c);
                    alert('Tag数据导入成功，即将刷新页面');
                    location.reload();
                } catch (err) {
                    alert('数据格式错误，导入失败');
                    console.error(err);
                }
                pan.querySelector('#file-import-tags').value = '';
            };
            reader.readAsText(file);
        };

        pan.querySelector('.tgfc-close-btn').onclick = () => pan.style.display = 'none';
        pan.querySelector('.tgfc-save-btn').onclick = () => {
            let c = getConfig();
            c.menuPlus = document.querySelector('#ck-menu-plus').checked;
            c.hideList = document.querySelector('#ck-list').checked;
            c.showListTip = document.querySelector('#ck-list-tip').checked;
            c.hideKeyword = document.querySelector('#ck-keyword').checked;
            c.showKeywordTip = document.querySelector('#ck-keyword-tip').checked;
            c.hideContent = document.querySelector('#ck-cont').checked;
            c.showContentTip = document.querySelector('#ck-cont-tip').checked;
            c.compact = document.querySelector('#ck-comp').checked;
            c.markdown = document.querySelector('#ck-md').checked;
            c.neoretro = document.querySelector('#ck-neoretro').checked;
            let rawBlock = document.querySelector('#in-block').value;
            c.blocked = rawBlock.split(/[,，\n]/).map(cleanStr).filter(Boolean);
            let rawKeywords = document.querySelector('#in-keywords').value;
            c.blockedKeywords = rawKeywords.split(/[,，\n]/).map(cleanStr).filter(Boolean);
            let widthVal = parseInt(document.querySelector('#in-width').value, 10);
            c.mainWidth = (isNaN(widthVal) || widthVal < 900) ? '900' : String(widthVal);

            c.font = document.querySelector('#sel-font').value;
            c.fontSize = document.querySelector('#in-fontsize').value;
            c.bgColor = document.querySelector('#in-bg').value;
            saveConfig(c);
            location.reload();
        };
    }

    function loadPanel() {
        let c = getConfig();
        document.querySelector('#ck-menu-plus').checked = c.menuPlus;
        document.querySelector('#ck-list').checked = c.hideList;
        document.querySelector('#ck-list-tip').checked = c.showListTip;
        document.querySelector('#ck-keyword').checked = c.hideKeyword !== false;
        document.querySelector('#ck-keyword-tip').checked = c.showKeywordTip !== false;
        document.querySelector('#ck-cont').checked = c.hideContent;
        document.querySelector('#ck-cont-tip').checked = c.showContentTip;
        document.querySelector('#ck-comp').checked = c.compact;
        document.querySelector('#ck-md').checked = c.markdown;
        document.querySelector('#ck-neoretro').checked = c.neoretro || false;
        document.querySelector('#in-block').value = c.blocked.join(',\n');
        document.querySelector('#in-keywords').value = (c.blockedKeywords || []).join(',\n');
        document.querySelector('#in-width').value = c.mainWidth;

        document.querySelector('#sel-font').value = c.font || '';
        let fs = c.fontSize || '';
        document.querySelector('#in-fontsize').value = fs;
        document.querySelector('#sel-fontsize').value = fs;
        document.querySelector('#in-bg').value = c.bgColor;
        document.querySelector('#in-bg-picker').value = c.bgColor.startsWith('#') ? c.bgColor : '#BDBEBD';
    }

    // ==========================================
    // 模块 6: 今日十大话题
    // ==========================================
    const TOP10_CACHE_KEY = 'tgfc_top10_cache';
    const TOP10_CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
    const TOP10_COLLAPSED_KEY = 'tgfc_top10_collapsed';
    const TOP10_MODE_KEY = 'tgfc_top10_mode';

    // 不同模式的配置
    const TOP10_MODES = {
        today: { label: '今日', pages: 6, days: 0 },
        yesterday: { label: '昨日', pages: 10, days: 1 },
        week: { label: '本周', pages: 25, days: 7 },
        month: { label: '本月', pages: 85, days: 30 }
    };

    // 检测是否为版面列表页
    function isForumListPage() {
        const url = location.href;
        return /forum-\d+-\d+\.html/.test(url) || /forumdisplay\.php/.test(url);
    }

    // 获取当前版面ID
    function getForumId() {
        const url = location.href;
        let match = url.match(/forum-(\d+)-/);
        if (match) return match[1];
        match = url.match(/fid=(\d+)/);
        if (match) return match[1];
        return null;
    }

    // 获取指定日期的日期字符串 (返回两种格式以兼容论坛不同显示)
    function getDateStr(daysAgo = 0) {
        const now = new Date();
        now.setDate(now.getDate() - daysAgo);
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        // 返回两种格式：带零填充 (2026-01-01) 和不带 (2026-1-1)
        return [
            `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            `${year}-${month}-${day}`
        ];
    }

    // 获取日期范围（用于本周）- 返回扁平数组
    function getDateRange(days) {
        const dates = [];
        for (let i = 0; i <= days; i++) {
            dates.push(...getDateStr(i));
        }
        return dates;
    }

    // 从缓存获取数据
    function getTop10Cache(fid, mode) {
        try {
            const cache = JSON.parse(Safe_GetValue(TOP10_CACHE_KEY, '{}'));
            const key = `${fid}_${mode}`;
            const data = cache[key];
            const todayStr = getDateStr(0)[0]; // 使用标准格式作为缓存日期标识
            if (data && data.date === todayStr && Date.now() - data.timestamp < TOP10_CACHE_DURATION) {
                return data.threads;
            }
        } catch (e) { }
        return null;
    }

    // 保存到缓存
    function setTop10Cache(fid, mode, threads) {
        try {
            const cache = JSON.parse(Safe_GetValue(TOP10_CACHE_KEY, '{}'));
            const key = `${fid}_${mode}`;
            cache[key] = {
                date: getDateStr(0)[0], // 使用标准格式
                timestamp: Date.now(),
                threads: threads
            };
            Safe_SetValue(TOP10_CACHE_KEY, JSON.stringify(cache));
        } catch (e) { }
    }

    // 构建版面分页URL
    function buildForumPageUrl(fid, page) {
        return `https://${location.hostname}/forum-${fid}-${page}.html`;
    }

    // 解析单页的帖子列表（支持日期范围筛选）
    function parseForumPageThreads(doc, validDates) {
        const threads = [];
        doc.querySelectorAll('tbody[id^="normalthread_"]').forEach(tbody => {
            const row = tbody.querySelector('tr');
            if (!row) return;

            // 获取发帖日期
            const dateEm = row.querySelector('td.author > em');
            if (!dateEm) return;
            const dateStr = dateEm.textContent.trim();

            // 筛选符合日期范围的帖子
            if (!validDates.includes(dateStr)) return;

            // 获取帖子信息
            const titleSpan = row.querySelector('th span[id^="thread_"]');
            const titleLink = titleSpan ? titleSpan.querySelector('a') : null;
            if (!titleLink) return;

            const numsCell = row.querySelector('td.nums');
            const repliesStrong = numsCell ? numsCell.querySelector('strong') : null;
            const replies = repliesStrong ? parseInt(repliesStrong.textContent) || 0 : 0;
            const viewsEm = numsCell ? numsCell.querySelector('em') : null;
            const views = viewsEm ? parseInt(viewsEm.textContent) || 0 : 0;

            const authorCite = row.querySelector('td.author > cite > a');
            const author = authorCite ? authorCite.textContent.trim() : '';

            const tid = tbody.id.replace('normalthread_', '');

            threads.push({
                tid: tid,
                title: titleLink.textContent.trim(),
                url: titleLink.href,
                replies: replies,
                views: views,
                author: author,
                date: dateStr
            });
        });
        return threads;
    }

    // 多页抓取帖子
    async function fetchThreads(fid, mode, onProgress) {
        const config = TOP10_MODES[mode];
        const maxPages = config.pages;
        let validDates;

        if (mode === 'today') {
            validDates = getDateStr(0); // 返回 [格式1, 格式2]
        } else if (mode === 'yesterday') {
            validDates = getDateStr(1); // 返回 [格式1, 格式2]
        } else {
            validDates = getDateRange(config.days);
        }

        const allThreads = [];
        const seenTids = new Set();
        let emptyPages = 0;

        for (let page = 1; page <= maxPages; page++) {
            try {
                let doc;
                if (page === 1 && location.href.includes(`forum-${fid}-1`)) {
                    doc = document;
                } else {
                    const pageUrl = buildForumPageUrl(fid, page);
                    const html = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: pageUrl,
                            overrideMimeType: 'text/html; charset=gbk',
                            onload: (resp) => resolve(resp.responseText),
                            onerror: reject
                        });
                    });
                    const parser = new DOMParser();
                    doc = parser.parseFromString(html, 'text/html');
                }

                const pageThreads = parseForumPageThreads(doc, validDates);

                let addedCount = 0;
                pageThreads.forEach(t => {
                    if (!seenTids.has(t.tid)) {
                        seenTids.add(t.tid);
                        allThreads.push(t);
                        addedCount++;
                    }
                });

                if (onProgress) onProgress(page, maxPages);

                if (addedCount === 0) {
                    emptyPages++;
                    if (emptyPages >= 3) break;
                } else {
                    emptyPages = 0;
                }

                if (page > 1) await new Promise(r => setTimeout(r, 150));
            } catch (e) {
                console.error('[TGFC助手] 抓取版面页面失败:', page, e);
            }
        }

        allThreads.sort((a, b) => b.replies - a.replies);
        return allThreads.slice(0, 10);
    }

    // 渲染十大话题列表
    function renderTop10List(container, threads, mode) {
        const modeLabel = TOP10_MODES[mode]?.label || '热门';
        if (!threads || threads.length === 0) {
            container.innerHTML = `<div class="tgfc-top10-empty">暂无${modeLabel}热门话题</div>`;
            return;
        }

        const ol = document.createElement('ol');
        ol.className = 'tgfc-top10-list';

        threads.forEach((t, i) => {
            const li = document.createElement('li');

            const rankSpan = document.createElement('span');
            rankSpan.className = 'tgfc-top10-rank';
            if (i === 0) rankSpan.classList.add('gold');
            else if (i === 1) rankSpan.classList.add('silver');
            else if (i === 2) rankSpan.classList.add('bronze');
            else rankSpan.classList.add('normal');
            rankSpan.textContent = i + 1;

            const link = document.createElement('a');
            link.className = 'tgfc-top10-link';
            link.href = t.url;
            link.textContent = t.title;
            link.title = t.title;

            const repliesSpan = document.createElement('span');
            repliesSpan.className = 'tgfc-top10-replies';
            repliesSpan.textContent = `${t.replies}回复`;

            const viewsSpan = document.createElement('span');
            viewsSpan.className = 'tgfc-top10-views';
            viewsSpan.textContent = `${t.views}浏览`;

            const authorSpan = document.createElement('span');
            authorSpan.className = 'tgfc-top10-author';
            authorSpan.textContent = t.author;
            authorSpan.title = t.author;

            li.appendChild(rankSpan);
            li.appendChild(link);
            li.appendChild(repliesSpan);
            li.appendChild(viewsSpan);
            li.appendChild(authorSpan);
            ol.appendChild(li);
        });

        container.innerHTML = '';
        container.appendChild(ol);
    }

    // 创建并插入十大话题面板
    function initTop10Panel() {
        if (!isForumListPage()) return;

        const fid = getForumId();
        if (!fid) return;

        const threadList = document.querySelector('div.mainbox.threadlist');
        if (!threadList) return;

        if (document.getElementById('tgfc-top10-panel')) return;

        const isCollapsed = Safe_GetValue(TOP10_COLLAPSED_KEY, 'true') === 'true';
        const currentMode = 'today'; // 默认每次进入都显示今日

        const panel = document.createElement('div');
        panel.id = 'tgfc-top10-panel';
        panel.className = 'tgfc-top10-panel';
        panel.innerHTML = `
            <div class="tgfc-top10-header">
                <span class="tgfc-top10-title"><span style="font-size:14px; position:relative; top:-1px; margin-right:4px;">🔥</span>十大话题</span>
                <div class="tgfc-top10-right">
                    <div class="tgfc-top10-tabs">
                        <span class="tgfc-top10-tab ${currentMode === 'today' ? 'active' : ''}" data-mode="today">今日</span>
                        <span class="tgfc-top10-tab ${currentMode === 'yesterday' ? 'active' : ''}" data-mode="yesterday">昨日</span>
                        <span class="tgfc-top10-tab ${currentMode === 'week' ? 'active' : ''}" data-mode="week">本周</span>
                        <span class="tgfc-top10-tab ${currentMode === 'month' ? 'active' : ''}" data-mode="month">本月</span>
                    </div>
                    <span class="tgfc-top10-status"></span>
                    <button class="tgfc-top10-refresh" title="刷新">🔄</button>
                </div>
            </div>
            <div class="tgfc-top10-body ${isCollapsed ? '' : 'expanded'}">
                <div class="tgfc-top10-loading">
                    <div class="tgfc-top10-loading-text">加载中...</div>
                </div>
            </div>
        `;

        threadList.parentNode.insertBefore(panel, threadList);

        const header = panel.querySelector('.tgfc-top10-header');
        const body = panel.querySelector('.tgfc-top10-body');
        const status = panel.querySelector('.tgfc-top10-status');
        const refreshBtn = panel.querySelector('.tgfc-top10-refresh');
        const tabs = panel.querySelectorAll('.tgfc-top10-tab');

        let activeMode = currentMode;

        // 选项卡切换
        tabs.forEach(tab => {
            tab.onclick = (e) => {
                e.stopPropagation();
                const mode = tab.dataset.mode;
                if (mode === activeMode) return;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeMode = mode;
                Safe_SetValue(TOP10_MODE_KEY, mode);

                // 展开面板并切换显示
                if (!body.classList.contains('expanded')) {
                    body.classList.add('expanded');
                    Safe_SetValue(TOP10_COLLAPSED_KEY, 'false');
                }
                displayTop10Data(fid, body, status, mode);
            };
        });

        // 点击header折叠/展开（排除选项卡和刷新按钮）
        header.onclick = (e) => {
            if (e.target.classList.contains('tgfc-top10-tab') ||
                e.target === refreshBtn ||
                e.target.closest('.tgfc-top10-right')) return;
            body.classList.toggle('expanded');
            Safe_SetValue(TOP10_COLLAPSED_KEY, body.classList.contains('expanded') ? 'false' : 'true');
        };

        // 刷新按钮 - 强制刷新当前模式
        refreshBtn.onclick = (e) => {
            e.stopPropagation();
            loadTop10DataInBackground(fid, activeMode, true).then(() => {
                displayTop10Data(fid, body, status, activeMode);
            });
        };

        // 显示当前模式数据
        displayTop10Data(fid, body, status, activeMode);

        // 后台预加载所有模式（不阻塞UI）
        preloadAllModes(fid);
    }

    // 显示指定模式的数据（从缓存读取）
    function displayTop10Data(fid, container, statusEl, mode) {
        const cached = getTop10Cache(fid, mode);
        if (cached) {
            statusEl.textContent = '';
            renderTop10List(container, cached, mode);
        } else {
            statusEl.textContent = '加载中...';
            container.innerHTML = '<div class="tgfc-top10-loading"><div class="tgfc-top10-loading-text">加载中...</div></div>';
            // 如果缓存不存在，等待后台加载完成后再显示
            loadTop10DataInBackground(fid, mode, false).then(() => {
                const data = getTop10Cache(fid, mode);
                if (data) {
                    statusEl.textContent = '';
                    renderTop10List(container, data, mode);
                } else {
                    statusEl.textContent = '';
                    container.innerHTML = `<div class="tgfc-top10-empty">暂无${TOP10_MODES[mode]?.label || ''}热门话题</div>`;
                }
            });
        }
    }

    // 后台加载指定模式的数据
    async function loadTop10DataInBackground(fid, mode, forceRefresh) {
        if (!forceRefresh) {
            const cached = getTop10Cache(fid, mode);
            if (cached) return; // 已有缓存，无需加载
        }

        try {
            const threads = await fetchThreads(fid, mode, null); // 不传进度回调
            setTop10Cache(fid, mode, threads);
        } catch (e) {
            console.error('[TGFC助手] 后台加载十大失败:', mode, e);
        }
    }

    // 预加载模式（按顺序，避免同时发送太多请求，本月不预加载）
    async function preloadAllModes(fid) {
        const modes = ['today', 'yesterday', 'week'];
        for (const mode of modes) {
            await loadTop10DataInBackground(fid, mode, false);
        }
    }

    // ==========================================
    // 模块 5: 启动
    // ==========================================


    function applyNeoRetro(mode) {
        // Normalize input to 0, 1, 2
        if (mode === true || mode === 'true') mode = 1;
        if (!mode || mode === 'false') mode = 0;
        mode = Number(mode);

        if (mode > 0) {
            document.body.classList.add('tgfc-neoretro-mode');
            // Mode 2: Dark Mode Extension
            if (mode === 2) {
                document.body.classList.add('tgfc-neoretro-dark');
                // Dark mode 强制背景深色
                document.body.style.setProperty('background-color', '#282828', 'important');

                // 自动应用 Dark Tag 配色
                let c = getConfig();
                const darkBg = '#303030';
                const darkCol = '#b0b0b0';

                // 只有当没有备份且当前处于默认/空配色时，才自动应用 Dark 配色
                // 防止在 Dark Mode 下用户手动改了颜色后被刷新强行覆盖回去
                if (c.nr_backup_bg === undefined && (c.globalPostBg === "" || c.globalPostBg === "#f7f7f7" || c.globalPostBg === "#ffd8d8")) {
                    // 备份现有配置 (包括全局单个字段)
                    c.nr_backup_bg = c.globalPostBg || "";
                    c.nr_backup_color = c.globalPostColor || "";
                    c.nr_backup_ubg = c.globalUserBg || "";
                    c.nr_backup_ucol = c.globalUserColor || "";
                    c.nr_backup_cbg = c.globalContentBg || "";
                    c.nr_backup_ccol = c.globalContentColor || "";

                    // 应用新配置
                    c.globalPostBg = darkBg;
                    c.globalPostColor = darkCol;
                    c.globalUserBg = darkBg;
                    c.globalUserColor = darkCol;
                    c.globalContentBg = darkBg;
                    c.globalContentColor = darkCol;
                    saveConfig(c);

                    // 更新面板 UI (如果打开)
                    if (document.querySelector('#col-bg')) {
                        document.querySelector('#col-bg').value = c.globalPostBg;
                        document.querySelector('#col-text').value = c.globalPostColor;
                    }
                }
            } else {
                document.body.classList.remove('tgfc-neoretro-dark');

                // 普通模式：设置页面背景
                let c = getConfig();
                let targetColor = c.bgColor;
                if (!targetColor || targetColor.toLowerCase().includes('bdbebd')) {
                    targetColor = (mode === 1) ? '#d8d4ca' : '';
                }
                if (targetColor) {
                    document.body.style.setProperty('background-color', targetColor, 'important');
                } else {
                    document.body.style.removeProperty('background-color');
                }

                // 恢复备份的配色（如果是从 Dark Mode 切回来）
                restoreNRBackup();

                // 自我修复逻辑：如果发现当前不是 Dark Mode，但配色被“卡死”在深色（且没有备份）
                // 且用户之前没有手动设置过这些颜色（即符合 Dark 预设值），则尝试自动修复
                let conf = getConfig();
                const darkBg = '#303030';
                if (conf.nr_backup_bg === undefined && conf.globalPostBg === darkBg) {
                    conf.globalPostBg = "";
                    conf.globalPostColor = "";
                    conf.globalUserBg = "";
                    conf.globalUserColor = "";
                    conf.globalContentBg = "";
                    conf.globalContentColor = "";
                    saveConfig(conf);
                }
            }
        } else {
            document.body.classList.remove('tgfc-neoretro-mode');
            document.body.classList.remove('tgfc-neoretro-dark');

            // 恢复原来的背景设置
            let c = getConfig();
            if (c.bgColor) {
                document.body.style.background = c.bgColor;
            } else {
                document.body.style.background = '';
            }

            // 恢复备份的配色
            restoreNRBackup();
        }

        function restoreNRBackup() {
            let c = getConfig();
            if (c.nr_backup_bg !== undefined) {
                c.globalPostBg = c.nr_backup_bg;
                c.globalPostColor = c.nr_backup_color;
                c.globalUserBg = c.nr_backup_ubg || "";
                c.globalUserColor = c.nr_backup_ucol || "";
                c.globalContentBg = c.nr_backup_cbg || "";
                c.globalContentColor = c.nr_backup_ccol || "";

                // 清理所有备份字段
                ['nr_backup_bg', 'nr_backup_color', 'nr_backup_ubg', 'nr_backup_ucol', 'nr_backup_cbg', 'nr_backup_ccol'].forEach(k => delete c[k]);
                saveConfig(c);

                // 更新面板 UI (如果打开)
                if (document.querySelector('#col-bg')) {
                    document.querySelector('#col-bg').value = c.globalPostBg;
                    document.querySelector('#col-text').value = c.globalPostColor;
                }
            }
        }
    }

    function start() {
        try { GM_addStyle(css); } catch (e) {
            let s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
        }
        let c = getConfig();

        // 初始同步配置到 localStorage，供 WAP 版脚本读取
        try {
            const wapConfig = {
                blocked: c.blocked,
                blockedKeywords: c.blockedKeywords,
                highlighted: c.highlighted,
                hideList: c.hideList,
                hideKeyword: c.hideKeyword,
                hideContent: c.hideContent,
            };
            localStorage.setItem('tgfc_wap_config', JSON.stringify(wapConfig));
        } catch (e) { /* ignore */ }

        if (c.bgColor) document.body.style.background = c.bgColor;

        // 必须在设置完 bgColor 之后调用，以确保 Neo-Retro 的 important 样式能正确覆盖默认背景
        applyNeoRetro(c.neoretro);

        if (c.mainWidth) {
            document.querySelectorAll("body > .wrap, #footer .wrap").forEach(w => {
                w.style.maxWidth = c.mainWidth + "px"; w.style.margin = "0 auto";
            });
        }
        // 字体设置已由 Critical CSS 处理，不再通过 JS 设置 body.fontFamily 以避免污染面板

        initPanel();

        // 如果开启了 Menu+，则加载
        if (c.menuPlus) {
            initMenuPlus();
        }

        scan();
        initTagStatsLink();
        initTop10Panel(); // 今日十大话题
        window.mdEnhancer = new TGMarkdownEnhancer();
        setInterval(scan, 2000);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();